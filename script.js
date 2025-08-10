document.addEventListener("DOMContentLoaded", () => {
         fetch('data.json')                                                 
        .then(response => response.json())
        .then(data => {
            const logoLeft = data.LOGO_LEFT[0];                             
            const logoLeftElement = document.createElement('img');          
            logoLeftElement.src = logoLeft.image;                           
            logoLeftElement.alt = logoLeft.title;                           
            logoLeftElement.classList.add('logo');                          
            const enlace = document.createElement('a');                  
            enlace.href = logoLeft.url;                                  
            enlace.target = '_self';                                       
           enlace.appendChild(logoLeftElement);                             
           scrollWrapper.appendChild(enlace);                              
            const logoRight = data.LOGO_RIGHT[0];                             
            const logoRightElement = document.createElement('img');         
            logoRightElement.src = logoRight.image;                          
            logoRightElement.alt = logoRight.title;                           
            logoRightElement.classList.add('logo');                          
            const enlace = document.createElement('a');                     
            enlace.href = logoRight.url;                                     
            enlace.target = '_self';                                        
           enlace.appendChild(logoRightElement);                          
           scrollWrapper.appendChild(enlace);                              
            const mobileImages = data.MOVIL.slice(0, 10);                   
            const scrollWrapper = document.getElementById('scrollWrapper'); 
            mobileImages.forEach(image => {                                 
            const imgElement = document.createElement('img');               
            imgElement.src = image.image;                                   
            imgElement.alt = image.title;                                  
            imgElement.classList.add('scroll-item');                        
           const enlace = document.createElement('a');                    
            enlace.href = image.url;                                       
            enlace.target = '_self';                                      

           enlace.appendChild(imgElement);                                 
           scrollWrapper.appendChild(enlace);                             
});
            mobileImages.forEach(image => {                                 
            const imgElement = document.createElement('img');               
            imgElement.src = image.image;                                   
            imgElement.alt = image.title;                                 
            imgElement.classList.add('scroll-item');                        
            const enlace = document.createElement('a');                    
            enlace.href = image.url;                                       
            enlace.target = '_self';                                       
           enlace.appendChild(imgElement);                                 
           scrollWrapper.appendChild(enlace);                              
        });
})
        .catch(error => {
            console.error('Error cargando el archivo JSON:', error);
        });
});
