import * as THREE from 'https://cdn.skypack.dev/three@0.129.0/build/three.module.js';
import { GLTFLoader } from 'https://cdn.skypack.dev/three@0.129.0/examples/jsm/loaders/GLTFLoader.js';
import { OrbitControls } from 'https://cdn.skypack.dev/three@0.129.0/examples/jsm/controls/OrbitControls.js';
import { gsap } from 'https://cdn.skypack.dev/gsap';

const camera = new THREE.PerspectiveCamera(
    70,
    window.innerWidth / window.innerHeight,
    0.1,
    1000
);
camera.position.z = 1;
//camera.position.y = 200;
const scene = new THREE.Scene();
let dragon;

//when blender is loaded using GLTF its animation is directly loaded in mixer 
let mixer;


// loading blender in dragon variable using gltf loader
const loader = new GLTFLoader();
loader.load('shadow_dragon.glb',
    function (gltf) {
        dragon = gltf.scene;
        scene.add(dragon);
        dragon.scale.set(20, 20, 20); // Adjust as        
        
        //using mixer animation 
        mixer = new THREE.AnimationMixer(dragon);
        mixer.clipAction(gltf.animations[3]).play();
        modelMove();
       
        console.log(gltf.animations);
 
    },
    function (xhr) {},
    function (error) {}
);


//lights 
const ambientLight = new THREE.AmbientLight(0xffffff, 1.3);
scene.add(ambientLight);

const topLight = new THREE.DirectionalLight(0xffffff, 1);
topLight.position.set(500, 500, 500);
scene.add(topLight);


//alpha true to make background transparent otherwise it is black
const renderer = new THREE.WebGLRenderer({alpha: true});
renderer.setSize(window.innerWidth, window.innerHeight);
document.getElementById('container3D').appendChild(renderer.domElement);
//render.render(scene,camera) put it in loop reReneder3D so that if on page load the blender is not rendered the it renders after it is loaded

// Add Orbit Controls
const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true; // smooth orbit control
controls.enabled = false;  // Start with controls disabled
console.log("OrbitControls initialized", controls);


//function for loading the blender 
const reRender3D = () => {
    requestAnimationFrame(reRender3D);
    renderer.render(scene, camera);
    controls.update(); // Update controls in the render loop

    if(mixer){
        mixer.update(0.01);
    } 
    
};
reRender3D();



let arrPositionModel = [
    {
        id: "banner",
        position: {x: 0, y: -0.5, z: 0},
        rotation: {x: 0, y: 1, z: 0},
        scale: { x: 20, y: 20, z: 20 }
        
        
    },
    {
        id: "intro",
        position: { x: -2.4, y: -1, z: -5 },
        rotation: { x: 1, y: 0, z: 0 },
        scale: { x: 60, y: 60, z: 60 }
        
    },
    {
        id: "description",
        position: { x: 6, y: -1, z: -5 },
        rotation: { x: 0, y: 0.5, z: 0 },
        scale: { x: 40, y: 40, z: 40 }
    },
    {
        id: "contact",
        position: { x: 0.8, y: -0.2, z: 0 },
        rotation: { x: 0, y: -0.9, z: 0 },
        scale: { x: 15, y: 15, z: 15 }
    },
];

const modelMove = () => {
    const sections = document.querySelectorAll('.section');
    let currentSection;
    sections.forEach((section) => {
        const rect = section.getBoundingClientRect();
        if (rect.top <= window.innerHeight / 3) {
            currentSection = section.id;
        }
    });
    let position_active = arrPositionModel.findIndex(
        (val) => val.id == currentSection
    );
    if (position_active >= 0) {
        let new_coordinates = arrPositionModel[position_active];
        gsap.to(dragon.position, {
            x: new_coordinates.position.x,
            y: new_coordinates.position.y,
            z: new_coordinates.position.z,
            duration: 1,
            ease: "power1.out"
        });
        gsap.to(dragon.rotation, {
            x: new_coordinates.rotation.x,
            y: new_coordinates.rotation.y,
            z: new_coordinates.rotation.z,
            duration: 1,
            ease: "power1.out"
        });
        gsap.to(dragon.scale, {
            x: new_coordinates.scale.x,
            y: new_coordinates.scale.y,
            z: new_coordinates.scale.z,
            duration: 1,
            ease: "power1.out"
        });
        // Enable OrbitControls only in the banner section
        controls.enabled = (currentSection === 'banner');

        // Reset position/rotation when leaving the banner section
        if (currentSection !== 'banner') {
            controls.reset();  // Resets OrbitControls camera rotation to initial state
        }
    }
    
}

window.addEventListener('scroll', () => {
    if (dragon) {
        modelMove();
    }
})

//resizing code mandatory 
window.addEventListener('resize', () => {
    renderer.setSize(window.innerWidth, window.innerHeight);
    //since the bee shape of blender changes so it is important to change camera aspect and update it
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();

    //since blender was not resizing as i added a particular scale above i added this function extra 
    if (dragon) {
        const scaleFactor = Math.min(window.innerWidth / 1200, 1); // Use 1200 or another suitable base width
        dragon.scale.set(20 * scaleFactor, 20 * scaleFactor, 20 * scaleFactor);
    }
})

// Smooth scroll for anchor links with class "scroll-link"
document.querySelectorAll('.scroll-link').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const targetId = this.getAttribute('href').substring(1); // Get the ID without the #
        const targetElement = document.getElementById(targetId);

        if (targetElement) {
            window.scrollTo({
                top: targetElement.offsetTop,
                behavior: 'smooth' // Smooth scroll behavior
            });
        }
    });
});