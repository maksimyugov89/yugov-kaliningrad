document.addEventListener('DOMContentLoaded', () => {
    // Hide loading screen
    const loadingScreen = document.querySelector('.loading');
    window.addEventListener('load', () => {
        loadingScreen.classList.add('hidden');
    });

    // Navbar scroll effect
    const navbar = document.getElementById('navbar');
    window.addEventListener('scroll', () => {
        navbar.classList.toggle('scrolled', window.scrollY > 50);
    });

    // Particle animation for hero section
    const particlesContainer = document.querySelector('.particles');
    const numParticles = 50;
    for (let i = 0; i < numParticles; i++) {
        const particle = document.createElement('div');
        particle.className = 'particle';
        particle.style.left = `${Math.random() * 100}%`;
        particle.style.animationDelay = `${Math.random() * 20}s`;
        particle.style.animationDuration = `${10 + Math.random() * 10}s`;
        particle.style.transform = `scale(${0.5 + Math.random() * 0.5})`;
        particlesContainer.appendChild(particle);
    }
    
    // Timeline animation on scroll
    const timelineItems = document.querySelectorAll('.timeline-item');
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.animation = `fadeInUp 0.8s forwards`;
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.2 });
    timelineItems.forEach(item => observer.observe(item));

});
