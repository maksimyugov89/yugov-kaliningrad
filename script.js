// Эта функция будет вызвана из modules-loader.js после загрузки контента
function initializeTimelineObserver() {
    const timelineItems = document.querySelectorAll('.timeline-item');
    // Проверка, что элементы найдены
    if (timelineItems.length === 0) {
        console.warn("Элементы путешествия для анимации не найдены.");
        return;
    }

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                // Добавляем класс, который делает элемент видимым
                entry.target.classList.add('visible');
                // Прекращаем наблюдение за элементом после анимации
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1 }); // Порог 0.1, чтобы анимация сработала чуть раньше

    timelineItems.forEach(item => observer.observe(item));
}


document.addEventListener('DOMContentLoaded', () => {
    // Логика для экрана загрузки
    const loadingScreen = document.querySelector('.loading');
    window.addEventListener('load', () => {
        loadingScreen.classList.add('hidden');
    });

    // Эффект для навигации при прокрутке
    const navbar = document.getElementById('navbar');
    window.addEventListener('scroll', () => {
        navbar.classList.toggle('scrolled', window.scrollY > 50);
    });

    // Анимация частиц в hero-секции
    const particlesContainer = document.querySelector('.particles');
    if (particlesContainer) {
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
    }
});
