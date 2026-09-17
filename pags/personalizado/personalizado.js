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

  const prendas = {
    'camiseta-blanca': '/assets/personalizacion/camiseta-blanca.png',
    'camiseta-negra': '/assets/personalizacion/camiseta-negra.png',
    'sudadera-blanca': '/assets/personalizacion/sudadera-blanca.png',
    'sudadera-negra': '/assets/personalizacion/sudadera-negra.png'
  };

  // Layout optimizado para pantallas pequeñas
  container.innerHTML = `
    <div class="p-3 shadow-sm bg-dark text-white rounded border border-secondary">
      <div class="row g-2 mb-3">
        <div class="col-12 col-sm-6">
          <label class="form-label fw-bold small">1. Selecciona Prenda:</label>
          <select id="prenda-select" class="form-select form-select-sm bg-dark text-white border-secondary">
            <option value="camiseta-blanca">Camiseta Blanca</option>
            <option value="camiseta-negra">Camiseta Negra</option>
            <option value="sudadera-blanca">Sudadera Blanca</option>
            <option value="sudadera-negra">Sudadera Negra</option>
          </select>
        </div>
        <div class="col-12 col-sm-6">
          <label class="form-label fw-bold small">2. Subir Diseños:</label>
          <input type="file" id="design-input" class="form-control form-control-sm bg-dark text-white border-secondary" accept="image/*" multiple>
        </div>
      </div>

      <!-- Contenedor con límites de dimensiones garantizados -->
      <div id="canvas-container" class="d-flex justify-content-center align-items-center bg-black rounded p-1 overflow-hidden position-relative w-100">
        <canvas id="canvas-mockup"></canvas>
      </div>

      <div class="d-flex flex-column  justify-content-between align-items-center mt-3 gap-2">
        <small class="text-secondary text-center text-sm-start small">Toca un diseño para moverlo, escalarlo o rotarlo.</small>
        <div class="d-flex gap-2 w-100 w-sm-auto justify-content-center">
          <button id="btn-delete" class="btn btn-outline-danger btn-sm flex-fill flex-sm-grow-0">Eliminar</button>
          <button id="btn-clear" class="btn btn-danger btn-sm flex-fill flex-sm-grow-0">Limpiar Todo</button>
        </div>
      </div>
    </div>
  `;

  const canvasContainer = document.getElementById('canvas-container');

  // Cálculo seguro del ancho del Canvas (mínimo 280px, máximo 500px)
  const getCanvasWidth = () => {
    const parentWidth = canvasContainer.clientWidth || container.clientWidth || 300;
    return Math.max(280, Math.min(parentWidth - 10, 500));
  };

  const initialWidth = getCanvasWidth();
  const canvas = new fabric.Canvas('canvas-mockup', {
    width: initialWidth,
    height: initialWidth * 1.2,
    preserveObjectStacking: true
  });

  // Cambiar la imagen de la prenda
  const cambiarPrenda = (keyPrenda) => {
    const imgUrl = prendas[keyPrenda];
    fabric.Image.fromURL(imgUrl, (img) => {
      if (!img) return;
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

  cambiarPrenda('camiseta-blanca');

  document.getElementById('prenda-select').addEventListener('change', (e) => {
    cambiarPrenda(e.target.value);
  });

  // Subir diseños del usuario
  document.getElementById('design-input').addEventListener('change', (e) => {
    const files = Array.from(e.target.files);

    files.forEach((file) => {
      const reader = new FileReader();
      reader.onload = (f) => {
        fabric.Image.fromURL(f.target.result, (img) => {
          if (!img) return;
          const maxDesignWidth = canvas.width * 0.35;
          if (img.width > maxDesignWidth) {
            img.scaleToWidth(maxDesignWidth);
          }

          img.set({
            left: canvas.width / 2 - (img.width * img.scaleX) / 2,
            top: canvas.height / 2 - (img.height * img.scaleY) / 2,
            cornerColor: '#0d6efd',
            cornerSize: 14,
            transparentCorners: false
          });

          canvas.add(img);
          canvas.setActiveObject(img);
        });
      };
      reader.readAsDataURL(file);
    });

    e.target.value = '';
  });

  // Botones de acción
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

  // Recálculo dinámico al girar el móvil o redimensionar la ventana
  window.addEventListener('resize', () => {
    const newWidth = getCanvasWidth();
    if (Math.abs(newWidth - canvas.width) < 10) return;

    const scaleFactor = newWidth / canvas.width;
    canvas.setWidth(newWidth);
    canvas.setHeight(newWidth * 1.2);

    if (canvas.backgroundImage) {
      const bg = canvas.backgroundImage;
      const bgScale = Math.min(canvas.width / bg.width, canvas.height / bg.height);
      bg.set({
        scaleX: bgScale,
        scaleY: bgScale,
        left: canvas.width / 2,
        top: canvas.height / 2
      });
    }

    canvas.getObjects().forEach((obj) => {
      obj.set({
        left: obj.left * scaleFactor,
        top: obj.top * scaleFactor,
        scaleX: obj.scaleX * scaleFactor,
        scaleY: obj.scaleY * scaleFactor
      });
      obj.setCoords();
    });

    canvas.renderAll();
  });

  // Atajo de teclado para PC
  window.addEventListener('keydown', (e) => {
    if ((e.key === 'Delete' || e.key === 'Backspace') && canvas.getActiveObject()) {
      if (['INPUT', 'TEXTAREA', 'SELECT'].includes(document.activeElement.tagName)) return;
      const activeObjects = canvas.getActiveObjects();
      activeObjects.forEach((obj) => canvas.remove(obj));
      canvas.discardActiveObject();
      canvas.renderAll();
    }
  });
});