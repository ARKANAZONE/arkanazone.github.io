document.addEventListener("DOMContentLoaded", function () {
  // ====== Config & common refs ======
  var pageKey = location.pathname;
  var banner = document.getElementById("banner");
  if (banner) banner.classList.add("visible");

  var searchInput = document.getElementById("searchInput");
  var searchBtn = document.getElementById("searchBtn");
  var pagination = document.getElementById("pagination");
  var paginationHeader = document.getElementById("pagination-header");
  var searchResultsContainer = document.getElementById("searchResultsContainer");
  var infantilContainer = document.getElementById("infantilContainer");
  var categoriaTitulo = document.getElementById("categoriaTitulo");
  var mainPagination = document.getElementById("main-pagination");

  var itemsPerPage = 10;
  var filteredResults = [];
  var baseCards = [];
  var isRestoring = false;
  var isHome = (document.body.getAttribute("data-category") === "HOME");

  // ====== URL Helpers ======
  function getParam(name) {
    var url = new URL(window.location.href);
    return url.searchParams.get(name);
  }

  function getPageParam() {
    var p = parseInt(getParam("page"), 10);
    return isNaN(p) || p < 1 ? 1 : p;
  }

  function setParams(params) {
    if (isRestoring) return;
    var url = new URL(window.location.href);
    Object.keys(params).forEach(function (k) {
      var v = params[k];
      if (v === null || v === undefined || v === "") url.searchParams.delete(k);
      else url.searchParams.set(k, v);
    });
    history.pushState({}, "", url.toString());
  }

  // ====== Visita counter ======
  (function () {
    var KEY = "visitCount";
    var LAST = "lastVisitUpdate";
    var now = Date.now();
    var last = parseInt(localStorage.getItem(LAST) || "0", 10);
    var count = parseInt(localStorage.getItem(KEY) || "0", 10);
    if (!last || (now - last) > 60000) {
      count += 1;
      localStorage.setItem(KEY, String(count));
      localStorage.setItem(LAST, String(now));
    }
    var span = document.getElementById("visitCount");
    if (span) span.textContent = String(count).padStart(8, "0");
  })();

  // ====== Pagination ======
  function renderPagination(currentPage, totalPages, onPageChange) {
    pagination.innerHTML = "";
    if (totalPages <= 1) {
      pagination.style.display = "none";
      return;
    }
    pagination.style.display = "block";

    function link(text, page, isActive, disabled, isDots) {
      var a = document.createElement("a");
      a.textContent = text;
      a.href = "#";
      a.style.cssText =
        "padding:6px 12px; background:" + (isActive ? "#00aaff" : "#222") +
        "; color:#fff; text-decoration:none; border-radius:4px; border:2px solid #00aaff; margin:2px; font-weight:bold; font-family:sans-serif;" +
        "opacity:" + (disabled ? "0.5" : "1") + ";" +
        "pointer-events:" + (disabled ? "none" : "auto") + ";";

      a.addEventListener("click", function (e) {
        e.preventDefault();
        if (!disabled && !isDots && page) onPageChange(page);
      });
      return a;
    }

    if (currentPage > 1) pagination.appendChild(link("Anterior", currentPage - 1));
    if (currentPage > 3) {
      pagination.appendChild(link("1", 1));
      if (currentPage > 4) pagination.appendChild(link("...", null, false, true, true));
    }

    for (var i = Math.max(1, currentPage - 2); i <= Math.min(totalPages, currentPage + 2); i++) {
      pagination.appendChild(link(String(i), i, i === currentPage));
    }

    if (currentPage < totalPages - 2) {
      if (currentPage < totalPages - 3) pagination.appendChild(link("...", null, false, true, true));
      pagination.appendChild(link(String(totalPages), totalPages));
    }

    if (currentPage < totalPages) pagination.appendChild(link("Siguiente", currentPage + 1));
  }

  // ====== Home Section Titles Toggle ======
  function toggleHomeSectionTitles(show) {
    if (!isHome || !infantilContainer) return;
    var titles = infantilContainer.querySelectorAll(".categoria-titulo");
    titles.forEach(function (el) {
      if (el.id !== "categoriaTitulo") el.style.display = show ? "block" : "none";
    });
  }

  // ====== Render Home Sections ======
  function renderHomeSections(data) {
    if (categoriaTitulo) categoriaTitulo.style.display = "none";
    if (paginationHeader) paginationHeader.style.display = "none";
    if (pagination) pagination.style.display = "none";
    if (mainPagination) mainPagination.style.display = "none";

    var sections = [
      "ESTRENOS",
      "RECOMENDADAS",
      "DESTACADOS",
      "CLÁSICOS DE TODOS LOS TIEMPOS",
      "BASADAS EN HECHOS REALES"
    ];

    sections.forEach(function (key) {
      var arr = data[key] || [];
      if (!arr.length) return;

      var h2 = document.createElement("div");
      h2.className = "categoria-titulo";
      h2.textContent = key;
      infantilContainer.appendChild(h2);

      var grid = document.createElement("div");
      grid.style.display = "flex";
      grid.style.flexWrap = "wrap";
      grid.style.gap = "10px";
      infantilContainer.appendChild(grid);

      arr.forEach(function (movie) {
        var card = createMovieCard(movie);
        grid.appendChild(card);
        baseCards.push(card);
      });
    });

    toggleHomeSectionTitles(true);
  }

  // ====== Render Category ======
  function renderCategory(data, category) {
    (data[category] || []).forEach(function (movie) {
      var card = createMovieCard(movie);
      infantilContainer.appendChild(card);
      baseCards.push(card);
    });
  }

  // ====== Create Movie Card (reutilizable) ======
  function createMovieCard(movie) {
    var card = document.createElement("div");
    card.classList.add("movie-card");
    card.style.position = "relative";

    var link = document.createElement("a");
    link.href = movie.url;
    link.target = "_self";

    var img = document.createElement("img");
    img.src = movie.image;
    img.alt = movie.title;

    var overlay = document.createElement("div");
    overlay.classList.add("title-overlay");
    overlay.textContent = movie.title;

    var titleDiv = document.createElement("div");
    titleDiv.classList.add("movie-title");
    titleDiv.textContent = movie.title;

    var infoDiv = document.createElement("div");
    infoDiv.classList.add("movie-info");
    infoDiv.innerHTML = '<span class="quality">' + (movie.quality || '') +
                        '</span><span class="year">' + (movie.year || '') + '</span>';

// Agregar la puntuación IMDB
    var imdbRatingDiv = document.createElement("div");
    imdbRatingDiv.classList.add("imdb-rating");
    imdbRatingDiv.textContent = movie.imdbRating; // Solo el número

// Ubicar la puntuación IMDb en la parte inferior derecha dentro de un círculo
    imdbRatingDiv.style.position = "absolute";
    imdbRatingDiv.style.bottom = "10px"; // Ajusta según el espacio deseado
    imdbRatingDiv.style.right = "10px"; // Ajusta según el espacio deseado


    link.appendChild(img);
    link.appendChild(overlay);
    card.appendChild(link);
    card.appendChild(infoDiv);
    card.appendChild(titleDiv);
    card.appendChild(imdbRatingDiv); // Añadir la puntuación IMDb a la tarjeta

    return card;
  }

  // ====== Show Category Page ======
  function showCategoryPage(page) {
    var totalPages = Math.ceil(baseCards.length / itemsPerPage) || 1;
    var start = (page - 1) * itemsPerPage;
    var end = start + itemsPerPage;

    baseCards.forEach(function (card, i) {
      card.style.display = (i >= start && i < end) ? "flex" : "none";
    });

    if (isHome) {
      if (mainPagination) mainPagination.style.display = "none";
      return;
    }

    if (mainPagination) {
      mainPagination.innerHTML = "";
      mainPagination.style.display = "block";

      var header = document.createElement("div");
      header.textContent = "PÁGINA " + page + " DE " + totalPages;
      header.style.textAlign = "center";
      header.style.marginBottom = "6px";
      mainPagination.appendChild(header);
    }

    renderPagination(page, totalPages, function (p) {
      setParams({ page: p });
      showCategoryPage(p);
    });
  }

  // ====== Show Search Results Page ======
  function showSearchPage(page) {
    var totalPages = Math.ceil(filteredResults.length / itemsPerPage) || 1;
    var start = (page - 1) * itemsPerPage;
    var end = start + itemsPerPage;

    filteredResults.forEach(function (card) {
      card.style.display = "none";
    });

    filteredResults.slice(start, end).forEach(function (card) {
      card.style.display = "flex";
    });

    renderPagination(page, totalPages, function (p) {
      var q = getParam("s") || (searchInput.value || "").trim();
      setParams({ s: q, page: p });
      localStorage.setItem(pageKey + "_lastSearchPage", String(p));
      showSearchPage(p);
    });

    if (paginationHeader) {
      paginationHeader.textContent = "PÁGINA " + page + " DE " + totalPages;
      paginationHeader.style.display = "block";
    }
  }

  // ====== Apply Search ======
  function applySearch(data) {
    var query = (searchInput.value || "").toLowerCase().trim();
    var msg = document.getElementById("search-result-msg");
    var title = document.getElementById("search-result-title");
    var img = document.getElementById("search-result-image");
    var nores = document.getElementById("search-result-noresult");
    var desc = document.getElementById("search-result-desc");

    if (categoriaTitulo) categoriaTitulo.style.display = query === "" ? (isHome ? "none" : "block") : "none";
    if (isHome) toggleHomeSectionTitles(query === "");

    if (query === "") {
      baseCards.forEach(function (c) { c.style.display = "flex"; });
      if (pagination) pagination.style.display = "none";
      if (paginationHeader) paginationHeader.style.display = "none";
      if (msg) msg.style.display = "none";
      if (searchResultsContainer) searchResultsContainer.innerHTML = "";
      localStorage.removeItem(pageKey + "_lastSearchQuery");
      localStorage.removeItem(pageKey + "_lastSearchPage");
      if (!isHome) showCategoryPage(1);
      setParams({ s: null, page: null });
      return;
    }

    localStorage.setItem(pageKey + "_lastSearchQuery", query);
    localStorage.setItem(pageKey + "_lastSearchPage", "1");

    baseCards.forEach(function (c) { c.style.display = "none"; });
    if (mainPagination) mainPagination.style.display = "none";
    if (msg) msg.style.display = "block";
    if (searchResultsContainer) searchResultsContainer.innerHTML = "";

    filteredResults = [];

    var matched = (data.TODAS || []).filter(function (p) {
      return (p.title || "").toLowerCase().includes(query);
    });

    matched.forEach(function (movie) {
      var card = createMovieCard(movie);
      searchResultsContainer.appendChild(card);
      filteredResults.push(card);
    });

    title.textContent = 'Resultados para: "' + query + '"';
    var startPage = isRestoring ? (getPageParam() || 1) : 1;

    if (filteredResults.length > 0) {
      setParams({ s: query, page: startPage });
      img.style.display = "none";
      nores.textContent = "";
      desc.textContent = filteredResults.length + " resultados encontrados.";
      showSearchPage(startPage);
    } else {
      setParams({ s: query, page: null });
      if (pagination) pagination.style.display = "none";
      if (paginationHeader) paginationHeader.style.display = "none";
      img.style.display = "block";
      nores.textContent = "No se encontraron coincidencias";
      desc.textContent = "Lo sentimos, pero nada coincide con sus términos de búsqueda.";
    }
  }

  // ====== Carousel ======
  function renderCarousel(data) {
    var scrollWrapper = document.getElementById("scrollWrapper");
    if (!scrollWrapper) return;

    function add(image) {
      var div = document.createElement("div");
      div.classList.add("scroll-item");

      var img = document.createElement("img");
      img.src = image.image;
      img.alt = image.title;
      div.appendChild(img);

      var infoDiv = document.createElement("div");
      infoDiv.classList.add("movie-info");
      infoDiv.innerHTML = '<span class="quality">' + (image.quality || '') + '</span><span class="year">' + (image.year || '') + '</span>';
      div.appendChild(infoDiv);

      var a = document.createElement("a");
      a.href = image.url;
      a.target = "_self";
      a.appendChild(div);
      scrollWrapper.appendChild(a);
    }

    (data.MOVIL || []).slice(0, 10).forEach(add);
    (data.MOVIL || []).slice(0, 10).forEach(add); // duplicado
  }

  // Restaura SOLO desde la URL. Si no hay ?s=, muestra la vista base.
// (No lee localStorage al iniciar.)
function restoreState(data) {
    var s = getParam("s");
    var p = getPageParam();

    if (s && s !== "") {
        // Restaurar búsqueda desde la URL
        isRestoring = true;
        if (searchInput) searchInput.value = s;
        applySearch(data);
        isRestoring = false;
        if (filteredResults.length > 0) showSearchPage(p || 1);
        return;
    }

    // Sin parámetros → vista base
    if (isHome) {
        // Home sin paginación
        baseCards.forEach(function (c) { c.style.display = "flex"; });
        if (pagination) pagination.style.display = "none";
        if (paginationHeader) paginationHeader.style.display = "none";
        if (mainPagination) mainPagination.style.display = "none";
        if (categoriaTitulo) categoriaTitulo.style.display = "none";
        toggleHomeSectionTitles(true);
    } else {
        // Categoría con paginación
        showCategoryPage(p || 1);
    }
}


  // ====== Load data.json and init ======
  var jsonPath = (location.pathname.includes("/peliculas/") || location.pathname.includes("/series/")) ? "../data.json" : "data.json";

  fetch(jsonPath)
    .then(function (r) { return r.json(); })
    .then(function (data) {
      renderCarousel(data);
      var category = document.body.getAttribute("data-category");
      if (isHome) {
        renderHomeSections(data);
      } else if (data[category]) {
        renderCategory(data, category);
      }

      if (searchBtn) searchBtn.addEventListener("click", function () { applySearch(data); });
      if (searchInput) searchInput.addEventListener("keypress", function (e) {
        if (e.key === "Enter") {
          e.preventDefault();
          applySearch(data);
        }
      });

      restoreState(data);

      window.addEventListener("popstate", function () {
        var s = getParam("s");
        var p = getPageParam();
        if (s && s !== "") {
          isRestoring = true;
          searchInput.value = s;
          applySearch(data);
          isRestoring = false;
          if (filteredResults.length > 0) showSearchPage(p);
        } else {
          var msg = document.getElementById("search-result-msg");
          if (msg) msg.style.display = "none";
          if (pagination) pagination.style.display = "none";
          if (paginationHeader) paginationHeader.style.display = "none";
          if (searchResultsContainer) searchResultsContainer.innerHTML = "";

          if (isHome) {
            baseCards.forEach(function (c) { c.style.display = "flex"; });
            toggleHomeSectionTitles(true);
            if (mainPagination) mainPagination.style.display = "none";
            if (categoriaTitulo) categoriaTitulo.style.display = "none";
          } else {
            if (categoriaTitulo) categoriaTitulo.style.display = "block";
            showCategoryPage(p || 1);
          }
        }
      });
    })
    .catch(function (err) {
      console.error("Error cargando JSON:", err);
    });
});
