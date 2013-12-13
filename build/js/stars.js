(function() {
  var Stars;

  FW.Stars = Stars = (function() {
    var rnd;

    rnd = FW.rnd;

    function Stars() {
      this.colorStart = new THREE.Color();
      this.colorStart.setRGB(Math.random(), Math.random(), Math.random());
      this.starGroup = new ShaderParticleGroup({
        texture: THREE.ImageUtils.loadTexture('assets/star.png'),
        blending: THREE.AdditiveBlending,
        maxAge: 100
      });
      this.colorEnd = new THREE.Color();
      this.colorEnd.setRGB(Math.random(), Math.random(), Math.random());
      this.generateStars();
      FW.scene.add(this.starGroup.mesh);
    }

    Stars.prototype.generateStars = function() {
      this.starEmitter = new ShaderParticleEmitter({
        type: 'sphere',
        radius: 120000,
        speed: .1,
        size: 30000,
        sizeSpread: 5000,
        particlesPerSecond: 200,
        opacityStart: 0,
        opacityMiddle: 1,
        opacityEnd: 0,
        colorStart: this.colorStart,
        colorSpread: new THREE.Vector3(rnd(.1, .5), rnd(.1, .5), rnd(.1, .5)),
        colorEnd: this.colorEnd
      });
      return this.starGroup.addEmitter(this.starEmitter);
    };

    Stars.prototype.tick = function() {
      this.starGroup.tick(0.16);
      return this.starEmitter.size += 100;
    };

    return Stars;

  })();

}).call(this);
