document.addEventListener("DOMContentLoaded", () => {

// Cargar el archivo JSON de imágenes
         fetch('data.json')                                                 // Tu archivo JSON se llama 'data.json' y esté en la misma carpeta
        .then(response => response.json())
        .then(data => {

// Insertar el logo izquierdo
            const logoLeft = data.LOGO_LEFT[0];                             // Cargar el primer objeto de la lista LOGO_LEFT del JSON data
            const logoLeftElement = document.createElement('img');          // Crea un nuevo elemento <img> en memoria en el contenedor logoLeftElement
            logoLeftElement.src = logoLeft.image;                           // Usa el campo "image" en tu JSON con el contenedor logoLeftElement
            logoLeftElement.alt = logoLeft.title;                           // Usa el campo "title" en tu JSON con el contenedor logoLeftElement
            logoLeftElement.classList.add('logo');                          // Le añade una clase CSS llamada logo, para aplicar estilos.

// Crear el enlace <a> para el logo
            const enlaceLeft = document.createElement('a');                     // Crea el enlace
            enlaceLeft.href = logoLeft.url;                                     // Poner la URL que permite acceder la imagen del logo
            enlaceLeft.target = '_self';                                        // Opcional: abrir en la misma pestaña

           enlaceLeft.appendChild(logoLeftElement);                             // Poner la imagen dentro del enlace
           document.getElementById('logo-left').appendChild(enlaceLeft);        // Agregar el enlace (con imagen) al contenedor

// Insertar el logo derecho
            const logoRight = data.LOGO_RIGHT[0];                             // Cargar el primer objeto de la lista LOGO_LEFT del JSON data
            const logoRightElement = document.createElement('img');          // Crea un nuevo elemento <img> en memoria en el contenedor logoLeftElement
            logoRightElement.src = logoRight.image;                           // Usa el campo "image" en tu JSON con el contenedor logoLeftElement
            logoRightElement.alt = logoRight.title;                           // Usa el campo "title" en tu JSON con el contenedor logoLeftElement
            logoRightElement.classList.add('logo');                          // Le añade una clase CSS llamada logo, para aplicar estilos.

// Crear el enlace <a> para el logo
            const enlaceRight = document.createElement('a');                     // Crea el enlace
            enlaceRight.href = logoRight.url;                                     // Poner la URL que permite acceder la imagen del logo
            enlaceRight.target = '_self';                                        // Opcional: abrir en la misma pestaña

           enlaceRight.appendChild(logoRightElement);                             // Poner la imagen dentro del enlace
           document.getElementById('logo-right').appendChild(enlaceRight);       // Asegúrate de agregarlo en el contenedor adecuado

// Insertar las diez portadas moviles
            const mobileImages = data.MOVIL.slice(0, 10);                   // Filtrar los 10 primeros objetos de la categoría MOVIL del JSON data
            const scrollWrapper = document.getElementById('scrollWrapper'); // Busca en el DOM un elemento con id="scrollWrapper", con las imágenes móviles
            mobileImages.forEach(image => {                                 // Crear los elementos de las imágenes y añadirlas al contenedor image
            const imgElement = document.createElement('img');               // Crea un nuevo elemento <img> en memoria en el contenedor imgElement
            imgElement.src = image.image;                                   // Usa el campo "image" en tu JSON con el contenedor image
            imgElement.alt = image.title;                                   // Usa el campo "title" en tu JSON con el contenedor image
            imgElement.classList.add('scroll-item');                        // Le añade una clase CSS llamada scroll-item, para aplicar estilos

// Crear el enlace <a> para las portadas moviles
            const enlaceMobile = document.createElement('a');                    // Crea el enlace
            enlaceMobile.href = image.url;                                       // Poner la URL que permite acceder la imagen de la pelicula
            enlaceMobile.target = '_self';                                       // Opcional: abrir en la misma pestaña

           enlaceMobile.appendChild(imgElement);                                 // Poner la imagen dentro del enlace
           scrollWrapper.appendChild(enlaceMobile);                              // Agregar el enlace (con imagen) al contenedor
});

// Duplicar las imágenes para crear el efecto de bucle infinito
            mobileImages.forEach(image => {                                 // Crear los elementos de las imágenes y añadirlas al contenedor image
            const imgElement = document.createElement('img');               // Crea un nuevo elemento <img> en memoria en el contenedor imgElement
            imgElement.src = image.image;                                   // Usa el campo "image" en tu JSON con el contenedor image
            imgElement.alt = image.title;                                   // Usa el campo "title" en tu JSON con el contenedor image
            imgElement.classList.add('scroll-item');                        // Le añade una clase CSS llamada scroll-item, para aplicar estilos

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
