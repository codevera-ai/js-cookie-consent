# Cookie Consent Library

A lightweight, customisable vanilla JavaScript library for managing cookie consent. This library handles all the consent logic whilst giving you complete control over the design and appearance of your cookie banner.

## Why this library is different

Unlike other cookie consent libraries that force you into a specific design, this library gives you **100% control over the appearance** of your cookie banner. We only provide the functionality - you design the interface.

**What this library does:**
- Manages cookie consent state
- Handles user accept/reject actions
- Stores consent preferences
- Provides event-driven architecture
- Shows/hides your banner based on consent status
- Displays cookies when requested

**What this library doesn't do:**
- Force any specific design or styling on you
- Include pre-built CSS themes (though we provide examples)
- Limit your creative freedom

You build your banner exactly how you want it to look. We handle everything else.

## Features

- Fully customisable design and styling
- Flexible positioning options (top, bottom, centre, left, right)
- Multiple animation styles (slide, fade, scale)
- Support for cookie categories (necessary, analytics, marketing, etc.)
- No dependencies
- Lightweight (10.3KB minified, ~4KB gzipped)
- Event-driven architecture
- Responsive and mobile-friendly
- Built with GDPR and CCPA compliance in mind

## Installation

### Via npm

```bash
npm install @codevera-ai/js-cookie-consent
```

### Via CDN

```html
<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/@codevera-ai/js-cookie-consent/src/cookie-consent.css">
<script src="https://cdn.jsdelivr.net/npm/@codevera-ai/js-cookie-consent/src/cookie-consent.js"></script>
```

### Manual installation

Download or clone the repository and include the files in your HTML:

```html
<link rel="stylesheet" href="path/to/cookie-consent.css">
<script src="path/to/cookie-consent.js"></script>
```

## Quick start

Create your cookie consent banner HTML with the required data attributes and classes:

```html
<div data-cookie-consent data-position="bottom-center" data-animation="slide" data-width="full">
    <div>
        <h2>We use cookies</h2>
        <p>We use cookies to improve your experience on our site.</p>
    </div>

    <div>
        <button class="js-cookie-accept">Accept all</button>
        <button class="js-cookie-reject">Reject all</button>
    </div>
</div>
```

The library will automatically initialise when the page loads if it finds an element with the `data-cookie-consent` attribute.

## Configuration

### Data attributes

Configure your cookie banner using data attributes on the container element:

#### `data-cookie-consent` (required)

Identifies the container as a cookie consent banner.

```html
<div data-cookie-consent>
    <!-- Your banner content -->
</div>
```

#### `data-position`

Controls where the banner appears on the screen.

**Options:**
- `top-left`
- `top-center`
- `top-right`
- `bottom-left`
- `bottom-center` (default)
- `bottom-right`
- `center`

```html
<div data-cookie-consent data-position="bottom-right">
    <!-- Your banner content -->
</div>
```

#### `data-animation`

Controls how the banner appears and disappears.

**Options:**
- `slide` (default)
- `fade`
- `scale`

```html
<div data-cookie-consent data-animation="fade">
    <!-- Your banner content -->
</div>
```

#### `data-width`

Controls the width of the banner.

**Options:**
- `full` (default) - 100% width
- `half` - 50% width
- `third` - 33.333% width
- `quarter` - 25% width
- `auto` - Content-based width

```html
<div data-cookie-consent data-width="half">
    <!-- Your banner content -->
</div>
```

### Button classes

Add these classes to buttons within your banner to handle user actions:

#### `js-cookie-accept`

Accepts cookies and saves consent.

```html
<button class="js-cookie-accept">Accept all cookies</button>
```

#### `js-cookie-reject`

Rejects optional cookies (keeps only necessary cookies).

```html
<button class="js-cookie-reject">Reject optional cookies</button>
```

#### `js-cookie-close`

Simply closes the banner without saving consent.

```html
<button class="js-cookie-close">Close</button>
```

#### `js-cookie-show-settings`

Shows the cookie banner again (use anywhere on your page).

```html
<button class="js-cookie-show-settings">Cookie settings</button>
```

#### `js-cookie-view-cookies`

View all cookies currently set on the site. Shows a default modal with all cookies, and also triggers an event with cookie data for custom implementations.

```html
<button class="js-cookie-view-cookies">View cookies</button>
```

### Category checkboxes

Allow users to choose specific cookie categories by adding checkboxes with the `js-cookie-category` class:

```html
<div>
    <input type="checkbox" id="necessary" class="js-cookie-category" value="necessary" checked disabled>
    <label for="necessary">Necessary cookies</label>
</div>

<div>
    <input type="checkbox" id="analytics" class="js-cookie-category" value="analytics">
    <label for="analytics">Analytics cookies</label>
</div>

<div>
    <input type="checkbox" id="marketing" class="js-cookie-category" value="marketing">
    <label for="marketing">Marketing cookies</label>
</div>
```

## JavaScript API

### Initialisation

The library automatically initialises, but you can manually initialise or re-initialise with custom options:

```javascript
CookieConsent.init({
    cookieName: 'cookie_consent',        // Cookie name (default: 'cookie_consent')
    cookieExpiry: 365,                   // Cookie expiry in days (default: 365)
    containerSelector: '[data-cookie-consent]',  // Container selector
    acceptClass: 'js-cookie-accept',     // Accept button class
    rejectClass: 'js-cookie-reject',     // Reject button class
    closeClass: 'js-cookie-close',       // Close button class
    showSettingsClass: 'js-cookie-show-settings',  // Show settings button class
    categoryCheckboxClass: 'js-cookie-category'    // Category checkbox class
});
```

### Methods

#### `CookieConsent.getConsent()`

Returns the current consent status as an object:

```javascript
const consent = CookieConsent.getConsent();
console.log(consent);
// Returns: { accepted: true, categories: ['necessary', 'analytics'], timestamp: '2024-01-15T10:30:00.000Z' }
```

#### `CookieConsent.hasConsent(category)`

Check if consent has been given for a specific category:

```javascript
if (CookieConsent.hasConsent('analytics')) {
    // Load analytics scripts
}
```

#### `CookieConsent.revoke()`

Revoke consent and show the banner again:

```javascript
CookieConsent.revoke();
```

#### `CookieConsent.viewCookies()`

Get all cookies currently set on the site. This method displays a default modal showing all cookies and returns the cookie data:

```javascript
const cookies = CookieConsent.viewCookies();
console.log(cookies);
// Returns: [{ name: 'cookie_name', value: 'cookie_value' }, ...]
```

The default modal is automatically displayed, but you can still listen to the event to implement your own custom display (see events section below).

#### `CookieConsent.show()`

Manually show the banner:

```javascript
CookieConsent.show();
```

#### `CookieConsent.hide()`

Manually hide the banner:

```javascript
CookieConsent.hide();
```

### Events

The library dispatches custom events that you can listen for:

#### `cookieConsent:consent-given`

Fired when user accepts cookies:

```javascript
document.addEventListener('cookieConsent:consent-given', function(event) {
    console.log('Consent given:', event.detail);
    // Load tracking scripts, analytics, etc.
});
```

#### `cookieConsent:consent-rejected`

Fired when user rejects optional cookies:

```javascript
document.addEventListener('cookieConsent:consent-rejected', function(event) {
    console.log('Consent rejected:', event.detail);
    // Remove tracking scripts
});
```

#### `cookieConsent:consent-revoked`

Fired when consent is revoked:

```javascript
document.addEventListener('cookieConsent:consent-revoked', function() {
    console.log('Consent revoked');
    // Clean up cookies and tracking
});
```

#### `cookieConsent:banner-shown`

Fired when the banner is displayed:

```javascript
document.addEventListener('cookieConsent:banner-shown', function() {
    console.log('Banner shown');
});
```

#### `cookieConsent:banner-hidden`

Fired when the banner is hidden:

```javascript
document.addEventListener('cookieConsent:banner-hidden', function() {
    console.log('Banner hidden');
});
```

#### `cookieConsent:cookies-viewed`

Fired when the view cookies button is clicked. The library displays a default modal automatically, but you can listen to this event to implement your own custom display:

```javascript
document.addEventListener('cookieConsent:cookies-viewed', function(event) {
    console.log('All cookies:', event.detail.cookies);
    // Optionally implement your own custom cookie display
    // The default modal will still be shown unless you prevent it
});
```

## Examples

This library includes six examples that you can use as-is or customise:

### 1. Skeleton (bare bones)

Located in `examples/skeleton/` - provides the basic HTML structure with no styling. Perfect as a starting point for custom designs.

### 2. Professional

Located in `examples/professional/` - clean, modern, minimal design suitable for most websites.

### 3. Corporate

Located in `examples/corporate/` - formal, trustworthy, traditional design for corporate websites.

### 4. Friendly

Located in `examples/friendly/` - warm, approachable, playful design for creative brands.

### 5. Dark mode

Located in `examples/dark/` - sleek modern dark theme.

### 6. Minimal

Located in `examples/minimal/` - ultra-minimal, no-frills design for maximum simplicity.

Each example includes a complete HTML file and CSS stylesheet. View the `examples/` directory for full code.

## Responsive design

All examples are fully responsive and mobile-friendly. The library automatically handles touch events and adapts layouts for smaller screens.

## Browser support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)
- Opera (latest)
- Mobile browsers (iOS Safari, Chrome Android)

## Best practices

### Loading scripts conditionally

Use the consent events to load third-party scripts only after consent is given:

```javascript
document.addEventListener('cookieConsent:consent-given', function(event) {
    const consent = event.detail;

    if (consent.categories.includes('analytics')) {
        // Load Google Analytics
        (function(i,s,o,g,r,a,m){i['GoogleAnalyticsObject']=r;i[r]=i[r]||function(){
        (i[r].q=i[r].q||[]).push(arguments)},i[r].l=1*new Date();a=s.createElement(o),
        m=s.getElementsByTagName(o)[0];a.async=1;a.src=g;m.parentNode.insertBefore(a,m)
        })(window,document,'script','https://www.google-analytics.com/analytics.js','ga');

        ga('create', 'UA-XXXXX-Y', 'auto');
        ga('send', 'pageview');
    }

    if (consent.categories.includes('marketing')) {
        // Load marketing pixels
    }
});
```

### Checking consent on page load

Check existing consent when the page loads:

```javascript
window.addEventListener('DOMContentLoaded', function() {
    const consent = CookieConsent.getConsent();

    if (consent && consent.accepted) {
        // User has already consented
        if (consent.categories.includes('analytics')) {
            // Load analytics
        }
    }
});
```

### Providing a settings link

Always provide a way for users to change their consent preferences:

```html
<footer>
    <button class="js-cookie-show-settings">Cookie preferences</button>
</footer>
```

## Customisation

### Custom styling

The library only applies positioning and animation styles. All visual styling is up to you. Create your own CSS file:

```css
[data-cookie-consent] {
    background: #ffffff;
    border: 1px solid #e5e7eb;
    padding: 2rem;
    border-radius: 0.5rem;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

/* Style your buttons */
.js-cookie-accept {
    background: #3b82f6;
    color: #ffffff;
    padding: 0.5rem 1rem;
    border: none;
    border-radius: 0.25rem;
    cursor: pointer;
}
```

### Custom animations

Override the default animations in your CSS:

```css
[data-cookie-consent][data-animation="custom"] {
    opacity: 0;
    transform: rotate(0deg);
    transition: all 0.5s ease;
}

[data-cookie-consent][data-animation="custom"].is-visible {
    opacity: 1;
    transform: rotate(360deg);
}
```

Then use it in your HTML:

```html
<div data-cookie-consent data-animation="custom">
    <!-- Your banner content -->
</div>
```

## Accessibility

The library is built with accessibility in mind:

- All interactive elements are keyboard accessible
- Proper ARIA attributes should be added to your HTML
- Focus management is handled automatically
- Screen reader friendly

### Recommended ARIA attributes

```html
<div data-cookie-consent role="dialog" aria-labelledby="cookie-title" aria-describedby="cookie-description">
    <h2 id="cookie-title">Cookie preferences</h2>
    <p id="cookie-description">We use cookies to improve your experience.</p>

    <button class="js-cookie-accept" aria-label="Accept all cookies">Accept all</button>
    <button class="js-cookie-reject" aria-label="Reject optional cookies">Reject</button>
</div>
```

## GDPR compliance

This library helps you comply with GDPR and other privacy regulations:

- Cookie consent is obtained before setting non-necessary cookies
- Users can accept, reject, or customise their cookie preferences
- Consent choices are stored and can be retrieved
- Users can revoke consent at any time
- Clear information about cookie categories

Remember: this library handles the technical implementation, but you are responsible for:

- Writing clear, accurate cookie policy information
- Only loading tracking scripts after consent is obtained
- Respecting user choices
- Providing accessible privacy information

## Licence

MIT Licence

Copyright (c) 2024

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicence, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.

## Support

For issues, questions, or contributions, please visit the GitHub repository.

## Contributing

Contributions are welcome. Please follow these guidelines:

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Write or update tests if applicable
5. Submit a pull request

## Changelog

### Version 1.0.0

- Initial release
- Core consent management functionality
- Flexible positioning and animations
- Cookie category support
- Event-driven architecture
- Six example implementations
- Comprehensive documentation
