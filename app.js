const path = window.location.pathname;

// Ej: /drop1 → "drop1"
const dropName = path.replace("/", "") || "drop1";

// Ruta al JSON
const url = `drops/${dropName}.json`;

fetch(url)
  .then(res => res.json())
  .then(data => {
    document.getElementById("title").textContent = data.title;
    document.getElementById("description").textContent = data.description;
  })
  .catch(() => {
    document.getElementById("title").textContent = "Drop no encontrado";
    document.getElementById("description").textContent = "";
  });

  /*IMPORTANTE (GitHub Pages)

Aquí viene la parte crítica:

GitHub Pages no tiene routing real, así que:

/drop1 puede dar 404
Solución:

Usar query params en vez de rutas:

orbain.eus/?drop=drop1

Y cambias el JS:

const params = new URLSearchParams(window.location.search);
const dropName = params.get("drop") || "drop1";*/