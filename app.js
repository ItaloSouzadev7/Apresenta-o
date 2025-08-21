// Presentation JavaScript functionality

let currentSlideIndex = 0;
const totalSlides = 12;

// Initialize presentation
document.addEventListener('DOMContentLoaded', function() {
    updateSlideDisplay();
    updateProgressBar();
    setupKeyboardNavigation();
    
    // Set initial slide counter
    document.getElementById('totalSlides').textContent = totalSlides;
});

// Change slide function
function changeSlide(direction) {
    const slides = document.querySelectorAll('.slide');
    const currentSlide = slides[currentSlideIndex];
    
    // Hide current slide
    currentSlide.classList.remove('active');
    
    // Calculate new slide index
    currentSlideIndex += direction;
    
    // Boundary checks
    if (currentSlideIndex < 0) {
        currentSlideIndex = 0;
    }
    if (currentSlideIndex >= totalSlides) {
        currentSlideIndex = totalSlides - 1;
    }
    
    // Show new slide
    const newSlide = slides[currentSlideIndex];
    newSlide.classList.add('active');
    
    // Update UI
    updateSlideDisplay();
    updateProgressBar();
    updateNavigationButtons();
}

// Update slide counter and navigation buttons
function updateSlideDisplay() {
    document.getElementById('currentSlide').textContent = currentSlideIndex + 1;
    updateNavigationButtons();
}

// Update progress bar
function updateProgressBar() {
    const progress = document.getElementById('progress');
    const percentage = ((currentSlideIndex + 1) / totalSlides) * 100;
    progress.style.width = percentage + '%';
}

// Update navigation button states
function updateNavigationButtons() {
    const prevBtn = document.getElementById('prevBtn');
    const nextBtn = document.getElementById('nextBtn');
    
    // Disable previous button on first slide
    prevBtn.disabled = currentSlideIndex === 0;
    
    // Disable next button on last slide
    nextBtn.disabled = currentSlideIndex === totalSlides - 1;
}

// Keyboard navigation
function setupKeyboardNavigation() {
    document.addEventListener('keydown', function(event) {
        switch(event.key) {
            case 'ArrowRight':
            case ' ':
            case 'PageDown':
                event.preventDefault();
                if (currentSlideIndex < totalSlides - 1) {
                    changeSlide(1);
                }
                break;
                
            case 'ArrowLeft':
            case 'PageUp':
                event.preventDefault();
                if (currentSlideIndex > 0) {
                    changeSlide(-1);
                }
                break;
                
            case 'Home':
                event.preventDefault();
                goToSlide(0);
                break;
                
            case 'End':
                event.preventDefault();
                goToSlide(totalSlides - 1);
                break;
                
            case 'Escape':
                event.preventDefault();
                toggleFullscreen();
                break;
        }
    });
}

// Go to specific slide
function goToSlide(slideIndex) {
    const slides = document.querySelectorAll('.slide');
    const currentSlide = slides[currentSlideIndex];
    
    if (slideIndex >= 0 && slideIndex < totalSlides && slideIndex !== currentSlideIndex) {
        // Hide current slide
        currentSlide.classList.remove('active');
        
        // Update index
        currentSlideIndex = slideIndex;
        
        // Show new slide
        const newSlide = slides[currentSlideIndex];
        newSlide.classList.add('active');
        
        // Update UI
        updateSlideDisplay();
        updateProgressBar();
        updateNavigationButtons();
    }
}

// Toggle fullscreen mode
function toggleFullscreen() {
    if (!document.fullscreenElement) {
        document.documentElement.requestFullscreen().catch(err => {
            console.log('Error attempting to enable fullscreen:', err);
        });
    } else {
        document.exitFullscreen();
    }
}

// Touch/swipe support for mobile devices
let touchStartX = 0;
let touchEndX = 0;

document.addEventListener('touchstart', function(event) {
    touchStartX = event.changedTouches[0].screenX;
}, false);

document.addEventListener('touchend', function(event) {
    touchEndX = event.changedTouches[0].screenX;
    handleSwipe();
}, false);

function handleSwipe() {
    const swipeThreshold = 50;
    const swipeDistance = touchEndX - touchStartX;
    
    if (Math.abs(swipeDistance) > swipeThreshold) {
        if (swipeDistance > 0) {
            // Swipe right - go to previous slide
            if (currentSlideIndex > 0) {
                changeSlide(-1);
            }
        } else {
            // Swipe left - go to next slide
            if (currentSlideIndex < totalSlides - 1) {
                changeSlide(1);
            }
        }
    }
}

// Auto-hide navigation after inactivity (optional feature)
let navigationTimeout;
const navigationElement = document.querySelector('.navigation');

function resetNavigationTimeout() {
    clearTimeout(navigationTimeout);
    navigationElement.style.opacity = '1';
    
    navigationTimeout = setTimeout(() => {
        navigationElement.style.opacity = '0.3';
    }, 3000); // Hide after 3 seconds of inactivity
}

// Track mouse movement to show/hide navigation
document.addEventListener('mousemove', resetNavigationTimeout);
document.addEventListener('touchstart', resetNavigationTimeout);

// Initialize navigation timeout
resetNavigationTimeout();

// Handle visibility change (when tab becomes active/inactive)
document.addEventListener('visibilitychange', function() {
    if (document.hidden) {
        // Pause any animations or timers when tab is hidden
        console.log('Presentation paused');
    } else {
        // Resume when tab becomes active
        console.log('Presentation resumed');
        resetNavigationTimeout();
    }
});

// Print presentation functionality
function printPresentation() {
    // Show all slides for printing
    const slides = document.querySelectorAll('.slide');
    slides.forEach(slide => {
        slide.style.display = 'block';
        slide.style.pageBreakAfter = 'always';
        slide.style.height = 'auto';
        slide.style.minHeight = '100vh';
    });
    
    // Hide navigation for printing
    const navigation = document.querySelector('.navigation');
    const progressBar = document.querySelector('.progress-bar');
    navigation.style.display = 'none';
    progressBar.style.display = 'none';
    
    // Trigger print
    window.print();
    
    // Restore normal display after printing
    setTimeout(() => {
        slides.forEach((slide, index) => {
            slide.style.display = index === currentSlideIndex ? 'flex' : 'none';
            slide.style.pageBreakAfter = 'auto';
            slide.style.height = '100vh';
            slide.style.minHeight = 'auto';
        });
        
        navigation.style.display = 'flex';
        progressBar.style.display = 'block';
    }, 1000);
}

// Keyboard shortcut for printing (Ctrl+P or Cmd+P)
document.addEventListener('keydown', function(event) {
    if ((event.ctrlKey || event.metaKey) && event.key === 'p') {
        event.preventDefault();
        printPresentation();
    }
});

// Presentation timer functionality
let presentationStartTime = null;
let timerInterval = null;

function startPresentationTimer() {
    presentationStartTime = new Date();
    updateTimer();
    
    timerInterval = setInterval(updateTimer, 1000);
}

function updateTimer() {
    if (!presentationStartTime) return;
    
    const now = new Date();
    const elapsed = Math.floor((now - presentationStartTime) / 1000);
    const minutes = Math.floor(elapsed / 60);
    const seconds = elapsed % 60;
    
    const timerDisplay = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    
    // You can display this timer somewhere if needed
    console.log('Presentation time:', timerDisplay);
}

function stopPresentationTimer() {
    if (timerInterval) {
        clearInterval(timerInterval);
        timerInterval = null;
        presentationStartTime = null;
    }
}

// Start timer when presentation begins
document.addEventListener('DOMContentLoaded', function() {
    startPresentationTimer();
});

// Slide transition animations
function addSlideTransitionEffects() {
    const slides = document.querySelectorAll('.slide');
    
    slides.forEach(slide => {
        slide.addEventListener('transitionend', function(event) {
            if (event.propertyName === 'opacity' && slide.classList.contains('active')) {
                // Slide has finished appearing
                animateSlideContent(slide);
            }
        });
    });
}

function animateSlideContent(slide) {
    const animatableElements = slide.querySelectorAll(
        '.automation-item, .opportunity-card, .stat-card, .case-card, .tool-category, .ergonomia-card, .roi-card, .timeline-item, .benefit-pillar, .goal-card, .step-card'
    );
    
    animatableElements.forEach((element, index) => {
        element.style.opacity = '0';
        element.style.transform = 'translateY(20px)';
        
        setTimeout(() => {
            element.style.transition = 'opacity 0.3s ease, transform 0.3s ease';
            element.style.opacity = '1';
            element.style.transform = 'translateY(0)';
        }, index * 100);
    });
}

// Initialize slide transitions
document.addEventListener('DOMContentLoaded', function() {
    addSlideTransitionEffects();
});

// Accessibility improvements
function improveAccessibility() {
    // Add ARIA labels to navigation buttons
    const prevBtn = document.getElementById('prevBtn');
    const nextBtn = document.getElementById('nextBtn');
    
    prevBtn.setAttribute('aria-label', 'Slide anterior');
    nextBtn.setAttribute('aria-label', 'Próximo slide');
    
    // Add slide descriptions for screen readers
    const slides = document.querySelectorAll('.slide');
    slides.forEach((slide, index) => {
        slide.setAttribute('aria-label', `Slide ${index + 1} de ${totalSlides}`);
        slide.setAttribute('role', 'img');
    });
    
    // Announce slide changes to screen readers
    const announceSlideChange = () => {
        const announcement = `Slide ${currentSlideIndex + 1} de ${totalSlides}`;
        const announcer = document.createElement('div');
        announcer.setAttribute('aria-live', 'polite');
        announcer.setAttribute('aria-atomic', 'true');
        announcer.className = 'sr-only';
        announcer.textContent = announcement;
        
        document.body.appendChild(announcer);
        
        setTimeout(() => {
            document.body.removeChild(announcer);
        }, 1000);
    };
    
    // Override changeSlide to include announcements
    const originalChangeSlide = window.changeSlide;
    window.changeSlide = function(direction) {
        originalChangeSlide(direction);
        announceSlideChange();
    };
}

// Initialize accessibility features
document.addEventListener('DOMContentLoaded', function() {
    improveAccessibility();
});

// Export functions for potential external use
window.presentationControls = {
    goToSlide: goToSlide,
    changeSlide: changeSlide,
    toggleFullscreen: toggleFullscreen,
    printPresentation: printPresentation,
    getCurrentSlide: () => currentSlideIndex,
    getTotalSlides: () => totalSlides
};