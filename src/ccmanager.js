/**
 * Cookie Consent Library
 * A lightweight, customisable cookie consent manager
 * @version 1.0.0
 */

(function(window, document) {
    'use strict';

    const CookieConsent = {
        config: {
            cookieName: 'cookie_consent',
            cookieExpiry: 365,
            containerSelector: '[data-cookie-consent]',
            acceptClass: 'js-cookie-accept',
            rejectClass: 'js-cookie-reject',
            settingsClass: 'js-cookie-settings',
            closeClass: 'js-cookie-close',
            showSettingsClass: 'js-cookie-show-settings',
            viewCookiesClass: 'js-cookie-view-cookies',
            categoryCheckboxClass: 'js-cookie-category',
            inlineCookiesClass: 'js-cookies-inline',
        },

        /**
         * Initialise the library
         */
        init: function(options) {
            this.config = { ...this.config, ...options };
            this.container = document.querySelector(this.config.containerSelector);

            if (!this.container) {
                console.warn('Cookie consent container not found');
                return;
            }

            this.position = this.container.getAttribute('data-cookie-consent-position') || 'bottom-center';
            this.animation = this.container.getAttribute('data-cookie-consent-animation') || 'slide';
            this.width = this.container.getAttribute('data-cookie-consent-width') || 'full';

            this.applyPositioning();
            this.bindEvents();
            this.checkConsent();
            this.renderInlineCookies();
        },

        /**
         * Apply positioning styles based on data attributes
         */
        applyPositioning: function() {
            const positions = {
                'top-left': { top: '0', left: '0', right: 'auto', bottom: 'auto' },
                'top-center': { top: '0', left: '50%', transform: 'translateX(-50%)', right: 'auto', bottom: 'auto' },
                'top-right': { top: '0', right: '0', left: 'auto', bottom: 'auto' },
                'bottom-left': { bottom: '0', left: '0', right: 'auto', top: 'auto' },
                'bottom-center': { bottom: '0', left: '50%', transform: 'translateX(-50%)', right: 'auto', top: 'auto' },
                'bottom-right': { bottom: '0', right: '0', left: 'auto', top: 'auto' },
                'center': { top: '50%', left: '50%', transform: 'translate(-50%, -50%)', right: 'auto', bottom: 'auto' }
            };

            const widths = {
                'full': '100%',
                'half': '50%',
                'third': '33.333%',
                'quarter': '25%',
                'auto': 'auto'
            };

            this.container.style.position = 'fixed';
            this.container.style.zIndex = '9999';

            const positionStyles = positions[this.position] || positions['bottom-center'];
            Object.keys(positionStyles).forEach(key => {
                this.container.style[key] = positionStyles[key];
            });

            // For full width with edge positions, use inset instead of width
            const centerPositions = ['top-center', 'bottom-center', 'center'];
            const isEdgePosition = !centerPositions.includes(this.position);

            if (this.width === 'full' && isEdgePosition) {
                // Use inset positioning for full-width edge positions
                if (this.position.includes('top')) {
                    this.container.style.left = '0';
                    this.container.style.right = '0';
                    this.container.style.width = 'auto';
                } else if (this.position.includes('bottom')) {
                    this.container.style.left = '0';
                    this.container.style.right = '0';
                    this.container.style.width = 'auto';
                }
            } else if (this.width !== 'auto') {
                // Apply width for center positions or non-full widths
                this.container.style.width = widths[this.width] || widths['full'];
                if (this.width !== 'full') {
                    this.container.style.maxWidth = widths[this.width];
                }
            }

            this.container.setAttribute('data-cookie-consent-animation', this.animation);
        },

        /**
         * Bind event listeners to buttons
         */
        bindEvents: function() {
            const acceptBtns = this.container.querySelectorAll(`.${this.config.acceptClass}`);
            const rejectBtns = this.container.querySelectorAll(`.${this.config.rejectClass}`);
            const closeBtns = this.container.querySelectorAll(`.${this.config.closeClass}`);
            const showSettingsBtns = document.querySelectorAll(`.${this.config.showSettingsClass}`);
            const viewCookiesBtns = document.querySelectorAll(`.${this.config.viewCookiesClass}`);

            acceptBtns.forEach(btn => {
                btn.addEventListener('click', (e) => {
                    e.preventDefault();
                    this.accept();
                });
            });

            rejectBtns.forEach(btn => {
                btn.addEventListener('click', (e) => {
                    e.preventDefault();
                    this.reject();
                });
            });

            closeBtns.forEach(btn => {
                btn.addEventListener('click', (e) => {
                    e.preventDefault();
                    this.hide();
                });
            });

            showSettingsBtns.forEach(btn => {
                btn.addEventListener('click', (e) => {
                    e.preventDefault();
                    this.show();
                });
            });

            viewCookiesBtns.forEach(btn => {
                btn.addEventListener('click', (e) => {
                    e.preventDefault();
                    this.viewCookies();
                });
            });
        },

        /**
         * Check if consent has been given
         */
        checkConsent: function() {
            const consent = this.getCookie(this.config.cookieName);

            if (!consent) {
                this.show();
            } else {
                this.hide();
            }

            return consent;
        },

        /**
         * Accept cookies
         */
        accept: function() {
            const categories = this.getSelectedCategories();
            const consentData = {
                accepted: true,
                categories: categories.length > 0 ? categories : ['necessary', 'analytics', 'marketing'],
                timestamp: new Date().toISOString()
            };

            this.setCookie(this.config.cookieName, JSON.stringify(consentData), this.config.cookieExpiry);
            this.hide();
            this.triggerEvent('consent-given', consentData);
        },

        /**
         * Reject cookies
         */
        reject: function() {
            const consentData = {
                accepted: false,
                categories: ['necessary'],
                timestamp: new Date().toISOString()
            };

            this.setCookie(this.config.cookieName, JSON.stringify(consentData), this.config.cookieExpiry);
            this.hide();
            this.triggerEvent('consent-rejected', consentData);
        },

        /**
         * Get selected cookie categories from checkboxes
         */
        getSelectedCategories: function() {
            const checkboxes = this.container.querySelectorAll(`.${this.config.categoryCheckboxClass}`);
            const categories = [];

            checkboxes.forEach(checkbox => {
                if (checkbox.checked) {
                    categories.push(checkbox.value);
                }
            });

            return categories;
        },

        /**
         * Show consent banner
         */
        show: function() {
            this.container.style.display = 'block';

            setTimeout(() => {
                this.container.classList.add('is-visible');
            }, 10);

            this.triggerEvent('banner-shown');
        },

        /**
         * Hide consent banner
         */
        hide: function() {
            this.container.classList.remove('is-visible');

            setTimeout(() => {
                this.container.style.display = 'none';
            }, 300);

            this.triggerEvent('banner-hidden');
        },

        /**
         * Set a cookie
         */
        setCookie: function(name, value, days) {
            const date = new Date();
            date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
            const expires = 'expires=' + date.toUTCString();
            document.cookie = name + '=' + value + ';' + expires + ';path=/;SameSite=Strict';
        },

        /**
         * Get a cookie value
         */
        getCookie: function(name) {
            const nameEQ = name + '=';
            const cookies = document.cookie.split(';');

            for (let i = 0; i < cookies.length; i++) {
                let cookie = cookies[i];
                while (cookie.charAt(0) === ' ') {
                    cookie = cookie.substring(1, cookie.length);
                }
                if (cookie.indexOf(nameEQ) === 0) {
                    return cookie.substring(nameEQ.length, cookie.length);
                }
            }
            return null;
        },

        /**
         * Delete a cookie
         */
        deleteCookie: function(name) {
            document.cookie = name + '=;expires=Thu, 01 Jan 1970 00:00:00 UTC;path=/;';
        },

        /**
         * Get current consent status
         */
        getConsent: function() {
            const consent = this.getCookie(this.config.cookieName);
            return consent ? JSON.parse(consent) : null;
        },

        /**
         * Check if a specific category is accepted
         */
        hasConsent: function(category) {
            const consent = this.getConsent();

            if (!consent || !consent.accepted) {
                return false;
            }

            return consent.categories.includes(category);
        },

        /**
         * Revoke consent and show banner again
         */
        revoke: function() {
            this.deleteCookie(this.config.cookieName);
            this.show();
            this.triggerEvent('consent-revoked');
        },

        /**
         * View all cookies currently set
         */
        viewCookies: function() {
            const allCookies = document.cookie.split(';').reduce((acc, cookie) => {
                const [name, value] = cookie.trim().split('=');
                if (name) {
                    acc.push({ name, value: value || '' });
                }
                return acc;
            }, []);

            // Show default display
            this.showDefaultCookieDisplay(allCookies);

            // Still fire event for custom handlers
            this.triggerEvent('cookies-viewed', { cookies: allCookies });

            return allCookies;
        },

        /**
         * Show default cookie display
         */
        showDefaultCookieDisplay: function(cookies) {
            // Remove existing display if present
            const existingDisplay = document.getElementById('cookie-consent-display');
            if (existingDisplay) {
                existingDisplay.remove();
            }

            // Create overlay
            const overlay = document.createElement('div');
            overlay.id = 'cookie-consent-display';
            overlay.style.cssText = 'position: fixed; top: 0; left: 0; right: 0; bottom: 0; background: rgba(0,0,0,0.5); z-index: 10000; display: flex; align-items: center; justify-content: center; padding: 1rem;';

            // Create modal
            const modal = document.createElement('div');
            modal.style.cssText = 'background: #ffffff; border-radius: 0.5rem; padding: 2rem; max-width: 600px; width: 100%; max-height: 80vh; overflow-y: auto; box-shadow: 0 10px 40px rgba(0,0,0,0.3);';

            // Header
            const header = document.createElement('div');
            header.style.cssText = 'display: flex; justify-content: space-between; align-items: center; margin-bottom: 1rem; border-bottom: 2px solid #e5e7eb; padding-bottom: 1rem;';

            const title = document.createElement('h3');
            title.textContent = 'Cookies on this site';
            title.style.cssText = 'margin: 0; font-size: 1.25rem; color: #111827;';

            const closeBtn = document.createElement('button');
            closeBtn.textContent = '×';
            closeBtn.style.cssText = 'background: none; border: none; font-size: 2rem; cursor: pointer; color: #6b7280; line-height: 1; padding: 0; width: 2rem; height: 2rem;';
            closeBtn.onclick = function() { overlay.remove(); };

            header.appendChild(title);
            header.appendChild(closeBtn);

            // Cookie list
            const list = document.createElement('div');

            if (cookies.length === 0) {
                const emptyMsg = document.createElement('p');
                emptyMsg.textContent = 'No cookies found';
                emptyMsg.style.cssText = 'color: #6b7280; text-align: center; padding: 2rem;';
                list.appendChild(emptyMsg);
            } else {
                cookies.forEach(function(cookie) {
                    const item = document.createElement('div');
                    item.style.cssText = 'padding: 1rem; border-bottom: 1px solid #e5e7eb; word-break: break-all;';

                    const cookieName = document.createElement('strong');
                    cookieName.textContent = cookie.name;
                    cookieName.style.cssText = 'color: #111827; display: block; margin-bottom: 0.25rem;';

                    const cookieValue = document.createElement('span');
                    cookieValue.textContent = cookie.value;
                    cookieValue.style.cssText = 'color: #6b7280; font-size: 0.875rem;';

                    item.appendChild(cookieName);
                    item.appendChild(cookieValue);
                    list.appendChild(item);
                });
            }

            // Close button at bottom
            const footer = document.createElement('div');
            footer.style.cssText = 'margin-top: 1.5rem; text-align: right;';

            const closeButton = document.createElement('button');
            closeButton.textContent = 'Close';
            closeButton.style.cssText = 'background: #3b82f6; color: #ffffff; border: none; padding: 0.75rem 1.5rem; border-radius: 0.375rem; cursor: pointer; font-size: 0.875rem; font-weight: 500;';
            closeButton.onclick = function() { overlay.remove(); };

            footer.appendChild(closeButton);

            // Assemble modal
            modal.appendChild(header);
            modal.appendChild(list);
            modal.appendChild(footer);
            overlay.appendChild(modal);

            // Close on overlay click
            overlay.onclick = function(e) {
                if (e.target === overlay) {
                    overlay.remove();
                }
            };

            // Add to page
            document.body.appendChild(overlay);
        },

        /**
         * Render cookies inline in elements with js-cookies-inline class
         */
        renderInlineCookies: function() {
            const inlineContainers = document.querySelectorAll(`.${this.config.inlineCookiesClass}`);

            if (inlineContainers.length === 0) {
                return;
            }

            const allCookies = document.cookie.split(';').reduce((acc, cookie) => {
                const [name, value] = cookie.trim().split('=');
                if (name) {
                    acc.push({ name, value: value || '' });
                }
                return acc;
            }, []);

            inlineContainers.forEach((container) => {
                // Clear existing content
                container.innerHTML = '';

                // Add default class for styling
                if (!container.classList.contains('cookie-consent-inline')) {
                    container.classList.add('cookie-consent-inline');
                }

                if (allCookies.length === 0) {
                    const emptyMessage = document.createElement('p');
                    emptyMessage.className = 'cookie-consent-inline-empty';
                    emptyMessage.textContent = 'No cookies found';
                    container.appendChild(emptyMessage);
                } else {
                    const table = document.createElement('table');
                    table.className = 'cookie-consent-inline-table';

                    const thead = document.createElement('thead');
                    const headerRow = document.createElement('tr');

                    const nameHeader = document.createElement('th');
                    nameHeader.textContent = 'Cookie name';

                    const valueHeader = document.createElement('th');
                    valueHeader.textContent = 'Value';

                    headerRow.appendChild(nameHeader);
                    headerRow.appendChild(valueHeader);
                    thead.appendChild(headerRow);
                    table.appendChild(thead);

                    const tbody = document.createElement('tbody');

                    allCookies.forEach((cookie) => {
                        const row = document.createElement('tr');

                        const nameCell = document.createElement('td');
                        nameCell.className = 'cookie-consent-inline-name';
                        nameCell.textContent = cookie.name;

                        const valueCell = document.createElement('td');
                        valueCell.className = 'cookie-consent-inline-value';

                        // Try to parse JSON and format it nicely
                        try {
                            const parsed = JSON.parse(decodeURIComponent(cookie.value));

                            if (typeof parsed === 'object' && parsed !== null) {
                                const list = document.createElement('ul');
                                list.className = 'cookie-consent-value-list';

                                Object.entries(parsed).forEach(([key, value]) => {
                                    const item = document.createElement('li');
                                    const keySpan = document.createElement('span');
                                    keySpan.className = 'cookie-consent-value-key';
                                    keySpan.textContent = key + ': ';

                                    const valueSpan = document.createElement('span');
                                    valueSpan.className = 'cookie-consent-value-text';

                                    if (Array.isArray(value)) {
                                        valueSpan.textContent = value.join(', ');
                                    } else if (typeof value === 'object' && value !== null) {
                                        valueSpan.textContent = JSON.stringify(value);
                                    } else {
                                        valueSpan.textContent = String(value);
                                    }

                                    item.appendChild(keySpan);
                                    item.appendChild(valueSpan);
                                    list.appendChild(item);
                                });

                                valueCell.appendChild(list);
                            } else {
                                valueCell.textContent = cookie.value;
                            }
                        } catch (e) {
                            // Not JSON, just display the raw value
                            valueCell.textContent = cookie.value;
                        }

                        row.appendChild(nameCell);
                        row.appendChild(valueCell);
                        tbody.appendChild(row);
                    });

                    table.appendChild(tbody);
                    container.appendChild(table);
                }
            });
        },

        /**
         * Trigger custom events
         */
        triggerEvent: function(eventName, data) {
            const event = new CustomEvent('cookieConsent:' + eventName, {
                detail: data,
                bubbles: true,
                cancelable: true
            });
            document.dispatchEvent(event);
        }
    };

    // Expose to global scope
    window.CookieConsent = CookieConsent;

    // Auto-initialise if data attribute exists
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', function() {
            if (document.querySelector('[data-cookie-consent]')) {
                CookieConsent.init();
            }
        });
    } else {
        if (document.querySelector('[data-cookie-consent]')) {
            CookieConsent.init();
        }
    }

})(window, document);
