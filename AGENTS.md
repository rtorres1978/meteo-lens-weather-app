Proyecto: Aplicacion web del tiempo

Rol del agents: Dessarrollador web experto con 12 años de experiencia en desarrollo web y 5 años de experiencia en desarrollo de aplicaciones móviles. 

Objetivo: Crear una aplicacion web que permita ver el tiempo de cualquier ciudad del mundo de forma sencilla y rapida. consumiendo un api rest externa y dando la posibilidad de ver el tiempo actual y el tiempo de los proximos 24 horas y dando la posibilidad de guardar las diferentes ciuadades en el localstorage para poder verlas posteriormente.

URL del api a consumir (no requiere authenticacion ni api key):

https://open-meteo.com/

Funcionalidades de la aplicacion:

- Busqueda de ciudad:
    - input para buscar la ciudad
    - boton de buscar
    - mensaje si la ciudad no existe
    - dar sugerencias de ciudad mientras escribimos

- Clima actual:
    - Nombre de la Ciudad
    - Temperatura actual
    - Descripcion del clima (soleado, nublado, lluvioso, etc)
    - Humedad
    - Velocidad del viento
    - Sensacion termica
    - Hora de la ultima actualizacion
    - Icono representativo del clima actual

        
- Clima por horas:
    - Nombre de la Ciudad
    - Temperatura por horas
    - Descripcion del clima por horas
    - Icono representativo del clima por horas
    - Hora
    - Boton para guardar la ciudad
        
- Localidad guardadas:
    - Boton guardar Ciudad
    - Boton eliminar Ciudad
    - Boton de ver pronostico de las proximas 24 horas
    - Boton de ver clima actual
    - Boton de ver clima por horas
    - Listas de ciudades guardadas
    - Eliminar Ciudad
    - Evitar para guardar duplicados

- Consideraciones importantes:
    - La parte de gestionar las localidades, asi como la parte de añadir localidades, debe hacerse en una ventana modal.
    - Aparte tendre el buscador para buscar el tiempo de nuevas localidades.
    - El diseño de la ventana modal debe ser el mismo que el diseño de la aplicacion web.
    - Una vez que tenga guardadas las localidades, podre ir dando click en cada una de ellas para ver el tiempo actual y el tiempo de los proximos 24 horas.


Stack de tecnologias:
- HTML5
- CSS3 (sin frameworks)
- JavaScript Vanilla, sin frameworks

Preferencias generales importantes:

- Todos los textos visibles en la aplicación web debe estar en Español


Preferencia de diseño:
- Basate en las imagenes del diseño y en el HTML del diseño que tienes en la carpeta design del proyecto

Preferencias de estilos:
- Eliminar TailwindCSS y pasarlo todo a CSS nativo.
- Colores (los del diseño)
- Uso de medidas con rem, usando un font-size base de 10px
- Uso de HTML5 y CSS3 nativo (sin tailwind, sin frameworks)
- Usa buenas practicas de maquetacion css y si es necesario usa flexbox y css grid layaut.
- usa el font-size en rem, con un font-size base de 10px.
- que webapp sea responsive y se vea bien en dispositivos moviles, tablets y computadoras.

Preferencias de codigo:

- Usa buenas practicas de programacion
- HTML debe der semantico
- No uses alert, confirm, promt, todo el feedback debe ser visual en el Dom.
- Usa comentarios en el codigo para explicar el funcionamiento de las funciones.
- No uses innerHTML, todo el contenidp debe ser insertado con appendChild, o previamente creado un elemento con document.createElement.
- Cuidado con olvidar prevenir el default de los eventos en submits o clicks
- Prioriza el codigo legible y bien estructurado.
- Prioriza que el codigo sea sencillo de entender.
- Si el agente no entiende algo, debe preguntar antes de continuar.
- Si el agente comete un error, debe corregirlo antes de continuar.

Estructura de archivos:

- carpeta(design – contiene los diseños)
- carpeta(assets)
- carpeta(css)
- carpeta(js)
- carpeta(img)
- index.html
- AGENTS.md 
