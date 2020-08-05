 // MPI viwer on looking glass / pc display
 import * as THREE from '/js/three.module.js';
 import { VRButton } from '/js/VRButton.js';

 var scene, camera, renderer, controls, holoplay, sceneCfg, urlParams;
 var enableHoloplay = false;
 var planesScaling = 1.0, planesScalingSize = 0.01;
 var keysCode = { LEFT: 37, UP: 38, RIGHT: 39, BOTTOM: 40 };
 
 //Lighting elements
 var ambientLight;
 
 //Scene objects
 var planes = [];
 
 // make planes function to set planes into specific place
 function makePlanes(url, depth){
   let texture = new THREE.TextureLoader().load( url );
   let material = new THREE.MeshBasicMaterial({
     map: texture,
     opacity: 1,
     transparent: true,
     side: THREE.DoubleSide,
   });
   let scale = (-depth)
   let geometry = new THREE.PlaneGeometry(1*scale,3 / 4 * scale,1);
   let plane = new THREE.Mesh(geometry, material);
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
   renderer.setPixelRatio( window.devicePixelRatio );
   renderer.setSize(window.innerWidth, window.innerHeight);
   renderer.xr.enabled = true;
   renderer.xr.setReferenceSpaceType( 'local' );
   document.body.appendChild( VRButton.createButton( renderer ) );
   document.body.appendChild(renderer.domElement);
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
    renderer.setRenderTarget(null);
    renderer.render( scene, camera );
 }
 
 //Render loop
 function RunApp(){
    renderer.setAnimationLoop( draw );
 }
 
 
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
 