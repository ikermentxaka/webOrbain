import * as THREE from 'https://cdn.jsdelivr.net/npm/three@0.160.0/build/three.module.js';

import { OrbitControls } from 'https://cdn.jsdelivr.net/npm/three@0.160.0/examples/jsm/controls/OrbitControls.js?module';

import { GLTFLoader } from 'https://cdn.jsdelivr.net/npm/three@0.160.0/examples/jsm/loaders/GLTFLoader.js?module';
//Para las texturas de reflejo
import { RGBELoader } from 'https://cdn.jsdelivr.net/npm/three@0.160.0/examples/jsm/loaders/RGBELoader.js?module';

const rgbeLoader = new RGBELoader();



//Create a Three.JS Scene
const scene = new THREE.Scene();
//create a new camera with positions and angles
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);

//Keep the 3D object on a global variable so we can access it later
let object;

//OrbitControls allow the camera to move around the scene
let controls;

//Set which object to render first
let objToRender = 'dino';


rgbeLoader.load('assets/hdr/1.hdr', function (texture) {
  texture.mapping = THREE.EquirectangularReflectionMapping;

  scene.environment = texture; // 👈 CLAVE (reflejos)
  //scene.background = texture;  // opcional (ver fondo)
});

scene.environmentIntensity = 1.5;
//Funcion para elegir que objeto renderizar
document.getElementById('btnDino').addEventListener('click', () => {
  cambioPieza('dino');
});

document.getElementById('btnBode').addEventListener('click', () => {
  cambioPieza('bodegon');
});

document.getElementById('btnEye').addEventListener('click', () => {
  cambioPieza('eye');
});

document.getElementById('btnPosca').addEventListener('click', () => {
  cambioPieza('posca');
});

window.cambioPieza = function(nombre){
  objToRender = nombre;
  console.log(objToRender);
  loadModel(nombre);
}

function loadModel(nombre) {
  // Eliminar el modelo anterior si existe
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
  `./models/${objToRender}/scene.gltf`,
  function (gltf) {
    //If the file is loaded, add it to the scene
    object = gltf.scene;
    scene.add(object);
  },
  function (xhr) {
    //While it is loading, log the progress
    console.log((xhr.loaded / xhr.total * 100) + '% loaded');
  },
  function (error) {
    //If there is an error, log it
    console.error(error);
  }
);

//Instantiate a new renderer and set its size
const renderer = new THREE.WebGLRenderer({ alpha: true }); //Alpha: true allows for the transparent background
renderer.setSize(window.innerWidth, window.innerHeight);

//Add the renderer to the DOM
document.getElementById("container3D").appendChild(renderer.domElement);

//Set how far the camera will be from the 3D model
//Hay que jugar con esto en caso de estar muy cerca o muy lejos del objeto. Solo tocar el valor de la izquierda.
camera.position.z = objToRender === "eye" ? 400 : 500;
camera.position.z = objToRender === "dino" ? 3 : 500;

//Add lights to the scene, so we can actually see the 3D model
const topLight = new THREE.DirectionalLight(0xffffff, 1); // (color, intensity)
topLight.position.set(500, 500, 500) //top-left-ish
topLight.castShadow = true;
scene.add(topLight);

const otherLight = new THREE.DirectionalLight(0xffffff, 1); // (color, intensity)
otherLight.position.set(200, 500, 100) //top-left-ish
otherLight.castShadow = true;
scene.add(otherLight);

const bottomLight = new THREE.DirectionalLight(0xffffff, 0.2); // (color, intensity)
bottomLight.position.set(200, -500, 100) //top-left-ish
bottomLight.castShadow = true;
scene.add(bottomLight);

const ambientLight = new THREE.AmbientLight(0x333333, objToRender === "eye" ? 20 : 7);
scene.add(ambientLight);


//This adds controls to the camera, so we can rotate / zoom it with the mouse
controls = new OrbitControls(camera, renderer.domElement);
  


//Render the scene
function animate() {
  requestAnimationFrame(animate);
  renderer.render(scene, camera);
}

//Add a listener to the window, so we can resize the window and the camera
window.addEventListener("resize", function () {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});



//Start the 3D rendering
animate();
