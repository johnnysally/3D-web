// Button click event to start the rocket animation and remove the hero section
document.getElementById('getStarted').addEventListener('click', function () {
  // Hide the hero section with animation
  const logo = document.querySelector('.logo');
  const heading = document.querySelector('h1');
  logo.classList.add('move-logo');
  heading.classList.add('move-heading');
  document.querySelector('.hero').style.display = 'none';

  // Show the 3D scene container
  const rocketSceneContainer = document.getElementById('rocket-scene');
  rocketSceneContainer.style.display = 'block';

  // Show the "About Us" link in the navbar
  document.getElementById('aboutUsLink').style.display = 'block';

  // Initialize the 3D scene
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
  const renderer = new THREE.WebGLRenderer({ alpha: true });
  renderer.setSize(window.innerWidth, window.innerHeight);
  rocketSceneContainer.appendChild(renderer.domElement);

  // Add fog to the scene to limit visibility
  scene.fog = new THREE.Fog(0x000000, -5, 150);  // Fog color and start/end distances

  // Lighting
  const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
  scene.add(ambientLight);

  const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
  directionalLight.position.set(10, 20, 10).normalize();
  scene.add(directionalLight);

  // Define the curve
  const curve = new THREE.CatmullRomCurve3([
    new THREE.Vector3(0, -20, 0),
    new THREE.Vector3(0, 0, -20),
    new THREE.Vector3(5, 5, -40),
    new THREE.Vector3(-5, 10, -60),
    new THREE.Vector3(0, 15, -100),
    new THREE.Vector3(0, 20, -120),
    new THREE.Vector3(2, 25, -130),
    new THREE.Vector3(10, 30, -160),
    new THREE.Vector3(-10, 35, -200),
    new THREE.Vector3(0, 40, -250),
    new THREE.Vector3(5, 45, -300),
    new THREE.Vector3(-5, 50, -350),
    new THREE.Vector3(0, 55, -400),
    new THREE.Vector3(10, 60, -450),
    new THREE.Vector3(-10, 65, -500),
    new THREE.Vector3(0, 70, -600),
    new THREE.Vector3(5, 75, -650),
    new THREE.Vector3(-5, 80, -700),
    new THREE.Vector3(0, 85, -750),
    new THREE.Vector3(10, 90, -800),
    new THREE.Vector3(-10, 95, -850),
    new THREE.Vector3(0, 100, -900),
    new THREE.Vector3(5, 105, -950),
    new THREE.Vector3(-5, 110, -1000),
    new THREE.Vector3(0, 115, -1050),
    new THREE.Vector3(10, 120, -1100),
    new THREE.Vector3(-10, 125, -1150),
    new THREE.Vector3(0, 130, -1200),
    new THREE.Vector3(5, 135, -1250),
    new THREE.Vector3(-5, 140, -1300),
    new THREE.Vector3(0, 145, -1350),
    new THREE.Vector3(10, 150, -1400),
    new THREE.Vector3(-10, 155, -1450),
    new THREE.Vector3(0, 160, -1500)
  ]);

  // Create a visible representation of the curve using TubeGeometry
  const tubeGeometry = new THREE.TubeGeometry(curve, 100, 0.2, 8, false);
  const tubeMaterial = new THREE.MeshBasicMaterial({ color: 0xff0000, wireframe: true });
  const tubeMesh = new THREE.Mesh(tubeGeometry, tubeMaterial);
  scene.add(tubeMesh);

  // Variables for scroll-based movement
  let scrollProgress = 0.1;  // Set initial scroll progress to 0.5 to start at the middle of the curve
  const minScrollProgress = scrollProgress;  // Minimum scroll progress is set to the initial scroll progress
  const maxScrollProgress = 1;  // Maximum scroll progress set to 1 (end of the curve)

  // Adjust camera position as user scrolls
  function updateCameraPosition() {
    // Calculate the camera position based on the scroll progress
    const cameraPosition = curve.getPoint(scrollProgress);
    camera.position.set(cameraPosition.x, cameraPosition.y + 30, cameraPosition.z + 70); // Adjust for height and distance
    camera.lookAt(curve.getPoint(Math.min(scrollProgress + 0.01, 1))); // Look at the next point along the curve
  }

  // Load the rocket
  let rocket;
  const mtlLoaderRocket = new THREE.MTLLoader();
  mtlLoaderRocket.load('3d/1393 Rocket Ship.mtl', (materials) => {
    materials.preload();
    const objLoaderRocket = new THREE.OBJLoader();
    objLoaderRocket.setMaterials(materials);
    objLoaderRocket.load('3d/1393 Rocket Ship.obj', (object) => {
      rocket = object;
      const startPosition = curve.getPoint(scrollProgress); // Get the starting point of the curve at the initial scroll progress
      rocket.position.set(startPosition.x, startPosition.y + 5, startPosition.z); // Position the rocket at the midpoint of the curve
      rocket.scale.set(0.2, 0.2, 0.2);
      rocket.rotation.y = Math.PI;
      rocket.rotation.x = Math.PI / 4; // Tilt the rocket upwards
      scene.add(rocket);
    });
  });

  // Load the planet
  let planet;
  const mtlLoaderPlanet = new THREE.MTLLoader();
  mtlLoaderPlanet.load('3d/1241 Venus.mtl', (materials) => {
    materials.preload();
    const objLoaderPlanet = new THREE.OBJLoader();
    objLoaderPlanet.setMaterials(materials);
    objLoaderPlanet.load('3d/1241 Venus.obj', (object) => {
      planet = object;
      planet.position.set(0, 115, -1090);
      planet.scale.set(0.03, 0.03, 0.03);
      planet.visible = false;
      scene.add(planet);
    });
  });


  // Camera initial position based on the midpoint of the curve
  const startCameraPosition = curve.getPoint(scrollProgress);
  camera.position.set(startCameraPosition.x, startCameraPosition.y + 40, startCameraPosition.z + 60);
  camera.lookAt(curve.getPoint(Math.min(scrollProgress + 0.01, 1)));

  // Animation loop
  function animate() {
    requestAnimationFrame(animate);

    if (rocket) {
      // Update rocket position along the curve
      const point = curve.getPoint(scrollProgress);
      rocket.position.set(point.x, point.y + 3, point.z); // Raise the rocket 3 units above the curve
      rocket.lookAt(curve.getPoint(Math.min(scrollProgress + 0.01, 1)));

            // Add oscillation to the rocket's movement
      rocket.position.x += Math.sin(Date.now() * 0.002) * 0.5;
      rocket.position.y += Math.sin(Date.now() * 0.003) * 0.5;

      // Show planet when rocket reaches a certain point
      if (rocket.position.z <= 20 && planet) {
        planet.visible = true;
      } else if (rocket.position.z >= 20 && planet) {
        planet.visible = false;
      }

      // Rocket oscillation effect
      rocket.rotation.y += 0.3 * Math.sin(Date.now() * 0.007);
      rocket.rotation.x += 0.03 * Math.sin(Date.now() * 0.009);
      // Camera follows rocket
      camera.position.set(
        rocket.position.x,
        rocket.position.y + 30, // Fixed height above the rocket
        rocket.position.z + 40 // Distance in front of the rocket
      );
      camera.lookAt(rocket.position);
    }

    renderer.render(scene, camera);
  }

  animate();

  // Scroll event listener
  window.addEventListener('wheel', (event) => {
    const delta = event.deltaY;
    scrollProgress += delta * 0.00005;  // Adjust the sensitivity for smoother scrolling
    scrollProgress = Math.max(minScrollProgress, Math.min(maxScrollProgress, scrollProgress));  // Clamp between minScrollProgress and maxScrollProgress
    updateCameraPosition();
  });

  // Handle window resize
  window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
  });
});

// "About Us" modal interactions
document.getElementById('aboutUsLink').addEventListener('click', () => {
  document.getElementById('aboutUsModal').style.display = 'flex';
});

document.getElementById('closeModal').addEventListener('click', () => {
  document.getElementById('aboutUsModal').style.display = 'none';
});