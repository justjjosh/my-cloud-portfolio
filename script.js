// Scroll Reveal
const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
        if (entry.isIntersecting) {
            entry.target.classList.add('show');
        }
    });
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