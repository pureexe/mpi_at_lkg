 //Basic elements for a Three.js/HoloPlay scene.
      
      /*
      function makePlanes(filename, depth){
        var img = new THREE.SpriteMaterial({
            map: THREE.ImageUtils.loadTexture(filename)
        });
        const sprite = new THREE.Sprite(img);
        scene.add(sprite);
        sprite.position.set(0,0,depth);
        scale = (-depth + 0.5) / 0.5 / 2
        sprite.scale.set(1 * scale,3/4 * scale,1);
      }
      */
      
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
        plane.position.z = depth
        scene.add(plane)
      } 
      
      

      var scene, camera, renderer, controls, holoplay, sceneCfg, urlParams;
      var enableHoloplay = true;

        //Lighting elements
        var ambientLight;

        //Scene objects
        var cubeGeometry;
        var cubeMaterial;
        var cubes;

        //Initialize our variables
        function init(){
            scene = new THREE.Scene();
            camera = new THREE.PerspectiveCamera(70, window.innerWidth/window.innerHeight, 0.1, 1000);
            camera.position.set(0,0,0);
            renderer = new THREE.WebGLRenderer();
            renderer.setSize(window.innerWidth, window.innerHeight);
            document.body.appendChild(renderer.domElement);
            controls = new THREE.OrbitControls(camera, renderer.domElement );
            controls.minAzimuthAngle = -Math.PI /2
            controls.maxAzimuthAngle = Math.PI /2
            controls.target.set( 0, 0, -0.5 );
            controls.enablePan = true;
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

      //Game loop
      function RunApp(){
        requestAnimationFrame(RunApp);
        draw();
      }


    var onCancel = function(ev){
      if(ev.preventDefault) { ev.preventDefault(); }
      return false;
    }; 
    window.addEventListener("dragover", onCancel, false);
    window.addEventListener("dragenter", onCancel, false);
      
urlParams = new URLSearchParams(window.location.search)
if(urlParams.has('pc')){
    enableHoloplay = false;
}
if(urlParams.has('scene')){
    fetch(urlParams.get('scene')+'/config.json')
    .then(response => response.json())
    .then(function(data){
        sceneCfg = data;
        init();
        RunApp();
    }).catch(function(e){
        console.log(e)
        alert('Cannot get config.json!');
    });
}else{
  document.getElementById('nothing-select').style.display = 'block';
}
