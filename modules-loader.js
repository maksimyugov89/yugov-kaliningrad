// Функция для загрузки HTML-модулей
async function loadModule(elementId, filePath) {
    try {
        const response = await fetch(filePath);
        if (!response.ok) {
            throw new Error(`Failed to load ${filePath}: ${response.status}`);
        }
        const html = await response.text();
        document.getElementById(elementId).innerHTML = html;
    } catch (error) {
        console.error('Error loading module:', error);
        document.getElementById(elementId).innerHTML = '<p>Ошибка загрузки контента</p>';
    }
}

// Загрузка всех модулей при загрузке страницы
document.addEventListener('DOMContentLoaded', async function() {
    // Загружаем модули параллельно
    await Promise.all([
        loadModule('journey-section', 'journey-section.html'),
        loadModule('gallery-section', 'gallery-photos.html'),
        loadModule('history-section', 'history-section.html')
    ]);
    
    // После загрузки модулей инициализируем функциональность
    initializeGallery();
    initializeFilterButtons();
});

// Инициализация галереи (модальные окна и т.д.)
function initializeGallery() {
    const galleryItems = document.querySelectorAll('.gallery-item img');
    const modal = document.getElementById('gallery-modal');
    const modalImg = document.getElementById('modal-img');
    const closeBtn = document.querySelector('.close');

    // Добавляем обработчики для изображений
    galleryItems.forEach(img => {
        img.addEventListener('click', function() {
            modal.style.display = 'block';
            modalImg.src = this.src;
            modalImg.alt = this.alt;
        });
    });

    // Закрытие модального окна
    if (closeBtn) {
        closeBtn.addEventListener('click', function() {
            modal.style.display = 'none';
        });
    }

    // Закрытие по клику вне изображения
    window.addEventListener('click', function(event) {
        if (event.target === modal) {
            modal.style.display = 'none';
        }
    });
}

// Инициализация кнопок фильтрации
function initializeFilterButtons() {
    const filterButtons = document.querySelectorAll('.filter-btn');
    const galleryItems = document.querySelectorAll('.gallery-item');

    filterButtons.forEach(button => {
        button.addEventListener('click', function() {
            // Убираем active класс со всех кнопок
            filterButtons.forEach(btn => btn.classList.remove('active'));
            // Добавляем active класс к текущей кнопке
            this.classList.add('active');

            const filter = this.getAttribute('data-filter');

            galleryItems.forEach(item => {
                if (filter === 'all') {
                    item.style.display = 'block';
                } else {
                    const categories = item.getAttribute('data-category');
                    if (categories && categories.includes(filter)) {
                        item.style.display = 'block';
                    } else {
                        item.style.display = 'none';
                    }
                }
            });
        });
    });
}

// Функция для добавления новых фотографий (для будущего использования)
function addNewPhoto(imagePath, alt, title, description, categories) {
    const gallery = document.getElementById('photo-gallery');
    
    const galleryItem = document.createElement('div');
    galleryItem.className = 'gallery-item';
    galleryItem.setAttribute('data-category', categories);
    
    galleryItem.innerHTML = `
        <img src="${imagePath}" alt="${alt}">
        <div class="gallery-overlay">
            <div>
                <h4>${title}</h4>
                <p>${description}</p>
            </div>
        </div>
    `;
    
    gallery.appendChild(galleryItem);
    
    // Переинициализируем обработчики для новой фотографии
    const newImg = galleryItem.querySelector('img');
    const modal = document.getElementById('gallery-modal');
    const modalImg = document.getElementById('modal-img');
    
    newImg.addEventListener('click', function() {
        modal.style.display = 'block';
        modalImg.src = this.src;
        modalImg.alt = this.alt;
    });
}
