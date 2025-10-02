document.addEventListener('DOMContentLoaded', function() {
    const uploadArea = document.getElementById('uploadArea');
    const fileInput = document.getElementById('fileUpload');
    const form = document.getElementById('smp-form');

    uploadArea.addEventListener('click', function() {
        fileInput.click();
    });

    uploadArea.addEventListener('dragover', function(e) {
        e.preventDefault();
        uploadArea.style.borderColor = 'rgba(255, 255, 255, 0.8)';
        uploadArea.style.background = 'rgba(255, 255, 255, 0.15)';
    });

    uploadArea.addEventListener('dragleave', function(e) {
        e.preventDefault();
        uploadArea.style.borderColor = 'rgba(255, 255, 255, 0.4)';
        uploadArea.style.background = 'rgba(255, 255, 255, 0.05)';
    });

    uploadArea.addEventListener('drop', function(e) {
        e.preventDefault();
        uploadArea.style.borderColor = 'rgba(255, 255, 255, 0.4)';
        uploadArea.style.background = 'rgba(255, 255, 255, 0.05)';

        const files = e.dataTransfer.files;
        handleFiles(files);
    });

    fileInput.addEventListener('change', function(e) {
        const files = e.target.files;
        handleFiles(files);
    });

    function handleFiles(files) {
        if (files.length > 0) {
            const file = files[0];
            const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif'];
            const maxSize = 16 * 1024 * 1024; // 16 MB

            if (!validTypes.includes(file.type)) {
                alert('Please upload a valid image file (jpeg, jpg, png, or gif)');
                return;
            }

            if (file.size > maxSize) {
                alert('File size must be less than 16 MB');
                return;
            }

            const uploadIcon = uploadArea.querySelector('.upload-icon');
            uploadIcon.style.color = '#4ade80';

            const fileName = document.createElement('p');
            fileName.textContent = file.name;
            fileName.style.color = 'rgba(255, 255, 255, 0.8)';
            fileName.style.marginTop = '10px';
            fileName.style.fontSize = '14px';

            const existingFileName = uploadArea.querySelector('p');
            if (existingFileName) {
                existingFileName.remove();
            }
            uploadArea.appendChild(fileName);
        }
    }

    form.addEventListener('submit', function(e) {
        e.preventDefault();

        const formData = {
            firstName: document.getElementById('firstName').value,
            lastName: document.getElementById('lastName').value,
            phone: document.getElementById('phone').value,
            email: document.getElementById('email').value,
            file: fileInput.files[0]
        };

        console.log('Form submitted with data:', formData);
        alert('Thank you for your submission! We will contact you soon to schedule your free SMP preview.');
    });

    const inputs = form.querySelectorAll('input[type="text"], input[type="tel"], input[type="email"]');
    inputs.forEach(input => {
        input.addEventListener('focus', function() {
            this.parentElement.style.transform = 'translateY(-2px)';
        });

        input.addEventListener('blur', function() {
            this.parentElement.style.transform = 'translateY(0)';
        });
    });

    const phoneInput = document.getElementById('phone');
    phoneInput.addEventListener('input', function(e) {
        let value = e.target.value.replace(/\D/g, '');
        if (value.length > 0) {
            if (value.length <= 3) {
                value = value;
            } else if (value.length <= 6) {
                value = value.slice(0, 3) + '-' + value.slice(3);
            } else {
                value = value.slice(0, 3) + '-' + value.slice(3, 6) + '-' + value.slice(6, 10);
            }
        }
        e.target.value = value;
    });

    // FAQ Accordion functionality
    const faqQuestions = document.querySelectorAll('.faq-question');

    faqQuestions.forEach(question => {
        question.addEventListener('click', function() {
            const faqItem = this.parentElement;
            const isActive = faqItem.classList.contains('active');

            // Close all FAQ items
            document.querySelectorAll('.faq-item').forEach(item => {
                item.classList.remove('active');
            });

            // If the clicked item wasn't active, open it
            if (!isActive) {
                faqItem.classList.add('active');
            }
        });
    });

    // Testimonials Carousel functionality
    (function() {
        const container = document.getElementById('smpTestimonialsContainer');
        const slides = document.querySelectorAll('.smp-testimonials-slide');
        const prevBtn = document.getElementById('smpPrevBtn');
        const nextBtn = document.getElementById('smpNextBtn');
        const paginationContainer = document.getElementById('smpPagination');

        if (!container || !slides.length || !prevBtn || !nextBtn) return;

        let currentSlide = 0;
        let currentCardIndex = 0;
        const totalSlides = slides.length;
        let isMobile = window.innerWidth <= 768;
        let allCards = [];
        let totalCards = 0;

        function init() {
            updateCardReferences();
            createPaginationDots();
            updateSlides();
            setupListeners();
            handleResponsive();
        }

        function updateCardReferences() {
            allCards = [];
            slides.forEach(slide => {
                const cards = slide.querySelectorAll('.smp-testimonial-card');
                cards.forEach(card => {
                    allCards.push({
                        card: card,
                        slide: slide
                    });
                });
            });
            totalCards = allCards.length;
        }

        function createPaginationDots() {
            paginationContainer.innerHTML = '';
            allCards.forEach((_, index) => {
                const dot = document.createElement('div');
                dot.classList.add('smp-pagination-dot');
                if (index === 0) dot.classList.add('active');
                dot.addEventListener('click', () => goToCard(index));
                paginationContainer.appendChild(dot);
            });
        }

        function updateSlides() {
            if (isMobile) {
                updateMobileView();
            } else {
                updateDesktopView();
            }
        }

        function updateDesktopView() {
            slides.forEach((slide, index) => {
                if (index === currentSlide) {
                    slide.classList.add('active');
                    slide.style.transform = 'translateX(0)';
                } else {
                    slide.classList.remove('active');
                    if (index > currentSlide) {
                        slide.style.transform = 'translateX(50px)';
                    } else {
                        slide.style.transform = 'translateX(-50px)';
                    }
                }
            });
        }

        function updateMobileView() {
            slides.forEach((slide, index) => {
                if (allCards[currentCardIndex].slide === slide) {
                    slide.classList.add('active');
                    slide.style.transform = 'translateX(0)';
                } else {
                    slide.classList.remove('active');
                    if (index > currentSlide) {
                        slide.style.transform = 'translateX(50px)';
                    } else {
                        slide.style.transform = 'translateX(-50px)';
                    }
                }
            });

            allCards.forEach((item, index) => {
                if (index === currentCardIndex) {
                    item.card.classList.add('mobile-active');
                } else {
                    item.card.classList.remove('mobile-active');
                }
            });

            const dots = paginationContainer.querySelectorAll('.smp-pagination-dot');
            dots.forEach((dot, index) => {
                if (index === currentCardIndex) {
                    dot.classList.add('active');
                } else {
                    dot.classList.remove('active');
                }
            });
        }

        function goToPrevSlide() {
            if (isMobile) {
                currentCardIndex = (currentCardIndex - 1 + totalCards) % totalCards;
                currentSlide = Array.from(slides).findIndex(slide =>
                    slide === allCards[currentCardIndex].slide
                );
            } else {
                currentSlide = (currentSlide - 1 + totalSlides) % totalSlides;
            }
            updateSlides();
        }

        function goToNextSlide() {
            if (isMobile) {
                currentCardIndex = (currentCardIndex + 1) % totalCards;
                currentSlide = Array.from(slides).findIndex(slide =>
                    slide === allCards[currentCardIndex].slide
                );
            } else {
                currentSlide = (currentSlide + 1) % totalSlides;
            }
            updateSlides();
        }

        function goToCard(index) {
            currentCardIndex = index;
            currentSlide = Array.from(slides).findIndex(slide =>
                slide === allCards[currentCardIndex].slide
            );
            updateSlides();
        }

        function handleResponsive() {
            const checkMobile = () => {
                const wasMobile = isMobile;
                isMobile = window.innerWidth <= 768;

                if (wasMobile !== isMobile) {
                    if (isMobile) {
                        const firstCardInSlide = allCards.findIndex(item =>
                            item.slide === slides[currentSlide]
                        );
                        currentCardIndex = firstCardInSlide >= 0 ? firstCardInSlide : 0;
                    }
                    updateSlides();
                }
            };

            window.addEventListener('resize', checkMobile);
            checkMobile();
        }

        function setupListeners() {
            prevBtn.addEventListener('click', goToPrevSlide);
            nextBtn.addEventListener('click', goToNextSlide);

            document.addEventListener('keydown', function(e) {
                if (e.key === 'ArrowLeft') {
                    goToPrevSlide();
                } else if (e.key === 'ArrowRight') {
                    goToNextSlide();
                }
            });

            let touchStartX = 0;
            let touchEndX = 0;

            container.addEventListener('touchstart', function(e) {
                touchStartX = e.changedTouches[0].screenX;
            }, false);

            container.addEventListener('touchend', function(e) {
                touchEndX = e.changedTouches[0].screenX;
                handleSwipe();
            }, false);

            function handleSwipe() {
                if (touchEndX < touchStartX - 50) {
                    goToNextSlide();
                } else if (touchEndX > touchStartX + 50) {
                    goToPrevSlide();
                }
            }
        }

        init();
    })();
});