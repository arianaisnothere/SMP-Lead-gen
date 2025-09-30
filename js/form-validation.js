export function validateFormData(data) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(data.email)) {
        showFieldError('email', 'Please enter a valid email address');
        return false;
    }

    const phoneRegex = /^[\d\s\-\+\(\)]+$/;
    if (!phoneRegex.test(data.phone) || data.phone.length < 10) {
        showFieldError('phone', 'Please enter a valid phone number');
        return false;
    }

    if (data.firstName.length < 2) {
        showFieldError('firstName', 'Please enter your first name');
        return false;
    }

    if (data.lastName.length < 2) {
        showFieldError('lastName', 'Please enter your last name');
        return false;
    }

    clearFieldErrors();
    return true;
}

export function showFieldError(fieldId, message) {
    const field = document.getElementById(fieldId);
    if (!field) return;

    field.style.borderColor = '#ff0000';

    const existingError = field.parentElement.querySelector('.error-message');
    if (existingError) {
        existingError.remove();
    }

    const errorDiv = document.createElement('div');
    errorDiv.className = 'error-message';
    errorDiv.style.color = '#ff0000';
    errorDiv.style.fontSize = '12px';
    errorDiv.style.marginTop = '5px';
    errorDiv.textContent = message;
    field.parentElement.appendChild(errorDiv);
}

export function clearFieldErrors() {
    document.querySelectorAll('.error-message').forEach(error => error.remove());
    document.querySelectorAll('input').forEach(input => {
        input.style.borderColor = '#ddd';
    });
}

export function formatPhoneNumber(value) {
    value = value.replace(/\D/g, '');

    if (value.length > 0) {
        if (value.length <= 3) {
            value = `(${value}`;
        } else if (value.length <= 6) {
            value = `(${value.slice(0, 3)}) ${value.slice(3)}`;
        } else {
            value = `(${value.slice(0, 3)}) ${value.slice(3, 6)}-${value.slice(6, 10)}`;
        }
    }

    return value;
}

export function setupRealtimeValidation() {
    document.querySelectorAll('#lead-form input').forEach(input => {
        input.addEventListener('blur', function() {
            if (this.hasAttribute('required') && !this.value.trim()) {
                this.style.borderColor = '#ff0000';
            } else {
                this.style.borderColor = '#ddd';
            }
        });

        input.addEventListener('input', function() {
            const errorMessage = this.parentElement.querySelector('.error-message');
            if (errorMessage) {
                errorMessage.remove();
            }
            this.style.borderColor = '#ddd';
        });
    });

    const phoneInput = document.getElementById('phone');
    if (phoneInput) {
        phoneInput.addEventListener('input', function(e) {
            e.target.value = formatPhoneNumber(e.target.value);
        });
    }
}