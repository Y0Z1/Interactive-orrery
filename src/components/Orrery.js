import React, { useRef, useEffect, useState } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';

const Orrery = ({ neos }) => {
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
        const geometry = new THREE.SphereGeometry(starRadius, 16, 16);
        const material = new THREE.MeshBasicMaterial({ color: 0xffffff });
        const star = new THREE.Mesh(geometry, material);

        star.position.x = (Math.random() - 0.5) * distanceFactor * 5;
        star.position.y = (Math.random() - 0.5) * distanceFactor * 5;
        star.position.z = (Math.random() - 0.5) * distanceFactor * 5;

        scene.add(star);
      }
    };

    createStars();

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
    const ambientLight = new THREE.AmbientLight(0x404040, 10);
    scene.add(ambientLight);

    const pointLight = new THREE.PointLight(0xffffff, 2000);
    pointLight.position.set(0, 0, 0);
    scene.add(pointLight);

    // Raycaster for detecting hover
    const raycaster = new THREE.Raycaster();

    // Sun
    const sunRadius = 5;
    const sunGeometry = new THREE.SphereGeometry(sunRadius, 32, 32);
    const sunMaterial = new THREE.MeshBasicMaterial({ color: 0xffff00 });
    const sun = new THREE.Mesh(sunGeometry, sunMaterial);
    sun.userData = { name: 'Sun' };
    scene.add(sun);

    // Solar system planets data
    const planetsData = [
      { name: 'Mercury', size: 0.5, distance: 10, color: 0xa9a9a9 },
      { name: 'Venus', size: 1.2, distance: 15, color: 0xffcc33 },
      { name: 'Earth', size: 1.2, distance: 20, color: 0x3366ff },
      { name: 'Mars', size: 0.7, distance: 25, color: 0xff3300 },
      { name: 'Jupiter', size: 3, distance: 35, color: 0xffa500 },
      { name: 'Saturn', size: 2.5, distance: 45, color: 0xffff00 },
      { name: 'Uranus', size: 2, distance: 55, color: 0x66ccff },
      { name: 'Neptune', size: 2, distance: 60, color: 0x0000ff },
    ];

    // const planetsData = [
    //   { name: 'Mercury', model: '/models/mercury.glb', distance: 10 },
    //   { name: 'Venus', model: '/models/venus.glb', distance: 15 },
    //   { name: 'Earth', model: '/models/earth.glb', distance: 20 },
    //   { name: 'Mars', model: '/models/mars.glb', distance: 25 },
    //   { name: 'Jupiter', model: '/models/jupiter.glb', distance: 35 },
    //   { name: 'Saturn', model: '/models/saturn.glb', distance: 45 },
    //   { name: 'Uranus', model: '/models/uranus.glb', distance: 55 },
    //   { name: 'Neptune', model: '/models/neptune.glb', distance: 60 },
    // ];

    // const loadModel = (modelPath, position) => {
    //   return new Promise((resolve) => {
    //      const loader = new GLTFLoader(); 
    //     loader.load(modelPath, (gltf) => {
    //       const model = gltf.scene;
    //       model.position.set(position.x, position.y, position.z);
    //       scene.add(model);
    //       resolve(model);
    //     });
    //   });
    // };

    // // Add planets with loaded models
    // const planetsPromises = planetsData.map(async (planet) => {
    //   const initialAngle = Math.random() * Math.PI * 2;
    //   const position = {
    //     x: planet.distance * Math.cos(initialAngle),
    //     z: planet.distance * Math.sin(initialAngle),
    //     y: 0, // You can set y based on your needs
    //   };

    //   const model = await loadModel(planet.model, position);
    //   model.userData = { name: planet.name, angle: initialAngle };
    //   return model;
    // });

    // Promise.all(planetsPromises).then((loadedPlanets) => {
    //   // Store loaded planets for further updates in the animate loop
    //   planets = loadedPlanets;
    // });

    // Add planets with random starting angles
    const planets = planetsData.map((planet) => {
      const geometry = new THREE.SphereGeometry(planet.size, 32, 32);
      const material = new THREE.MeshBasicMaterial({ color: planet.color });
      const sphere = new THREE.Mesh(geometry, material);

      const initialAngle = Math.random() * Math.PI * 2;
      sphere.userData = { name: planet.name, angle: initialAngle };

      sphere.position.x = planet.distance * Math.cos(initialAngle);
      sphere.position.z = planet.distance * Math.sin(initialAngle);

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

      scene.add(sphere);
      return sphere;
    });

    // Near-Earth Objects (NEOs)
    const neoSpheres = neos.map((neo) => {
      const size = neo.estimated_diameter.kilometers.estimated_diameter_max / 2; // Scale down
      const geometry = new THREE.SphereGeometry(size, 32, 32);
      const material = new THREE.MeshBasicMaterial({
        color: neo.is_potentially_hazardous_asteroid ? 0xff0000 : 0x00ff00,
      });
      const sphere = new THREE.Mesh(geometry, material);

      sphere.position.x = Math.random() * 40 - 20;
      sphere.position.y = Math.random() * 40 - 20;
      sphere.position.z = Math.random() * 40 - 20;

      sphere.userData = { name: 'NEO ' + neo.name };
      scene.add(sphere);
      return sphere;
    });

    let earthModel; // Reference to the loaded model

    const loadModel = (url) => {
      const loader = new GLTFLoader();
      loader.load(
        url,
        (gltf) => {
          earthModel = gltf.scene; // Save the reference
          scene.add(earthModel);
          earthModel.position.set(10, 5, -20);
        },
        undefined,
        (error) => {
          console.error('An error occurred loading the model:', error);
        }
      );
    };

    loadModel("models/earth.glb")


    // Near-Earth Objects (NEOs)
    // const neoPromises = neos.map((neo) => {
      //   const size = neo.estimated_diameter.kilometers.estimated_diameter_max / 2; // Scale down
      //   return new Promise((resolve) => {
      //     loader.load('/path/to/neo_model.glb', (gltf) => {
      //       const neoModel = gltf.scene;
      //       neoModel.scale.set(size, size, size); // Scale based on size
      //       neoModel.position.set(Math.random() * 40 - 20, Math.random() * 40 - 20, Math.random() * 40 - 20);
      //       neoModel.userData = { name: 'NEO ' + neo.name };
      //       scene.add(neoModel);
      //       resolve(neoModel);
      //     });
      //   });
      // });
    
      // Promise.all(neoPromises).then((loadedNEOs) => {
      //   neoModels = loadedNEOs; // Store loaded NEOs for further updates
      // });

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

      sun.rotation.y += 0.001;
      neoSpheres.forEach((sphere) => {
        sphere.rotation.y += 0.005;
      });

      planets.forEach((planet, index) => {
        const planetData = planetsData[index];
        const speed = 0.0005;
        planet.userData.angle += speed;

        planet.position.x = planetData.distance * Math.cos(planet.userData.angle);
        planet.position.z = planetData.distance * Math.sin(planet.userData.angle);
      });

      raycaster.setFromCamera(mouse, camera);
      const intersects = raycaster.intersectObjects([...neoSpheres, ...planets, sun]);

      if (intersects.length > 0) {
        const intersectedObject = intersects[0].object;
        const hoveredName = intersectedObject.userData.name;
        if (intersectedObject.userData.angle !== undefined) {
          setHoveredPlanet(hoveredName);
          setHoveredNEO(null);
        } else {
          setHoveredNEO(hoveredName);
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
      <div ref={mountRef} style={{ width: '100%', height: '800px' }} />
      {(hoveredNEO || hoveredPlanet) && (
        <div ref={tooltipRef} className='absolute left-1/2 top-0 text-white bg-gray-900 p-2 rounded-md no-select pointer-events-none -translate-x-1/2 translate-y-1/2'>
          {hoveredNEO || hoveredPlanet}
        </div>
      )}
    </div>
  );
};

export default Orrery;
