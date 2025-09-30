export function showSuccessMessage(form, leadScore) {
    if (!form) return;

    const successDiv = document.createElement('div');
    successDiv.className = 'success-message';

    let message = '';
    if (leadScore >= 85) {
        message = '🔥 Excellent! A specialist will contact you within 1 hour to secure your spot!';
    } else if (leadScore >= 60) {
        message = '✓ Great! We\'ll contact you within 24 hours with your personalized plan.';
    } else if (leadScore >= 30) {
        message = '✓ Thank you! We\'ll send you resources to help you prepare for the program.';
    } else {
        message = '✓ Thank you! Check your email for free resources to get started.';
    }

    successDiv.innerHTML = `
        <div style="background: #4caf50; color: white; padding: 15px; border-radius: 5px; margin-top: 20px; text-align: center;">
            ${message}
        </div>
    `;
    form.appendChild(successDiv);

    setTimeout(() => {
        successDiv.remove();
    }, 5000);
}

export function showErrorMessage(form) {
    if (!form) return;

    const errorDiv = document.createElement('div');
    errorDiv.className = 'error-message-general';
    errorDiv.innerHTML = `
        <div style="background: #f44336; color: white; padding: 15px; border-radius: 5px; margin-top: 20px; text-align: center;">
            There was an error submitting your request. Please try again or contact support.
        </div>
    `;
    form.appendChild(errorDiv);

    setTimeout(() => {
        errorDiv.remove();
    }, 5000);
}

export function setupFaqAccordion() {
    const faqItems = document.querySelectorAll('.faq-item');

    faqItems.forEach(item => {
        const question = item.querySelector('.faq-question');

        if (question) {
            question.addEventListener('click', () => {
                item.classList.toggle('active');

                faqItems.forEach(otherItem => {
                    if (otherItem !== item && otherItem.classList.contains('active')) {
                        otherItem.classList.remove('active');
                    }
                });
            });
        }
    });
}