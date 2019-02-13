
import FileLoader from '../util/Loader.js';
import HospitalMenu from '../react/menus/environment/HospitalMenu';

class HospitalEnvironment {
  constructor(renderer, parent, performers, defaults) {
    this.renderer = renderer;
    this.parent = parent;
    this.performers = performers;
    this.defaults = defaults;

    this.name = "Hospital";

    this.elements = [];
    this.lights = [];

    this.visible = true;

    this.options = {};

    this.loader = new FileLoader();

    // this.initSkybox();
    this.initSpace();
    this.initFloor(50);
    this.initLights();
    this.initMirror();  
  }

  toggleVisible(val) {
    this.setVisible(!this.getVisible());
  }

  getVisible() {
    return this.visible;
  }

  setVisible(val) {
    // console.log(val);
    this.visible = val;
    this.elements.forEach((element) => {
      element.visible = val;
    });
    this.lights.forEach((light) => {
      light.visible = val;
    });

    // this.toggleSkybox(val);
  }

  toggleSkybox(visible) {
    switch(visible) {
      case true:
        this.initSkybox();
        break;
      case false:
        this.parent.remove(this.skyBox);
        break;
    }
  }

  initSpace() {
    console.log('asdf asdfasdf');
    this.loader.loadGLTF('../models/environments/hospital/scene.gltf', {}, (gltf) => {
      this.gltf = gltf.scene;

      this.gltf.position.copy(new THREE.Vector3(7.109999999999994, -1.6053299999999988, 39));
      this.gltf.rotation.set(0, 4.1, 0);
      this.gltf.scale.set(0.013, 0.013, 0.013);

      this.gltf.traverse((child) => {
        switch (child.type) {
          default:
            break;
          case 'Mesh':
            child.castShadow = true;
            child.receiveShadow = true;
            break;
        }
      });
      this.elements.push(this.gltf);
      this.parent.add(this.gltf);
    });
  }

  initSkybox() {
    const cubeMap = new THREE.CubeTexture([]);
    cubeMap.format = THREE.RGBFormat;

    this.loader.loadImage('textures/de38ad4f55903add2fdbe290bcc6ef79.png', {}, (image) => {
        const getSide = (x, y) => {
            const size = 1024;

            const canvas = document.createElement('canvas');
            canvas.width = size;
            canvas.height = size;

            const context = canvas.getContext('2d');
            context.drawImage(image, -x * size, -y * size);

            return canvas;
        };

        cubeMap.images[0] = getSide(2, 1); // px
        cubeMap.images[1] = getSide(0, 1); // nx
        cubeMap.images[2] = getSide(1, 0); // py
        cubeMap.images[3] = getSide(1, 2); // ny
        cubeMap.images[4] = getSide(1, 1); // pz
        cubeMap.images[5] = getSide(3, 1); // nz
        cubeMap.needsUpdate = true;
    });

    const cubeShader = THREE.ShaderLib.cube;
    cubeShader.uniforms.tCube.value = cubeMap;

    this.skyBox = new THREE.Mesh(
        new THREE.CubeGeometry(10, 10, 10, 1, 1, 1, null, true),
        new THREE.ShaderMaterial({
            fragmentShader: cubeShader.fragmentShader,
            vertexShader: cubeShader.vertexShader,
            uniforms: cubeShader.uniforms,
            depthWrite: false,
            side: THREE.BackSide,
        }),
    );

    this.parent.add(this.skyBox);
    // this.elements.push(this.skyBox);
  }

  initMirror() {
    const w = 1920/250;
    const h = 1080/250;
    var geo = new THREE.PlaneBufferGeometry( w * 2, h * 2 );
    let overflow = new THREE.Mesh(geo, new THREE.MeshBasicMaterial({color:0xFFFFFF}));
    overflow.position.z = -0.1;
    this.parent.add(overflow);
    this.elements.push(overflow);

    var geometry = new THREE.PlaneBufferGeometry( w, h );
    var verticalMirror = new THREE.Reflector( geometry, {
      // clipBias: 0.003,
      textureWidth: $('#scenes').width() * window.devicePixelRatio,
      textureHeight: $('#scenes').height() * window.devicePixelRatio,
      color: 0x889999,
      recursion: 1
    } );
    // window.verticalMirror = verticalMirror;
    verticalMirror.position.y = 1.25;
    verticalMirror.position.z = 5;
    this.parent.add(verticalMirror);
    this.elements.push(verticalMirror);
  }

  initFloor(size) {
    this.floor = new THREE.Mesh(
      new THREE.PlaneBufferGeometry( size, size, 1 ),
      new THREE.MeshPhongMaterial({ color:0x88a635, opacity: 1 })
    );
    // window.floor = this.floor;
    this.floor.position.y = -1.0875;
    this.floor.position.z = 15;
    this.floor.rotation.x = -Math.PI/2;
    this.floor.receiveShadow = true;

    this.elements.push(this.floor);
    this.parent.add(this.floor);
  }

  initLights() {
    const hemiLight = new THREE.HemisphereLight( 0xFFFFFF, 0xFFFFFF, 0.95 );
    hemiLight.groundColor.setHSL( 0, 0, 0 );
    hemiLight.position.set( 1, 1.5, 0 );
    // hemiLight.position.multiplyScalar( 30 );
    this.parent.add( hemiLight );
    this.lights.push( hemiLight );

    // const hemiLightHelper = new THREE.HemisphereLightHelper( hemiLight, 10 );
    // this.parent.add( hemiLightHelper );
    //
    const dirLight = new THREE.DirectionalLight( 0xFFFFFF, 0.95 );
    // dirLight.color.setHSL( 0.95, 0.95, 0.95 );
    dirLight.position.set( 1, 1.5, 0 );
    // dirLight.position.multiplyScalar( 30 );
    this.parent.add( dirLight );
    this.lights.push( dirLight );

    let lightTarget = new THREE.Object3D();
    this.parent.add(lightTarget);
    lightTarget.position.set(0, 0, 5);
    dirLight.target = lightTarget;
    dirLight.castShadow = true;
    
    dirLight.castShadow = true;
    dirLight.shadow.mapSize.width = 2048;
    dirLight.shadow.mapSize.height = 2048;
    
    var d = 50;
    dirLight.shadow.camera.left = - d;
    dirLight.shadow.camera.right = d;
    dirLight.shadow.camera.top = d;
    dirLight.shadow.camera.bottom = - d;
    dirLight.shadow.camera.far = 3500;
    dirLight.shadow.bias = 0.000;
    
    // const dirLightHeper = new THREE.DirectionalLightHelper( dirLight, 10 );
    // this.parent.add( dirLightHeper );
  }

  removeElements() {
    this.elements.forEach((element) => {
      this.parent.remove(element);
    });
  }

  removeLights() {
    this.lights.forEach((light) => {
      this.parent.remove(light);
    });
  }

  remove() {
    this.removeLights();
    this.removeElements();
  }

  update(timeDelta) {
    // put frame updates here.
    if (this.gltf && this.gltf.mixer) { this.gltf.mixer.update(this.gltf.clock.getDelta()); }
  }
  
  // updated options from gui
  updateOptions(data) {
    this.options = data;
    this.remove();
  }

  // returns react gui object when effect is selected
  getGUI() {
    return <HospitalMenu data={this.options}
      updateOptions={this.updateOptions.bind(this)}/>;
  }
}

module.exports = HospitalEnvironment;
