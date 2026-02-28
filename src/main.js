import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { CSS2DRenderer, CSS2DObject } from 'three/examples/jsm/renderers/CSS2DRenderer.js';

// ========== 场景初始化 ==========
const scene = new THREE.Scene();

const camera = new THREE.PerspectiveCamera(
    75,
    window.innerWidth / window.innerHeight,
    0.1,
    2000
);
camera.position.set(0, 80, 150);

const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(window.devicePixelRatio);
document.getElementById('canvas-container').appendChild(renderer.domElement);

// CSS2D 渲染器用于显示标签
const labelRenderer = new CSS2DRenderer();
labelRenderer.setSize(window.innerWidth, window.innerHeight);
labelRenderer.domElement.style.position = 'absolute';
labelRenderer.domElement.style.top = '0px';
labelRenderer.domElement.style.pointerEvents = 'none';
document.getElementById('canvas-container').appendChild(labelRenderer.domElement);

const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;
controls.dampingFactor = 0.05;

// ========== 创建行星标签 ==========
function createPlanetLabel(name, emoji) {
    const div = document.createElement('div');
    div.className = 'planet-label';
    div.textContent = `${emoji} ${name}`;
    div.style.cssText = `
        color: #ffffff;
        font-family: 'Microsoft YaHei', Arial, sans-serif;
        font-size: 12px;
        padding: 4px 8px;
        background: rgba(0, 0, 0, 0.6);
        border-radius: 4px;
        border: 1px solid rgba(255, 255, 255, 0.3);
        white-space: nowrap;
        pointer-events: none;
        text-shadow: 0 0 4px rgba(255, 255, 255, 0.5);
    `;
    const label = new CSS2DObject(div);
    label.position.set(0, 3, 0);
    return label;
}

// ========== 程序化纹理生成 ==========
function createPlanetTexture(type, size = 512) {
    const canvas = document.createElement('canvas');
    canvas.width = size;
    canvas.height = size;
    const ctx = canvas.getContext('2d');
    
    switch(type) {
        case 'mercury':
            ctx.fillStyle = '#8c7853';
            ctx.fillRect(0, 0, size, size);
            for(let i = 0; i < 200; i++) {
                const x = Math.random() * size;
                const y = Math.random() * size;
                const r = Math.random() * 20 + 5;
                ctx.beginPath();
                ctx.arc(x, y, r, 0, Math.PI * 2);
                ctx.fillStyle = `rgba(60, 50, 40, ${Math.random() * 0.5})`;
                ctx.fill();
            }
            break;
            
        case 'venus':
            const venusGrad = ctx.createLinearGradient(0, 0, size, size);
            venusGrad.addColorStop(0, '#ffc649');
            venusGrad.addColorStop(0.5, '#e6a030');
            venusGrad.addColorStop(1, '#d4891a');
            ctx.fillStyle = venusGrad;
            ctx.fillRect(0, 0, size, size);
            for(let i = 0; i < 30; i++) {
                ctx.beginPath();
                ctx.arc(Math.random() * size, Math.random() * size, Math.random() * 80 + 20, 0, Math.PI * 2);
                ctx.fillStyle = `rgba(255, 220, 150, ${Math.random() * 0.3})`;
                ctx.fill();
            }
            break;
            
        case 'earth':
            ctx.fillStyle = '#1a5fb4';
            ctx.fillRect(0, 0, size, size);
            const continents = [
                {x: 100, y: 150, w: 120, h: 80},
                {x: 250, y: 100, w: 150, h: 120},
                {x: 350, y: 200, w: 100, h: 150},
                {x: 80, y: 300, w: 80, h: 100},
                {x: 400, y: 350, w: 90, h: 70}
            ];
            continents.forEach(c => {
                ctx.fillStyle = '#2e7d32';
                ctx.beginPath();
                ctx.ellipse(c.x, c.y, c.w/2, c.h/2, 0, 0, Math.PI * 2);
                ctx.fill();
                for(let i = 0; i < 5; i++) {
                    ctx.fillStyle = `rgba(60, 100, 60, ${Math.random() * 0.5})`;
                    ctx.beginPath();
                    ctx.ellipse(c.x + (Math.random()-0.5)*c.w*0.6, c.y + (Math.random()-0.5)*c.h*0.6, c.w/6, c.h/6, 0, 0, Math.PI * 2);
                    ctx.fill();
                }
            });
            for(let i = 0; i < 15; i++) {
                ctx.fillStyle = `rgba(255, 255, 255, ${Math.random() * 0.4 + 0.1})`;
                ctx.beginPath();
                ctx.ellipse(Math.random() * size, Math.random() * size, Math.random() * 60 + 20, Math.random() * 30 + 10, 0, 0, Math.PI * 2);
                ctx.fill();
            }
            break;
            
        case 'mars':
            const marsGrad = ctx.createRadialGradient(size/2, size/2, 0, size/2, size/2, size);
            marsGrad.addColorStop(0, '#c1440e');
            marsGrad.addColorStop(0.5, '#a33a0c');
            marsGrad.addColorStop(1, '#8b3009');
            ctx.fillStyle = marsGrad;
            ctx.fillRect(0, 0, size, size);
            ctx.fillStyle = 'rgba(255, 255, 255, 0.7)';
            ctx.beginPath();
            ctx.ellipse(size/2, 30, 80, 30, 0, 0, Math.PI * 2);
            ctx.fill();
            for(let i = 0; i < 50; i++) {
                ctx.beginPath();
                ctx.arc(Math.random() * size, Math.random() * size, Math.random() * 15 + 3, 0, Math.PI * 2);
                ctx.fillStyle = `rgba(100, 30, 10, ${Math.random() * 0.4})`;
                ctx.fill();
            }
            break;
            
        case 'jupiter':
            const jupiterColors = ['#d8ca9d', '#c4a574', '#a67c52', '#8b6914', '#d4b896'];
            for(let y = 0; y < size; y += 25) {
                ctx.fillStyle = jupiterColors[Math.floor(y / 25) % jupiterColors.length];
                ctx.fillRect(0, y, size, 30);
            }
            ctx.fillStyle = '#c45c3e';
            ctx.beginPath();
            ctx.ellipse(350, 280, 60, 35, 0.2, 0, Math.PI * 2);
            ctx.fill();
            ctx.fillStyle = '#a84832';
            ctx.beginPath();
            ctx.ellipse(350, 280, 40, 22, 0.2, 0, Math.PI * 2);
            ctx.fill();
            break;
            
        case 'saturn':
            const saturnColors = ['#f4d59e', '#e8c97a', '#d4b56a', '#c9a85c', '#f0d090'];
            for(let y = 0; y < size; y += 30) {
                ctx.fillStyle = saturnColors[Math.floor(y / 30) % saturnColors.length];
                ctx.fillRect(0, y, size, 35);
            }
            break;
            
        case 'uranus':
            const uranusGrad = ctx.createLinearGradient(0, 0, 0, size);
            uranusGrad.addColorStop(0, '#a8e0e0');
            uranusGrad.addColorStop(0.5, '#d1e7e7');
            uranusGrad.addColorStop(1, '#8fd4d4');
            ctx.fillStyle = uranusGrad;
            ctx.fillRect(0, 0, size, size);
            for(let y = 0; y < size; y += 40) {
                ctx.fillStyle = `rgba(150, 200, 200, ${Math.random() * 0.3})`;
                ctx.fillRect(0, y, size, 20);
            }
            break;
            
        case 'neptune':
            const neptuneGrad = ctx.createRadialGradient(size/2, size/2, 0, size/2, size/2, size);
            neptuneGrad.addColorStop(0, '#4169e1');
            neptuneGrad.addColorStop(0.5, '#5b5ddf');
            neptuneGrad.addColorStop(1, '#3a4fc9');
            ctx.fillStyle = neptuneGrad;
            ctx.fillRect(0, 0, size, size);
            ctx.fillStyle = 'rgba(30, 40, 100, 0.6)';
            ctx.beginPath();
            ctx.ellipse(200, 250, 70, 40, 0.1, 0, Math.PI * 2);
            ctx.fill();
            for(let i = 0; i < 8; i++) {
                ctx.fillStyle = `rgba(100, 150, 255, ${Math.random() * 0.3})`;
                ctx.fillRect(0, i * 64 + 20, size, 15);
            }
            break;
            
        case 'sun':
            const sunGrad = ctx.createRadialGradient(size/2, size/2, 0, size/2, size/2, size/2);
            sunGrad.addColorStop(0, '#ffffff');
            sunGrad.addColorStop(0.3, '#ffdd00');
            sunGrad.addColorStop(0.7, '#ff9900');
            sunGrad.addColorStop(1, '#ff6600');
            ctx.fillStyle = sunGrad;
            ctx.fillRect(0, 0, size, size);
            for(let i = 0; i < 20; i++) {
                const x = Math.random() * size;
                const y = Math.random() * size;
                const r = Math.random() * 30 + 10;
                ctx.beginPath();
                ctx.arc(x, y, r, 0, Math.PI * 2);
                ctx.fillStyle = `rgba(255, ${150 + Math.random() * 50}, 0, ${Math.random() * 0.5 + 0.3})`;
                ctx.fill();
            }
            break;
    }
    
    const texture = new THREE.CanvasTexture(canvas);
    texture.wrapS = THREE.RepeatWrapping;
    texture.wrapT = THREE.RepeatWrapping;
    return texture;
}

// ========== 创建土星环纹理 ==========
function createSaturnRingTexture(size = 512) {
    const canvas = document.createElement('canvas');
    canvas.width = size;
    canvas.height = 64;
    const ctx = canvas.getContext('2d');
    
    const gradient = ctx.createLinearGradient(0, 0, size, 0);
    gradient.addColorStop(0, 'rgba(180, 160, 130, 0.1)');
    gradient.addColorStop(0.2, 'rgba(200, 180, 150, 0.9)');
    gradient.addColorStop(0.3, 'rgba(160, 140, 110, 0.3)');
    gradient.addColorStop(0.4, 'rgba(210, 190, 160, 0.8)');
    gradient.addColorStop(0.5, 'rgba(140, 120, 90, 0.2)');
    gradient.addColorStop(0.6, 'rgba(200, 180, 150, 0.7)');
    gradient.addColorStop(0.8, 'rgba(180, 160, 130, 0.9)');
    gradient.addColorStop(1, 'rgba(180, 160, 130, 0.1)');
    
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, size, 64);
    
    const texture = new THREE.CanvasTexture(canvas);
    texture.wrapS = THREE.RepeatWrapping;
    return texture;
}

// ========== 创建星空背景 ==========
function createStarField() {
    const starCount = 5000;
    const geometry = new THREE.BufferGeometry();
    const positions = new Float32Array(starCount * 3);
    const colors = new Float32Array(starCount * 3);

    for (let i = 0; i < starCount; i++) {
        const i3 = i * 3;
        positions[i3] = (Math.random() - 0.5) * 2000;
        positions[i3 + 1] = (Math.random() - 0.5) * 2000;
        positions[i3 + 2] = (Math.random() - 0.5) * 2000;

        const color = new THREE.Color();
        color.setHSL(0.6, 0.2, 0.5 + Math.random() * 0.5);
        colors[i3] = color.r;
        colors[i3 + 1] = color.g;
        colors[i3 + 2] = color.b;
    }

    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));

    const material = new THREE.PointsMaterial({
        size: 2,
        vertexColors: true,
        transparent: true,
        opacity: 0.8
    });

    const stars = new THREE.Points(geometry, material);
    scene.add(stars);
}

// ========== 创建太阳 ==========
function createSun() {
    const geometry = new THREE.SphereGeometry(10, 64, 64);
    const texture = createPlanetTexture('sun');
    
    const material = new THREE.MeshBasicMaterial({
        map: texture,
        emissive: 0xffdd00,
        emissiveIntensity: 1
    });

    const sun = new THREE.Mesh(geometry, material);
    scene.add(sun);

    // 太阳标签
    const label = createPlanetLabel('太阳', '☀️');
    label.position.set(0, 12, 0);
    sun.add(label);

    // 太阳光晕
    const glowGeometry = new THREE.SphereGeometry(12, 32, 32);
    const glowMaterial = new THREE.MeshBasicMaterial({
        color: 0xffaa00,
        transparent: true,
        opacity: 0.3,
        side: THREE.BackSide
    });
    const glow = new THREE.Mesh(glowGeometry, glowMaterial);
    sun.add(glow);

    const sunLight = new THREE.PointLight(0xffffff, 3, 800);
    sunLight.position.set(0, 0, 0);
    scene.add(sunLight);

    const sunLight2 = new THREE.PointLight(0xffffcc, 1.5, 600);
    sunLight2.position.set(0, 0, 0);
    scene.add(sunLight2);

    const ambientLight = new THREE.AmbientLight(0x666666, 0.8);
    scene.add(ambientLight);

    return sun;
}

// ========== 行星数据配置 ==========
const planetData = [
    { name: '水星', emoji: '☿️', type: 'mercury', radius: 1.5, orbitRadius: 18, speed: 4.74 },
    { name: '金星', emoji: '♀️', type: 'venus', radius: 2.5, orbitRadius: 28, speed: 3.5 },
    { name: '地球', emoji: '🌍', type: 'earth', radius: 2.8, orbitRadius: 40, speed: 2.98 },
    { name: '火星', emoji: '♂️', type: 'mars', radius: 2.2, orbitRadius: 55, speed: 2.41 },
    { name: '木星', emoji: '♃', type: 'jupiter', radius: 7, orbitRadius: 80, speed: 1.31 },
    { name: '土星', emoji: '🪐', type: 'saturn', radius: 6, orbitRadius: 110, speed: 0.97, hasRing: true },
    { name: '天王星', emoji: '⛢', type: 'uranus', radius: 4, orbitRadius: 140, speed: 0.68 },
    { name: '海王星', emoji: '♆', type: 'neptune', radius: 3.8, orbitRadius: 170, speed: 0.54 }
];

const planets = [];

// ========== 创建轨道线 ==========
function createOrbitLine(radius) {
    const curve = new THREE.EllipseCurve(0, 0, radius, radius, 0, 2 * Math.PI, false, 0);
    const points = curve.getPoints(100);
    const geometry = new THREE.BufferGeometry().setFromPoints(points);
    const material = new THREE.LineBasicMaterial({
        color: 0x444444,
        transparent: true,
        opacity: 0.3
    });

    const orbit = new THREE.Line(geometry, material);
    orbit.rotation.x = -Math.PI / 2;
    scene.add(orbit);
}

// ========== 创建行星 ==========
function createPlanet(data) {
    createOrbitLine(data.orbitRadius);

    const geometry = new THREE.SphereGeometry(data.radius, 64, 64);
    const texture = createPlanetTexture(data.type);

    const material = new THREE.MeshStandardMaterial({
        map: texture,
        roughness: 0.6,
        metalness: 0.1,
        bumpScale: 0.05
    });

    const planet = new THREE.Mesh(geometry, material);
    scene.add(planet);

    // 添加标签
    const label = createPlanetLabel(data.name, data.emoji);
    label.position.set(0, data.radius + 2, 0);
    planet.add(label);

    if (data.hasRing) {
        createSaturnRing(planet);
    }

    return {
        mesh: planet,
        orbitRadius: data.orbitRadius,
        speed: data.speed,
        angle: Math.random() * Math.PI * 2
    };
}

// ========== 创建土星环 ==========
function createSaturnRing(planet) {
    const ringGeometry = new THREE.RingGeometry(8, 14, 128);
    const ringTexture = createSaturnRingTexture();
    
    const pos = ringGeometry.attributes.position;
    const uv = ringGeometry.attributes.uv;
    for (let i = 0; i < uv.count; i++) {
        const x = pos.getX(i);
        const y = pos.getY(i);
        const dist = Math.sqrt(x * x + y * y);
        uv.setXY(i, (dist - 8) / 6, 0.5);
    }

    const ringMaterial = new THREE.MeshBasicMaterial({
        map: ringTexture,
        side: THREE.DoubleSide,
        transparent: true,
        opacity: 0.9
    });

    const ring = new THREE.Mesh(ringGeometry, ringMaterial);
    ring.rotation.x = Math.PI / 2.2;
    planet.add(ring);
}

// ========== 初始化场景 ==========
function init() {
    createStarField();
    createSun();

    planetData.forEach(data => {
        planets.push(createPlanet(data));
    });

    const ambientLight = new THREE.AmbientLight(0x888888, 0.6);
    scene.add(ambientLight);
}

// ========== 动画循环 ==========
function animate() {
    requestAnimationFrame(animate);

    planets.forEach(planet => {
        planet.angle += planet.speed * 0.001;
        planet.mesh.position.x = Math.cos(planet.angle) * planet.orbitRadius;
        planet.mesh.position.z = Math.sin(planet.angle) * planet.orbitRadius;
        planet.mesh.rotation.y += 0.005;
    });

    controls.update();
    renderer.render(scene, camera);
    labelRenderer.render(scene, camera);
}

// ========== 窗口大小自适应 ==========
window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
    labelRenderer.setSize(window.innerWidth, window.innerHeight);
});

// ========== 启动程序 ==========
init();
animate();
