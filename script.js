document.addEventListener("DOMContentLoaded", () => {

// =========================
    // Identificador único por página
    // =========================
    const pageKey = location.pathname; // Ej: "/index.html" o "/series.html"


    // =========================
    // Animación: mostrar banner (texto + logos)
    // =========================
    document.getElementById('banner').classList.add('visible');

    // =========================
    // Cargar portadas móviles desde data.json
    // =========================
    fetch('data.json') // Asegúrate de que tu archivo JSON se llama 'data.json' y esté en la misma carpeta
        .then(response => response.json())
        .then(data => {
            const scrollWrapper = document.getElementById('scrollWrapper');

            // =========================
            // Filtrar las 10 primeras imágenes de la categoría "MOVIL"
            // =========================//
            const mobileImages = data.MOVIL.slice(0, 10);

            // =========================
            // Agregar imágenes con enlaces
            // =========================
            mobileImages.forEach(image => {
                const imgElement = document.createElement('img');
                imgElement.src = image.image;  // Usando el campo "image" en tu JSON campo "url"
                imgElement.alt = image.title; // Usando el campo "title" en tu JSON
                imgElement.classList.add('scroll-item');

                // Crear el enlace <a> para las portadas moviles
            const enlaceMobile = document.createElement('a');                    // Crea el enlace
            enlaceMobile.href = image.url;                                       // Poner la URL que permite acceder la imagen de la pelicula
            enlaceMobile.target = '_self';                                       // Opcional: abrir en la misma pestaña
            enlaceMobile.appendChild(imgElement);                                 // Poner la imagen dentro del enlace
            
            scrollWrapper.appendChild(enlaceMobile);                              // Agregar el enlace (con imagen) al contenedor
    
                // Duplicar las imágenes para crear el efecto de bucle infinito
            mobileImages.forEach(image => {
                const imgElement = document.createElement('img');
                imgElement.src = image.image;
                imgElement.alt = image.title;
                imgElement.classList.add('scroll-item');
                
           // Crear el enlace <a> para las portadas moviles
            const enlaceMobile = document.createElement('a');                    // Crea el enlace
            enlaceMobile.href = image.url;                                       // Poner la URL que permite acceder la imagen de la pelicula
            enlaceMobile.target = '_self';                                       // Opcional: abrir en la misma pestaña
            enlaceMobile.appendChild(imgElement);                                 // Poner la imagen dentro del enlace
            
            scrollWrapper.appendChild(enlaceMobile);                              // Agregar el enlace (con imagen) al contenedor
     });
        .catch(error => {
            console.error('Error cargando el archivo JSON:', error);

                // =========================
            // Cargar portadas de la categoría INFANTIL en la columna izquierda (solo una vez y limitadas a 11)
            // =========================
            const infantilContainer = document.getElementById('infantilContainer');
            const infantilMovies = data.INFANTIL.slice(0, 11);  // Solo cargar las primeras 11 películas
            infantilMovies.forEach(movie => {
                const card = document.createElement('div');
                card.classList.add('movie-card');

                const link = document.createElement('a');
                link.href = movie.url;
                link.target = '_self';

                const img = document.createElement('img');
                img.src = movie.image;
                img.alt = movie.title;

                const overlay = document.createElement('div');
                overlay.classList.add('title-overlay');
                overlay.textContent = movie.title;

                const titleDiv = document.createElement('div');
                titleDiv.classList.add('movie-title');
                titleDiv.textContent = movie.title;

                link.appendChild(img);
                link.appendChild(overlay);
                link.appendChild(titleDiv);
                card.appendChild(link);
                infantilContainer.appendChild(card);
            });

        })
        .catch(error => {
            console.error('Error cargando el archivo JSON:', error);
        });

// =========================
    // Contador de visitas
    // =========================
    const visitSpan = document.getElementById('visitCount');
    const STORAGE_KEY = 'visitCount';
    let visitCount = localStorage.getItem(STORAGE_KEY);
    visitCount = visitCount === null ? 5555 : parseInt(visitCount, 10);
    visitSpan.textContent = visitCount.toString().padStart(8, '0');
    setInterval(() => {
        visitCount++;
        localStorage.setItem(STORAGE_KEY, visitCount);
        visitSpan.textContent = visitCount.toString().padStart(8, '0');
    }, 60000);

    // =========================
    // Búsqueda y paginación dinámica
    // =========================
    const searchInput = document.getElementById('searchInput');
    const searchBtn = document.getElementById('searchBtn');
    const movieCards = Array.from(document.querySelectorAll('.movie-card'));
    const pagination = document.getElementById('pagination');
    const paginationHeader = document.getElementById('pagination-header');

    const itemsPerPage = 10;
    let filteredResults = [];

    function renderPagination(currentPage, totalPages) {
        pagination.innerHTML = "";
        pagination.style.display = filteredResults.length > 0 ? "block" : "none";

        const createBtn = (text, page, isActive = false, isDisabled = false) => {
            const btn = document.createElement("a");
            btn.textContent = text;
            btn.style.padding = "6px 12px";
            btn.style.background = isActive ? "#00aaff" : "#222";
            btn.style.color = "#fff";
            btn.style.textDecoration = "none";
            btn.style.borderRadius = "4px";
            btn.style.border = "2px solid #00aaff";
            btn.style.margin = "2px";
            btn.style.fontWeight = "bold";
            btn.style.fontFamily = "sans-serif";
            btn.href = "#";
            if (!isDisabled && page !== null) {
                btn.addEventListener("click", (e) => {
                    e.preventDefault();
                    showPage(page);
        
         } else {
                btn.style.pointerEvents = "none";
                btn.style.opacity = "0.5";
            }
            return btn;
        };

        if (currentPage > 1) pagination.appendChild(createBtn("Anterior", currentPage - 1));
        if (currentPage > 3) {
            pagination.appendChild(createBtn("1", 1));
            if (currentPage > 4) pagination.appendChild(createBtn("...", null, false, true));
        }
        for (let i = Math.max(1, currentPage - 2); i <= Math.min(totalPages, currentPage + 2); i++) {
            pagination.appendChild(createBtn(i, i, i === currentPage));
        }
        if (currentPage < totalPages - 2) {
            if (currentPage < totalPages - 3) pagination.appendChild(createBtn("...", null, false, true));
            pagination.appendChild(createBtn(totalPages, totalPages));
        }
        if (currentPage < totalPages) pagination.appendChild(createBtn("Siguiente", currentPage + 1));
    }

    function showPage(page) {
        const start = (page - 1) * itemsPerPage;
        const end = start + itemsPerPage;
        movieCards.forEach(card => card.style.display = 'none');
        filteredResults.slice(start, end).forEach(card => card.style.display = 'flex');
        renderPagination(page, Math.ceil(filteredResults.length / itemsPerPage));
        paginationHeader.textContent = `PÁGINA ${page} DE ${Math.ceil(filteredResults.length / itemsPerPage)}`;
        paginationHeader.style.display = "block";
    

// Guardar página actual (con identificador de página)
        localStorage.setItem(pageKey + "_lastSearchPage", page);
    }

    function filterMovies() {
        const query = searchInput.value.toLowerCase().trim();
        const resultMsg = document.getElementById('search-result-msg');
        const resultTitle = document.getElementById('search-result-title');
        const resultImage = document.getElementById('search-result-image');
        const resultNoResult = document.getElementById('search-result-noresult');
        const resultDesc = document.getElementById('search-result-desc');
        const mainPagination = document.getElementById('main-pagination');

        if (query === "") {
            movieCards.forEach(card => card.style.display = 'flex');
            pagination.style.display = "none";
            mainPagination.style.display = "block";
            resultMsg.style.display = "none";
            paginationHeader.style.display = "none";

// Limpiar búsqueda guardada solo para esta página
            localStorage.removeItem(pageKey + "_lastSearchQuery");
            localStorage.removeItem(pageKey + "_lastSearchPage");
            return;
        }

// Guardar búsqueda solo para esta página
        localStorage.setItem(pageKey + "_lastSearchQuery", query);
        localStorage.setItem(pageKey + "_lastSearchPage", 1);

        filteredResults = movieCards.filter(card => {
            const title = card.querySelector('.movie-title').textContent.toLowerCase();
            return title.includes(query);

        movieCards.forEach(card => card.style.display = 'none');
        resultMsg.style.display = "block";
        mainPagination.style.display = "none";
        resultTitle.textContent = `Resultados para: "${query}"`;

        if (filteredResults.length > 0) {
            showPage(1);
            resultImage.style.display = "none";
            resultNoResult.textContent = "";
            resultDesc.textContent = `${filteredResults.length} resultados encontrados.`;
        } else {
            pagination.style.display = "none";
            resultImage.style.display = "block";
            resultNoResult.textContent = "No se encontraron coincidencias";
            resultDesc.textContent = "Lo sentimos, pero nada coincide con sus términos de búsqueda. Intente nuevamente con algunas palabras clave diferentes.";
            paginationHeader.style.display = "none";
         }
    }

    // Eventos de búsqueda
    searchBtn.addEventListener('click', filterMovies);
    searchInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            e.preventDefault();
            filterMovies();
        }
    });


// --- NUEVO: Detectar si es sesión nueva y limpiar localStorage si es necesario ---
    const sessionKey = pageKey + "_sessionActive";

    if (!sessionStorage.getItem(sessionKey)) {
        // Primera carga de esta pestaña o navegador abierto nuevo
        localStorage.removeItem(pageKey + "_lastSearchQuery");
        localStorage.removeItem(pageKey + "_lastSearchPage");
        sessionStorage.setItem(sessionKey, "true");
    }

// =========================
    // Restaurar búsqueda y página guardada (solo de esta página) al recargar
    // =========================
    function restoreSearch() {
        const savedQuery = localStorage.getItem(pageKey + "_lastSearchQuery");
        const savedPage = parseInt(localStorage.getItem(pageKey + "_lastSearchPage"), 10) || 1;

        if (savedQuery && savedQuery !== "") {
            searchInput.value = savedQuery;
            filterMovies();
            if (filteredResults.length > 0 && savedPage > 1) {
                showPage(savedPage);
            }
        }
    }

restoreSearch(); // Para recarga normal

    // =========================
    // Restaurar al volver con botón atrás (bfcache)
    // =========================
    window.addEventListener("pageshow", (event) => {
        if (event.persisted) { // viene del historial (bfcache)
            restoreSearch();
        }
    });
});
