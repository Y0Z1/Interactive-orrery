import React, { useRef, useEffect, useState } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';

const OrreryPx = ({ neos }) => {
  const mountRef = useRef(null);
  const [hoveredNEO, setHoveredNEO] = useState(null);
  const [hoveredPlanet, setHoveredPlanet] = useState(null);
  const tooltipRef = useRef(null);

  useEffect(() => {
    const mount = mountRef.current;

    // Create the scene
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x000000);

    // Create stars
    const createStars = () => {
      const starCount = 1500;
      const starRadius = 0.4;
      const distanceFactor = 300;

      for (let i = 0; i < starCount; i++) {
        const geometry = new THREE.BoxGeometry(starRadius);
        const material = new THREE.MeshBasicMaterial({ color: 0xffffff });
        const star = new THREE.Mesh(geometry, material);

        star.position.x = (Math.random() - 0.5) * distanceFactor * 5 + 100;
        star.position.y = (Math.random() - 0.5) * distanceFactor * 5 + 100;
        star.position.z = (Math.random() - 0.5) * distanceFactor * 5 + 100;

        scene.add(star);
      }
    };

    createStars(); // Call the function to add stars to the scene

    // Camera
    const camera = new THREE.PerspectiveCamera(75, mount.clientWidth / mount.clientHeight, 0.1, 1000);
    camera.position.z = 100;
    camera.position.x = 50;
    camera.position.y = 50;

    // Renderer
    const renderer = new THREE.WebGLRenderer();
    renderer.setSize(mount.clientWidth, mount.clientHeight);
    mount.appendChild(renderer.domElement);

    // Lighting
    const ambientLight = new THREE.AmbientLight(0x404040);
    scene.add(ambientLight);

    const pointLight = new THREE.PointLight(0xffffff, 1);
    pointLight.position.set(0, 0, 0);
    scene.add(pointLight);

    // Raycaster for detecting hover
    const raycaster = new THREE.Raycaster();

      // Sun with texture
      const sunRadius = 5;
      const sunGeometry = new THREE.BoxGeometry(sunRadius,sunRadius,sunRadius);
      const textureLoader = new THREE.TextureLoader()
      const textureFront = textureLoader.load('/textures/Cube_Sun-3.png');
      const textureBack = textureLoader.load('/textures/Cube_Sun-1.png');
      const textureLeft = textureLoader.load('/textures/Cube_Sun-T.png');
      const textureRight = textureLoader.load('/textures/Cube_Sun-B.png');
      const textureTop = textureLoader.load('/textures/Cube_Sun-2.png');
      const textureBottom = textureLoader.load('/textures/Cube_Sun-4.png');

      // Create materials for each face of the box
      const sunMaterial = [
        new THREE.MeshBasicMaterial({ map: textureFront }),  // Front face
        new THREE.MeshBasicMaterial({ map: textureBack }),   // Back face
        new THREE.MeshBasicMaterial({ map: textureLeft }),   // Left face
        new THREE.MeshBasicMaterial({ map: textureRight }),  // Right face
        new THREE.MeshBasicMaterial({ map: textureTop }),    // Top face
        new THREE.MeshBasicMaterial({ map: textureBottom }), // Bottom face
      ];

      const sun = new THREE.Mesh(sunGeometry, sunMaterial);
      sun.userData = { name: 'Sun', type:'Yellow Dwarf Star', overview:"The Sun's gravity holds the solar system together, keeping everything in its orbit. The connection and interactions between the Sun and Earth drive the seasons, ocean currents, weather, climate, radiation belts and auroras. Though it is special to us, there are billions of stars like our Sun scattered across the Milky Way galaxy. The Sun has many names in many cultures. The Latin word for Sun is “sol,” which is the main adjective for all things Sun-related: solar.", length_of_year:'230 million Earth Years' };
      scene.add(sun);


    // Solar system planets data with texture paths
    const planetsData = [
      { name: 'Mercury', size: 0.5, distance: 10, texture: '/textures/mercury.jpg',hasRings:false,
        type: "Terrestrial Planet",
        overview: "Mercury is the closest planet to the Sun and has a thin atmosphere, making it inhospitable for life as we know it. Its surface is rocky and heavily cratered, resembling the Moon. Mercury experiences extreme temperature fluctuations due to its proximity to the Sun.",
        length_of_year: "88 Earth Days" },
      { name: 'Venus', size: 1.2, distance: 15, texture: '/textures/venus.jpg',hasRings:false,
        type: "Terrestrial Planet",
        overview: "Venus, often called Earth’s 'sister planet,' is similar in size but has a thick, toxic atmosphere primarily composed of carbon dioxide, with clouds of sulfuric acid. This results in a runaway greenhouse effect.",
        length_of_year: "225 Earth Days" },
      { name: 'Earth', size: 1.2, distance: 20, texture: '/textures/earth.jpg',hasRings:false,
        type: "Terrestrial Planet",
        overview: "Earth is the only known planet to support life. It has a diverse range of ecosystems, weather patterns, and climates, driven by its axial tilt and distance from the Sun.",
        length_of_year: "365.25 Earth Days" },
      { name: 'Mars', size: 0.7, distance: 25, texture: '/textures/mars.jpg',hasRings:false,
        type: "Terrestrial Planet",
        overview: "Mars, known as the 'Red Planet,' has a thin atmosphere and surface conditions that include the largest volcano and canyon in the solar system. Its reddish appearance is due to iron oxide.",
        length_of_year: "687 Earth Days" },
      { name: 'Jupiter', size: 3, distance: 35, texture: '/textures/jupiter.jpg',hasRings:false,
        type: "Gas Giant",
        overview: "Jupiter is the largest planet in the solar system and is known for its Great Red Spot, a massive storm larger than Earth. It has a thick atmosphere composed mostly of hydrogen and helium.",
        length_of_year: "11.86 Earth Years" },
      { name: 'Saturn', size: 2.5, distance: 45, texture: '/textures/saturn.jpg', hasRings:true,ringTexture:'/textures/saturnring.jpg',
        type: "Gas Giant",
        overview: "Saturn is famous for its stunning rings, made primarily of ice and rock particles. It has a thick atmosphere of hydrogen and helium.",
        length_of_year: "29.46 Earth Years" },
      { name: 'Uranus', size: 2, distance: 55, texture: '/textures/uranus.jpg', hasRings:true,ringTexture:'/textures/uranusring.gif',
        type: "Ice Giant",
        overview: "Uranus is unique for its tilted axis, causing extreme seasonal variations. It has a cold atmosphere composed mainly of hydrogen, helium, and methane.",
        length_of_year: "84 Earth Years" },
      { name: 'Neptune', size: 2, distance: 60, texture: '/textures/neptune.jpg', hasRings:false,
        type: "Ice Giant",
        overview: "Neptune is the farthest planet from the Sun and is known for its deep blue color. It has strong winds and storms, including the Great Dark Spot.",
        length_of_year: "164.8 Earth Years" },
    ];


        // Function to create rings
        const createRing = (planet) => {
          const ringGeometry = new THREE.RingGeometry(planet.size * 1.5, planet.size * 2.25, 4);
          const ringMaterial = new THREE.MeshBasicMaterial({
            color: 0xffffff,
            side: THREE.DoubleSide,
            transparent: true,
            opacity: 0.7,
            });
            const ring = new THREE.Mesh(ringGeometry, ringMaterial);
              
            // Rotate the ring to be flat along the planet's equator
            ring.rotation.x = Math.PI /2;
            if (planet.name==='Uranus'){
              ring.rotation.x = Math.PI;
            }
              
            // Position the ring to be centered on the planet
            ring.position.y = 0; // Ensure it's at the same level as the planet
            return ring;
          };



    // Add planets with random starting angles
    const planets = planetsData.map((planet) => {
      const geometry = new THREE.BoxGeometry(planet.size+1,planet.size+1,planet.size+1);
      const textureLoader = new THREE.TextureLoader()
      const textureFront = textureLoader.load('/textures/Cube_'+planet.name+'-3.png');
      const textureBack = textureLoader.load('/textures/Cube_'+planet.name+'-1.png');
      const textureLeft = textureLoader.load('/textures/Cube_'+planet.name+'-T.png');
      const textureRight = textureLoader.load('/textures/Cube_'+planet.name+'-B.png');
      const textureTop = textureLoader.load('/textures/Cube_'+planet.name+'-2.png');
      const textureBottom = textureLoader.load('/textures/Cube_'+planet.name+'-4.png');

      // Create materials for each face of the box
      const material = [
        new THREE.MeshBasicMaterial({ map: textureFront }),  // Front face
        new THREE.MeshBasicMaterial({ map: textureBack }),   // Back face
        new THREE.MeshBasicMaterial({ map: textureLeft }),   // Left face
        new THREE.MeshBasicMaterial({ map: textureRight }),  // Right face
        new THREE.MeshBasicMaterial({ map: textureTop }),    // Top face
        new THREE.MeshBasicMaterial({ map: textureBottom }), // Bottom face
      ];
      const sphere = new THREE.Mesh(geometry, material);

      const initialAngle = Math.random() * Math.PI * 2;
      sphere.userData = { name: planet.name, angle: initialAngle, type:planet.type, overview:planet.overview,length_of_year:planet.length_of_year};

       // Create orbit path for the planet
       const points = [];
       for (let i = 0; i <= 100; i++) {
         const angle = (i / 100) * Math.PI * 2; // Full circle
         points.push(
           new THREE.Vector3(
             planet.distance * Math.cos(angle),
             0, // Assuming orbits are in the xz-plane
             planet.distance * Math.sin(angle)
           )
         );
       }
       const orbitGeometry = new THREE.BufferGeometry().setFromPoints(points);
       const orbitMaterial = new THREE.LineBasicMaterial({ color: 0xffffff, transparent: true, opacity: 0.5 });
       const orbitLine = new THREE.Line(orbitGeometry, orbitMaterial);
       scene.add(orbitLine); // Add orbit line to the scene
 

      sphere.position.x = planet.distance * Math.cos(initialAngle);
      sphere.position.z = planet.distance * Math.sin(initialAngle);

             // Create the ring for the planet if it has rings
      if (planet.hasRings) {
        const ring = createRing(planet);
        scene.add(ring);
        ring.userData = { parent: sphere }; // Associate the ring with the planet
      }

      scene.add(sphere);
      return sphere;
    });

        // Add planets to the scene
        planets.forEach(planet => scene.add(planet));

    // Near-Earth Objects (NEOs)
    const neoSpheres = neos.map((neo) => {
      const size = neo.estimated_diameter.kilometers.estimated_diameter_max / 2; // Scale down
      const geometry = new THREE.BoxGeometry(size,size,size);
      const textureLoader = new THREE.TextureLoader()
      const textureFront = textureLoader.load('/textures/Cube_NEO-3.png');
      const textureBack = textureLoader.load('/textures/Cube_NEO-1.png');
      const textureLeft = textureLoader.load('/textures/Cube_NEO-T.png');
      const textureRight = textureLoader.load('/textures/Cube_NEO-B.png');
      const textureTop = textureLoader.load('/textures/Cube_NEO-2.png');
      const textureBottom = textureLoader.load('/textures/Cube_NEO-4.png');

      // Create materials for each face of the box
      const material = [
        new THREE.MeshBasicMaterial({ map: textureFront }),  // Front face
        new THREE.MeshBasicMaterial({ map: textureBack }),   // Back face
        new THREE.MeshBasicMaterial({ map: textureLeft }),   // Left face
        new THREE.MeshBasicMaterial({ map: textureRight }),  // Right face
        new THREE.MeshBasicMaterial({ map: textureTop }),    // Top face
        new THREE.MeshBasicMaterial({ map: textureBottom }), // Bottom face
      ];

      const sphere = new THREE.Mesh(geometry, material);

      sphere.position.x = Math.random() * 40 - 20;
      sphere.position.y = Math.random() * 40 - 40;
      sphere.position.z = Math.random() * 40 + 20;

      sphere.userData = { name: 'NEO ' + neo.name };
      scene.add(sphere);
      return sphere;
    });

    // Orbit Controls
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.1;
    controls.rotateSpeed = 0.5;
    controls.minDistance = sunRadius + 5;
    controls.maxDistance = 150;

    const mouse = new THREE.Vector2(); // Move the mouse declaration here

    // Handle mouse move
    const onMouseMove = (event) => {
      const rect = renderer.domElement.getBoundingClientRect();
      mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
      mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;
    };

    window.addEventListener('mousemove', onMouseMove);

    // Animation loop
    const animate = () => {
      requestAnimationFrame(animate);

      sun.rotation.y += 0.005;
      neoSpheres.forEach((sphere) => {
        sphere.rotation.y += 0.0005;
      });

      planets.forEach(planet => {
        const { angle } = planet.userData;
        const distance = planetsData.find(p => p.name === planet.userData.name).distance;
        planet.position.x = distance * Math.cos(angle);
        planet.position.z = distance * Math.sin(angle);
        planet.rotation.y += 0.01;
        planet.userData.angle += 0.001; // Adjust the speed of rotation

        // Update ring position based on planet's position
        const ring = scene.children.find(child => child.userData && child.userData.parent === planet);
        if (ring) {
          ring.position.x = planet.position.x;
          ring.position.z = planet.position.z;
        }
      });

      raycaster.setFromCamera(mouse, camera);
      const intersects = raycaster.intersectObjects([...neoSpheres, ...planets, sun]);

      if (intersects.length > 0) {
        const intersectedObject = intersects[0].object;
        const hoveredName = intersectedObject.userData;
        if (intersectedObject.userData.type !== undefined) {
          setHoveredPlanet(hoveredName);
          setHoveredNEO(null);
        } else {
          setHoveredNEO(hoveredName.name);
          setHoveredPlanet(null);
        }

        // Update tooltip position using the updated mouse state
        if (tooltipRef.current) {
          tooltipRef.current.style.left = `50%`;
          tooltipRef.current.style.top = `0`;
        }
      } else {
        setHoveredNEO(null);
        setHoveredPlanet(null);
      }

      controls.update();
      renderer.render(scene, camera);
    };

    animate();

    return () => {
      window.removeEventListener('mousemove', onMouseMove);
      mount.removeChild(renderer.domElement);
      controls.dispose();
    };
  }, [neos]);

  return (
    <div style={{ position: 'relative' }}>
      <div ref={mountRef} className='w-full h-[80vh]' />
      {(hoveredNEO || hoveredPlanet) && (
        <div ref={tooltipRef} className='absolute left-1/2 top-0 text-white bg-gray-900 p-2 rounded-md no-select pointer-events-none -translate-x-1/2 translate-y-1/2'>
          {hoveredNEO ? hoveredNEO : (
            <>
              <h3>{hoveredPlanet.name}</h3>
              <div className='absolute left-10 top-0 text-[0.8em] text-white bg-gray-900 p-4 w-[50vh] rounded-md no-select pointer-events-none translate-x-3/4'>
              <h2 className='text-lg font-bold'>Type: </h2><h3 className='text-[0.8em]'>{hoveredPlanet.type}</h3>
              <h2 className='text-lg font-bold'>Overview: </h2><h3 className='text-[0.8em]'>{hoveredPlanet.overview}</h3>
              <h2 className='text-lg font-bold'>Length of year: </h2><h3 className='text-[0.8em]'>{hoveredPlanet.length_of_year}</h3>
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
};

export default OrreryPx;
