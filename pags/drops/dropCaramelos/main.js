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

rgbeLoader.load('assets/hdr/4.hdr', function (texture) {
  texture.mapping = THREE.EquirectangularReflectionMapping;
  scene.environment = texture; 
  scene.background = texture;  
});

scene.environmentIntensity = 1.5;


window.cambioPieza = function(nombre){
  objToRender = nombre;
  console.log(objToRender);
  loadModel(nombre);
}

function loadModel(nombre) {
  if (object) {
    scene.remove(object);
  }

  loader.load(
    `./models/${nombre}/scene.gltf`,
    function (gltf) {
      object = gltf.scene;
      scene.add(object);
    },
    function (xhr) {
      console.log((xhr.loaded / xhr.total * 100) + '% loaded');
    },
    function (error) {
      console.error(error);
    }
  );
}

//Instantiate a loader for the .gltf file
const loader = new GLTFLoader();

//Load the file
loader.load(
  `./models/${objToRender}/bp.gltf`,
  function (gltf) {
    object = gltf.scene;
    scene.add(object);
  },
  function (xhr) {
    console.log((xhr.loaded / xhr.total * 100) + '% loaded');
  },
  function (error) {
    console.error(error);
  }
);

//Instantiate a new renderer and set its size
const renderer = new THREE.WebGLRenderer({ alpha: true }); 

// 3. ADAPTAR EL RENDERIZADOR AL TAMAÑO DEL DIV
renderer.setSize(widthInicial, heightInicial);

//Add the renderer to the DOM
contenedor.appendChild(renderer.domElement);

//Set how far the camera will be from the 3D model
camera.position.z = objToRender === "eye" ? 400 : 500;
camera.position.z = objToRender === "dino" ? 3 : 500;

//Add lights to the scene
const topLight = new THREE.DirectionalLight(0xffffff, 1); 
topLight.position.set(500, 500, 500);
topLight.castShadow = true;
scene.add(topLight);

const otherLight = new THREE.DirectionalLight(0xffffff, 1); 
otherLight.position.set(200, 500, 100);
otherLight.castShadow = true;
scene.add(otherLight);

const bottomLight = new THREE.DirectionalLight(0xffffff, 0.2); 
bottomLight.position.set(200, -500, 100);
bottomLight.castShadow = true;
scene.add(bottomLight);

const ambientLight = new THREE.AmbientLight(0x333333, objToRender === "eye" ? 20 : 7);
scene.add(ambientLight);

//This adds controls to the camera
controls = new OrbitControls(camera, renderer.domElement);
  
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