document.addEventListener("DOMContentLoaded", () => {
    // Cargar el archivo JSON de imágenes
    fetch('data.json') // Asegúrate de que tu archivo JSON se llama 'data.json' y esté en la misma carpeta
        .then(response => response.json())
        .then(data => {
            const scrollWrapper = document.getElementById('scrollWrapper');

            // Cargar el logo desde el JSON
            const logoUrl = data.LOGO.slice(0, 1); // Asumimos que "LOGO" contiene solo un logo
            const logoElement = document.getElementById('logo');
            logoElement.src = logoUrl; // Establecer la URL del logo en la etiqueta <img>

            // Filtrar las imágenes de la categoría "MOVIL"
            const mobileImages = data.MOVIL.slice(0, 10);

            // Crear los elementos de las imágenes y añadirlas al contenedor
            mobileImages.forEach(image => {

            // Crear un enlace para la portada
            const linkElement = document.createElement('a');
            linkElement.href = image.url;  // Usar el campo "url" para el enlace
            linkElement.target = "_self";  // Abre el enlace en la misma ventana

            // Crear la imagen de la portada
            const imgElement = document.createElement('img');
            imgElement.src = image.image;  // Usando el campo "image" en tu JSON
            imgElement.alt = image.title; // Usando el campo "title" en tu JSON
            imgElement.classList.add('scroll-item');

            // Añadir la imagen al enlace
                linkElement.appendChild(imgElement);
                
           // Añadir el enlace al contenedor
                scrollWrapper.appendChild(linkElement);
            });

            // Duplicar las imágenes para crear el efecto de bucle infinito
            mobileImages.forEach(image => {

            const linkElement = document.createElement('a');
            linkElement.href = image.url;
            linkElement.target = "_self";

                const imgElement = document.createElement('img');
                imgElement.src = image.image;
                imgElement.alt = image.title;
                imgElement.classList.add('scroll-item');

                linkElement.appendChild(imgElement);
                scrollWrapper.appendChild(linkElement);
            });
        })
        .catch(error => {
            console.error('Error cargando el archivo JSON:', error);
        });
});
