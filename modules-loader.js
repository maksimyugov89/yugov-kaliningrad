async function loadModule(elementId, filePath) {
    try {
        const response = await fetch(filePath);
        if (!response.ok) throw new Error(`Не удалось загрузить ${filePath}: ${response.statusText}`);
        const html = await response.text();
        const element = document.getElementById(elementId);
        if (element) {
            element.innerHTML = html;
        } else {
            console.error(`Элемент с id "${elementId}" не найден.`);
        }
    } catch (error) {
        console.error('Ошибка загрузки модуля:', error);
    }
}

document.addEventListener('DOMContentLoaded', async () => {
    // Параллельно загружаем все секции
    await Promise.all([
        loadModule('journey-section', 'journey-section.html'),
        loadModule('gallery-section', 'gallery-photos.html'),
        loadModule('map-section', 'map-section.html'),
        loadModule('history-section', 'history-section.html')
    ]);

    // После загрузки контента, инициализируем всю интерактивность
    initializeGallery();
    initializeMap();
    initializeTimelineObserver(); 
});

function initializeGallery() {
    const photoGallery = document.getElementById('photo-gallery');
    if (!photoGallery) return;

    // Убедитесь, что пути к изображениям правильные
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
        // Добавьте сюда больше фотографий при необходимости
    ];

    photos.forEach(photo => {
        // Оборачиваем каждую картинку в ссылку <a> для GLightbox
        const link = document.createElement('a');
        link.href = photo.src; 
        link.className = 'gallery-item glightbox'; 
        link.dataset.category = photo.cat;
        link.dataset.gallery = 'family-trip'; 
        link.dataset.title = photo.title; 

        link.innerHTML = `
            <img src="${photo.src}" alt="${photo.title}" loading="lazy">
            <div class="gallery-overlay">
                <div>
                    <h4>${photo.title}</h4>
                </div>
            </div>
        `;
        photoGallery.appendChild(link);
    });
    
    // Инициализация GLightbox
    const lightbox = GLightbox({
        selector: '.glightbox', 
        touchNavigation: true, 
        loop: true, 
        zoomable: true, 
        openEffect: 'zoom', 
        closeEffect: 'fade',
        slideEffect: 'slide',
    });

    const filterButtons = document.querySelectorAll('.filter-btn');
    const galleryItems = document.querySelectorAll('a.gallery-item');
    
    filterButtons.forEach(button => {
        button.addEventListener('click', () => {
            filterButtons.forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');
            const filter = button.dataset.filter;

            galleryItems.forEach(item => {
                const isVisible = filter === 'all' || item.dataset.category.includes(filter);
                item.style.display = isVisible ? 'block' : 'none';
            });
            lightbox.reload();
        });
    });
}

function initializeMap() {
    const mapElement = document.getElementById('map');
    if (!mapElement || mapElement.classList.contains('leaflet-container')) return;

    const map = L.map('map').setView([54.85, 20.4], 9);

    L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
        attribution: '&copy; OpenStreetMap &copy; CARTO',
        subdomains: 'abcd',
        maxZoom: 19
    }).addTo(map);

    const locations = [
        { coords: [54.953, 20.153], title: 'Зеленоградск' },
        { coords: [55.096, 20.846], title: 'Куршская коса' },
        { coords: [54.708, 20.512], title: 'Исторический центр Калининграда' },
        { coords: [54.945, 20.153], title: 'Светлогорск' },
        { coords: [54.644, 19.891], title: 'Балтийск' }
    ];

    locations.forEach(loc => {
        L.marker(loc.coords).addTo(map)
            .bindPopup(`<b>${loc.title}</b>`);
    });
}
