export class Quiz {
    constructor() {
        this.currentQuestion = 1;
        this.answers = {};
        this.leadScore = 0;
        this.init();
    }

    init() {
        this.cacheElements();
        this.bindEvents();
    }

    cacheElements() {
        this.startBtn = document.getElementById('start-quiz-btn');
        this.modal = document.getElementById('quiz-modal');
        this.modalClose = document.getElementById('modal-close');
        this.container = document.getElementById('quiz-container');
        this.leadFormContainer = document.getElementById('lead-form-container');
        this.nextBtn = document.getElementById('quiz-next');
        this.backBtn = document.getElementById('quiz-back');
        this.progressFill = document.getElementById('progress-fill');
        this.currentQuestionSpan = document.getElementById('current-question');
    }

    bindEvents() {
        if (this.startBtn) {
            this.startBtn.addEventListener('click', () => this.openModal());
        }

        if (this.modalClose) {
            this.modalClose.addEventListener('click', () => this.closeModal());
        }

        if (this.modal) {
            this.modal.addEventListener('click', (e) => {
                if (e.target === this.modal) this.closeModal();
            });
        }

        const quizOptions = document.querySelectorAll('.quiz-option input');
        quizOptions.forEach(option => {
            option.addEventListener('change', (e) => this.handleOptionSelect(e));
        });

        if (this.nextBtn) {
            this.nextBtn.addEventListener('click', () => this.handleNext());
        }

        if (this.backBtn) {
            this.backBtn.addEventListener('click', () => this.handleBack());
        }
    }

    openModal() {
        this.modal.classList.add('active');
        document.body.style.overflow = 'hidden';
        this.updateProgressBar();
    }

    closeModal() {
        this.modal.classList.remove('active');
        document.body.style.overflow = '';
        this.reset();
    }

    reset() {
        this.currentQuestion = 1;
        this.answers = {};
        document.querySelectorAll('.quiz-question').forEach((q, index) => {
            q.classList.toggle('active', index === 0);
        });
        document.querySelectorAll('.quiz-option input').forEach(input => {
            input.checked = false;
        });
        this.container.style.display = 'block';
        this.leadFormContainer.style.display = 'none';
        this.updateProgressBar();
        this.currentQuestionSpan.textContent = 1;
        this.nextBtn.style.display = 'none';
        this.backBtn.style.display = 'none';
    }

    handleOptionSelect(e) {
        const questionNum = e.target.name.replace('q', '');
        const selectedLabel = e.target.parentElement.querySelector('span').textContent;
        this.answers[questionNum] = {
            letter: e.target.value,
            text: selectedLabel
        };

        setTimeout(() => {
            if (this.currentQuestion < 4) {
                this.advanceToNextQuestion();
            } else {
                this.completeQuiz();
            }
        }, 600);
    }

    advanceToNextQuestion() {
        const currentEl = document.querySelector(`.quiz-question[data-question="${this.currentQuestion}"]`);
        const nextQuestion = this.currentQuestion + 1;
        const nextEl = document.querySelector(`.quiz-question[data-question="${nextQuestion}"]`);

        // Add exiting class for smooth transition out
        currentEl.classList.add('exiting');

        // After fade out, switch to next question
        setTimeout(() => {
            currentEl.classList.remove('active', 'exiting');
            this.currentQuestion = nextQuestion;
            nextEl.classList.add('active');
            this.updateProgressBar();
            this.currentQuestionSpan.textContent = this.currentQuestion;
            this.updateNavigationButtons();
        }, 400);
    }

    goToPreviousQuestion() {
        const currentEl = document.querySelector(`.quiz-question[data-question="${this.currentQuestion}"]`);
        const prevQuestion = this.currentQuestion - 1;
        const prevEl = document.querySelector(`.quiz-question[data-question="${prevQuestion}"]`);

        // Add exiting class for smooth transition out
        currentEl.classList.add('exiting');

        // After fade out, switch to previous question
        setTimeout(() => {
            currentEl.classList.remove('active', 'exiting');
            this.currentQuestion = prevQuestion;
            prevEl.classList.add('active');
            this.updateProgressBar();
            this.currentQuestionSpan.textContent = this.currentQuestion;
            this.updateNavigationButtons();
        }, 400);
    }

    handleNext() {
        if (this.currentQuestion < 4) {
            this.advanceToNextQuestion();
        } else {
            this.completeQuiz();
        }
    }

    handleBack() {
        if (this.currentQuestion === 5) {
            this.leadFormContainer.style.opacity = '0';
            this.leadFormContainer.style.transition = 'opacity 0.3s ease';

            setTimeout(() => {
                this.leadFormContainer.style.display = 'none';
                this.leadFormContainer.style.opacity = '1';
                this.container.style.display = 'block';
                this.currentQuestion = 4;
                const lastQuestionEl = document.querySelector(`.quiz-question[data-question="4"]`);

                // Simple fade in for the last question
                setTimeout(() => {
                    lastQuestionEl.classList.add('active');
                    this.updateProgressBar();
                    this.currentQuestionSpan.textContent = this.currentQuestion;
                    this.updateNavigationButtons();
                }, 100);
            }, 300);
        } else {
            this.goToPreviousQuestion();
        }
    }

    updateNavigationButtons() {
        if (this.currentQuestion === 5) {
            this.backBtn.style.display = 'inline-block';
            this.nextBtn.style.display = 'none';
        } else {
            this.backBtn.style.display = this.currentQuestion > 1 ? 'inline-block' : 'none';

            if (this.answers[this.currentQuestion]) {
                this.nextBtn.style.display = 'inline-block';
                this.nextBtn.disabled = false;
            } else {
                this.nextBtn.style.display = 'none';
            }
        }
    }

    updateProgressBar() {
        const progress = (this.currentQuestion / 4) * 100;
        this.progressFill.style.width = progress + '%';
    }

    completeQuiz() {
        this.leadScore = this.calculateLeadScore();
        this.container.style.opacity = '0';
        this.container.style.transition = 'opacity 0.3s ease';

        setTimeout(() => {
            this.container.style.display = 'none';
            this.leadFormContainer.style.display = 'block';
            this.container.style.opacity = '1';
        }, 300);

        this.currentQuestion = 5;
        this.updateNavigationButtons();
        this.updateLeadFormMessaging();
    }

    calculateLeadScore() {
        let score = 0;

        switch(this.answers['1']?.letter) {
            case 'A': score += 25; break;
            case 'B': score += 20; break;
            case 'C': score += 15; break;
            case 'D': score += 0; break;
        }

        switch(this.answers['2']?.letter) {
            case 'A': score += 25; break;
            case 'B': score += 20; break;
            case 'C': score += 10; break;
            case 'D': score += 0; break;
        }

        switch(this.answers['3']?.letter) {
            case 'A': score += 30; break;
            case 'B': score += 15; break;
            case 'C': score += 0; break;
        }

        switch(this.answers['4']?.letter) {
            case 'A': score += 20; break;
            case 'B': score += 10; break;
            case 'C': score += 5; break;
        }

        return score;
    }

    updateLeadFormMessaging() {
        const icon = this.leadFormContainer.querySelector('.form-icon');
        const heading = this.leadFormContainer.querySelector('h3');
        const subtext = this.leadFormContainer.querySelector('p');

        if (this.leadScore >= 85) {
            icon.textContent = "🔥";
            heading.textContent = "Excellent! You're HIGHLY qualified for our program!";
            subtext.textContent = "You're exactly who we're looking for. Enter your details to secure your spot and get immediate access to your personalized business plan:";
            icon.style.fontSize = '48px';
        } else if (this.leadScore >= 60) {
            icon.textContent = "🎯";
            heading.textContent = "Great! You're a perfect fit for SMP training.";
            subtext.textContent = "Enter your details below to get your personalized business plan:";
        } else if (this.leadScore >= 30) {
            icon.textContent = "💡";
            heading.textContent = "You're on the right track!";
            subtext.textContent = "While you may need to prepare a bit more, we can help you get ready. Enter your details for resources and guidance:";
        } else {
            icon.textContent = "📚";
            heading.textContent = "Thanks for your interest!";
            subtext.textContent = "Based on your answers, we recommend starting with our free resources to better prepare for the program:";
        }
    }

    getLeadCategory() {
        if (this.leadScore >= 85) return 'HOT';
        if (this.leadScore >= 60) return 'WARM';
        if (this.leadScore >= 30) return 'COOL';
        return 'COLD';
    }

    getQuizData() {
        // Format answers for submission with full text
        const formattedAnswers = {};
        for (const [question, answer] of Object.entries(this.answers)) {
            formattedAnswers[`q${question}`] = answer.text;
        }

        return {
            answers: formattedAnswers,
            leadScore: this.leadScore,
            leadCategory: this.getLeadCategory()
        };
    }
}