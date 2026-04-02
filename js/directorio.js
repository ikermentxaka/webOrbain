/*//Este dibuja en el directorio*/

fetch('/drops/data/drops.json')
  .then(res => res.json())
  .then(data => {
    const container = document.getElementById('drops-container');

    data.drops.forEach(drop => {
      const card = document.createElement('a');
      card.href = drop.link;

      card.innerHTML = `
        <div class="card" id="card">
          <img src="../drops/data/${drop.image}" />
          <h2>${drop.title}</h2>
        </div>
      `;

      container.appendChild(card);
    });
  });