/**
 * PC Store - Main JavaScript
 */

document.addEventListener('DOMContentLoaded', function () {
    // Mobile Navigation Toggle
    const mobileToggle = document.getElementById('mobileToggle');
    const navLinks = document.querySelector('.nav-links');

    if (mobileToggle && navLinks) {
        mobileToggle.addEventListener('click', function () {
            navLinks.classList.toggle('active');
        });
    }

    // Auto-hide alerts after 5 seconds
    const alerts = document.querySelectorAll('.alert');
    alerts.forEach(function (alert) {
        setTimeout(function () {
            alert.style.opacity = '0';
            alert.style.transform = 'translateY(-10px)';
            setTimeout(function () {
                alert.remove();
            }, 300);
        }, 5000);
    });

    // Quantity Input Validation
    const quantityInputs = document.querySelectorAll('input[type="number"][name="quantity"]');
    quantityInputs.forEach(function (input) {
        input.addEventListener('change', function () {
            if (this.value < 1) this.value = 1;
            if (this.max && this.value > parseInt(this.max)) {
                this.value = this.max;
            }
        });
    });

    // Add to Cart Animation
    const addToCartButtons = document.querySelectorAll('.btn-add-cart');
    addToCartButtons.forEach(function (btn) {
        btn.addEventListener('click', function () {
            const originalText = this.innerHTML;
            this.innerHTML = '<i class="fas fa-check"></i> Added!';
            this.classList.add('btn-success');
            this.classList.remove('btn-primary');

            setTimeout(function () {
                btn.innerHTML = originalText;
                btn.classList.remove('btn-success');
                btn.classList.add('btn-primary');
            }, 1500);
        });
    });

    // Confirm Delete Actions
    const deleteButtons = document.querySelectorAll('.btn-delete, [data-confirm]');
    deleteButtons.forEach(function (btn) {
        btn.addEventListener('click', function (e) {
            var message = this.getAttribute('data-confirm') || 'Are you sure you want to delete this item?';
            if (!confirm(message)) {
                e.preventDefault();
            }
        });
    });

    // Form Validation
    const forms = document.querySelectorAll('form[data-validate]');
    forms.forEach(function (form) {
        form.addEventListener('submit', function (e) {
            var isValid = true;
            var requiredFields = form.querySelectorAll('[required]');

            requiredFields.forEach(function (field) {
                if (!field.value.trim()) {
                    isValid = false;
                    field.style.borderColor = '#ef4444';
                    field.addEventListener('input', function () {
                        this.style.borderColor = '';
                    }, { once: true });
                }
            });

            if (!isValid) {
                e.preventDefault();
                showNotification('Please fill in all required fields.', 'error');
            }
        });
    });

    // Image Preview for Upload
    const imageInput = document.getElementById('productImage');
    const imagePreview = document.getElementById('imagePreview');

    if (imageInput && imagePreview) {
        imageInput.addEventListener('change', function () {
            var file = this.files[0];
            if (file) {
                var reader = new FileReader();
                reader.onload = function (e) {
                    imagePreview.src = e.target.result;
                    imagePreview.style.display = 'block';
                };
                reader.readAsDataURL(file);
            }
        });
    }

    // Search Box Toggle on Mobile
    const searchToggle = document.getElementById('searchToggle');
    const navSearch = document.querySelector('.nav-search');

    if (searchToggle && navSearch) {
        searchToggle.addEventListener('click', function () {
            navSearch.style.display = navSearch.style.display === 'block' ? 'none' : 'block';
        });
    }

    // Cart Quantity Update
    const cartQuantityInputs = document.querySelectorAll('.cart-quantity input');
    cartQuantityInputs.forEach(function (input) {
        input.addEventListener('change', function () {
            this.closest('form').submit();
        });
    });
});

/**
 * Show notification message
 */
function showNotification(message, type) {
    type = type || 'success';
    var notification = document.createElement('div');
    notification.className = 'alert alert-' + type;
    notification.style.position = 'fixed';
    notification.style.top = '80px';
    notification.style.right = '20px';
    notification.style.zIndex = '9999';
    notification.style.minWidth = '300px';
    notification.textContent = message;

    document.body.appendChild(notification);

    setTimeout(function () {
        notification.style.opacity = '0';
        notification.style.transform = 'translateY(-10px)';
        setTimeout(function () {
            notification.remove();
        }, 300);
    }, 4000);
}

/**
 * Loading Screen Animation
 */
window.addEventListener('load', function() {
    setTimeout(function() {
        const loadingScreen = document.getElementById('loading-screen');
        if (loadingScreen) {
            loadingScreen.classList.add('fade-out');
            setTimeout(function() {
                loadingScreen.style.display = 'none';
            }, 500);
        }
    }, 10000); // Show loading screen for 10 seconds
});

/**
 * Update cart badge count
 */
function updateCartBadge(count) {
    var badge = document.querySelector('.cart-badge');
    if (count > 0) {
        if (!badge) {
            badge = document.createElement('span');
            badge.className = 'cart-badge';
            document.querySelector('.cart-link').appendChild(badge);
        }
        badge.textContent = count;
    } else if (badge) {
        badge.remove();
    }
}
