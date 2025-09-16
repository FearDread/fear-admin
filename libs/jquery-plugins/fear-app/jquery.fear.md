# FEAR jQuery Plugin

A comprehensive jQuery plugin for building single-page applications with routing, modals, animations, and component management.

## Table of Contents

- [Installation](#installation)
- [Basic Usage](#basic-usage)
- [Configuration Options](#configuration-options)
- [API Methods](#api-methods)
- [Events](#events)
- [Routing System](#routing-system)
- [Components](#components)
- [Examples](#examples)
- [Integration with Other Libraries](#integration-with-other-libraries)

## Installation

### Prerequisites

- jQuery 1.8+ (tested with jQuery 3.x)
- Modern browser with ES5 support

### Include Files

```html
<!-- jQuery (required) -->
<script src="https://cdnjs.cloudflare.com/ajax/libs/jquery/3.6.0/jquery.min.js"></script>

<!-- Optional dependencies -->
<script src="https://cdnjs.cloudflare.com/ajax/libs/OwlCarousel2/2.3.4/owl.carousel.min.js"></script>
<script src="https://cdnjs.cloudflare.com/ajax/libs/jquery-circle-progress/1.2.2/circle-progress.min.js"></script>

<!-- FEAR Plugin -->
<script src="js/fear-plugin.js"></script>
```

### Basic HTML Structure

```html
<div class="fear_all_wrap">
  <div class="fear_container">
    <!-- Your content will be loaded here -->
  </div>
  
  <!-- Modal will be auto-generated -->
  <!-- Mobile menu structure -->
  <div class="fear_mobile_menu">
    <ul>
      <li><a href="#home">Home</a></li>
      <li><a href="#about">About</a></li>
      <li><a href="#works">Works</a></li>
      <li><a href="#contact">Contact</a></li>
    </ul>
  </div>
</div>
```

## Basic Usage

### Auto-Initialization

The plugin automatically initializes when the DOM is ready if a `.fear_all_wrap` element is found:

```javascript
// Auto-initializes with debug enabled
$(document).ready(function() {
  // Plugin automatically starts
});
```

### Manual Initialization

```javascript
$('.fear_all_wrap').FEAR({
  debug: true,
  preloadDelay: 800,
  fadeSpeed: 200
});
```

## Configuration Options

```javascript
var options = {
  // Preloader settings
  preloadDelay: 800,           // Preloader delay in milliseconds
  fadeSpeed: 200,              // Fade animation speed
  
  // File paths
  fragmentPath: 'js/fragments/', // Path to HTML fragments
  contactAPI: 'http://example.com/api/contact', // Contact form endpoint
  
  // Routing configuration
  routes: {
    home: { name: 'home', html: null, callback: null },
    about: { name: 'about', html: null, callback: null },
    works: { name: 'works', html: null, callback: null },
    github: { name: 'github', html: null, callback: null },
    contact: { name: 'contact', html: null, callback: null }
  },
  
  // Development
  debug: false                 // Enable console logging
};

$('.fear_all_wrap').FEAR(options);
```

## API Methods

### Navigation Methods

```javascript
var fear = $('.fear_all_wrap').data('plugin_FEAR');

// Navigate to a specific route
fear.navigateTo('about');

// Get current route
var currentRoute = fear.getCurrentRoute();

// Add new route
fear.addRoute('blog', {
  name: 'blog',
  html: null,
  callback: function() {
    console.log('Blog route loaded');
  }
});

// Remove route
fear.removeRoute('blog');
```

### Modal Methods

```javascript
// Open modal with content
fear.openModal('<h2>Custom Content</h2><p>This is a modal.</p>');

// Close modal
fear.closeModal();
```

### Component Methods

```javascript
// Reinitialize all components
fear.initComponents();

// Initialize specific components
fear.initBackgroundImages();
fear.initProgressBars();
fear.initCircularProgress();
fear.initCursor();
```

### GitHub Integration

```javascript
// Fetch GitHub profile data
fear.fetchGitHubProfile('username').done(function(data) {
  console.log('User:', data.name);
  console.log('Followers:', data.followers);
});
```

### Utility Methods

```javascript
// Destroy plugin instance
fear.destroy();

// Log message (only if debug is enabled)
fear.log('Custom message', { data: 'value' });

// Trigger custom events
fear.trigger('custom:event', { custom: 'data' });
```

## Events

The plugin triggers several custom events that you can listen to:

```javascript
$('.fear_all_wrap')
  .on('fear:initialized', function(e) {
    console.log('Plugin initialized');
  })
  .on('fear:route:loaded', function(e, data) {
    console.log('Route loaded:', data.route);
  })
  .on('fear:route:error', function(e, data) {
    console.log('Route error:', data.error);
  })
  .on('fear:modal:opened', function(e) {
    console.log('Modal opened');
  })
  .on('fear:modal:closed', function(e) {
    console.log('Modal closed');
  })
  .on('fear:contact:sent', function(e, data) {
    console.log('Contact form sent:', data.success);
  })
  .on('fear:contact:error', function(e) {
    console.log('Contact form error');
  })
  .on('fear:github:loaded', function(e, data) {
    console.log('GitHub data:', data);
  })
  .on('fear:github:error', function(e, error) {
    console.log('GitHub error:', error);
  });
```

## Routing System

### Fragment-Based Routing

Create HTML fragments in your specified `fragmentPath` directory:

```
js/fragments/
├── home.html
├── about.html
├── works.html
├── contact.html
└── github.html
```

### Route Configuration

```javascript
$('.fear_all_wrap').FEAR({
  routes: {
    home: { 
      name: 'home', 
      html: null, 
      callback: function() {
        // Custom initialization for home page
        console.log('Home page loaded');
      }
    },
    about: { 
      name: 'about', 
      html: null, 
      callback: function() {
        // Initialize about page components
        this.initProgressBars();
      }
    }
  }
});
```

### Navigation Links

```html
<!-- Navigation menu -->
<ul class="transition_link">
  <li><a href="#home">Home</a></li>
  <li class="active"><a href="#about">About</a></li>
  <li><a href="#works">Works</a></li>
  <li><a href="#contact">Contact</a></li>
</ul>
```

## Components

### Background Images

```html
<!-- Auto-initialized background images -->
<div data-img-url="img/background.jpg"></div>
```

### Progress Bars

```html
<div class="progress_inner" data-value="85" data-color="#007bff">
  <div class="bar">
    <div class="bar_in"></div>
  </div>
</div>
```

### Circular Progress

```html
<div class="circular_progress_bar">
  <div class="myCircle" data-value="0.75"></div>
</div>
```

### SVG Image Conversion

```html
<!-- Images with class 'html' are auto-converted to SVG -->
<img class="html" src="img/icon.svg" alt="Icon">
```

### Custom Cursor

```html
<!-- Add cursor elements -->
<div class="mouse-cursor">
  <div class="cursor-inner"></div>
  <div class="cursor-outer"></div>
</div>
```

### Contact Form

```html
<form class="contact_form">
  <input type="text" id="name" placeholder="Name" required>
  <input type="email" id="email" placeholder="Email" required>
  <input type="text" id="subject" placeholder="Subject">
  <textarea id="message" placeholder="Message" required></textarea>
  <button type="submit" id="send_message">Send Message</button>
  <div class="returnmessage"></div>
  <div class="empty_notice" style="display:none;">Please fill all fields!</div>
</form>
```

### Portfolio Popup

```html
<div class="fear_portfolio">
  <div class="list_inner">
    <div class="image">
      <div class="main" data-img-url="img/portfolio1.jpg"></div>
    </div>
    <div class="details">
      <h3>Project Title</h3>
      <span>Category</span>
    </div>
    <a href="#" class="portfolio_popup">View Details</a>
    
    <!-- Hidden content for popup -->
    <div class="fear_hidden_content">
      <div class="portfolio_popup_details">
        <h4>Project Details</h4>
        <p>Project description goes here...</p>
      </div>
    </div>
  </div>
</div>
```

## Examples

### Complete Implementation

```html
<!DOCTYPE html>
<html>
<head>
  <title>FEAR App</title>
  <script src="https://cdnjs.cloudflare.com/ajax/libs/jquery/3.6.0/jquery.min.js"></script>
  <script src="js/fear-plugin.js"></script>
</head>
<body>
  <div class="fear_all_wrap">
    <!-- Preloader -->
    <div id="preloader">
      <div class="loader"></div>
    </div>
    
    <!-- Top Bar -->
    <div class="fear_topbar">
      <div class="trigger">
        <div class="hamburger">
          <span></span>
          <span></span>
          <span></span>
        </div>
      </div>
    </div>
    
    <!-- Mobile Menu -->
    <div class="fear_mobile_menu">
      <ul>
        <li><a href="#home">Home</a></li>
        <li><a href="#about">About</a></li>
        <li><a href="#works">Works</a></li>
        <li><a href="#contact">Contact</a></li>
      </ul>
    </div>
    
    <!-- Main Container -->
    <div class="fear_container">
      <!-- Content loaded dynamically -->
    </div>
    
    <!-- Custom Cursor -->
    <div class="mouse-cursor">
      <div class="cursor-inner"></div>
      <div class="cursor-outer"></div>
    </div>
  </div>

  <script>
    $(document).ready(function() {
      $('.fear_all_wrap').FEAR({
        debug: true,
        contactAPI: 'your-api-endpoint.php',
        routes: {
          home: { 
            name: 'home', 
            html: null, 
            callback: function() {
              console.log('Welcome to the home page!');
            }
          }
        }
      });
    });
  </script>
</body>
</html>
```

### Advanced Route Handling

```javascript
$('.fear_all_wrap').FEAR({
  routes: {
    home: { 
      name: 'home', 
      html: null, 
      callback: function() {
        // Initialize home-specific components
        this.initCircularProgress();
        
        // Custom logic
        console.log('Home loaded');
      }
    },
    portfolio: {
      name: 'portfolio',
      html: null,
      callback: function() {
        // Initialize portfolio grid
        if (typeof Isotope !== 'undefined') {
          $('.portfolio-grid').isotope({
            itemSelector: '.portfolio-item'
          });
        }
      }
    }
  }
});

// Add dynamic routes
var fear = $('.fear_all_wrap').data('plugin_FEAR');
fear.addRoute('services', {
  name: 'services',
  html: null,
  callback: function() {
    this.initProgressBars();
    console.log('Services page initialized');
  }
});
```

### GitHub Integration Example

```javascript
$('.fear_all_wrap').FEAR({
  routes: {
    github: {
      name: 'github',
      html: null,
      callback: function() {
        var self = this;
        
        // Fetch GitHub data when route loads
        this.fetchGitHubProfile('yourusername').done(function(data) {
          // Update UI with GitHub data
          $('.github-stats').html([
            '<h3>' + data.name + '</h3>',
            '<p>Followers: ' + data.followers + '</p>',
            '<p>Public Repos: ' + data.public_repos + '</p>',
            '<p>Bio: ' + (data.bio || 'No bio available') + '</p>'
          ].join(''));
        });
      }
    }
  }
});
```

### Event Handling

```javascript
$('.fear_all_wrap')
  .FEAR({ debug: true })
  .on('fear:route:loaded', function(e, data) {
    // Analytics tracking
    if (typeof gtag !== 'undefined') {
      gtag('config', 'GA_MEASUREMENT_ID', {
        page_title: data.route,
        page_location: window.location.href
      });
    }
  })
  .on('fear:contact:sent', function(e, data) {
    if (data.success) {
      alert('Thank you! Your message has been sent.');
    } else {
      alert('Sorry, there was an error sending your message.');
    }
  })
  .on('fear:modal:opened', function() {
    // Pause videos when modal opens
    $('video').each(function() {
      this.pause();
    });
  });
```

## Integration with Other Libraries

### With Owl Carousel

```javascript
// The plugin automatically initializes Owl Carousel in modals
// You can also manually initialize:
$('.fear_all_wrap').on('fear:route:loaded', function(e, data) {
  if (data.route === 'gallery') {
    $('.owl-carousel').owlCarousel({
      items: 3,
      loop: true,
      autoplay: true
    });
  }
});
```

### With Isotope/Masonry

```javascript
$('.fear_all_wrap').on('fear:route:loaded', function(e, data) {
  if (data.route === 'portfolio') {
    $('.portfolio-grid').isotope({
      itemSelector: '.portfolio-item',
      layoutMode: 'masonry'
    });
  }
});
```

### CSS Variables Integration

The plugin automatically detects CSS custom properties for colors:

```css
:root {
  --main-color: #007bff;
}
```

## Browser Support

- Chrome 40+
- Firefox 35+
- Safari 9+
- Edge 12+
- Internet Explorer 10+

## License

This plugin is released under the MIT License.

## Contributing

1. Fork the repository
2. Create your feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## Support

For issues and questions, please use the GitHub issues page or contact the development team.