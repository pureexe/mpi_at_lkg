 // MPI viwer on looking glass / pc display
      
var scene, camera, renderer, controls, holoplay, sceneCfg, urlParams;
var enableHoloplay = true;
var planesScaling = 1.0, planesScalingSize = 0.01;
var keysCode = { LEFT: 37, UP: 38, RIGHT: 39, BOTTOM: 40 };

//Lighting elements
var ambientLight;

//Scene objects
var planes = [];

// make planes function to set planes into specific place
function makePlanes(url, depth){
  texture = new THREE.TextureLoader().load( url );
  material = new THREE.MeshBasicMaterial({
    map: texture,
    opacity: 1,
    transparent: true,
    side: THREE.DoubleSide,
  });
  scale = (-depth)
  var geometry = new THREE.PlaneGeometry(1*scale,3 / 4 * scale,1);
  plane = new THREE.Mesh(geometry, material);
  planes.push(plane);
  plane.position.z = depth;
  scene.add(plane);
} 

//Initialize our variables
function init(){
  scene = new THREE.Scene();
  camera = new THREE.PerspectiveCamera(70, window.innerWidth/window.innerHeight, 0.1, 1000);
  camera.position.set(0,0,0);
  renderer = new THREE.WebGLRenderer();
  renderer.setSize(window.innerWidth, window.innerHeight);
  document.body.appendChild(renderer.domElement);
  controls = new THREE.OrbitControls(camera, renderer.domElement );
  controls.minAzimuthAngle = -Math.PI /2;
  controls.maxAzimuthAngle = Math.PI /2;
  controls.target.set( 0, 0, -0.5 );
  controls.enableKeys = false;
  if(enableHoloplay){
    holoplay = new HoloPlay(scene, camera, renderer);
  }
  ambientLight = new THREE.AmbientLight(0xFFFFFF, 1);
  scene.add(ambientLight);
  sceneCfg['planes'].forEach(function(plane,index){
    name = urlParams.get('scene')+'/planes/'
    name += index.toString().lpad('0',4) + '.png'
    makePlanes(name,-plane);
  });
}

//Resize window on size change
window.addEventListener('resize', function(){
  var width = window.innerWidth;
  var height = window.innerHeight;
  renderer.setSize(width, height);
  camera.aspect = width/height;
  camera.updateProjectionMatrix();
});

//Render the scene
function draw(){
  if(enableHoloplay){
    holoplay.render();
  }else{
    renderer.setRenderTarget(null);
    renderer.render( scene, camera );
  }
}

//Render loop
function RunApp(){
  requestAnimationFrame(RunApp);
  draw();
}

//Change plane scaling
function updatePlaneScaling(pSize){
  planesScaling += pSize;
  console.log("Plane scaling: " + planesScaling);
  for(let i = 0; i < planes.length; i++){
    planes[i].position.z = -sceneCfg['planes'][i] * planesScaling;
  }
  dmin = Math.min(...sceneCfg['planes']);
  dmax = Math.max(...sceneCfg['planes']);
  pivot = (dmin + dmax) / 2 * planesScaling
  controls.target.set( 0, 0, -pivot);
}

// Handle Keyboard input
function onKeyDown(ev) {
  if(ev.keyCode == keysCode.UP){
    updatePlaneScaling(planesScalingSize);
  }else if(ev.keyCode == keysCode.BOTTOM){
    updatePlaneScaling(-planesScalingSize);
  }
}

//Disable Drag & Drop for pan/rotate 
var onCancel = function(ev){
  if(ev.preventDefault) { ev.preventDefault(); }
  return false;
}; 

window.addEventListener("dragover", onCancel, false);
window.addEventListener("dragenter", onCancel, false);
window.addEventListener( 'keydown', onKeyDown, false );
      
// Main Program

// Param Parse
urlParams = new URLSearchParams(window.location.search)
if(urlParams.has('pc')){
    enableHoloplay = false;
}
if(urlParams.has('scaling')){
  scaling = parseFloat(urlParams.get('scaling'));
  if(!Number.isNaN(scaling)){
    planesScalingSize = scaling;
  }
}

if(urlParams.has('scene')){
  //load config.json
  fetch(urlParams.get('scene')+'/config.json')
    .then(response => response.json())
    .then(function(data){
        sceneCfg = data;
        init();
        RunApp();
    }).catch(function(e){
      console.error(e);
      alert('Cannot get config.json!');
    });
}else{
  document.getElementById('nothing-select').style.display = 'block';
}
