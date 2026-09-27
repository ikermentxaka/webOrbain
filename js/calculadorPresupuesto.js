const URL_PRECIOS = '/pags/calculadora-presupuesto/presupuesto.json';

document.addEventListener('DOMContentLoaded', () => {
  const seccion = document.getElementById('calculador-presupuesto');
  if (!seccion) return;

  const cantidad = document.getElementById('cantidad');
  const calidad = document.getElementById('calidad');
  const estampacion = document.getElementById('estampacion');
  const tamanoFrontal = document.getElementById('tamano-frontal');
  const campoTrasera = document.getElementById('campo-tamano-trasera');
  const tamanoTrasera = document.getElementById('tamano-trasera');
  const urgencia = document.getElementById('urgencia');
  const totalTexto = document.getElementById('total-texto');

  let precios = null;

  const euros = (n) => n.toLocaleString('es-ES', { style: 'currency', currency: 'EUR' });

  const calcular = () => {
    if (!precios) return;

    const prendas = parseInt(cantidad.value, 10);
    let estampa = precios.estampacion[tamanoFrontal.value];
    if (estampacion.value === 'ambas') {
      estampa += precios.estampacion[tamanoTrasera.value];
    }

    const total = (precios.prendas[calidad.value] + estampa) * prendas * precios.urgencia[urgencia.value];
    const unitario = total / prendas;
    const dias = precios.diasEntrega[urgencia.value];

    totalTexto.textContent = `${euros(total)} - ${euros(unitario)} por camiseta - Entrega en ${dias} días aproximadamente`;
  };

  estampacion.addEventListener('change', () => {
    campoTrasera.classList.toggle('d-none', estampacion.value !== 'ambas');
    calcular();
  });

  [cantidad, calidad, tamanoFrontal, tamanoTrasera, urgencia].forEach((campo) => {
    campo.addEventListener('change', calcular);
  });

  fetch(URL_PRECIOS)
    .then((res) => {
      if (!res.ok) throw new Error(res.status);
      return res.json();
    })
    .then((data) => {
      precios = data;
      calcular();
    })
    .catch(() => {
      totalTexto.textContent = 'No se han podido cargar los precios. Vuelve a intentarlo.';
    });
});
