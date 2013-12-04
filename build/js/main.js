(function() {
  var Main;

  window.FW = {};

  if (typeof SC !== "undefined" && SC !== null) {
    SC.initialize({
      client_id: "7da24ca214bf72b66ed2494117d05480"
    });
  }

  window.soundOn = true;

  window.onload = function() {
    FW.startingPos = new THREE.Vector3(-580, 913, 1009);
    FW.myWorld = new FW.World();
    FW.myWorld.animate();
    FW.main = new FW.Main();
    FW.main.makeStars();
    return FW.camera.lookAt(FW.main.stars.position);
  };

  FW.Main = Main = (function() {
    function Main() {
      if (soundOn) {
        SC.stream("/tracks/rameses-b-inspire", function(sound) {
          return sound.play();
        });
      }
    }

    Main.prototype.makeStars = function() {
      var _this = this;
      this.grow = new grow3.System(FW.scene, FW.camera, RULES.bush);
      this.stars = this.grow.build(void 0, new THREE.Vector3().copy(FW.startingPos));
      return setTimeout(function() {
        FW.scene.remove(_this.stars);
        return _this.makeStars();
      }, 40000);
    };

    return Main;

  })();

  FW.rocketMat = new THREE.ShaderMaterial({
    uniforms: uniforms1,
    vertexShader: document.getElementById('rocketVertexShader').textContent,
    fragmentShader: document.getElementById('fragment_shader1').textContent
  });

}).call(this);
