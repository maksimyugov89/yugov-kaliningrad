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
    if (navbar && window.scrollY > 50) {
        navbar.classList.add('scrolled');
    } else if (navbar) {
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
    const mapElement = document.getElementById('map');
    if (!mapElement) return;
    
    const map = L.map('map').setView([54.7065, 20.511], 10);
    
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap contributors'
    }).addTo(map);

    // Family journey locations - обновлено согласно исправленным описаниям
    const locations = [
        {
            coords: [54.9530, 20.1530],
            title: 'Зеленоградск',
            description: 'Курортный проспект и исторические улицы города кошек',
            icon: '🐱'
        },
        {
            coords: [54.954, 20.153],
            title: 'Музей кошек "Мурариум"',
            description: 'Уникальный музей, посвященный котам в Зеленоградске',
            icon: '🏠'
        },
        {
            coords: [54.9480, 20.1480],
            title: 'Церковь Преображения Господня',
            description: 'Кирпичная готическая церковь в Зеленоградске',
            icon: '⛪'
        },
        {
            coords: [55.0964, 20.8466],
            title: 'Куршская коса',
            description: 'Национальный парк ЮНЕСКО с деревянными скульптурами и пляжами',
            icon: '🌲'
        },
        {
            coords: [54.7089, 20.5086],
            title: 'Фридландские ворота',
            description: 'Средневековые ворота XIV века с музеем и ретро-телефонами',
            icon: '🏰'
        },
        {
            coords: [54.708, 20.512],
            title: 'Росгартенские ворота',
            description: 'Величественная кирпичная архитектура XIV века',
            icon: '🏛️'
        },
        {
            coords: [54.710, 20.515],
            title: 'Бранденбургские ворота',
            description: 'Исторические ворота с музеем марципана',
            icon: '🍰'
        },
        {
            coords: [54.706, 20.520],
            title: 'Фридрихсбургские ворота',
            description: 'Крепостные укрепления с памятником маленькому Петру I',
            icon: '👑'
        },
        {
            coords: [54.7010, 20.5128],
            title: 'Музей Балтийского флота',
            description: 'Готическое здание с морской историей',
            icon: '⚓'
        },
        {
            coords: [54.704, 20.509],
            title: 'Памятник "Прокурор и защитник"',
            description: 'Бронзовая скульптурная композиция с зубрами',
            icon: '🦏'
        },
        {
            coords: [54.712, 20.508],
            title: 'Музей изобразительных искусств',
            description: 'Бывшая биржа с художественными коллекциями',
            icon: '🎨'
        },
        {
            coords: [54.703, 20.507],
            title: 'Памятник "Несущая воду"',
            description: 'Белая скульптура в парке Южном',
            icon: '💧'
        },
        {
            coords: [54.9455, 20.1535],
            title: 'Светлогорск',
            description: 'Курорт с водонапорной башней Раушен и променадом',
            icon: '🏖️'
        },
        {
            coords: [54.6447, 19.8910],
            title: 'Балтийск',
            description: 'Площадь Балтийской славы и морские памятники',
            icon: '🚢'
        },
        {
            coords: [54.948, 20.150],
            title: 'Памятник "Курортница"',
            description: 'Бронзовый памятник в Зеленоградске',
            icon: '👩'
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
function initGalleryModal() {
    const modal = document.getElementById('gallery-modal');
    const modalImg = document.getElementById('modal-img');
    const closeBtn = document.querySelector('.close');
    const galleryItems = document.querySelectorAll('.gallery-item');

    if (!modal || !modalImg || !closeBtn) return;

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
}

// Initialize everything when page loads
document.addEventListener('DOMContentLoaded', () => {
    initMap();
    initGalleryModal();
    
    // Animate timeline items on scroll
    const timelineItems = document.querySelectorAll('.timeline-item');
    timelineItems.forEach((item, index) => {
        item.dataset.delay = `${index * 0.2}s`;
    });
    
    // Observe elements for animation
    document.querySelectorAll('.timeline-item').forEach(item => {
        observer.observe(item);
    });
    document.querySelectorAll('.info-card').forEach(item => {
        observer.observe(item);
    });
});

// Parallax effect for hero section
window.addEventListener('scroll', () => {
    const scrolled = window.pageYOffset;
    const hero = document.querySelector('.hero');
    if (hero) {
        hero.style.transform = `translateY(${scrolled * 0.5}px)`;
    }
});
