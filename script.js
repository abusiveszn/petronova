document.addEventListener('DOMContentLoaded', () => {
    // Mobile Menu Logic
    const mobileMenuToggle = document.querySelector('.mobile-menu-toggle');
    const navLinks = document.querySelector('.nav-links');
    
    if (mobileMenuToggle && navLinks) {
        mobileMenuToggle.addEventListener('click', () => {
            navLinks.classList.toggle('active');
            // Toggle icon from menu to x
            const icon = mobileMenuToggle.querySelector('i');
            if (navLinks.classList.contains('active')) {
                icon.setAttribute('data-lucide', 'x');
            } else {
                icon.setAttribute('data-lucide', 'menu');
            }
            lucide.createIcons();
        });

        // Close menu when link clicked
        navLinks.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => {
                navLinks.classList.remove('active');
                const icon = mobileMenuToggle.querySelector('i');
                icon.setAttribute('data-lucide', 'menu');
                lucide.createIcons();
            });
        });
    }

    // Calculator Form Logic
    const form = document.getElementById('shipping-form');
    const destinationSelect = document.getElementById('destination');
    const serviceSelect = document.getElementById('service');
    const weightInput = document.getElementById('weight');
    const priceDisplay = document.getElementById('calc-price');
    const baseFreightDisplay = document.getElementById('base-freight');
    const fuelSurchargeDisplay = document.getElementById('fuel-surcharge');
    const totalEstimateDisplay = document.getElementById('total-estimate');

    // Values based on dummy logic for demonstration
    const destinationBase = {
        'asia': 500,
        'europe': 1200,
        'americas': 1500
    };

    const serviceMultiplier = {
        'air': 2.5,
        'sea_fcl': 1.5,
        'sea_lcl': 1.0
    };

    function calculateEstimate(e) {
        if(e && e.type === 'submit') e.preventDefault();
        
        const dest = destinationSelect.value;
        const service = serviceSelect.value;
        const weight = parseFloat(weightInput.value) || 0;

        if (dest && service && weight > 0) {
            const base = destinationBase[dest];
            const multiplier = serviceMultiplier[service];
            
            // Quantity is multiplier
            const weightFactor = weight;
            
            const baseFreight = base * multiplier * weightFactor;
            const fuelSurcharge = baseFreight * 0.15;
            const documentationFee = 150;
            const total = baseFreight + fuelSurcharge + documentationFee;
            
            // Animate all numbers
            if (baseFreightDisplay) animateValue(baseFreightDisplay, parseFloat(baseFreightDisplay.innerText.replace(/,/g, '')) || 0, baseFreight, 500);
            if (fuelSurchargeDisplay) animateValue(fuelSurchargeDisplay, parseFloat(fuelSurchargeDisplay.innerText.replace(/,/g, '')) || 0, fuelSurcharge, 500);
            if (totalEstimateDisplay) animateValue(totalEstimateDisplay, parseFloat(totalEstimateDisplay.innerText.replace(/,/g, '')) || 0, total, 500);
            if (priceDisplay) animateValue(priceDisplay, parseFloat(priceDisplay.innerText.replace(/,/g, '')) || 0, total, 500);
        } else {
            if (baseFreightDisplay) baseFreightDisplay.innerText = '0';
            if (fuelSurchargeDisplay) fuelSurchargeDisplay.innerText = '0';
            if (totalEstimateDisplay) totalEstimateDisplay.innerText = '0';
            if (priceDisplay) priceDisplay.innerText = '0';
        }
    }

    form.addEventListener('change', calculateEstimate);
    form.addEventListener('input', calculateEstimate);
    
    // Initial calc load
    calculateEstimate();
    
    // Smooth Scrolling for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const targetId = this.getAttribute('href');
            if(targetId === '#') return;
            
            const targetElement = document.querySelector(targetId);
            if(targetElement) {
                e.preventDefault();
                targetElement.scrollIntoView({
                    behavior: 'smooth'
                });
            }
        });
    });

    // Intersection Observer for subtle animations on scroll
    const observerOptions = {
        threshold: 0.1,
        rootMargin: "0px 0px -50px 0px"
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    // Initial styles for animation
    const style = document.createElement('style');
    style.innerHTML = `
        .fade-in-up {
            opacity: 0;
            transform: translateY(20px);
            transition: opacity 0.6s ease-out, transform 0.6s ease-out;
        }
        .fade-in-up.visible {
            opacity: 1;
            transform: translateY(0);
        }
    `;
    document.head.appendChild(style);

    // Apply animation classes to sections and cards
    document.querySelectorAll('.section-header, .service-card, .feature-item, .testimonial-card, .calculator-card, .stats-grid .stat-item').forEach(el => {
        el.classList.add('fade-in-up');
        observer.observe(el);
    });

    // Observer for Count-Up Stats
    const statsObserverOptions = {
        threshold: 0.5
    };

    const statsObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const counters = entry.target.querySelectorAll('.count-up');
                counters.forEach(counter => {
                    const target = +counter.getAttribute('data-target');
                    animateValue(counter, 0, target, 2000); // 2 seconds duration
                });
                statsObserver.unobserve(entry.target);
            }
        });
    }, statsObserverOptions);

    const statsGrid = document.querySelector('.stats-grid');
    if (statsGrid) {
        statsObserver.observe(statsGrid);
    }
});

// Helper for animating number change
function animateValue(obj, start, end, duration) {
    if (start === end) return;
    let startTimestamp = null;
    const step = (timestamp) => {
        if (!startTimestamp) startTimestamp = timestamp;
        const progress = Math.min((timestamp - startTimestamp) / duration, 1);
        // easeOutQuart
        const easeProgress = 1 - Math.pow(1 - progress, 4);
        const currentVal = Math.floor(progress * (end - start) + start);
        obj.innerHTML = currentVal.toLocaleString();
        if (progress < 1) {
            window.requestAnimationFrame(step);
        } else {
            // Final format
            obj.innerHTML = Math.floor(end).toLocaleString();
        }
    };
    window.requestAnimationFrame(step);
}
