// intro-refactored.js - Modular intro system using FEAR GUI framework

/**
 * Device Detection Module
 * Handles device and WebGL capability detection
 */
FEAR.create('DeviceDetection', function(GUI) {
  return {
    load: function(options = {}) {
      const detection = {
        windowWidth: GUI.$(window).width(),
        windowHeight: GUI.$(window).height(),
        isMobile: /mobile/i.test(navigator.userAgent),
        webGLSupported: !!window.WebGLRenderingContext
      };

      // Add body classes
      GUI.$('body').addClass(detection.isMobile ? 'mobile' : 'desktop');

      // Store detection results in shared state
      GUI.emit('device:detected', detection);
      
      GUI.log('Device detection complete:', detection);
      
      return detection;
    }
  };
});

/**
 * Widow Control Module
 * Prevents widow words in text elements
 */
FEAR.create('WidowControl', function(GUI) {
  const widowControl = this;
  
  const applyWidowControl = () => {
    const windowWidth = GUI.$(window).width();
    const widowElements = GUI.$('h1, h2, h3, h4, h5, h6, li, p, figcaption, .case-study-tagline, .large-cta')
      .not('.discovery_cell p, #site-nav li, footer li');

    // Remove existing non-breaking spaces
    widowElements.each(function() {
      GUI.$(this).html(GUI.$(this).html().replace(/&nbsp;/g, ' '));
    });

    // Apply widow control on larger screens
    if (windowWidth > 640) {
      widowElements.each(function() {
        GUI.$(this).html(
          GUI.$(this).html().replace(/\s((?=(([^\s<>]|<[^>]*>)+))\2)\s*$/, '&nbsp;$1')
        );
      });
    }
  };

  return {
    load: function(options = {}) {
      // Apply widow control immediately
      applyWidowControl();

      // Debounced resize handler
      const debouncedResize = GUI.utils.debounce(applyWidowControl, 50);
      GUI.$(window).on('resize.widowControl', debouncedResize);

      GUI.log('Widow control initialized');
      return Promise.resolve();
    },

    unload: function() {
      GUI.$(window).off('resize.widowControl');
      GUI.log('Widow control unloaded');
      return Promise.resolve();
    }
  };
});

/**
 * Screen Capture Module
 * Captures page screenshot using html2canvas
 */
FEAR.create('ScreenCapture', function(GUI) {
  let screenShotCanvas = null;
  let canvasDataURL = null;
  let canvasImage = null;
  let screenCaptured = false;

  return {
    load: function(options = {}) {
      const target = options.target || '.ajax';
      
      return new Promise((resolve, reject) => {
        if (!window.html2canvas) {
          GUI.warn('html2canvas not available');
          return reject(new Error('html2canvas not loaded'));
        }

        html2canvas(GUI.$(target)[0], {
          letterRendering: true,
          allowTaint: true,
          onrendered: function(canvas) {
            screenShotCanvas = canvas;
            canvasDataURL = screenShotCanvas.toDataURL();
            canvasImage = new Image();
            canvasImage.src = canvasDataURL;
            screenCaptured = true;

            GUI.log('Screen captured successfully');
            
            // Emit event with capture data
            GUI.emit('screen:captured', {
              canvas: screenShotCanvas,
              dataURL: canvasDataURL,
              image: canvasImage,
              height: screenShotCanvas.height
            });

            resolve({
              canvas: screenShotCanvas,
              dataURL: canvasDataURL,
              image: canvasImage
            });
          }
        });
      });
    },

    getCapture: function() {
      return {
        canvas: screenShotCanvas,
        dataURL: canvasDataURL,
        image: canvasImage,
        captured: screenCaptured
      };
    }
  };
});

/**
 * Glitch Effect Module
 * WebGL glitch effect using Three.js
 */
FEAR.create('GlitchEffect', function(GUI) {
  let animateable = false;
  let renderer = null;
  let scene = null;
  
  const initializeGlitch = (image, height, options = {}) => {
    const isFourOhFour = options.is404 || false;
    const fps = isFourOhFour ? 5 : 20;
    
    let SCREEN_WIDTH = window.innerWidth;
    let SCREEN_HEIGHT = height;
    
    if (height > 4096) {
      SCREEN_HEIGHT = 4096;
    }

    const windowHalfX = SCREEN_WIDTH / 2;
    const windowHalfY = height / 2;
    const delta = 0.1;

    // Initialize Three.js scene
    scene = new THREE.Scene();
    const sceneBG = new THREE.Scene();
    
    const camera = new THREE.OrthographicCamera(
      -windowHalfX, windowHalfX, windowHalfY, -windowHalfY, 1, 10000
    );
    camera.position.z = 100;

    // Background texture
    const background = new THREE.MeshBasicMaterial({
      map: THREE.ImageUtils.loadTexture(image),
      depthTest: false
    });

    background.map.needsUpdate = true;
    const plane = new THREE.PlaneBufferGeometry(1, 1);
    const bgMesh = new THREE.Mesh(plane, background);
    bgMesh.position.z = 1;
    bgMesh.scale.set(SCREEN_WIDTH, height, 1);
    sceneBG.add(bgMesh);
    bgMesh.material.map.needsUpdate = true;

    // Setup renderer
    renderer = new THREE.WebGLRenderer();
    renderer.setClearColor(0xffffff);
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.autoClear = false;
    renderer.gammaInput = true;
    renderer.gammaOutput = true;

    GUI.$(renderer.domElement)
      .attr('id', 'loader')
      .css('height', height);
    GUI.$('#main-body').append(renderer.domElement);

    // Setup composers
    const rtParameters = {
      minFilter: THREE.LinearFilter,
      magFilter: THREE.LinearFilter,
      format: THREE.RGBFormat,
      stencilBuffer: true
    };

    const renderBackground = new THREE.RenderPass(sceneBG, camera);
    const clearMask = new THREE.ClearMaskPass();

    const composer = new THREE.EffectComposer(
      renderer,
      new THREE.WebGLRenderTarget(SCREEN_WIDTH, SCREEN_HEIGHT, rtParameters)
    );
    
    const renderScene = new THREE.TexturePass(composer.renderTarget2);
    composer.addPass(renderBackground);
    composer.addPass(clearMask);

    const composer1 = new THREE.EffectComposer(
      renderer,
      new THREE.WebGLRenderTarget(SCREEN_WIDTH, SCREEN_HEIGHT, rtParameters)
    );

    const glitch = new THREE.GlitchPass(
      options.glitchDtSize || 100,
      options.glitchDelay || 1,
      options.glitchAmplification || 0.5
    );
    glitch.renderToScreen = true;

    composer1.addPass(renderScene);
    composer1.addPass(glitch);
    renderScene.uniforms['tDiffuse'].value = composer.renderTarget2;

    // Animation loop
    const render = () => {
      renderer.clear();
      composer.render(delta);
      composer1.render(delta);
    };

    const animate = () => {
      if (animateable) {
        setTimeout(() => {
          render();
          requestAnimationFrame(animate);
        }, 1000 / fps);
      }
    };

    animate();
  };

  return {
    load: function(options = {}) {
      return new Promise((resolve) => {
        // Wait for screen capture
        GUI.add('screen:captured', (data) => {
          if (data && data.dataURL && data.height) {
            animateable = true;
            initializeGlitch(data.dataURL, data.height, options);
            
            GUI.log('Glitch effect initialized');
            resolve();
          }
        });
      });
    },

    start: function() {
      animateable = true;
      return GUI.$('#loader').animateAsync({ opacity: [1, 0] }, 1000);
    },

    stop: function() {
      return GUI.$('#loader')
        .animateAsync({ opacity: 0 }, { delay: 500, duration: 1000 })
        .then(() => {
          animateable = false;
          GUI.$('#loader').remove();
          GUI.log('Glitch effect stopped');
        });
    },

    unload: function() {
      animateable = false;
      if (renderer) {
        renderer.dispose();
        renderer = null;
      }
      scene = null;
      GUI.$('#loader').remove();
      return Promise.resolve();
    }
  };
});

/**
 * Initial Loader Module
 * Handles the initial page loading animation
 */
FEAR.create('InitialLoader', function(GUI) {
  const typeText = (text, target, speed = 60) => {
    return new Promise((resolve) => {
      const chars = text.split('');
      let index = 0;

      const typeChar = () => {
        if (index < chars.length) {
          GUI.$(target).html(GUI.$(target).html() + chars[index]);
          index++;
          setTimeout(typeChar, speed);
        } else {
          resolve();
        }
      };

      typeChar();
    });
  };

  return {
    load: function(options = {}) {
      const loadText = options.loadText || 'Warning: Intrusion detected.';
      const webGLEnabled = options.webGLEnabled !== false;

      // Remove noscroll on mobile
      GUI.add('device:detected', (detection) => {
        if (detection.isMobile) {
          GUI.$('body').removeClass('noscroll');
        }
      });

      return GUI.ready()
        .then(() => {
          // Type loading text
          return typeText(loadText, '#loader-text', 60);
        })
        .then(() => GUI.timeout(1700))
        .then(() => {
          // Wait for document ready
          return new Promise((resolve) => {
            const checkReady = setInterval(() => {
              if (document.readyState === 'complete') {
                clearInterval(checkReady);
                resolve();
              }
            }, 10);
          });
        })
        .then(() => {
          // Fade out loader
          return GUI.$('#initial-loader').animateAsync({
            translateZ: 0,
            opacity: 0
          }, {
            display: 'none',
            duration: 800
          });
        })
        .then(() => {
          if (webGLEnabled) {
            // Trigger glitch effect
            return GUI.emit('loader:webgl-ready')
              .then(() => GUI.timeout(500))
              .then(() => {
                GUI.$('#initial-loader').remove();
              });
          } else {
            return GUI.timeout(1001).then(() => {
              GUI.$('#initial-loader').remove();
            });
          }
        })
        .then(() => {
          GUI.$('body').removeClass('noscroll');
          GUI.log('Initial loader complete');
        });
    }
  };
});

/**
 * Page Transition Module
 * Manages page transitions with optional glitch effect
 */
FEAR.create('PageTransition', function(GUI) {
  return {
    load: function(options = {}) {
      const useGlitch = options.useGlitch !== false;

      // Listen for route changes
      GUI.add('route:start', (data) => {
        GUI.log('Page transition starting for:', data.path);
        // Scroll to top
        return GUI.$('html').animateAsync({ scrollTop: 0 }, 1000);
      });

      GUI.add('route:complete', (data) => {
        GUI.log('Page transition complete for:', data.path);
      });

      if (useGlitch) {
        // Setup glitch transition
        GUI.add('loader:webgl-ready', () => {
          return FEAR.start('GlitchEffect')
            .then(() => {
              const glitchModule = FEAR.state.instances['GlitchEffect'];
              if (glitchModule) {
                return glitchModule.start()
                  .then(() => GUI.timeout(500))
                  .then(() => glitchModule.stop());
              }
            });
        });
      }

      GUI.log('Page transition module loaded');
      return Promise.resolve();
    }
  };
});

/**
 * Main Application Bootstrap
 * Initialize all modules and start the application
 */
$(document).ready(function() {
  // Configure FEAR GUI
  FEAR.configure({
    name: 'IntroApp',
    logLevel: 0
  });

  // Detect device capabilities
  FEAR.start('DeviceDetection')
    .then((detection) => {
      // Start widow control
      return FEAR.start('WidowControl');
    })
    .then(() => {
      // Wait for window load
      return new Promise((resolve) => {
        $(window).on('load', resolve);
      });
    })
    .then(() => {
      // Get device detection results
      return new Promise((resolve) => {
        FEAR.broker.once('device:detected', (detection) => {
          resolve(detection);
        });
        // Re-emit to trigger any waiting listeners
        return FEAR.state.instances['DeviceDetection'].load();
      });
    })
    .then((detection) => {
      // Start screen capture if WebGL is supported
      if (detection.webGLSupported) {
        return FEAR.start('ScreenCapture', {
          options: { target: '.ajax' }
        });
      }
    })
    .then(() => {
      // Start initial loader
      return FEAR.start('InitialLoader', {
        options: {
          loadText: 'Warning: Intrusion detected.',
          webGLEnabled: FEAR.state.instances['DeviceDetection']?.load()?.webGLSupported
        }
      });
    })
    .then(() => {
      // Start page transition module
      return FEAR.start('PageTransition', {
        options: {
          useGlitch: true
        }
      });
    })
    .then(() => {
      console.log('Application initialized successfully');
      FEAR.broker.emit('app:ready');
    })
    .catch((error) => {
      console.error('Application initialization failed:', error);
    });
});

// Expose utility functions for backward compatibility
window.captureScreen = () => {
  const capture = FEAR.state.instances['ScreenCapture'];
  return capture ? capture.getCapture() : null;
};

window.removePageCanvas = () => {
  const glitch = FEAR.state.instances['GlitchEffect'];
  return glitch ? glitch.stop() : Promise.resolve();
};