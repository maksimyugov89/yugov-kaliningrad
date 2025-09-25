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
    await Promise.all([
        loadModule('journey-section', 'journey-section.html'),
        loadModule('gallery-section', 'gallery-photos.html'),
        loadModule('map-section', 'map-section.html'),
        loadModule('history-section', 'history-section.html')
    ]);

    initializeGallery();
    initializeMap();
    initializeTimelineObserver();
});

function initializeGallery() {
    const galleryItems = document.querySelectorAll('.gallery-item');
    if (galleryItems.length === 0) return;

    // Шаг 1: Превращаем каждый статичный div в рабочую ссылку для GLightbox
    galleryItems.forEach(item => {
        const img = item.querySelector('img');
        const titleElement = item.querySelector('h4');
        const descriptionElement = item.querySelector('p');

        if (!img) return;

        // Извлекаем данные
        const imgSrc = img.getAttribute('src');
        const title = titleElement ? titleElement.textContent : '';
        const description = descriptionElement ? descriptionElement.textContent : '';

        // Создаем новый элемент <a>, который будет оберткой
        const link = document.createElement('a');
        link.href = imgSrc;
        link.className = 'gallery-item glightbox'; // Важные классы
        
        // Переносим data-атрибуты со старого div на новую ссылку
        if (item.dataset.category) {
            link.dataset.category = item.dataset.category;
        }
        
        // Устанавливаем атрибуты для GLightbox
        link.dataset.gallery = 'family-trip';
        link.dataset.title = title;
        link.dataset.description = description;

        // Копируем внутреннее содержимое (img и overlay) в новую ссылку
        link.innerHTML = item.innerHTML;

        // Заменяем старый div на новую ссылку в DOM
        item.parentNode.replaceChild(link, item);
    });

    // Шаг 2: Инициализируем GLightbox
    const lightbox = GLightbox({
        selector: '.glightbox',
        touchNavigation: true,
        loop: true,
        zoomable: true,
        openEffect: 'zoom',
        closeEffect: 'fade',
        slideEffect: 'slide',
        // Включаем отображение описаний
        description: {
            position: 'bottom', // или 'left', 'right'
            mobilePosition: 'bottom'
        }
    });

    // Шаг 3: Настраиваем фильтрацию
    const filterButtons = document.querySelectorAll('.filter-btn');
    const newGalleryItems = document.querySelectorAll('a.gallery-item'); // Теперь ищем ссылки

    filterButtons.forEach(button => {
        button.addEventListener('click', () => {
            filterButtons.forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');
            const filter = button.dataset.filter;

            newGalleryItems.forEach(item => {
                const isVisible = filter === 'all' || (item.dataset.category && item.dataset.category.includes(filter));
                item.style.display = isVisible ? 'block' : 'none';
            });
            // Перезагружаем GLightbox, чтобы он учитывал отфильтрованные элементы
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
