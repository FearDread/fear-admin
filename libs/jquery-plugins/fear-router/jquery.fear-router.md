# Fear Dynamic Router jQuery Plugin

A powerful, lightweight client-side routing solution for single-page applications. Seamlessly handle navigation, dynamic content loading, and route management with performance optimization and accessibility features built-in.

![Version](https://img.shields.io/badge/version-2.0.0-blue.svg)
![jQuery](https://img.shields.io/badge/jQuery-3.0%2B-green.svg)
![License](https://img.shields.io/badge/license-MIT-green.svg)
![Size](https://img.shields.io/badge/size-~15kb-brightgreen.svg)

## 🚀 Features

- **Dynamic Content Loading** - Load HTML fragments on-demand
- **Smart Caching** - Intelligent caching system with TTL support
- **Performance Monitoring** - Built-in metrics tracking and optimization
- **Accessibility First** - ARIA support, screen reader announcements
- **SEO Friendly** - Dynamic title and meta tag updates
- **Error Handling** - Comprehensive error handling with retry mechanisms
- **Modern Architecture** - ES6+ classes with Promise-based async operations
- **Event-Driven** - Rich event system for extensibility
- **Memory Efficient** - Automatic cleanup and resource management
- **Developer Friendly** - Extensive debugging and logging options

## 📦 Installation

### Via CDN
```html
<script src="https://code.jquery.com/jquery-3.6.0.min.js"></script>
<script src="path/to/fear-router.min.js"></script>
```

### Via NPM
```bash
npm install fear-router-jquery
```

### Manual Download
Download the latest release from the [releases page](https://github.com/feardread/fear-router/releases).

## 🎯 Quick Start

### Basic HTML Structure
```html
<div id="app" class="fear-app">
  <nav>
    <a href="#home">Home</a>
    <a href="#about">About</a>
    <a href="#works">Works</a>
    <a href="#contact">Contact</a>
  </nav>
  
  <main class="fear_container">
    <!-- Dynamic content will be loaded here -->
  </main>
</div>
```

### Initialize the Router
```javascript
$(document).ready(function() {
  $('#app').fearRouter({
    fragmentPath: 'templates/',
    fallbackRoute: 'home',
    debug: true,
    
    routes: {
      home: { 
        name: 'home', 
        title: 'Home - Welcome',
        path: 'home.html'
      },
      about: { 
        name: 'about', 
        title: 'About Us',
        path: 'about.html'
      },
      works: { 
        name: 'works', 
        title: 'Our Works',
        path: 'portfolio.html'
      },
      contact: { 
        name: 'contact', 
        title: 'Contact',
        path: 'contact.html'
      }
    }
  });
});
```

### Create Your HTML Fragments
Create HTML files in your `templates/` directory:

**templates/home.html**
```html
<section class="hero">
  <h1>Welcome to Fear Portfolio</h1>
  <p>Discover amazing web experiences</p>
</section>
```

**templates/about.html**
```html
<section class="about">
  <h1>About Us</h1>
  <p>Learn more about our story and mission</p>
</section>
```

## ⚙️ Configuration Options

### Default Configuration
```javascript
const defaults = {
  // Core routing
  hashChange: true,
  pushState: false,
  fallbackRoute: 'home',
  fragmentPath: 'js/fragments/',
  container: '.fear_container',
  
  // Caching
  enableCache: true,
  cacheTimeout: 5 * 60 * 1000, // 5 minutes
  maxCacheSize: 50,
  
  // Animations
  animations: {
    enabled: true,
    fadeSpeed: 300,
    slideSpeed: 400,
    easing: 'swing'
  },
  
  // Loading indicators
  loading: {
    enabled: true,
    template: '<div class="fear-loading">Loading...</div>',
    minDisplayTime: 200,
    timeout: 10000
  },
  
  // Error handling
  errorHandling: {
    enabled: true,
    template: '<div class="fear-error">{message}</div>',
    showConsoleErrors: true,
    retryAttempts: 2
  },
  
  // Accessibility
  accessibility: {
    announceRouteChanges: true,
    focusOnRouteChange: true,
    skipLinkSelector: '.skip-link'
  },
  
  // SEO & Meta
  seo: {
    updateTitle: true,
    updateMeta: true,
    titleSuffix: ' - FEAR',
    defaultTitle: 'FEAR Portfolio'
  },
  
  // Performance
  performance: {
    trackMetrics: true,
    preloadRoutes: [],
    lazyLoad: true
  },
  
  // Event callbacks
  callbacks: {
    onInit: null,
    onDestroy: null,
    beforeRouteChange: null,
    afterRouteChange: null,
    onRouteChange: null,
    onRouteLoaded: null,
    onError: null
  },
  
  // Debug mode
  debug: false
};
```

## 🛠️ API Reference

### Initialization
```javascript
// Basic initialization
$('#app').fearRouter();

// With custom options
$('#app').fearRouter({
  fragmentPath: 'pages/',
  debug: true
});

// Auto-initialization with data attributes
<div data-fear-router data-fear-router-options='{"debug": true}'></div>
```

### Public Methods

#### Navigation
```javascript
// Navigate to a route
$('#app').fearRouter('navigateTo', 'about');

// Navigate with pushState
$('#app').fearRouter('navigateTo', 'contact', true);

// Reload current route
$('#app').fearRouter('reload');
```

#### Route Management
```javascript
// Add a new route
$('#app').fearRouter('addRoute', 'blog', {
  title: 'Blog',
  path: 'blog.html',
  callback: function() {
    console.log('Blog page loaded');
  }
});

// Remove a route
$('#app').fearRouter('removeRoute', 'blog');
```

#### Cache Management
```javascript
// Clear all cached content
$('#app').fearRouter('clearCache');
```

#### State Information
```javascript
// Get current route
const currentRoute = $('#app').fearRouter('getCurrentRoute');

// Get previous route
const previousRoute = $('#app').fearRouter('getPreviousRoute');

// Check if router is ready
const isReady = $('#app').fearRouter('isReady');

// Get performance metrics
const metrics = $('#app').fearRouter('getMetrics');
```

#### Event Management
```javascript
// Bind event handler
$('#app').fearRouter('on', 'fear:router:loaded', function(e, data) {
  console.log('Route loaded:', data.route);
});

// Unbind event handler
$('#app').fearRouter('off', 'fear:router:loaded');
```

#### Lifecycle
```javascript
// Destroy router instance
$('#app').fearRouter('destroy');
```

## 📡 Events

The router emits various events throughout its lifecycle:

```javascript
$('#app')
  // Core events
  .on('fear:router:init', function(e, data, router) {
    console.log('Router initialized');
  })
  .on('fear:router:loaded', function(e, data, router) {
    console.log(`Route ${data.route} loaded in ${data.loadTime}ms`);
  })
  .on('fear:router:rendered', function(e, data, router) {
    console.log('Route content rendered');
  })
  .on('fear:router:error', function(e, data, router) {
    console.error('Router error:', data.message);
  })
  
  // Route events
  .on('fear:router:route-added', function(e, data, router) {
    console.log('New route added:', data.name);
  })
  .on('fear:router:route-removed', function(e, data, router) {
    console.log('Route removed:', data.name);
  })
  
  // Component events
  .on('fear:router:init-components', function(e, data, router) {
    // Reinitialize components after route change
    initTooltips();
    initModals();
  });
```

## 🎨 Route Configuration

### Basic Route
```javascript
routes: {
  home: {
    name: 'home',
    title: 'Home Page',
    path: 'home.html'
  }
}
```

### Advanced Route with Callback
```javascript
routes: {
  portfolio: {
    name: 'portfolio',
    title: 'Our Portfolio',
    path: 'portfolio.html',
    meta: {
      description: 'View our amazing portfolio',
      keywords: 'portfolio, work, projects'
    },
    preload: true,
    callback: function(route) {
      // Initialize portfolio components
      $('.portfolio-grid').isotope();
      $('.lightbox').magnificPopup();
      
      // Load dynamic data
      this.loadPortfolioData();
    }
  }
}
```

### Route with Async Callback
```javascript
routes: {
  dashboard: {
    name: 'dashboard',
    title: 'Dashboard',
    path: 'dashboard.html',
    callback: async function(route) {
      try {
        const userData = await fetch('/api/user').then(r => r.json());
        this.renderUserData(userData);
      } catch (error) {
        this.handleError('Failed to load user data');
      }
    }
  }
}
```

## 🔧 Advanced Usage Examples

### Authentication Guard
```javascript
$('#app').fearRouter({
  callbacks: {
    beforeRouteChange: function(newRoute, currentRoute) {
      const protectedRoutes = ['dashboard', 'profile', 'admin'];
      
      if (protectedRoutes.includes(newRoute)) {
        if (!this.isAuthenticated()) {
          this.navigateTo('login');
          return false; // Cancel navigation
        }
      }
      
      return true; // Allow navigation
    }
  }
});
```

### Analytics Integration
```javascript
$('#app').fearRouter({
  callbacks: {
    afterRouteChange: function(route) {
      // Google Analytics 4
      if (typeof gtag !== 'undefined') {
        gtag('config', 'GA_MEASUREMENT_ID', {
          page_path: `/#${route}`,
          page_title: this.options.routes[route].title
        });
      }
      
      // Custom analytics
      analytics.track('Page View', {
        route: route,
        timestamp: Date.now()
      });
    }
  }
});
```

### Dynamic Route Loading
```javascript
// Add routes dynamically from API
fetch('/api/pages')
  .then(response => response.json())
  .then(pages => {
    pages.forEach(page => {
      $('#app').fearRouter('addRoute', page.slug, {
        title: page.title,
        path: `${page.slug}.html`,
        meta: {
          description: page.description,
          keywords: page.keywords
        }
      });
    });
  });
```

### Custom Loading Template
```javascript
$('#app').fearRouter({
  loading: {
    enabled: true,
    template: `
      <div class="custom-loading">
        <div class="spinner-container">
          <div class="spinner"></div>
          <p>Loading awesome content...</p>
        </div>
      </div>
    `,
    minDisplayTime: 500
  }
});
```

### Error Handling with Retry
```javascript
$('#app').fearRouter({
  errorHandling: {
    enabled: true,
    retryAttempts: 3,
    template: `
      <div class="error-container">
        <h3>Oops! Something went wrong</h3>
        <p>{message}</p>
        <button class="retry-btn">Try Again</button>
        <a href="#home" class="home-link">Go Home</a>
      </div>
    `
  },
  
  callbacks: {
    onError: function(message, error) {
      // Custom error logging
      console.error('Router Error:', error);
      
      // Send to error tracking service
      if (window.Sentry) {
        Sentry.captureException(error);
      }
    }
  }
});
```

## 🎭 CSS Classes and Styling

The router adds helpful CSS classes for styling different states:

```css
/* Loading states */
.fear-loading {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(255, 255, 255, 0.9);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 9999;
}

.fear-loading-active {
  opacity: 1;
  visibility: visible;
}

/* Error states */
.fear-error {
  padding: 2rem;
  text-align: center;
  background: #f8f9fa;
  border: 1px solid #dee2e6;
  border-radius: 0.5rem;
  margin: 2rem 0;
}

.retry-btn {
  background: #007bff;
  color: white;
  border: none;
  padding: 0.5rem 1rem;
  border-radius: 0.25rem;
  cursor: pointer;
  margin: 0.5rem;
}

.retry-btn:hover {
  background: #0056b3;
}

/* Accessibility */
.sr-only {
  position: absolute !important;
  width: 1px !important;
  height: 1px !important;
  padding: 0 !important;
  margin: -1px !important;
  overflow: hidden !important;
  clip: rect(0,0,0,0) !important;
  white-space: nowrap !important;
  border: 0 !important;
}

/* Container animations */
.fear_container {
  transition: opacity 0.3s ease-in-out;
}

/* Active navigation links */
.fear-nav a.active {
  color: #007bff;
  font-weight: bold;
}
```

## 🔍 Debugging and Development

### Enable Debug Mode
```javascript
$('#app').fearRouter({
  debug: true
});
```

Debug mode provides:
- Detailed console logging
- Performance metrics
- Route change notifications
- Error stack traces

### Performance Monitoring
```javascript
// Get detailed metrics
const router = $('#app').fearRouter('Constructor');
const metrics = router.getMetrics();

console.log('Performance Metrics:', {
  totalRoutes: metrics.totalRoutes,
  cacheHitRate: metrics.cacheHits / (metrics.cacheHits + metrics.cacheMisses),
  averageLoadTime: Array.from(metrics.routeLoadTimes.values()).reduce((a, b) => a + b, 0) / metrics.routeLoadTimes.size
});

// Monitor slow routes
$('#app').on('fear:router:loaded', function(e, data) {
  if (data.loadTime > 1000) {
    console.warn(`Slow route detected: ${data.route} took ${data.loadTime}ms`);
  }
});
```

## 🚨 Common Issues and Solutions

### Route Not Loading
- Check if the HTML file exists in the `fragmentPath`
- Verify the route configuration is correct
- Enable debug mode to see detailed error messages
- Check browser console for network errors

### Cache Issues
```javascript
// Clear cache for troubleshooting
$('#app').fearRouter('clearCache');

// Disable cache for development
$('#app').fearRouter({
  enableCache: false
});
```

### Performance Issues
- Enable route preloading for frequently accessed routes
- Optimize HTML fragments (remove unnecessary content)
- Use performance monitoring to identify bottlenecks
- Consider implementing lazy loading for heavy content

### Accessibility Issues
- Ensure proper heading hierarchy in fragments
- Add ARIA labels to navigation elements
- Test with screen readers
- Enable route change announcements

## 🌟 Best Practices

### 1. Fragment Structure
Keep HTML fragments focused and semantic:
```html
<!-- Good: Focused content -->
<section class="page-content" role="main">
  <h1>Page Title</h1>
  <p>Content here...</p>
</section>

<!-- Avoid: Full HTML documents -->
<!DOCTYPE html>
<html>...</html>
```

### 2. Route Organization
Organize routes logically:
```javascript
routes: {
  // Main pages
  home: { ... },
  about: { ... },
  
  // Sub-sections
  'portfolio-web': { ... },
  'portfolio-mobile': { ... },
  
  // Special pages
  '404': { ... },
  'maintenance': { ... }
}
```

### 3. Error Handling
Always provide meaningful error messages:
```javascript
callbacks: {
  onError: function(message, error) {
    // Log for developers
    console.error('Router Error:', error);
    
    // Show user-friendly message
    this.showUserMessage('Sorry, there was a problem loading the page.');
    
    // Optional: Report to monitoring service
    if (window.errorReporting) {
      window.errorReporting.captureException(error);
    }
  }
}
```

### 4. Performance Optimization
```javascript
// Preload critical routes
performance: {
  preloadRoutes: ['home', 'about'],
  trackMetrics: true
},

// Optimize animations for performance
animations: {
  enabled: !window.matchMedia('(prefers-reduced-motion: reduce)').matches,
  fadeSpeed: 200 // Faster animations feel more responsive
}
```

## 🤝 Contributing

We welcome contributions! Please read our [Contributing Guide](CONTRIBUTING.md) for details on:
- Code style and standards
- Submitting bug reports
- Proposing new features
- Development setup

## 📄 License

MIT License - see [LICENSE](LICENSE) file for details.

## 🆘 Support

- **Documentation**: [Full documentation](https://feardread.github.io/fear-router/)
- **Issues**: [GitHub Issues](https://github.com/feardread/fear-router/issues)
- **Discussions**: [GitHub Discussions](https://github.com/feardread/fear-router/discussions)
- **Email**: support@fearrouter.com

## 🎯 Roadmap

- [ ] TypeScript definitions
- [ ] React/Vue.js integration helpers
- [ ] Advanced caching strategies
- [ ] WebWorker support for heavy operations
- [ ] Progressive Web App features
- [ ] Server-side rendering compatibility

## 🏆 Credits

Built with ❤️ by [FearDread](https://github.com/feardread)

Special thanks to all [contributors](https://github.com/feardread/fear-router/contributors) who have helped make this project better.

---

**Star ⭐ this project if you find it useful!**