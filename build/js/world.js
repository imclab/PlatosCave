(function() {
  var World,
    __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

  FW.World = World = (function() {
    function World() {
      this.animate = __bind(this.animate, this);
      this.onKeyDown = __bind(this.onKeyDown, this);
      var aMeshMirror, directionalLight, waterNormals,
        _this = this;
      this.textureCounter = 0;
      this.animDelta = 0;
      this.animDeltaDir = 1;
      this.lightVal = .16;
      this.lightDir = 0;
      this.clock = new THREE.Clock();
      this.updateNoise = true;
      this.animateTerrain = false;
      this.mlib = {};
      this.MARGIN = 10;
      this.SCREEN_WIDTH = window.innerWidth;
      this.SCREEN_HEIGHT = window.innerHeight - 2 * this.MARGIN;
      this.camFar = 8000;
      FW.camera = new THREE.PerspectiveCamera(40, this.SCREEN_WIDTH / this.SCREEN_HEIGHT, 2, this.camFar);
      FW.camera.position.set(0, 570, 0);
      this.controls = new THREE.FlyControls(FW.camera);
      this.controls.movementSpeed = 600;
      this.controls.rollSpeed = Math.PI / 6;
      this.controls.pitchEnabled = true;
      this.stats = new Stats();
      this.stats.domElement.style.position = 'absolute';
      this.stats.domElement.style.left = '0px';
      this.stats.domElement.style.top = '0px';
      document.body.appendChild(this.stats.domElement);
      FW.scene = new THREE.Scene();
      this.firework = new FW.Firework();
      this.groundControl = new FW.Rockets();
      this.meteor = new FW.Meteor();
      this.stars = new FW.Stars();
      directionalLight = new THREE.DirectionalLight(0xffff55, 1);
      directionalLight.position.set(-600, 300, 600);
      FW.scene.add(directionalLight);
      this.renderer = new THREE.WebGLRenderer();
      this.renderer.setSize(this.SCREEN_WIDTH, this.SCREEN_HEIGHT);
      this.renderer.domElement.style.position = "absolute";
      this.renderer.domElement.style.top = this.MARGIN + "px";
      this.renderer.domElement.style.left = "0px";
      document.body.appendChild(this.renderer.domElement);
      waterNormals = new THREE.ImageUtils.loadTexture('./assets/waternormals.jpg');
      this.water = new THREE.Water(this.renderer, FW.camera, FW.scene, {
        textureWidth: 512,
        textureHeight: 512,
        waterNormals: waterNormals,
        alpha: 1.0,
        sunDirection: directionalLight.position.normalize(),
        sunColor: 0xffffff,
        waterColor: 0x001e0f
      });
      aMeshMirror = new THREE.Mesh(new THREE.PlaneGeometry(2000, 2000, 10, 10), this.water.material);
      aMeshMirror.add(this.water);
      aMeshMirror.rotation.x = -Math.PI * 0.5;
      FW.scene.add(aMeshMirror);
      this.onWindowResize();
      window.addEventListener("resize", (function() {
        return _this.onWindowResize();
      }), false);
      document.addEventListener("keydown", (function() {
        return _this.onKeyDown(event);
      }), false);
    }

    World.prototype.onWindowResize = function(event) {
      this.SCREEN_WIDTH = window.innerWidth;
      this.SCREEN_HEIGHT = window.innerHeight - 2 * this.MARGIN;
      this.renderer.setSize(this.SCREEN_WIDTH, this.SCREEN_HEIGHT);
      FW.camera.aspect = this.SCREEN_WIDTH / this.SCREEN_HEIGHT;
      return FW.camera.updateProjectionMatrix();
    };

    World.prototype.onKeyDown = function(event) {
      switch (event.keyCode) {
        case 78:
          return this.lightDir *= -1;
        case 77:
          return this.animDeltaDir *= -1;
      }
    };

    World.prototype.animate = function() {
      requestAnimationFrame(this.animate);
      this.water.material.uniforms.time.value += 1.0 / 60.0;
      return this.render();
    };

    World.prototype.render = function() {
      var delta;
      delta = this.clock.getDelta();
      this.stats.update();
      this.groundControl.update();
      this.meteor.tick();
      this.stars.tick();
      this.controls.update(delta);
      this.water.render();
      return this.renderer.render(FW.scene, FW.camera);
    };

    return World;

  })();

}).call(this);
