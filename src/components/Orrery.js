import React, { useRef, useEffect, useState } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';

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
      const starCount = 1500; // Number of stars
      const starRadius = 0.4; // Star size
      const distanceFactor = 300; // Adjust this for distance
    
      for (let i = 0; i < starCount; i++) {
        const geometry = new THREE.SphereGeometry(starRadius, 16, 16);
        const material = new THREE.MeshBasicMaterial({ color: 0xffffff });
        const star = new THREE.Mesh(geometry, material);
    
        // Set the stars farther away
        star.position.x = (Math.random() - 0.5) * distanceFactor * 5; // Increase multiplier for more distance
        star.position.y = (Math.random() - 0.5) * distanceFactor * 5;
        star.position.z = (Math.random() - 0.5) * distanceFactor * 5;
    
        scene.add(star);
      }
    };
    
    createStars(); // Call the function to add stars to the scene


    // Camera
    const camera = new THREE.PerspectiveCamera(75, mount.clientWidth / mount.clientHeight, 0.1, 1000);
    camera.position.z = 100;

    // Renderer
    const renderer = new THREE.WebGLRenderer();
    renderer.setSize(mount.clientWidth, mount.clientHeight);
    mount.appendChild(renderer.domElement);

    // Lighting
    const ambientLight = new THREE.AmbientLight(0x404040);
    scene.add(ambientLight);

    const pointLight = new THREE.PointLight(0xffffff, 1);
    pointLight.position.set(10, 10, 10);
    scene.add(pointLight);

    // Raycaster for detecting hover
    const raycaster = new THREE.Raycaster();
    const mouse = new THREE.Vector2();

    // Sun
    const sunRadius = 5
    const sunGeometry = new THREE.SphereGeometry(sunRadius, 32, 32);
    const sunMaterial = new THREE.MeshBasicMaterial({ color: 0xffff00 });
    const sun = new THREE.Mesh(sunGeometry, sunMaterial);
    sun.userData={name:'Sun'};
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

    // Add planets with random starting angles
    const planets = planetsData.map((planet) => {
      const geometry = new THREE.SphereGeometry(planet.size, 32, 32);
      const material = new THREE.MeshBasicMaterial({ color: planet.color });
      const sphere = new THREE.Mesh(geometry, material);

      const initialAngle = Math.random() * Math.PI * 2;
      sphere.userData = { name: planet.name, angle: initialAngle };

      sphere.position.x = planet.distance * Math.cos(initialAngle);
      sphere.position.z = planet.distance * Math.sin(initialAngle);
      
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

      sphere.userData = { name: 'NEO '+neo.name };
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

    // Handle mouse move
    const onMouseMove = (event) => {
      const rect = renderer.domElement.getBoundingClientRect();
      mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
      mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;
    };

    window.addEventListener('mousemove', onMouseMove);

    // Animation loop
    const animate = (event) => {
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

        // Update tooltip position
        if (tooltipRef.current) {
          tooltipRef.current.style.left = `${event.clientX}px`;
          tooltipRef.current.style.top = `${event.clientY}px`;
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
        <div
          ref={tooltipRef}
          style={{
            position: 'absolute',
            backgroundColor: 'rgba(0, 0, 0, 0.7)',
            color: 'white',
            padding: '5px',
            borderRadius: '3px',
            pointerEvents: 'none',
            transform: 'translate(-50%,50%)',
            whiteSpace: 'nowrap',
            top: '0',
            left: '50%',
          }}
        >
          {hoveredNEO || hoveredPlanet}
        </div>
      )}
    </div>
  );
};

export default Orrery;
