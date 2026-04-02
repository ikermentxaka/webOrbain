const params = new URLSearchParams(window.location.search);
const dropId = params.get('drop');

fetch(`/drops/data/${dropId}.json`)
  .then(res => res.json())
  .then(data => {
    document.getElementById('title').textContent = data.title;
    document.getElementById('description').textContent = data.description;
     const carousel = document.getElementById('fotosCarousel');

    data.images.forEach((src, index) => {
      const item = document.createElement('div');
      item.classList.add('carousel-item');

      if (index === 0) {
        item.classList.add('active'); // Bootstrap necesita esto
      }

      item.innerHTML = `
        <img src="${src}" class="d-block w-100" alt="imagen drop">
      `;

      carousel.appendChild(item);
    });
  });