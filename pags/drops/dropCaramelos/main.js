import * as THREE from 'https://cdn.jsdelivr.net/npm/three@0.160.0/build/three.module.js';
import { OrbitControls } from 'https://cdn.jsdelivr.net/npm/three@0.160.0/examples/jsm/controls/OrbitControls.js?module';
import { GLTFLoader } from 'https://cdn.jsdelivr.net/npm/three@0.160.0/examples/jsm/loaders/GLTFLoader.js?module';
//Para las texturas de reflejo
import { RGBELoader } from 'https://cdn.jsdelivr.net/npm/three@0.160.0/examples/jsm/loaders/RGBELoader.js?module';

const rgbeLoader = new RGBELoader();

// 1. OBTENER EL CONTENEDOR LOCAL
// Guardamos la referencia al div para usar sus medidas reales en vez de las de la pantalla
const contenedor = document.getElementById("container3D");

// Medidas iniciales del div (si colapsa a 0, le damos un fallback por seguridad)
const widthInicial = contenedor.clientWidth || 500;
const heightInicial = contenedor.clientHeight || 500;

//Create a Three.JS Scene
const scene = new THREE.Scene();

// 2. ADAPTAR LA CÁMARA AL TAMAÑO DEL DIV
// Cambiado window.innerWidth/Height por las dimensiones del contenedor
const camera = new THREE.PerspectiveCamera(75, widthInicial / heightInicial, 0.1, 1000);

//Keep the 3D object on a global variable so we can access it later
let object;

//OrbitControls allow the camera to move around the scene
let controls;

//Set which object to render first
let objToRender = 'dino';

rgbeLoader.load('assets/hdr/ubiAbando.hdr', function (texture) {
  texture.mapping = THREE.EquirectangularReflectionMapping;
  scene.environment = texture; 
  scene.background = texture;  
});


/////CAMBIAR EL 360 DE UNO A OTRO
document.getElementById('ubiAbando').addEventListener('click', () => {
  rgbeLoader.load('assets/hdr/ubiAbando.hdr', function (texture) {
  texture.mapping = THREE.EquirectangularReflectionMapping;
  scene.environment = texture; 
  scene.background = texture;  
});
});
document.getElementById('ubiMoyua').addEventListener('click', () => {
  rgbeLoader.load('assets/hdr/ubiMoyua.hdr', function (texture) {
  texture.mapping = THREE.EquirectangularReflectionMapping;
  scene.environment = texture; 
  scene.background = texture;  
});
});
document.getElementById('ubiPortu').addEventListener('click', () => {
  rgbeLoader.load('assets/hdr/ubiPortu.hdr', function (texture) {
  texture.mapping = THREE.EquirectangularReflectionMapping;
  scene.environment = texture; 
  scene.background = texture;  
});
});


///////////////


//Instantiate a loader for the .gltf file
const loader = new GLTFLoader();

//Instantiate a new renderer and set its size
const renderer = new THREE.WebGLRenderer({ alpha: true }); 

// 3. ADAPTAR EL RENDERIZADOR AL TAMAÑO DEL DIV
renderer.setSize(widthInicial, heightInicial);

//Add the renderer to the DOM
contenedor.appendChild(renderer.domElement);

//IMPORTANTE!! NO BORRAR
//Set how far the camera will be from the 3D model
camera.position.z = objToRender === "eye" ? 400 : 500;

//This adds controls to the camera
controls = new OrbitControls(camera, renderer.domElement);

controls.rotateSpeed = -1; // invierte ambos

// RESPUESTA TACTIL
controls.addEventListener('change', () => {
  controls.getAzimuthalAngle = () => -controls.getAzimuthalAngle();
});

//Render the scene
function animate() {
  requestAnimationFrame(animate);
  renderer.render(scene, camera);
}

// 4. CAMBIO CLAVE: REDIMENSIONAR SEGÚN EL DIV, NO SEGÚN LA PANTALLA
// Sustituimos el eventListener de window por un ResizeObserver enfocado en el contenedor
const resizeObserver = new ResizeObserver((entries) => {
  for (let entry of entries) {
    // Tomamos el ancho y alto del div que se define en tu CSS
    const width = entry.contentRect.width || contenedor.clientWidth;
    const height = entry.contentRect.height || contenedor.clientHeight;

    camera.aspect = width / height;
    camera.updateProjectionMatrix();
    renderer.setSize(width, height);
  }
});
resizeObserver.observe(contenedor);

//Start the 3D rendering
animate();