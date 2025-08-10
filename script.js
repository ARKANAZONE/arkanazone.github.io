document.addEventListener("DOMContentLoaded", () => {
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

                scrollWrapper.appendChild(imgElement);
            });

            // Duplicar las imágenes para crear el efecto de bucle infinito
            mobileImages.forEach(image => {
                const imgElement = document.createElement('img');
                imgElement.src = image.image;
                imgElement.alt = image.title;
                imgElement.classList.add('scroll-item');

                scrollWrapper.appendChild(imgElement);
            });
        })
        .catch(error => {
            console.error('Error cargando el archivo JSON:', error);
        });
});
