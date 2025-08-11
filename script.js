document.addEventListener("DOMContentLoaded", () => {

// Hacer visible el banner (texto + logos)
    document.getElementById('banner').classList.add('visible');

    // Cargar el archivo JSON de imágenes
    fetch('data.json') // Asegúrate de que tu archivo JSON se llama 'data.json' y esté en la misma carpeta
        .then(response => response.json())
        .then(data => {
            const scrollWrapper = document.getElementById('scrollWrapper');

            // Filtrar las imágenes de la categoría "MOVIL"
            const mobileImages = data.MOVIL.slice(0, 10);

            // Crear los elementos de las imágenes y añadirlas al contenedor
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
            });

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
        })
        .catch(error => {
            console.error('Error cargando el archivo JSON:', error);
        });
});
