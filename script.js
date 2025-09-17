// Smooth scrolling for navigation
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// Navbar scroll effect
window.addEventListener('scroll', () => {
    const navbar = document.getElementById('navbar');
    if (window.scrollY > 50) {
        navbar.classList.add('scrolled');
    } else {
        navbar.classList.remove('scrolled');
    }
});

// Timeline animation on scroll
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.animationDelay = entry.target.dataset.delay || '0s';
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateX(0)';
        }
    });
}, observerOptions);

// Initialize map
function initMap() {
    const map = L.map('map').setView([54.7065, 20.511], 10);
    
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap contributors'
    }).addTo(map);

    // Family journey locations
    const locations = [
        {
            coords: [54.7065, 20.511],
            title: 'Кафедральный собор',
            description: 'Главная достопримечательность Калининграда и могила Иммануила Канта',
            icon: '⛪'
        },
        {
            coords: [54.7104, 20.5120],
            title: 'Музей янтаря',
            description: 'Уникальная коллекция балтийского золота',
            icon: '💎'
        },
        {
            coords: [54.7027, 20.5097],
            title: 'Рыбная деревня',
            description: 'Стилизованный квартал в духе старого Кёнигсберга',
            icon: '🏘️'
        },
        {
            coords: [54.9530, 20.1530],
            title: 'Светлогорск',
            description: 'Курортный город с знаменитой водонапорной башней',
            icon: '🏖️'
        },
        {
            coords: [55.0964, 20.8466],
            title: 'Куршская коса',
            description: 'Национальный парк, объект Всемирного наследия ЮНЕСКО',
            icon: '🌲'
        },
        {
            coords: [54.7089, 20.5086],
            title: 'Фридландские ворота',
            description: 'Средневековые городские ворота и музей',
            icon: '🏰'
        },
        {
            coords: [54.7010, 20.5128],
            title: 'Музей Мирового океана',
            description: 'Морская история и настоящие корабли',
            icon: '⚓'
        }
    ];

    locations.forEach(location => {
        const marker = L.marker(location.coords).addTo(map);
        marker.bindPopup(`
            <div style="text-align: center;">
                <div style="font-size: 24px; margin-bottom: 8px;">${location.icon}</div>
                <h4 style="margin: 0 0 8px 0; color: #2c5aa0;">${location.title}</h4>
                <p style="margin: 0; font-size: 13px;">${location.description}</p>
            </div>
        `);
    });
}

// Gallery filtering
const filterButtons = document.querySelectorAll('.filter-btn');
const galleryItems = document.querySelectorAll('.gallery-item');

filterButtons.forEach(button => {
    button.addEventListener('click', () => {
        filterButtons.forEach(btn => btn.classList.remove('active'));
        button.classList.add('active');
        
        const filter = button.dataset.filter;
        
        galleryItems.forEach(item => {
            if (filter === 'all' || item.dataset.category.includes(filter)) {
                item.style.display = 'block';
                item.style.opacity = '1';
                item.style.transform = 'scale(1)';
            } else {
                item.style.opacity = '0';
                item.style.transform = 'scale(0.8)';
                setTimeout(() => {
                    if (!item.dataset.category.includes(filter)) {
                        item.style.display = 'none';
                    }
                }, 300);
            }
        });
    });
});

// Gallery modal
const modal = document.getElementById('gallery-modal');
const modalImg = document.getElementById('modal-img');
const closeBtn = document.querySelector('.close');

galleryItems.forEach(item => {
    item.addEventListener('click', () => {
        modal.style.display = 'block';
        modalImg.src = item.querySelector('img').src;
        modalImg.alt = item.querySelector('img').alt;
    });
});

closeBtn.addEventListener('click', () => {
    modal.style.display = 'none';
});

modal.addEventListener('click', (e) => {
    if (e.target === modal) {
        modal.style.display = 'none';
    }
});

// Initialize everything when page loads
document.addEventListener('DOMContentLoaded', () => {
    initMap();
    
    // Animate timeline items on scroll
    const timelineItems = document.querySelectorAll('.timeline-item');
    timelineItems.forEach((item, index) => {
        item.dataset.delay = `${index * 0.2}s`;
    });
    
    // Observe elements for animation
    observer.observe(document.querySelectorAll('.timeline-item'));
    observer.observe(document.querySelectorAll('.info-card'));
});

// Parallax effect for hero section
window.addEventListener('scroll', () => {
    const scrolled = window.pageYOffset;
    const hero = document.querySelector('.hero');
    if (hero) {
        hero.style.transform = `translateY(${scrolled * 0.5}px)`;
    }
});
