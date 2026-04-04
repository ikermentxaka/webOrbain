/*//Este dibuja en el directorio*/
/*fetch es una api para hacer peticiones http, aqui la usamos para obtener el json*/
fetch('/drops/data/drops.json')
/*Esta es la estrctura básica en un fetch, habiendo un response y un data*/
  .then(res => res.json())
  .then(data => {/*Crea la referencia container al elemento html con ese id*/
    const container = document.getElementById('drops-container');
//data.drops es un array
    data.drops.forEach(drop => {
      const card = document.createElement('a');
      card.href = drop.link;

/*innerHtml establece el html de un elemento*/
      card.innerHTML = `
        <div class="card" id="card">
          <img src="../drops/data/${drop.image}" />
          <h2>${drop.title}</h2>
        </div>
      `;
/*El metodo appendChild inserta un elememto hijo al elemento seleccionado.

En este caso en cada vuelta, se introduce una card.*/
      container.appendChild(card);
    });
  });