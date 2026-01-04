// Scroll Reveal
const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
        if (entry.isIntersecting) {
            entry.target.classList.add('show');
        }
    });
}, {
    threshold: 0.1
});

const hiddenElements = document.querySelectorAll('.hidden');
hiddenElements.forEach((el) => observer.observe(el));

// Interactive Dangly Balls
document.addEventListener('mousemove', (e) => {
    const balls = document.querySelectorAll('.dangler');
    const mouseX = e.clientX / window.innerWidth;

    balls.forEach((ball, index) => {
        const depth = index + 1;
        const moveX = (mouseX - 0.5) * (depth * 10);
        ball.style.transform = `rotate(${moveX}deg)`;
    });
});

// Mobile Nav Toggle
const hamburger = document.querySelector('.hamburger');
const navLinks = document.querySelector('.nav-links');

if (hamburger) {
    hamburger.addEventListener('click', () => {
        navLinks.classList.toggle('active');
        const icon = hamburger.querySelector('i');
        if (navLinks.classList.contains('active')) {
            icon.classList.remove('fa-bars');
            icon.classList.add('fa-times');
        } else {
            icon.classList.remove('fa-times');
            icon.classList.add('fa-bars');
        }
    });
}

// Terminal Typing Effect Enhancement
document.addEventListener('DOMContentLoaded', () => {
    // Add glitch effect to terminal title occasionally
    const terminalTitle = document.querySelector('.terminal-title');
    if (terminalTitle) {
        setInterval(() => {
            if (Math.random() > 0.95) {
                terminalTitle.style.textShadow = '2px 0 #ff00ff, -2px 0 #00ffff';
                setTimeout(() => {
                    terminalTitle.style.textShadow = 'none';
                }, 100);
            }
        }, 2000);
    }

    // Project card hover sound effect (visual feedback)
    const projectCards = document.querySelectorAll('.terminal-project-card');
    projectCards.forEach(card => {
        card.addEventListener('mouseenter', () => {
            // Add subtle border pulse on hover
            card.style.animation = 'borderPulse 0.5s ease-in-out';
        });

        card.addEventListener('mouseleave', () => {
            card.style.animation = '';
        });
    });

    // Smooth scroll for navigation links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
                // Close mobile menu if open
                if (navLinks.classList.contains('active')) {
                    navLinks.classList.remove('active');
                    const icon = hamburger.querySelector('i');
                    icon.classList.remove('fa-times');
                    icon.classList.add('fa-bars');
                }
            }
        });
    });

    // Add terminal boot sequence effect
    const terminalCard = document.querySelector('.terminal-card');
    if (terminalCard) {
        terminalCard.style.opacity = '0';
        terminalCard.style.transform = 'scale(0.95)';

        setTimeout(() => {
            terminalCard.style.transition = 'all 0.5s ease-out';
            terminalCard.style.opacity = '1';
            terminalCard.style.transform = 'scale(1)';
        }, 300);
    }

    // GitHub link hover effect enhancement
    const githubLinks = document.querySelectorAll('.github-link');
    githubLinks.forEach(link => {
        link.addEventListener('mouseenter', function () {
            this.innerHTML = '<i class="fab fa-github"></i> <span style="color: #00ff41;">git clone</span> ' + this.textContent.replace('View Repository', '').trim();
        });

        link.addEventListener('mouseleave', function () {
            this.innerHTML = '<i class="fab fa-github"></i> View Repository';
        });
    });

    // Add random terminal flicker effect
    setInterval(() => {
        if (Math.random() > 0.98) {
            const terminalBody = document.querySelector('.terminal-body');
            if (terminalBody) {
                terminalBody.style.opacity = '0.95';
                setTimeout(() => {
                    terminalBody.style.opacity = '1';
                }, 50);
            }
        }
    }, 3000);

    // Konami code easter egg for fun
    let konamiCode = [];
    const konamiSequence = ['ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight', 'b', 'a'];

    document.addEventListener('keydown', (e) => {
        konamiCode.push(e.key);
        konamiCode = konamiCode.slice(-10);

        if (konamiCode.join('') === konamiSequence.join('')) {
            // Matrix rain effect
            document.body.style.animation = 'matrixRain 2s ease-in-out';
            setTimeout(() => {
                document.body.style.animation = '';
            }, 2000);
        }
    });
});

// Add CSS animation for border pulse
const style = document.createElement('style');
style.textContent = `
    @keyframes borderPulse {
        0%, 100% { border-color: var(--terminal-border); }
        50% { border-color: var(--terminal-text); }
    }
    
    @keyframes matrixRain {
        0%, 100% { filter: hue-rotate(0deg); }
        50% { filter: hue-rotate(120deg); }
    }
`;
document.head.appendChild(style);