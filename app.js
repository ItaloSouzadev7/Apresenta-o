class DigitalTransformationApp {
    constructor() {
        this.currentSlide = 1;
        this.totalSlides = 11;
        this.slides = document.querySelectorAll('.slide');
        this.progressFill = document.querySelector('.progress-fill');
        this.currentSlideElement = document.getElementById('current-slide');
        this.totalSlidesElement = document.getElementById('total-slides');
        this.prevBtn = document.getElementById('prevBtn');
        this.nextBtn = document.getElementById('nextBtn');
        
        this.init();
    }

    init() {
        // Set initial state
        this.updateSlideCounter();
        this.updateProgressBar();
        this.updateNavigationButtons();
        
        // Add event listeners
        this.addEventListeners();
        
        // Show first slide
        this.showSlide(1);
        
        // Initialize slide titles for accessibility
        this.slideData = this.initializeSlideData();
    }

    initializeSlideData() {
        return [
            {
                title: 'Transformação Digital: I.A., Automação e Bem-Estar',
                description: 'Apresentação sobre oportunidades de otimização'
            },
            {
                title: 'Por que Agora?',
                description: 'Tendências do mercado contábil brasileiro'
            },
            {
                title: 'I.A. na Contabilidade',
                description: 'Dados sobre automação e economia de custos'
            },
            {
                title: 'Benefícios Científicos Comprovados',
                description: 'Pesquisas sobre produtividade com múltiplas telas'
            },
            {
                title: 'Oportunidades de Automação',
                description: 'Processos que podem ser otimizados'
            },
            {
                title: 'Cases de Sucesso',
                description: 'Empresas brasileiras que cresceram com digitalização'
            },
            {
                title: 'Ergonomia e Bem-Estar',
                description: 'Importância para produtividade da equipe'
            },
            {
                title: 'Soluções Tecnológicas',
                description: 'Ferramentas de I.A. e automação disponíveis'
            },
            {
                title: 'ROI Comprovado',
                description: 'Retorno sobre investimento em digitalização'
            },
            {
                title: 'Cronograma de Implementação',
                description: 'Plano gradual baseado em best practices'
            },
            {
                title: 'Próximos Passos',
                description: 'Ações para começar a transformação'
            }
        ];
    }

    addEventListeners() {
        // Navigation buttons - Fixed the direction issue
        this.prevBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            e.preventDefault();
            this.goToPreviousSlide(); // Left arrow (‹) goes to previous
        });
        
        this.nextBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            e.preventDefault();
            this.goToNextSlide(); // Right arrow (›) goes to next
        });
        
        // Keyboard navigation
        document.addEventListener('keydown', (e) => this.handleKeyNavigation(e));
        
        // Touch/swipe support for mobile
        this.addTouchSupport();
        
        // Click navigation (excluding interactive elements)
        document.addEventListener('click', (e) => {
            if (this.shouldHandleClick(e)) {
                if (e.clientX > window.innerWidth / 2) {
                    this.goToNextSlide();
                } else {
                    this.goToPreviousSlide();
                }
            }
        });

        // Handle visibility change for performance
        document.addEventListener('visibilitychange', () => {
            this.handleVisibilityChange();
        });

        // Handle window resize
        window.addEventListener('resize', this.debounce(() => {
            this.handleResize();
        }, 250));
    }

    shouldHandleClick(e) {
        // Don't handle clicks on interactive elements
        const interactiveSelectors = [
            '.navigation', '.nav-btn', 'button', 'a', 
            'input', 'textarea', 'select', '.tool-card'
        ];
        
        return !interactiveSelectors.some(selector => 
            e.target.closest(selector) || e.target.matches(selector)
        );
    }

    addTouchSupport() {
        let startX = 0;
        let startY = 0;
        let endX = 0;
        let endY = 0;
        let startTime = 0;

        document.addEventListener('touchstart', (e) => {
            startX = e.touches[0].clientX;
            startY = e.touches[0].clientY;
            startTime = Date.now();
        }, { passive: true });

        document.addEventListener('touchend', (e) => {
            endX = e.changedTouches[0].clientX;
            endY = e.changedTouches[0].clientY;
            const endTime = Date.now();
            
            this.handleSwipe(startX, startY, endX, endY, endTime - startTime);
        }, { passive: true });
    }

    handleSwipe(startX, startY, endX, endY, duration) {
        const deltaX = endX - startX;
        const deltaY = endY - startY;
        const minSwipeDistance = 50;
        const maxSwipeTime = 500; // Maximum swipe time in ms

        // Check if it's a valid swipe (horizontal, fast enough, long enough)
        if (Math.abs(deltaX) > Math.abs(deltaY) && 
            Math.abs(deltaX) > minSwipeDistance && 
            duration < maxSwipeTime) {
            
            if (deltaX > 0) {
                // Swipe right - go to previous slide
                this.goToPreviousSlide();
            } else {
                // Swipe left - go to next slide
                this.goToNextSlide();
            }
        }
    }

    handleKeyNavigation(e) {
        // Prevent default behavior for presentation keys
        const presentationKeys = [
            'ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown', 
            ' ', 'Home', 'End', 'f', 'F', 'r', 'R'
        ];
        
        if (presentationKeys.includes(e.key)) {
            e.preventDefault();
        }

        switch(e.key) {
            case 'ArrowLeft':
            case 'ArrowUp':
                this.goToPreviousSlide();
                break;
            case 'ArrowRight':
            case 'ArrowDown':
            case ' ': // Spacebar
                this.goToNextSlide();
                break;
            case 'Home':
                this.goToSlide(1);
                break;
            case 'End':
                this.goToSlide(this.totalSlides);
                break;
            case 'r':
            case 'R':
                this.restart();
                break;
            case 'f':
            case 'F':
                this.toggleFullscreen();
                break;
            case 'Escape':
                this.exitFullscreen();
                break;
            case '1':
            case '2':
            case '3':
            case '4':
            case '5':
            case '6':
            case '7':
            case '8':
            case '9':
                // Direct slide navigation with number keys
                const slideNumber = parseInt(e.key);
                if (slideNumber <= this.totalSlides) {
                    this.goToSlide(slideNumber);
                }
                break;
        }
    }

    goToNextSlide() {
        if (this.currentSlide < this.totalSlides) {
            this.goToSlide(this.currentSlide + 1);
        } else {
            // On last slide, restart presentation
            this.restart();
        }
    }

    goToPreviousSlide() {
        if (this.currentSlide > 1) {
            this.goToSlide(this.currentSlide - 1);
        }
    }

    goToSlide(slideNumber) {
        if (slideNumber < 1 || slideNumber > this.totalSlides || slideNumber === this.currentSlide) {
            return;
        }

        // Hide current slide with animation
        this.hideSlide(this.currentSlide);
        
        // Update current slide number
        const previousSlide = this.currentSlide;
        this.currentSlide = slideNumber;
        
        // Show new slide with animation
        setTimeout(() => {
            this.showSlide(this.currentSlide);
        }, 100);
        
        // Update UI elements
        this.updateSlideCounter();
        this.updateProgressBar();
        this.updateNavigationButtons();
        
        // Announce slide change for accessibility
        this.announceSlideChange();
        
        // Track slide transitions for analytics (if needed)
        this.trackSlideTransition(previousSlide, slideNumber);
    }

    showSlide(slideNumber) {
        const slide = document.querySelector(`[data-slide="${slideNumber}"]`);
        if (slide) {
            slide.classList.add('active');
            
            // Trigger any slide-specific animations
            this.triggerSlideAnimations(slide, slideNumber);
        }
    }

    hideSlide(slideNumber) {
        const slide = document.querySelector(`[data-slide="${slideNumber}"]`);
        if (slide) {
            slide.classList.remove('active');
        }
    }

    triggerSlideAnimations(slide, slideNumber) {
        // Add specific animations for certain slides
        switch(slideNumber) {
            case 1:
                // Hero slide animations
                this.animateHeroIcons(slide);
                break;
            case 3:
                // I.A. benefits animation
                this.animateBenefitNumbers(slide);
                break;
            case 4:
                // Scientific data animation
                this.animateScientificData(slide);
                break;
            case 9:
                // ROI metrics animation
                this.animateROIMetrics(slide);
                break;
        }
    }

    animateHeroIcons(slide) {
        const icons = slide.querySelectorAll('.hero-icon');
        icons.forEach((icon, index) => {
            icon.style.opacity = '0';
            icon.style.transform = 'translateY(20px)';
            
            setTimeout(() => {
                icon.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
                icon.style.opacity = '0.9';
                icon.style.transform = 'translateY(0)';
            }, index * 200 + 500);
        });
    }

    animateBenefitNumbers(slide) {
        const numbers = slide.querySelectorAll('.benefit-number');
        numbers.forEach((number, index) => {
            const finalValue = number.textContent;
            number.textContent = '0';
            
            setTimeout(() => {
                this.animateNumber(number, finalValue);
            }, index * 300 + 300);
        });
    }

    animateScientificData(slide) {
        const resultNumbers = slide.querySelectorAll('.result-number');
        resultNumbers.forEach((number, index) => {
            const finalValue = number.textContent;
            number.style.opacity = '0';
            
            setTimeout(() => {
                number.style.transition = 'opacity 0.8s ease';
                number.style.opacity = '1';
                this.animateNumber(number, finalValue);
            }, index * 400 + 600);
        });
    }

    animateROIMetrics(slide) {
        const roiValues = slide.querySelectorAll('.roi-value');
        roiValues.forEach((value, index) => {
            const finalValue = value.textContent;
            value.style.transform = 'scale(0)';
            
            setTimeout(() => {
                value.style.transition = 'transform 0.6s cubic-bezier(0.68, -0.55, 0.265, 1.55)';
                value.style.transform = 'scale(1)';
                this.animateNumber(value, finalValue);
            }, index * 250 + 400);
        });
    }

    animateNumber(element, finalValue) {
        const isPercentage = finalValue.includes('%');
        const isHours = finalValue.includes('h');
        const numericValue = parseFloat(finalValue);
        
        if (isNaN(numericValue)) {
            element.textContent = finalValue;
            return;
        }

        let currentValue = 0;
        const increment = numericValue / 30; // 30 steps for smooth animation
        const duration = 1500; // 1.5 seconds
        const stepTime = duration / 30;

        const timer = setInterval(() => {
            currentValue += increment;
            if (currentValue >= numericValue) {
                currentValue = numericValue;
                clearInterval(timer);
            }
            
            let displayValue = Math.round(currentValue);
            if (isPercentage) {
                element.textContent = displayValue + '%';
            } else if (isHours) {
                element.textContent = displayValue + 'h';
            } else {
                element.textContent = displayValue.toString();
            }
        }, stepTime);
    }

    updateSlideCounter() {
        if (this.currentSlideElement && this.totalSlidesElement) {
            this.currentSlideElement.textContent = this.currentSlide;
            this.totalSlidesElement.textContent = this.totalSlides;
        }
    }

    updateProgressBar() {
        if (this.progressFill) {
            const progressPercentage = (this.currentSlide / this.totalSlides) * 100;
            this.progressFill.style.width = `${progressPercentage}%`;
        }
    }

    updateNavigationButtons() {
        if (!this.prevBtn || !this.nextBtn) return;
        
        // Update previous button
        this.prevBtn.disabled = this.currentSlide === 1;
        this.prevBtn.title = this.currentSlide === 1 ? 
            'Slide anterior (não disponível)' : 'Slide anterior';
        
        // Update next button
        this.nextBtn.disabled = false;
        
        if (this.currentSlide === this.totalSlides) {
            this.nextBtn.innerHTML = '🔄';
            this.nextBtn.title = 'Reiniciar apresentação';
        } else {
            this.nextBtn.innerHTML = '›';
            this.nextBtn.title = 'Próximo slide';
        }
    }

    announceSlideChange() {
        // Create or update live region for screen readers
        let liveRegion = document.getElementById('slide-announcement');
        if (!liveRegion) {
            liveRegion = document.createElement('div');
            liveRegion.id = 'slide-announcement';
            liveRegion.className = 'sr-only';
            liveRegion.setAttribute('aria-live', 'polite');
            liveRegion.setAttribute('aria-atomic', 'true');
            document.body.appendChild(liveRegion);
        }
        
        const slideInfo = this.slideData[this.currentSlide - 1];
        liveRegion.textContent = `Slide ${this.currentSlide} de ${this.totalSlides}: ${slideInfo.title}. ${slideInfo.description}`;
    }

    trackSlideTransition(from, to) {
        // Log slide transitions for potential analytics
        console.log(`Transição: Slide ${from} → Slide ${to}`);
        
        // You could integrate with analytics services here
        // Example: gtag('event', 'slide_view', { slide_number: to });
    }

    handleVisibilityChange() {
        if (document.hidden) {
            console.log('⏸️ Apresentação pausada (aba inativa)');
        } else {
            console.log('▶️ Apresentação retomada');
        }
    }

    handleResize() {
        // Handle responsive updates if needed
        console.log(`📱 Redimensionamento detectado no slide ${this.currentSlide}`);
        
        // Trigger re-layout for current slide animations if needed
        const currentSlideElement = document.querySelector(`[data-slide="${this.currentSlide}"]`);
        if (currentSlideElement && currentSlideElement.classList.contains('active')) {
            // Force re-render of any responsive elements
            this.triggerSlideAnimations(currentSlideElement, this.currentSlide);
        }
    }

    // Public API methods
    getCurrentSlide() {
        return this.currentSlide;
    }

    getTotalSlides() {
        return this.totalSlides;
    }

    getCurrentSlideData() {
        return this.slideData[this.currentSlide - 1];
    }

    restart() {
        this.goToSlide(1);
        console.log('🔄 Apresentação reiniciada');
    }

    toggleFullscreen() {
        if (document.fullscreenElement) {
            this.exitFullscreen();
        } else {
            this.enterFullscreen();
        }
    }

    enterFullscreen() {
        const element = document.documentElement;
        
        if (element.requestFullscreen) {
            element.requestFullscreen();
        } else if (element.mozRequestFullScreen) {
            element.mozRequestFullScreen();
        } else if (element.webkitRequestFullscreen) {
            element.webkitRequestFullscreen();
        } else if (element.msRequestFullscreen) {
            element.msRequestFullscreen();
        }
    }

    exitFullscreen() {
        if (document.exitFullscreen) {
            document.exitFullscreen();
        } else if (document.mozCancelFullScreen) {
            document.mozCancelFullScreen();
        } else if (document.webkitExitFullscreen) {
            document.webkitExitFullscreen();
        } else if (document.msExitFullscreen) {
            document.msExitFullscreen();
        }
    }

    // Utility methods
    debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    }

    // Export current slide as data (for potential integrations)
    exportSlideData() {
        return {
            currentSlide: this.currentSlide,
            totalSlides: this.totalSlides,
            slideData: this.getCurrentSlideData(),
            timestamp: new Date().toISOString()
        };
    }
}

// Performance and Animation Utilities
class PresentationUtils {
    static smoothScrollToElement(element, duration = 1000) {
        const start = window.pageYOffset;
        const target = element.getBoundingClientRect().top + start;
        const startTime = Date.now();

        function animateScroll() {
            const elapsed = Date.now() - startTime;
            const progress = Math.min(elapsed / duration, 1);
            const easeProgress = PresentationUtils.easeInOutCubic(progress);
            
            window.scrollTo(0, start + (target - start) * easeProgress);
            
            if (progress < 1) {
                requestAnimationFrame(animateScroll);
            }
        }
        
        requestAnimationFrame(animateScroll);
    }

    static easeInOutCubic(t) {
        return t < 0.5 ? 4 * t * t * t : (t - 1) * (2 * t - 2) * (2 * t - 2) + 1;
    }

    static preloadSlideAssets() {
        // Preload any heavy assets for smooth transitions
        const images = document.querySelectorAll('img[data-src]');
        images.forEach(img => {
            const src = img.getAttribute('data-src');
            if (src) {
                const newImg = new Image();
                newImg.src = src;
            }
        });
    }

    static detectFeatures() {
        return {
            fullscreen: !!(
                document.fullscreenEnabled || 
                document.mozFullScreenEnabled || 
                document.webkitFullscreenEnabled || 
                document.msFullscreenEnabled
            ),
            touch: 'ontouchstart' in window,
            webGL: !!window.WebGLRenderingContext,
            localStorage: !!window.localStorage,
            serviceWorker: 'serviceWorker' in navigator
        };
    }
}

// Initialize the application
document.addEventListener('DOMContentLoaded', () => {
    // Feature detection
    const features = PresentationUtils.detectFeatures();
    
    // Initialize the main application
    window.digitalTransformationApp = new DigitalTransformationApp();
    
    // Preload assets for better performance
    PresentationUtils.preloadSlideAssets();
    
    // Setup performance monitoring
    if ('performance' in window) {
        window.addEventListener('load', () => {
            const loadTime = performance.now();
            console.log(`⚡ Apresentação carregada em ${Math.round(loadTime)}ms`);
        });
    }
    
    // Log initialization
    console.log('🚀 Transformação Digital: I.A., Automação e Bem-Estar');
    console.log('');
    console.log('📋 CONTROLES DISPONÍVEIS:');
    console.log('  • Setas ←/→ ou ↑/↓: Navegar entre slides');
    console.log('  • Espaço: Próximo slide');
    console.log('  • Números 1-9: Ir diretamente para o slide');
    console.log('  • Home: Primeiro slide');
    console.log('  • End: Último slide');
    console.log('  • R: Reiniciar apresentação');
    console.log('  • F: Alternar tela cheia');
    console.log('  • Escape: Sair da tela cheia');
    console.log('  • Clique na metade direita/esquerda da tela: Navegar');
    console.log('  • Gestos de deslizar em dispositivos touch');
    console.log('');
    
    // Feature availability log
    console.log('🔧 RECURSOS DISPONÍVEIS:');
    console.log(`  • Tela cheia: ${features.fullscreen ? '✅' : '❌'}`);
    console.log(`  • Touch: ${features.touch ? '✅' : '❌'}`);
    console.log(`  • WebGL: ${features.webGL ? '✅' : '❌'}`);
    console.log(`  • Local Storage: ${features.localStorage ? '✅' : '❌'}`);
    console.log('');
    
    // Check for required elements
    const requiredElements = [
        { selector: '#prevBtn', name: 'Botão anterior' },
        { selector: '#nextBtn', name: 'Botão próximo' },
        { selector: '#current-slide', name: 'Contador de slide atual' },
        { selector: '#total-slides', name: 'Contador total de slides' },
        { selector: '.progress-fill', name: 'Barra de progresso' },
        { selector: '.slide', name: 'Slides' }
    ];
    
    let missingElements = [];
    requiredElements.forEach(element => {
        if (!document.querySelector(element.selector)) {
            console.error(`❌ ${element.name} não encontrado: ${element.selector}`);
            missingElements.push(element.name);
        }
    });
    
    if (missingElements.length === 0) {
        console.log('✅ Todos os elementos necessários carregados corretamente');
    } else {
        console.warn(`⚠️ ${missingElements.length} elemento(s) não encontrado(s)`);
    }
    
    // Prevent context menu and text selection during presentation
    document.addEventListener('contextmenu', (e) => {
        e.preventDefault();
    });
    
    document.addEventListener('selectstart', (e) => {
        if (!e.target.closest('input, textarea')) {
            e.preventDefault();
        }
    });
    
    // Add visual feedback for navigation buttons
    document.querySelectorAll('.nav-btn').forEach(btn => {
        btn.addEventListener('mousedown', function() {
            this.style.transform = 'scale(0.95)';
        });
        
        btn.addEventListener('mouseup', function() {
            this.style.transform = '';
        });
        
        btn.addEventListener('mouseleave', function() {
            this.style.transform = '';
        });
    });
    
    // Setup fullscreen change handlers
    ['fullscreenchange', 'mozfullscreenchange', 'webkitfullscreenchange', 'msfullscreenchange'].forEach(event => {
        document.addEventListener(event, () => {
            if (document.fullscreenElement || 
                document.mozFullScreenElement || 
                document.webkitFullscreenElement || 
                document.msFullscreenElement) {
                console.log('🖥️ Modo tela cheia ativado');
            } else {
                console.log('🔍 Modo tela cheia desativado');
            }
        });
    });
    
    // Add keyboard shortcut hint to console
    setTimeout(() => {
        console.log('💡 DICA: Pressione F para tela cheia, R para reiniciar, ou use as setas para navegar!');
    }, 2000);
});

// Global error handling for presentation
window.addEventListener('error', (e) => {
    console.error('❌ Erro na apresentação:', e.message);
    // You could implement error reporting here
});

// Service Worker registration for offline capability (optional)
if ('serviceWorker' in navigator && window.location.protocol === 'https:') {
    navigator.serviceWorker.register('/sw.js').then(() => {
        console.log('📱 Service Worker registrado para uso offline');
    }).catch(() => {
        console.log('📱 Service Worker não disponível');
    });
}

// Export for potential external use
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { DigitalTransformationApp, PresentationUtils };
}