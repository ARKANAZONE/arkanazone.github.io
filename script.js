document.addEventListener("DOMContentLoaded", function () {
    var pageKey = location.pathname;
    document.getElementById('banner').classList.add('visible');

    var searchInput = document.getElementById('searchInput');
    var searchBtn = document.getElementById('searchBtn');
    var pagination = document.getElementById('pagination');
    var paginationHeader = document.getElementById('pagination-header');
    var searchResultsContainer = document.getElementById('searchResultsContainer');
    var infantilContainer = document.getElementById('infantilContainer');
    var categoriaTitulo = document.getElementById('categoriaTitulo');
    var mainPagination = document.getElementById('main-pagination');
    var itemsPerPage = 10;
    var filteredResults = [];
    var allInfantilCards = [];

    // ========================
    // Contador de visitas
    // ========================
    var visitSpan = document.getElementById('visitCount');
    var STORAGE_KEY = 'visitCount';
    var visitCount = localStorage.getItem(STORAGE_KEY);
    visitCount = visitCount === null ? 3000 : parseInt(visitCount, 10);
    visitSpan.textContent = ('00000000' + visitCount).slice(-8);
    setInterval(function () {
        visitCount++;
        localStorage.setItem(STORAGE_KEY, visitCount);
        visitSpan.textContent = ('00000000' + visitCount).slice(-8);
    }, 60000);

    // ========================
    // Renderizador de paginación
    // ========================
    function renderPagination(currentPage, totalPages, callback) {
        pagination.innerHTML = "";
        pagination.style.display = totalPages > 1 ? "block" : "none";

        function createBtn(text, page, isActive, isDisabled) {
            if (isActive === undefined) isActive = false;
            if (isDisabled === undefined) isDisabled = false;

            var btn = document.createElement("a");
            btn.textContent = text;
            btn.href = "#";
            btn.style.cssText =
                "padding: 6px 12px; background: " + (isActive ? "#00aaff" : "#222") +
                "; color: white; text-decoration: none; border-radius: 4px; border: 2px solid #00aaff; margin: 2px; font-weight: bold; font-family: sans-serif;" +
                "opacity: " + (isDisabled ? "0.5" : "1") +
                "; pointer-events: " + (isDisabled ? "none" : "auto") + ";";
            if (!isDisabled && page !== null) {
                btn.addEventListener("click", function (e) {
                    e.preventDefault();
                    callback(page);
                });
            }
            return btn;
        }

        if (currentPage > 1) pagination.appendChild(createBtn("Anterior", currentPage - 1));
        if (currentPage > 3) {
            pagination.appendChild(createBtn("1", 1));
            if (currentPage > 4) pagination.appendChild(createBtn("...", null, false, true));
        }
        for (var i = Math.max(1, currentPage - 2); i <= Math.min(totalPages, currentPage + 2); i++) {
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
        var totalPages = Math.ceil(allInfantilCards.length / itemsPerPage);
        var start = (page - 1) * itemsPerPage;
        var end = start + itemsPerPage;
        allInfantilCards.forEach(function (card, index) {
            card.style.display = (index >= start && index < end) ? 'flex' : 'none';
        });

        renderPagination(page, totalPages, showInfantilPage);
        paginationHeader.textContent = "PÁGINA " + page + " DE " + totalPages;
        paginationHeader.style.display = totalPages > 1 ? "block" : "none";
        mainPagination.style.display = "block";

        // Guardar página actual de categoría
        localStorage.setItem(pageKey + "_lastCategoryPage", page);
    }

    // ========================
    // Determinar ruta del JSON automáticamente
    // ========================
    var pathLevels = location.pathname.split("/").filter(Boolean);
    var jsonPath = "";
    if (pathLevels.includes("peliculas") || pathLevels.includes("series")) {
        jsonPath = new Array(pathLevels.length - 1).fill("..").join("/") + "/data.json";
    } else {
        jsonPath = "data.json";
    }

    // ========================
    // Cargar data.json
    // ========================
    fetch(jsonPath)
        .then(response => response.json())
        .then(function (data) {
            var scrollWrapper = document.getElementById('scrollWrapper');

            // Scroll MOVIL
            data.MOVIL.slice(0, 10).forEach(function (image) {
                var imgElement = document.createElement('img');
                imgElement.src = image.image;
                imgElement.alt = image.title;
                imgElement.classList.add('scroll-item');

                var enlaceMobile = document.createElement('a');
                enlaceMobile.href = image.url;
                enlaceMobile.target = '_self';
                enlaceMobile.appendChild(imgElement);

                scrollWrapper.appendChild(enlaceMobile);
            });
            // Duplicado para bucle infinito
            data.MOVIL.slice(0, 10).forEach(function (image) {
                var imgElement2 = document.createElement('img');
                imgElement2.src = image.image;
                imgElement2.alt = image.title;
                imgElement2.classList.add('scroll-item');

                var enlaceMobile2 = document.createElement('a');
                enlaceMobile2.href = image.url;
                enlaceMobile2.target = '_self';
                enlaceMobile2.appendChild(imgElement2);

                scrollWrapper.appendChild(enlaceMobile2);
            });

            var category = document.body.getAttribute("data-category");

            if (data[category]) {
                data[category].forEach(function (movie) {
                    var card = document.createElement('div');
                    card.classList.add('movie-card');

                    var link = document.createElement('a');
                    link.href = movie.url;
                    link.target = '_self';

                    var img = document.createElement('img');
                    img.src = movie.image;
                    img.alt = movie.title;

                    var overlay = document.createElement('div');
                    overlay.classList.add('title-overlay');
                    overlay.textContent = movie.title;

                    var titleDiv = document.createElement('div');
                    titleDiv.classList.add('movie-title');
                    titleDiv.textContent = movie.title;

                    link.appendChild(img);
                    link.appendChild(overlay);
                    link.appendChild(titleDiv);
                    card.appendChild(link);

                    infantilContainer.appendChild(card);
                    allInfantilCards.push(card);
                });
            }

            // ========================
            // Función de búsqueda global
            // ========================
            function showSearchPage(page) {
                var totalPages = Math.ceil(filteredResults.length / itemsPerPage);
                var start = (page - 1) * itemsPerPage;
                var end = start + itemsPerPage;
                filteredResults.forEach(function (card) { card.style.display = 'none'; });
                filteredResults.slice(start, end).forEach(function (card) { card.style.display = 'flex'; });

                renderPagination(page, totalPages, showSearchPage);
                paginationHeader.textContent = "PÁGINA " + page + " DE " + totalPages;
                paginationHeader.style.display = "block";

                // Guardar página actual de búsqueda
                localStorage.setItem(pageKey + "_lastSearchPage", page);
            }

            function filterMovies() {
                var query = searchInput.value.toLowerCase().trim();
                var resultMsg = document.getElementById('search-result-msg');
                var resultTitle = document.getElementById('search-result-title');
                var resultImage = document.getElementById('search-result-image');
                var resultNoResult = document.getElementById('search-result-noresult');
                var resultDesc = document.getElementById('search-result-desc');

                if (categoriaTitulo) categoriaTitulo.style.display = query === "" ? 'block' : 'none';

                if (query === "") {
                    allInfantilCards.forEach(card => card.style.display = 'flex');
                    pagination.style.display = "none";
                    mainPagination.style.display = "block";
                    resultMsg.style.display = "none";
                    paginationHeader.style.display = "none";
                    searchResultsContainer.innerHTML = "";

                    localStorage.removeItem(pageKey + "_lastSearchQuery");
                    localStorage.removeItem(pageKey + "_lastSearchPage");

                    // Volver a la página 1 de la categoría
                    showInfantilPage(1);

                    return;
                }

                localStorage.setItem(pageKey + "_lastSearchQuery", query);
                localStorage.setItem(pageKey + "_lastSearchPage", 1);

                allInfantilCards.forEach(card => card.style.display = 'none');
                mainPagination.style.display = "none";
                resultMsg.style.display = "block";
                searchResultsContainer.innerHTML = "";

                var matched = (data.TODAS || []).filter(p => p.title.toLowerCase().includes(query));
                filteredResults = [];

                matched.forEach(function (movie) {
                    var card = document.createElement('div');
                    card.classList.add('movie-card');

                    var link = document.createElement('a');
                    link.href = movie.url;
                    link.target = '_self';

                    var img = document.createElement('img');
                    img.src = movie.image;
                    img.alt = movie.title;

                    var overlay = document.createElement('div');
                    overlay.classList.add('title-overlay');
                    overlay.textContent = movie.title;

                    var titleDiv = document.createElement('div');
                    titleDiv.classList.add('movie-title');
                    titleDiv.textContent = movie.title;

                    link.appendChild(img);
                    link.appendChild(overlay);
                    link.appendChild(titleDiv);
                    card.appendChild(link);

                    filteredResults.push(card);
                    searchResultsContainer.appendChild(card);
                });

                resultTitle.textContent = "Resultados para: \"" + query + "\"";

                if (filteredResults.length > 0) {
                    resultImage.style.display = "none";
                    resultNoResult.textContent = "";
                    resultDesc.textContent = filteredResults.length + " resultados encontrados.";
                    showSearchPage(1);
                } else {
                    pagination.style.display = "none";
                    paginationHeader.style.display = "none";
                    resultImage.style.display = "block";
                    resultNoResult.textContent = "No se encontraron coincidencias";
                    resultDesc.textContent = "Lo sentimos, pero nada coincide con sus términos de búsqueda.";
                }
            }

            searchBtn.addEventListener('click', filterMovies);
            searchInput.addEventListener('keypress', function (e) {
                if (e.key === 'Enter') {
                    e.preventDefault();
                    filterMovies();
                }
            });

            // ========================
            // Restaurar búsqueda y página
            // ========================
            function restoreSearch() {
                var savedQuery = localStorage.getItem(pageKey + "_lastSearchQuery");
                var savedSearchPage = parseInt(localStorage.getItem(pageKey + "_lastSearchPage"), 10) || 1;
                var savedCategoryPage = parseInt(localStorage.getItem(pageKey + "_lastCategoryPage"), 10) || 1;

                if (savedQuery && savedQuery !== "") {
                    searchInput.value = savedQuery;
                    filterMovies();
                    if (filteredResults.length > 0) {
                        showSearchPage(savedSearchPage);
                    }
                } else {
                    // Mostrar página de categoría guardada
                    showInfantilPage(savedCategoryPage);
                }
            }

            restoreSearch();

            window.addEventListener("pageshow", function (event) {
                if (event.persisted) {
                    restoreSearch();
                }
            });
        })
        .catch(err => console.error("Error cargando JSON:", err));
});
