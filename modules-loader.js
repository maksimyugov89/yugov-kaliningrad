async function loadModule(elementId, filePath) {
    try {
        const response = await fetch(filePath);
        if (!response.ok) throw new Error(`Failed to load ${filePath}`);
        const html = await response.text();
        document.getElementById(elementId).innerHTML = html;
    } catch (error) {
        console.error('Error loading module:', error);
    }
}

document.addEventListener('DOMContentLoaded', async () => {
    await Promise.all([
        loadModule('journey-section', 'journey-section.html'),
        loadModule('gallery-section', 'gallery-photos.html'),
        loadModule('map-section', 'map-section.html'),
        loadModule('history-section', 'history-section.html')
    ]);

    // Once all modules are loaded, initialize functionalities
    initializeGallery();
    initializeMap();
});

function initializeGallery() {
    const photoGallery = document.getElementById('photo-gallery');
    if (!photoGallery) return;

    const photos = [
        { src: "images/img_1.jpg", title: "Курортный проспект", cat: "sights family" },
        { src: "images/img_2.jpg", title: "Прогулка по Зеленоградску", cat: "family" },
        { src: "images/img_3.jpg", title: "Тевтонский рыцарь", cat: "culture museums" },
        { src: "images/img_8.jpg", title: "На Куршской косе", cat: "nature family" },
        { src: "images/img_12.jpg", title: "Папа у Балтики", cat: "beach family" },
        { src: "images/img_15.jpg", title: "Фридландские ворота", cat: "sights" },
        { src: "images/img_20.jpg", title: "Селфи у ворот", cat: "family" },
        { src: "images/img_30.jpg", title: "Семейный портрет", cat: "family beach" },
        { src: "images/img_32.jpg", title: "Мама с дочками", cat: "family beach" },
    ];

    photos.forEach(photo => {
        const item = document.createElement('div');
        item.className = 'gallery-item';
        item.dataset.category = photo.cat;
        item.innerHTML = `
            <img src="${photo.src}" alt="${photo.title}" loading="lazy">
            <div class="gallery-overlay">
                <div>
                    <h4>${photo.title}</h4>
                    <p>${photo.cat.replace(/\b\w/g, l => l.toUpperCase())}</p>
                </div>
            </div>
        `;
        photoGallery.appendChild(item);
    });

    const filterButtons = document.querySelectorAll('.filter-btn');
    const galleryItems = document.querySelectorAll('.gallery-item');
    const modal = document.getElementById('gallery-modal');
    const modalImg = document.getElementById('modal-img');
    const closeBtn = document.querySelector('.close');

    filterButtons.forEach(button => {
        button.addEventListener('click', () => {
            filterButtons.forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');
            const filter = button.dataset.filter;

            galleryItems.forEach(item => {
                item.style.display = (filter === 'all' || item.dataset.category.includes(filter)) ? 'block' : 'none';
            });
        });
    });

    galleryItems.forEach(item => {
        item.addEventListener('click', () => {
            modal.style.display = 'block';
            modalImg.src = item.querySelector('img').src;
        });
    });

    closeBtn.onclick = () => modal.style.display = 'none';
    modal.onclick = (e) => {
        if (e.target === modal) {
            modal.style.display = 'none';
        }
    };
}

function initializeMap() {
    const mapElement = document.getElementById('map');
    if (!mapElement) return;

    const map = L.map('map').setView([54.85, 20.4], 9);

    L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>',
        subdomains: 'abcd',
        maxZoom: 19
    }).addTo(map);

    const locations = [
        { coords: [54.95, 20.15], title: 'Зеленоградск' },
        { coords: [55.08, 20.62], title: 'Куршская коса' },
        { coords: [54.71, 20.51], title: 'Центр Калининграда' },
        { coords: [54.94, 20.15], title: 'Светлогорск' }
    ];

    locations.forEach(loc => {
        L.marker(loc.coords).addTo(map)
            .bindPopup(`<b>${loc.title}</b>`);
    });
}
