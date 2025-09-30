import { Quiz } from './quiz.js';
import { validateFormData, setupRealtimeValidation } from './form-validation.js';
import { showSuccessMessage, showErrorMessage, setupFaqAccordion } from './ui-utils.js';
import config from './config.js';

const N8N_WEBHOOK_URL = config.N8N_WEBHOOK_URL;

document.addEventListener('DOMContentLoaded', function() {
    const quiz = new Quiz();

    setupFaqAccordion();
    setupRealtimeValidation();

    const form = document.getElementById('lead-form');
    const submitBtn = form ? form.querySelector('.submit-btn') : null;

    if (form) {
        form.addEventListener('submit', async function(e) {
            e.preventDefault();

            const originalBtnText = submitBtn.textContent;
            submitBtn.disabled = true;
            submitBtn.textContent = 'Submitting...';

            const quizData = quiz.getQuizData();

            const formData = {
                firstName: document.getElementById('firstName').value.trim(),
                lastName: document.getElementById('lastName').value.trim(),
                phone: document.getElementById('phone').value.trim(),
                email: document.getElementById('email').value.trim(),
                quizAnswers: quizData.answers,
                leadScore: quizData.leadScore,
                leadCategory: quizData.leadCategory,
                timestamp: new Date().toISOString(),
                source: 'smp-landing-page',
                userAgent: navigator.userAgent,
                referrer: document.referrer || 'direct',
                pageUrl: window.location.href
            };

            if (!validateFormData(formData)) {
                submitBtn.disabled = false;
                submitBtn.textContent = originalBtnText;
                return;
            }

            try {
                const response = await fetch(N8N_WEBHOOK_URL, {
                    method: 'POST',
                    mode: 'cors',
                   
                    










                    
                    body: JSON.stringify(formData)
                });

                if (response.ok) {
                    showSuccessMessage(form, quizData.leadScore);
                    form.reset();

                    if (typeof gtag !== 'undefined') {
                        gtag('event', 'form_submission', {
                            'event_category': 'Lead',
                            'event_label': 'SMP Free Plan'
                        });
                    }

                    setTimeout(() => {
                        quiz.closeModal();
                        window.location.href = 'https://smp.scalpmicroproclinic.com/smp-book-a-call';
                    }, 2000);

                } else {
                    throw new Error(`Failed to submit form: ${response.status} ${response.statusText}`);
                }

            } catch (error) {
                console.error('Form submission error:', error);

                if (error.message.includes('Failed to fetch') || error.name === 'TypeError') {
                    console.error('CORS Error: The n8n webhook may need to be configured to allow requests from this domain.');
                    showErrorMessage(form, 'Unable to submit form. Please contact support or try again later.');
                } else {
                    showErrorMessage(form);
                }

            } finally {
                submitBtn.disabled = false;
                submitBtn.textContent = originalBtnText;
            }
        });
    }
});