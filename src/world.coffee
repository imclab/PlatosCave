
FW.World = class World
  
  time = Date.now() 
  constructor: ()->

    @clock = new THREE.Clock()
    @projector = new THREE.Projector()
    @targetVec = new THREE.Vector3()
    @launchSpeed = 1
    @explosionDelay = 1000
    @shootDirection = new THREE.Vector3()
    @rockets = []
    rnd = FW.rnd
    @launchSound = new Audio('./assets/launch.mp3');
    @explodeSound = new Audio('./assets/explosion.mp3');
    @crackleSound = new Audio('./assets/crackle.mp3');

  
    #scene
    @scene = new THREE.Scene()

    #CAMERA
    @camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 1, 1000)
    @camera.position.z = 1;




    #ROCKET
    @rocketMat= new THREE.ShaderMaterial({
    uniforms: uniforms1,
    vertexShader: document.getElementById('vertexShader').textContent,
    fragmentShader: document.getElementById('fragment_shader1').textContent

    })
    @rocketGeo = new THREE.CylinderGeometry(.1, 1, 1);
    

    #LIGHTS
    light = new THREE.DirectionalLight(0xff00ff)
    # @scene.add(light)

    @light = new THREE.PointLight(0xffeeee, 0.0, 500)
    @light.position.set(1, 1, 1);
    @scene.add(@light)

    #MOON

    geometry = new THREE.SphereGeometry(0.5, 32, 32)
    material = new THREE.MeshBasicMaterial({color: 0xffffff})
    mesh = new THREE.Mesh(geometry, material );
    mesh.scale.multiplyScalar(17);
    mesh.position.set(-50, 20, -100)
    moonlight = new THREE.DirectionalLight(0xffeeee, 1.0)
    @scene.add( mesh );
    mesh.add(moonlight)



    @stats = new Stats()
    @stats.domElement.style.position = 'absolute';
    @stats.domElement.style.left = '0px';
    @stats.domElement.style.top = '0px';
    document.body.appendChild(@stats.domElement);

    # FLOOR
    geometry = new THREE.PlaneGeometry(1000, 1000, 100, 100)
    geometry.applyMatrix new THREE.Matrix4().makeRotationX(-Math.PI / 2)
    material = new THREE.MeshPhongMaterial( { color: 0xff00ff, transparent: true, blending: THREE.AdditiveBlending } ) 
    material.opacity = 0.6
    material.needsUpdate = true

    mesh = new THREE.Mesh(geometry, material)
    mesh.position.y = -200
    @scene.add mesh

    #RECURSIVE STRUCTURES
    @g = new grow3.System(@scene, @camera, RULES.bush)
    @g.build(undefined, new THREE.Vector3(rnd(100,300), 10, 10))
    
    
    @renderer = new THREE.WebGLRenderer({antialias: true})
    @renderer.setClearColor( 0x000000, 1 );
    @renderer.setSize window.innerWidth, window.innerHeight
    document.body.appendChild @renderer.domElement

    #CONTROLS
    @controls = new THREE.OrbitControls(@camera, @renderer.domElement)
    @scene.add @controls
    
    window.addEventListener "resize", onWindowResize, false


  explode: (position)->
    @light.intensity = 1.0
    @light.position.set position.x, position.y, position.z
    @firework.createExplosion(position)
    
    #set timeout for speed of sound delay!
    setTimeout(()=>
      @explodeSound.play()
      setTimeout(()=>
        @crackleSound.play()
      400)
    800)


  launchRocket: ()->
    @launchSound.load();
    @explodeSound.load()
    @crackleSound.load()
    rocket = new THREE.Mesh(@rocketGeo, @rocketMat)
    rocket.position.set(@camera.position.x, @camera.position.y, @camera.position.z)
    @rockets.push(rocket)
    vector = new THREE.Vector3()
    vector.set(0,0,1)
    @projector.unprojectVector(vector, @camera)
    ray = new THREE.Ray(@camera.position, vector.sub(@camera.position).normalize() );
    @scene.add(rocket)
    @target =  vector.sub(@camera.position).normalize()
    rocket.shootDirection = new THREE.Vector3()
    rocket.shootDirection.x = ray.direction.x;
    rocket.shootDirection.y = ray.direction.y;
    rocket.shootDirection.z = ray.direction.z;
    @launchSound.play();
    setTimeout(()=>
      @scene.remove(rocket)
      @explode(rocket.position)
    @explosionDelay)


  onWindowResize = ->
    FW.myWorld.camera.aspect = window.innerWidth / window.innerHeight
    FW.myWorld.camera.updateProjectionMatrix()
    FW.myWorld.renderer.setSize window.innerWidth, window.innerHeight

  animate: =>
    if @light.intensity > 0
      @light.intensity-= 0.01
    requestAnimationFrame @animate

    delta = @clock.getDelta();

    @updateRocket rocket for rocket in @rockets
 
    if @firework.exploding
      @firework.tick()
    uniforms1.time.value += delta * 5;
    @stats.update()
    @controls.update()
    @renderer.render @scene, @camera
    time = Date.now()


  updateRocket: (rocket)->
    rocket.translateX(@launchSpeed * rocket.shootDirection.x)
    rocket.translateY( @launchSpeed * rocket.shootDirection.y)
    rocket.translateZ(@launchSpeed * rocket.shootDirection.z)
