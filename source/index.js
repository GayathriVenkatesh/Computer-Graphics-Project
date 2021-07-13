import * as THREE from 'https://threejsfundamentals.org/threejs/resources/threejs/r127/build/three.module.js';
import {OrbitControls} from 'https://threejsfundamentals.org/threejs/resources/threejs/r127/examples/jsm/controls/OrbitControls.js';
import {GLTFLoader} from 'https://threejsfundamentals.org/threejs/resources/threejs/r127/examples/jsm/loaders/GLTFLoader.js';

function main() {
  var avatars = [];
  var obstacles = [];
  const canvas = document.querySelector('#c');
  const renderer = new THREE.WebGLRenderer({
    canvas,
    logarithmicDepthBuffer: true,
  });
  // Overhead Drone Camera - Perspective
  const fov = 45;
  const aspect = 2;  // the canvas default
  const near = 0.00001;
  const far = 100;
  const camera = new THREE.PerspectiveCamera(fov, aspect, near, far);
  camera.position.set(0, 50, 0);
  camera.lookAt(new THREE.Vector3(0,0,0));

  // Default Camera - Orthographic
  const fov2 = 45;
  const aspect2 = 2;  // the canvas default
  const near2 = 0.00001;
  const far2 = 100;
  const camera2 = new THREE.PerspectiveCamera(fov2, aspect2, near2, far2);
  camera2.position.set(-10, 40, 50);
  camera2.lookAt(new THREE.Vector3(0,0,0));

  const camera3 = new THREE.PerspectiveCamera(405, 2, 0.00001, 100);
  camera3.position.set(-30,0,-10);
  camera3.lookAt(new THREE.Vector3(-30,0,100));

  var cam_boolean = 0, texture_boolean = 0, jump = 0, start_jumping = 0, rotate = 0;
  var selected_cam = cam_boolean == 0 ? 'cam2' : (cam_boolean == 1 ? 'cam1' : 'cam3');

  document.addEventListener('keypress', function (e) {
    if (e.key == 'c') {
        cam_boolean = (1+cam_boolean)%3;
        selected_cam = cam_boolean == 0 ? 'cam2' : (cam_boolean == 1 ? 'cam1' : 'cam3');
    }
    else if (e.key == 'j') {
      jump = !jump;
    }
    else if (e.key == 's' && jump) {
      start_jumping = !start_jumping;
    }
    else if (e.key == 'r' && jump) {
      rotate = !rotate;
    }
  })
    var gui = new dat.GUI({
        height : 3 * 32 - 1
    });
    var speed = 0;
    var xpos = 0;
    var params = {
        x_posn: 0,
        height: 50,
        speed: 0
    };
    gui.add(params, 'x_posn').onFinishChange(function(){
        xpos = params.x_posn;
    })
    gui.add(params, 'height').onFinishChange(function(){
        camera.position.set(camera.position.x, params.height, camera.position.z);
    })
    gui.add(params, 'speed').onFinishChange(function(){
        speed = params.speed;
    })
  const controls = new OrbitControls(camera, canvas);
  controls.target.set(0, 5, 0);
  controls.update();

    const scene = new THREE.Scene();

    function loadModel(url) {
        return new Promise(resolve => {
          new GLTFLoader().load(url, resolve);
        });
      }

  function translateX(num) {
    avatars[0].position.set(avatars[0].position.x + num, avatars[0].position.y, avatars[0].position.z)
    avatars[3].position.set(avatars[3].position.x + num, avatars[3].position.y, avatars[3].position.z)
    var coll = false;
    for (var i=0; i<4; i+=1) {
      if (detectCollision(avatars[i], obstacles)) {
        coll = true; break
      }
    }
    if (coll == true) {
      avatars[0].position.set(avatars[0].position.x - num, avatars[0].position.y, avatars[0].position.z)
      avatars[3].position.set(avatars[3].position.x - num, avatars[3].position.y, avatars[3].position.z)
    }
  }
  function translateY(num) {
    avatars[0].position.set(avatars[0].position.x, avatars[0].position.y + num, avatars[0].position.z)
    avatars[3].position.set(avatars[3].position.x, avatars[3].position.y + num, avatars[3].position.z)
    var coll = false;
    for (var i=0; i<4; i+=1) {
          if (detectCollision(avatars[i], obstacles)) {
            coll = true; break
          }
      }
    if (coll == true) {
      avatars[0].position.set(avatars[0].position.x, avatars[0].position.y - num, avatars[0].position.z)
      avatars[3].position.set(avatars[3].position.x, avatars[3].position.y - num, avatars[3].position.z)
    }
}
  function translateZ(num) {
    avatars[0].position.set(avatars[0].position.x, avatars[0].position.y, avatars[0].position.z + num)
    avatars[3].position.set(avatars[3].position.x, avatars[3].position.y, avatars[3].position.z + num)
    var coll = false;
    for (var i=0; i<4; i+=1) {
      if (detectCollision(avatars[i], obstacles)) {
        coll = true; break
      }
    }
    if (coll == true) {
      avatars[0].position.set(avatars[0].position.x, avatars[0].position.y, avatars[0].position.z - num)
      avatars[3].position.set(avatars[3].position.x, avatars[3].position.y, avatars[3].position.z - num)
    }
  }

  function isIntersecting(box, box2) {
    return box.max.x < box2.min.x || box.min.x > box2.max.x ||
			box.max.y < box2.min.y || box.min.y > box2.max.y ||
			box.max.z < box2.min.z || box.min.z > box2.max.z ? false : true;
  }
  function detectCollision(avatar, obstacles) {
    for (var i=0; i < obstacles.length; i++) {
      var bounding_box = new THREE.Box3().setFromObject(avatar);
      var box = new THREE.Box3().setFromObject(obstacles[i]); // bbox of spherical obstacle
      if (isIntersecting(box, bounding_box)) {
        return true;
      }
    }
    return false;
  }

    {
    const planeSize = 400;
    const loader = new THREE.TextureLoader();
    var planeMat = new THREE.MeshPhongMaterial({
      map: loader.load(texture),
      side: THREE.DoubleSide,
    });

    var texture = 'https://threejsfundamentals.org/threejs/resources/images/checker.png'
    var load = loader.load(texture)
    load.wrapS = THREE.RepeatWrapping;
    load.wrapT = THREE.RepeatWrapping;
    load.magFilter = THREE.NearestFilter;
    const repeats = planeSize / 8;
    load.repeat.set(repeats, repeats);
    planeMat = new THREE.MeshPhongMaterial({
      map: load,
      side: THREE.DoubleSide,
    });  
    console.log(texture);
    var planeGeo = new THREE.PlaneGeometry(planeSize, planeSize);   
    var mesh_plane = new THREE.Mesh(planeGeo, planeMat);
    mesh_plane.rotation.x = Math.PI * -.5;
    scene.add(mesh_plane);

    var texture_list = ['map7.jpg', 'texture2.jpg', 'texture1.jpg', 'marble.jpg', 'marble2.jpg']
    document.addEventListener('keypress', function (e) {
      if (e.key == 't') {
        texture_boolean = !texture_boolean;
        texture = texture_boolean == 0 ? 'https://threejsfundamentals.org/threejs/resources/images/checker.png' : 'map7.jpg';
        load = loader.load(texture)
        if (texture != 'map7.jpg') {
          load.wrapS = THREE.RepeatWrapping;
          load.wrapT = THREE.RepeatWrapping;
          load.magFilter = THREE.NearestFilter;
          const repeats = planeSize / 8;
          load.repeat.set(repeats, repeats);
        }
        
        planeMat = new THREE.MeshPhongMaterial({
          map: load,
          side: THREE.DoubleSide,
        });  
        console.log(texture);
        planeGeo = new THREE.PlaneGeometry(planeSize, planeSize);   
        mesh_plane = new THREE.Mesh(planeGeo, planeMat);
        mesh_plane.rotation.x = Math.PI * -.5;
        scene.add(mesh_plane);
      }
    })   
  }
    const sphereRadius = 2;
    const sphereWidthDivisions = 32;
    const sphereHeightDivisions = 16;
    const sphereGeo = new THREE.SphereGeometry(sphereRadius, sphereWidthDivisions, sphereHeightDivisions);  
    var sphereMat = new THREE.MeshBasicMaterial();
    sphereMat.color.setHSL(1 * .73, 1, 0.5);
    var mesh1 = new THREE.Mesh(sphereGeo, sphereMat);  
    var dynamicMesh = new THREE.Mesh(sphereGeo, sphereMat);  
    var dynamicMesh2 = new THREE.Mesh(sphereGeo, sphereMat);  
    var url = 'https://threejsfundamentals.org/threejs/resources/models/knight/KnightCharacter.gltf';

    var sphereMat;
    var loader = new THREE.TextureLoader();
    loader.load(texture_list[0], function (texture) {
          sphereMat = new THREE.MeshBasicMaterial( { map: texture, overdraw: 1 } );
          mesh1 = new THREE.Mesh(sphereGeo, sphereMat);
          mesh1.position.set(-3, 1.5, 2*5*2.2);
          scene.add(mesh1);
          obstacles.push(mesh1)
          console.log(obstacles)
      });

      loader.load(texture_list[1], function (texture) {
            sphereMat = new THREE.MeshBasicMaterial( { map: texture, overdraw: 1 } );
            mesh1 = new THREE.Mesh(sphereGeo, sphereMat);
            mesh1.position.set(21 - 1, 1.5, 5);
            scene.add(mesh1);
            obstacles.push(mesh1)
            console.log(obstacles)
        });

        loader.load(texture_list[2], function ( texture ) {
          sphereMat = new THREE.MeshBasicMaterial( { map: texture, overdraw: 1 } );
          mesh1 = new THREE.Mesh(sphereGeo, sphereMat);
          mesh1.position.set(-10 - 1, 1.5, 1 * 6 * -2.2);
          scene.add(mesh1);
          obstacles.push(mesh1)
          console.log(obstacles)
      });

      loader.load(texture_list[3], function ( texture ) {
        sphereMat = new THREE.MeshBasicMaterial( { map: texture, overdraw: 1 } );
        dynamicMesh = new THREE.Mesh(sphereGeo, sphereMat);
        obstacles.push(dynamicMesh)
      });

      loader.load(texture_list[4], function ( texture ) {
        sphereMat = new THREE.MeshBasicMaterial( { map: texture, overdraw: 1 } );
        dynamicMesh2 = new THREE.Mesh(sphereGeo, sphereMat);
        obstacles.push(dynamicMesh2)
    });

    let model1, model2, model3, model4, model5;
    let p1 = loadModel(url).then(result => { model1 = result.scene.children[0]; });
    let p2 = loadModel(url).then(result => { model2 = result.scene.children[0]; });
    let p3 = loadModel(url).then(result => { model3 = result.scene.children[0]; });
    let p4 = loadModel(url).then(result => { model4 = result.scene.children[0]; });
    url = './Models/Robo_Man_plain.gltf';	
    url = './Models/Robo_Man_plain.gltf';	
    var p5 = loadModel(url).then(result => { model5 = result.scene.children[0]; });	
    // change_Mapping();	

    Promise.all([p1,p2,p3,p4,p5]).then(() => {
        model1.position.set(-30,0,-10);
        model2.position.set(0,0,10);
        model3.position.set(2,1.5,-1.2);  // was 20,0,20
        model4.position.set(0,0,0)
        model5.position.set(8,14.5,-1.2)

        model1.scale.set(3,3,3);
        model4.scale.set(3,3,3);
        model5.scale.set(1,1,1);

        scene.add(model1);
        model1.add(model2);
        model1.add(model3);
        scene.add(model4);
        scene.add(model5);
        avatars.push(model1)
        avatars.push(model2);
        avatars.push(model3);
        avatars.push(model4)

        camera3.position.set(model1.position.x, model1.position.y, model1.position.z);
  {
    const light = new THREE.AmbientLight(0xFFFFFF, 1);
    scene.add(light);
    
    var street_lights = [];
    var leader_index = 0;
    for (let i = 0; i < 6; ++i) {
        const spotLight = new THREE.SpotLight(0x0000FF, 0.5);
        spotLight.position.set(100, 20, 6-2*i);
        spotLight.castShadow = true;
        spotLight.angle = Math.PI/6;
        spotLight.shadow.mapSize.width = 1024;
        spotLight.shadow.mapSize.height = 1024;
        spotLight.shadow.camera.near = 5;
        spotLight.shadow.camera.far = 0;
        spotLight.shadow.camera.fov = 3;
        scene.add( spotLight );
        street_lights.push(spotLight);
      }
    const color_headlight = 0xFF00FF;
    const headlight = new THREE.DirectionalLight(color_headlight, 1);
    headlight.position.set(avatars[leader_index].position.x, avatars[leader_index].position.y, avatars[leader_index].position.z);
    headlight.target.position.set(avatars[leader_index].position.x+10, avatars[leader_index].position.y+10, avatars[leader_index].position.z+1);
    scene.add(headlight);

    const searchlight = new THREE.SpotLight(0xffff99, 0.5);
    searchlight.position.set(0, avatars[0].position.y + 20, 0);
    console.log("seee", searchlight.color)
    searchlight.target = avatars[0]
    searchlight.angle = Math.PI/6
    searchlight.castShadow = true;
    searchlight.shadow.mapSize.width = 1024;
    searchlight.shadow.mapSize.height = 1024;
    searchlight.shadow.camera.near = 5;
    searchlight.shadow.camera.far = 0;
    searchlight.shadow.camera.fov = 3;
    scene.add(searchlight);
  
  var street = 1, head = 1, search = 1;
	var max_maps = 3;	
	var curr_map = 1;	
	var texture_m4 = loader.load('image.jpg'),p4;	

  texture_m4.encoding = THREE.sRGBEncoding;	
	texture_m4.flipY = false;	
	model5.material.map = texture_m4;
  window.addEventListener("keydown", function(e){
    if(e.keyCode == 39) translateX(1);
    else if(e.keyCode == 40) translateY(-1);
    else if(e.keyCode == 37) translateX(-1);
    else if(e.keyCode == 38) translateY(1);
    else if(e.keyCode == 188) translateZ(1);
    else if(e.keyCode == 190) translateZ(-1);

    else if(e.key === 'm'){	
      curr_map = (curr_map+1)%max_maps;	
      if(curr_map == 0){	
        console.log('Map-Cylin',model5, texture_m4);	
        texture_m4 = loader.load('image1.jpg');	
        texture_m4.encoding = THREE.sRGBEncoding;	
        texture_m4.flipY = false;	
        model5.material = new THREE.MeshBasicMaterial({	
          map: texture_m4,});		
      }	
      else if(curr_map == 1){	
        texture_m4 = loader.load('image2.jpg');	
        p4 = loadModel('./Models/Robo_Man_cyl2.gltf').then(result => { model5 = result.scene.children[0]; });	
        console.log('Map-Spher',model5, texture_m4);	
        model5.material.map = texture_m4;	
      }	
      else if(curr_map == 2){	
        texture_m4 = loader.load('image.jpg');	
        console.log(curr_map);	
        if(model5.material.isMaterial){	
          model5.material.map = loader.load('image.jpg');	
        }	
      }	
    }

    else if(e.keyCode == 70) street = !street;
    else if(e.keyCode == 71) head = !head;
    else if(e.keyCode == 72) search = !search;
    
    if (!head) headlight.color.set(0,0,0);
    else headlight.color.set(0xFF00FF)

    if (!search) searchlight.color.set(0,0,0);
    else searchlight.color.set(0xFFFF99)

    if (!street) {
      for (var i=0; i<street_lights.length; i++)
        street_lights[i].color.set(0,0,0);
    }
    else 
      for (var i=0; i<street_lights.length; i++)
        street_lights[i].color.set(0x0000FF);
    var avatar_index = 0
    headlight.position.set(avatars[0].position.x, avatars[0].position.y, avatars[0].position.z);
    headlight.target.position.set(avatars[0].position.x-1, avatars[0].position.y-1, avatars[0].position.z-1);
    camera3.position.set(avatars[avatar_index].position.x, avatars[avatar_index].position.y, avatars[avatar_index].position.z);
    camera3.lookAt(new THREE.Vector3(-avatars[avatar_index].position.x+10, avatars[avatar_index].position.y+10, avatars[avatar_index].position.z+110));
  })
  }
});

  function resizeRendererToDisplaySize(renderer) {
    const canvas = renderer.domElement;
    const width = canvas.clientWidth;
    const height = canvas.clientHeight;
    const needResize = canvas.width !== width || canvas.height !== height;
    if (needResize) {
      renderer.setSize(width, height, false);
    }
    return needResize;
  }
  var angle = 0;
  var jump_bool = 0;
  var dynamic = 0, dynamic2 = 0;

  function render() {
    mesh1.position.set(mesh1.position.x-0.1, mesh1.position.y, mesh1.position.z);
    if (mesh1.position.x < -50) {
      mesh1.position.x = 50;
    }
    jump_bool += 1;
    dynamic += 1; dynamic2 += 1;
    if (jump_bool > 50) jump_bool = 0;

    if (dynamic % 800 == 0) {
      dynamicMesh.position.set(-15, 1.5, 1*5 * 2.2);
      scene.add(dynamicMesh)
      obstacles.push(dynamicMesh)
    }
    else if (dynamic % 400 == 0) {
      scene.remove(dynamicMesh)
      obstacles = obstacles.filter(function(value, index, arr){ 
        return value != dynamicMesh;
      });
    }
    if (dynamic2 % 650 == 0) {
      dynamicMesh2.position.set(4, 1.5, -10*2.2);
      scene.add(dynamicMesh2)
      obstacles.push(dynamicMesh2)
    }
    else if (dynamic2 % 325 == 0) {
      scene.remove(dynamicMesh2)
      obstacles = obstacles.filter(function(value, index, arr){ 
        return value != dynamicMesh2;
    });
  }
   
    var val = jump_bool > 25 ? 2 : -2;
    Promise.all([p1,p2,p3]).then(() => {
      if (jump == 1) {
        model4.position.set(mesh1.position.x, mesh1.position.y, mesh1.position.z);       
        if (start_jumping)  
          model4.position.y = mesh1.position.y + val; 
        if (rotate) 
          model4.rotation.y += Math.PI/20;  
      }
  });
    if (resizeRendererToDisplaySize(renderer)) {
      const canvas = renderer.domElement;
      camera2.aspect = canvas.clientWidth / canvas.clientHeight;
      camera2.updateProjectionMatrix();
    }
    if (selected_cam == "cam1") {
        renderer.render(scene, camera);
        camera.position.x = 10 * Math.cos(angle) + xpos;  
        camera.position.z = 10 * Math.sin(angle);
        angle += 0.01*speed;
    }
    else if (selected_cam == "cam2") {
        renderer.render(scene, camera2);
    } 
    else if (selected_cam == "cam3") {
      renderer.render(scene, camera3 );
    }
    requestAnimationFrame(render);
  }

  requestAnimationFrame(render);
}

main();
