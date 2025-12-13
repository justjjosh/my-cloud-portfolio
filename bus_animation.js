
import * as THREE from 'three';

// --- Configuration ---
const CONFIG = {
    colors: {
        busBody: 0xf5a623, // Danfo Yellow
        busStripe: 0x000000,
        glass: 0x87ceeb,
        tire: 0x333333,
        rim: 0xcccccc
    },
    tools: [
        { name: 'AWS', color: '#ff9900', icon: '' }, // fa-aws
        { name: 'Docker', color: '#0db7ed', icon: 'kh' }, // fa-docker (approx) or use text
        { name: 'Python', color: '#3776ab', icon: 'xe' }, // fa-python
        { name: 'K8s', color: '#326ce5', icon: 'dh' }, // custom
        { name: 'Linux', color: '#f5a623', icon: '' }, // fa-linux
        { name: 'Git', color: '#f05032', icon: '' }  // fa-git-alt
        // Note: Using FontAwesome unicodes requires loading the font in canvas, 
        // which can be tricky. Falling back to text-based icons or simple colored cubes for MVP 
        // if font load fails, but we'll try to draw text.
    ]
};

// --- Scene Setup ---
const container = document.getElementById('bus-container');
const scene = new THREE.Scene();

// Camera
const camera = new THREE.PerspectiveCamera(45, container.offsetWidth / container.offsetHeight, 0.1, 100);
camera.position.set(0, 2, 8);
camera.lookAt(0, 0, 0);

// Renderer
const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
renderer.setSize(container.offsetWidth, container.offsetHeight);
renderer.setPixelRatio(window.devicePixelRatio);
container.appendChild(renderer.domElement);

// Lights
const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
scene.add(ambientLight);

const dirLight = new THREE.DirectionalLight(0xffffff, 0.8);
dirLight.position.set(5, 5, 5);
scene.add(dirLight);

// --- Bus Construction ---
function createDanfoBus() {
    const busGroup = new THREE.Group();

    // 1. Body
    const bodyGeo = new THREE.BoxGeometry(3, 1.4, 1.2);
    const bodyMat = new THREE.MeshStandardMaterial({ color: CONFIG.colors.busBody });
    const body = new THREE.Mesh(bodyGeo, bodyMat);
    body.position.y = 0.9;
    busGroup.add(body);

    // 2. Black Stripes (Danfo signature)
    const stripeGeo = new THREE.BoxGeometry(3.02, 0.2, 1.22);
    const stripeMat = new THREE.MeshBasicMaterial({ color: CONFIG.colors.busStripe });
    const stripe1 = new THREE.Mesh(stripeGeo, stripeMat);
    stripe1.position.y = 0.9;
    busGroup.add(stripe1);

    // 3. Roof
    const roofGeo = new THREE.BoxGeometry(2.9, 0.1, 1.1);
    const roofMat = new THREE.MeshStandardMaterial({ color: 0xffffff }); // White roof common
    const roof = new THREE.Mesh(roofGeo, roofMat);
    roof.position.y = 1.65;
    busGroup.add(roof);

    // 4. Windows (Simple blue boxes)
    const windowGeo = new THREE.BoxGeometry(2.8, 0.5, 1.25);
    const windowMat = new THREE.MeshStandardMaterial({ color: CONFIG.colors.glass, transparent: true, opacity: 0.7 });
    const windows = new THREE.Mesh(windowGeo, windowMat);
    windows.position.y = 1.2;
    busGroup.add(windows);

    // 5. Wheels
    const wheelGeo = new THREE.CylinderGeometry(0.35, 0.35, 0.2, 32);
    wheelGeo.rotateX(Math.PI / 2);
    const wheelMat = new THREE.MeshStandardMaterial({ color: CONFIG.colors.tire });

    const positions = [
        [-1, 0.35, 0.6],
        [1, 0.35, 0.6],
        [-1, 0.35, -0.6],
        [1, 0.35, -0.6]
    ];

    positions.forEach(pos => {
        const wheel = new THREE.Mesh(wheelGeo, wheelMat);
        wheel.position.set(...pos);
        busGroup.add(wheel);

        // Rims
        const rim = new THREE.Mesh(new THREE.CylinderGeometry(0.2, 0.2, 0.22, 16), new THREE.MeshStandardMaterial({ color: CONFIG.colors.rim }));
        rim.rotateX(Math.PI / 2);
        rim.position.set(...pos);
        busGroup.add(rim);
    });

    return busGroup;
}

const bus = createDanfoBus();
scene.add(bus);

// --- Icon System ---
const icons = [];
const iconTextureCache = {};

function getIconTexture(toolName, color) {
    if (iconTextureCache[toolName]) return iconTextureCache[toolName];

    const canvas = document.createElement('canvas');
    canvas.width = 128;
    canvas.height = 128;
    const ctx = canvas.getContext('2d');

    // Bg
    ctx.fillStyle = color;
    ctx.beginPath();
    ctx.roundRect(0, 0, 128, 128, 20);
    ctx.fill();

    // Text (Simulating icon with first letter if font fails, but intended as logo)
    ctx.fillStyle = 'white';
    ctx.font = 'bold 80px sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(toolName[0], 64, 64);

    // Border
    ctx.strokeStyle = 'white';
    ctx.lineWidth = 6;
    ctx.strokeRect(4, 4, 120, 120);

    const texture = new THREE.CanvasTexture(canvas);
    iconTextureCache[toolName] = texture;
    return texture;
}

function spawnIcon() {
    // Pick random tool
    const tool = CONFIG.tools[Math.floor(Math.random() * CONFIG.tools.length)];

    const geometry = new THREE.BoxGeometry(0.5, 0.5, 0.5);
    const material = new THREE.MeshStandardMaterial({
        map: getIconTexture(tool.name, tool.color)
    });

    const icon = new THREE.Mesh(geometry, material);

    // Spawn at back of bus
    icon.position.copy(bus.position);
    icon.position.x -= 1.5; // Behind bus
    icon.position.y += 0.5;

    // Random initial velocity
    icon.userData = {
        velocity: new THREE.Vector3(
            -0.05 - Math.random() * 0.05, // Fly out back
            0.1 + Math.random() * 0.1,    // Pop up
            (Math.random() - 0.5) * 0.1   // Slight drift
        ),
        rotSpeed: new THREE.Vector3(
            Math.random() * 0.1,
            Math.random() * 0.1,
            Math.random() * 0.1
        )
    };

    scene.add(icon);
    icons.push(icon);
}


// --- Animation State ---
let time = 0;
const busSpeed = 0.0; // Stationary bus, world moves, or bus moves in bounds?
// Let's make the bus drive back and forth or just bob in place while "moving" (road moving effect)
// Simpler: Bus slightly moves forward/back, bobbing.

function animate() {
    requestAnimationFrame(animate);

    time += 0.05;

    // Bus Animation (Suspension/Engine vibration)
    bus.position.y = Math.sin(time * 2) * 0.02;
    bus.rotation.z = Math.sin(time * 1.5) * 0.01; // Slight rock

    // Spawn icons periodically
    if (Math.floor(time * 20) % 50 === 0) {
        spawnIcon();
    }

    // Update Icons
    for (let i = icons.length - 1; i >= 0; i--) {
        const icon = icons[i];

        // Physics
        icon.position.add(icon.userData.velocity);
        icon.rotation.x += icon.userData.rotSpeed.x;
        icon.rotation.y += icon.userData.rotSpeed.y;
        icon.userData.velocity.y -= 0.005; // Gravity

        // Remove if too low
        if (icon.position.y < -3) {
            scene.remove(icon);
            icons.splice(i, 1);
        }
    }

    renderer.render(scene, camera);
}

// --- Resize Handler ---
window.addEventListener('resize', () => {
    camera.aspect = container.offsetWidth / container.offsetHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(container.offsetWidth, container.offsetHeight);
});

animate();
