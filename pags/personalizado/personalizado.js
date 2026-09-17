// Carga dinámica de Fabric.js desde CDN para manipulación de canvas
const loadFabric = () => {
  return new Promise((resolve, reject) => {
    if (window.fabric) return resolve(window.fabric);
    const script = document.createElement('script');
    script.src = 'https://cdnjs.cloudflare.com/ajax/libs/fabric.js/5.3.1/fabric.min.js';
    script.onload = () => resolve(window.fabric);
    script.onerror = reject;
    document.head.appendChild(script);
  });
};

document.addEventListener('DOMContentLoaded', async () => {
  const container = document.getElementById('mockup-tool');
  if (!container) return;

  await loadFabric();

  // Rutas de las imágenes base
  const prendas = {
    'camiseta-blanca': '/assets/personalizacion/camiseta-blanca.png',
    'camiseta-negra': '/assets/personalizacion/camiseta-negra.png',
    'sudadera-blanca': '/assets/personalizacion/sudadera-blanca.png',
    'sudadera-negra': '/assets/personalizacion/sudadera-negra.png'
  };

  // 1. Estructura HTML del editor
  container.innerHTML = `
    <div class="p-3 shadow-sm bg-dark text-white border-secondary">
      <div class="row g-3 mb-3">
        <div class="col-12 col-md-6">
          <label class="form-label fw-bold">1. Selecciona Prenda:</label>
          <select id="prenda-select" class="form-select bg-dark text-white border-secondary">
            <option value="camiseta-blanca">Camiseta Blanca</option>
            <option value="camiseta-negra">Camiseta Negra</option>
            <option value="sudadera-blanca">Sudadera Blanca</option>
            <option value="sudadera-negra">Sudadera Negra</option>
          </select>
        </div>
        <div class="col-12 col-md-6">
          <label class="form-label fw-bold">2. Subir Diseños:</label>
          <input type="file" id="design-input" class="form-control bg-dark text-white border-secondary" accept="image/*" multiple>
        </div>
      </div>

      <!-- Contenedor del Canvas -->
      <div class="d-flex justify-content-center align-items-center bg-dark rounded p-2 overflow-hidden position-relative" style="min-height: 450px;">
        <canvas id="canvas-mockup" class="position-relative mx-auto"></canvas>
      </div>

      <div class="d-flex justify-content-between align-items-center mt-3">
        <small class="text-secondary">Haz clic en un diseño para moverlo, escalarlo o rotarlo.</small>
        <div>
          <button id="btn-delete" class="btn btn-outline-danger btn-sm me-2">Eliminar Selección</button>
          <button id="btn-clear" class="btn btn-danger btn-sm">Limpiar Todo</button>
        </div>
      </div>
    </div>
  `;

  // 2. Inicialización del Canvas interactivo
  const canvasElement = document.getElementById('canvas-mockup');
  const canvasWidth = Math.min(container.clientWidth - 40, 500);
  const canvasHeight = canvasWidth * 1.2; // Proporción 1:1.2

  const canvas = new fabric.Canvas('canvas-mockup', {
    width: canvasWidth,
    height: canvasHeight,
    preserveObjectStacking: true
  });

  // 3. Función para cambiar la imagen de fondo de la prenda
  const cambiarPrenda = (keyPrenda) => {
    const imgUrl = prendas[keyPrenda];
    fabric.Image.fromURL(imgUrl, (img) => {
      // Ajustar escala de la prenda al canvas
      const scale = Math.min(canvas.width / img.width, canvas.height / img.height);
      img.set({
        scaleX: scale,
        scaleY: scale,
        selectable: false,
        evented: false,
        originX: 'center',
        originY: 'center',
        left: canvas.width / 2,
        top: canvas.height / 2
      });

      canvas.setBackgroundImage(img, canvas.renderAll.bind(canvas));
    });
  };

  // Cargar prenda inicial
  cambiarPrenda('camiseta-blanca');

  // Evento: Cambiar opción de prenda
  document.getElementById('prenda-select').addEventListener('change', (e) => {
    cambiarPrenda(e.target.value);
  });

  // 4. Evento: Subir uno o varios diseños del usuario
  document.getElementById('design-input').addEventListener('change', (e) => {
    const files = Array.from(e.target.files);

    files.forEach((file) => {
      const reader = new FileReader();
      reader.onload = (f) => {
        fabric.Image.fromURL(f.target.result, (img) => {
          // Escalar diseño a un tamaño razonable al insertarlo
          const maxDesignWidth = canvas.width * 0.35;
          if (img.width > maxDesignWidth) {
            img.scaleToWidth(maxDesignWidth);
          }

          img.set({
            left: canvas.width / 2 - (img.width * img.scaleX) / 2,
            top: canvas.height / 2 - (img.height * img.scaleY) / 2,
            cornerColor: '#0d6efd',
            cornerStyle: 'circle',
            transparentCorners: false
          });

          canvas.add(img);
          canvas.setActiveObject(img);
        });
      };
      reader.readAsDataURL(file);
    });

    e.target.value = ''; // Resetear input
  });

  // 5. Botones de control
  document.getElementById('btn-delete').addEventListener('click', () => {
    const activeObjects = canvas.getActiveObjects();
    activeObjects.forEach((obj) => canvas.remove(obj));
    canvas.discardActiveObject();
    canvas.renderAll();
  });

  document.getElementById('btn-clear').addEventListener('click', () => {
    canvas.getObjects().forEach((obj) => canvas.remove(obj));
    canvas.renderAll();
  });

  // Atajo de teclado: Tecla Supr / Delete elimina el objeto seleccionado
  window.addEventListener('keydown', (e) => {
    if ((e.key === 'Delete' || e.key === 'Backspace') && canvas.getActiveObject()) {
      // Evitar borrar si se está escribiendo en un input
      if (['INPUT', 'TEXTAREA', 'SELECT'].includes(document.activeElement.tagName)) return;
      
      const activeObjects = canvas.getActiveObjects();
      activeObjects.forEach((obj) => canvas.remove(obj));
      canvas.discardActiveObject();
      canvas.renderAll();
    }
  });
});