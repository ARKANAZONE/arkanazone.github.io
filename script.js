document.addEventListener("DOMContentLoaded", () => {
    const pageKey = location.pathname;
    document.getElementById('banner').classList.add('visible');

    const searchInput = document.getElementById('searchInput');
    const searchBtn = document.getElementById('searchBtn');
    const pagination = document.getElementById('pagination');
    const paginationHeader = document.getElementById('pagination-header');
    const searchResultsContainer = document.getElementById('searchResultsContainer');
    const infantilContainer = document.getElementById('infantilContainer');
    const categoriaTitulo = document.getElementById('categoriaTitulo');
    const mainPagination = document.getElementById('main-pagination');
    const itemsPerPage = 10;
    let filteredResults = [];
    let allInfantilCards = [];

    // ========================
    // Contador de visitas
    // ========================
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

    // ========================
    // Renderizador de paginación
    // ========================
    function renderPagination(currentPage, totalPages, callback) {
        pagination.innerHTML = "";
        pagination.style.display = totalPages > 1 ? "block" : "none";

        const createBtn = (text, page, isActive = false, isDisabled = false) => {
            const btn = document.createElement("a");
            btn.textContent = text;
            btn.href = "#";
            btn.style.cssText = `
                padding: 6px 12px;
                background: ${isActive ? "#00aaff" : "#222"};
                color: white;
                text-decoration: none;
                border-radius: 4px;
                border: 2px solid #00aaff;
                margin: 2px;
                font-weight: bold;
                font-family: sans-serif;
                opacity: ${isDisabled ? "0.5" : "1"};
                pointer-events: ${isDisabled ? "none" : "auto"};
            `;
            if (!isDisabled && page !== null) {
                btn.addEventListener("click", (e) => {
                    e.preventDefault();
                    callback(page);
                });
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

    // ========================
    // Mostrar página infantil
    // ========================
    function showInfantilPage(page) {
        const totalPages = Math.ceil(allInfantilCards.length / itemsPerPage);
        const start = (page - 1) * itemsPerPage;
        const end = start + itemsPerPage;
        allInfantilCards.forEach((card, index) => {
            card.style.display = (index >= start && index < end) ? 'flex' : 'none';
        });

        renderPagination(page, totalPages, showInfantilPage);
        paginationHeader.textContent = `PÁGINA ${page} DE ${totalPages}`;
        paginationHeader.style.display = totalPages > 1 ? "block" : "none";
        mainPagination.style.display = "block";
    }

    // ========================
    // Cargar data.json (MOVIL + scroll)
    // ========================
    fetch('../../data.json')
        .then(response => response.json())
        .then(data => {
            const scrollWrapper = document.getElementById('scrollWrapper');

            data.MOVIL.slice(0, 10).forEach(image => {
                const imgElement = document.createElement('img');
                imgElement.src = image.image;
                imgElement.alt = image.title;
                imgElement.classList.add('scroll-item');

                const enlaceMobile = document.createElement('a');
                enlaceMobile.href = image.url;
                enlaceMobile.target = '_self';
                enlaceMobile.appendChild(imgElement);

                scrollWrapper.appendChild(enlaceMobile);
            });

// Duplicado para efecto de bucle infinito
        data.MOVIL.slice(0, 10).forEach(image => {
            const imgElement = document.createElement('img');
            imgElement.src = image.image;
            imgElement.alt = image.title;
            imgElement.classList.add('scroll-item');

            const enlaceMobile = document.createElement('a');
            enlaceMobile.href = image.url;
            enlaceMobile.target = '_self';
            enlaceMobile.appendChild(imgElement);

            scrollWrapper.appendChild(enlaceMobile);
        });

            const category = document.body.getAttribute("data-category");

if (data[category]) {
    data[category].forEach(movie => {
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
        allInfantilCards.push(card);
    });

    showInfantilPage(1);
}


    // ========================
    // Mostrar página de búsqueda
    // ========================
    function showSearchPage(page) {
        const totalPages = Math.ceil(filteredResults.length / itemsPerPage);
        const start = (page - 1) * itemsPerPage;
        const end = start + itemsPerPage;
        filteredResults.forEach(card => card.style.display = 'none');
        filteredResults.slice(start, end).forEach(card => card.style.display = 'flex');

        renderPagination(page, totalPages, showSearchPage);
        paginationHeader.textContent = `PÁGINA ${page} DE ${totalPages}`;
        paginationHeader.style.display = "block";
    }

    // ========================
    // Filtrar búsqueda
    // ========================
    function filterMovies() {
        const query = searchInput.value.toLowerCase().trim();
        const resultMsg = document.getElementById('search-result-msg');
        const resultTitle = document.getElementById('search-result-title');
        const resultImage = document.getElementById('search-result-image');
        const resultNoResult = document.getElementById('search-result-noresult');
        const resultDesc = document.getElementById('search-result-desc');

        if (categoriaTitulo) categoriaTitulo.style.display = query === "" ? 'block' : 'none';

        if (query === "") {
            document.querySelectorAll('.movie-card').forEach(card => card.style.display = 'flex');
            pagination.style.display = "none";
            mainPagination.style.display = "block";
            resultMsg.style.display = "none";
            paginationHeader.style.display = "none";
            searchResultsContainer.innerHTML = "";
            localStorage.removeItem(pageKey + "_lastSearchQuery");
            localStorage.removeItem(pageKey + "_lastSearchPage");
            showInfantilPage(1);
            return;
        }

        localStorage.setItem(pageKey + "_lastSearchQuery", query);
        localStorage.setItem(pageKey + "_lastSearchPage", 1);

        document.querySelectorAll('.movie-card').forEach(card => card.style.display = 'none');
        mainPagination.style.display = "none";
        resultMsg.style.display = "block";
        searchResultsContainer.innerHTML = "";

        fetch('peliculastodas.json')
            .then(response => response.json())
            .then(data => {
                const matched = (data.TODAS || []).filter(p => p.title.toLowerCase().includes(query));
                filteredResults = [];

                matched.forEach(movie => {
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

                    filteredResults.push(card);
                    searchResultsContainer.appendChild(card);
                });

                resultTitle.textContent = `Resultados para: "${query}"`;

                if (filteredResults.length > 0) {
                    resultImage.style.display = "none";
                    resultNoResult.textContent = "";
                    resultDesc.textContent = `${filteredResults.length} resultados encontrados.`;
                    showSearchPage(1);
                } else {
                    pagination.style.display = "none";
                    paginationHeader.style.display = "none";
                    resultImage.style.display = "block";
                    resultNoResult.textContent = "No se encontraron coincidencias";
                    resultDesc.textContent = "Lo sentimos, pero nada coincide con sus términos de búsqueda.";
                }
            });
    }

    searchBtn.addEventListener('click', filterMovies);
    searchInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            e.preventDefault();
            filterMovies();
        }
    });

    // ========================
    // Restaurar búsqueda si hay datos previos
    // ========================
    const sessionKey = pageKey + "_sessionActive";
    if (!sessionStorage.getItem(sessionKey)) {
        localStorage.removeItem(pageKey + "_lastSearchQuery");
        localStorage.removeItem(pageKey + "_lastSearchPage");
        sessionStorage.setItem(sessionKey, "true");
    }

    function restoreSearch() {
        const savedQuery = localStorage.getItem(pageKey + "_lastSearchQuery");
        const savedPage = parseInt(localStorage.getItem(pageKey + "_lastSearchPage"), 10) || 1;
        if (savedQuery && savedQuery !== "") {
            searchInput.value = savedQuery;
            filterMovies();
            if (filteredResults.length > 0 && savedPage > 1) {
                showSearchPage(savedPage);
            }
        }
    }

    restoreSearch();

    window.addEventListener("pageshow", (event) => {
        if (event.persisted) {
            restoreSearch();
        }
    });
});
