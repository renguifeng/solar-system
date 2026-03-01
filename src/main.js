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

// ========== 创建行星/卫星标签 ==========
function createPlanetLabel(name, emoji) {
    const div = document.createElement('div');
    div.className = 'planet-label';
    div.textContent = `${emoji} ${name}`;
    div.style.cssText = `
        color: #ffffff;
        font-family: 'Microsoft YaHei', Arial, sans-serif;
        font-size: 12px;
        padding: 4px 8px;
        background: rgba(0, 0, 0, 0.7);
        border-radius: 4px;
        border: 1px solid rgba(255, 255, 255, 0.4);
        white-space: nowrap;
        pointer-events: none;
        text-shadow: 0 0 4px rgba(255, 255, 255, 0.6);
    `;
    const label = new CSS2DObject(div);
    label.position.set(0, 3, 0);
    allLabels.push(label);  // 保存到数组
    return label;
}

// ========== 增强颜色对比度 ==========
function enhanceContrast(color, factor = 1.6) {
    // 将颜色向更极端方向调整（深色更深，浅色更浅）
    const r = parseInt(color.slice(1, 3), 16);
    const g = parseInt(color.slice(3, 5), 16);
    const b = parseInt(color.slice(5, 7), 16);
    
    const adjust = (c) => {
        if (c > 128) {
            return Math.min(255, c + (255 - c) * (factor - 1));
        } else {
            return Math.max(0, c - c * (factor - 1));
        }
    };
    
    const nr = Math.round(adjust(r));
    const ng = Math.round(adjust(g));
    const nb = Math.round(adjust(b));
    
    return `#${nr.toString(16).padStart(2, '0')}${ng.toString(16).padStart(2, '0')}${nb.toString(16).padStart(2, '0')}`;
}

// ========== 程序化纹理生成 ==========
function createPlanetTexture(type, size = 512) {
    const canvas = document.createElement('canvas');
    canvas.width = size;
    canvas.height = size;
    const ctx = canvas.getContext('2d');
    
    switch(type) {
        case 'mercury':
            ctx.fillStyle = '#9a8866';
            ctx.fillRect(0, 0, size, size);
            for(let i = 0; i < 200; i++) {
                const x = Math.random() * size;
                const y = Math.random() * size;
                const r = Math.random() * 20 + 5;
                ctx.beginPath();
                ctx.arc(x, y, r, 0, Math.PI * 2);
                ctx.fillStyle = `rgba(40, 30, 20, ${Math.random() * 0.6})`;
                ctx.fill();
            }
            break;
            
        case 'venus':
            const venusGrad = ctx.createLinearGradient(0, 0, size, size);
            venusGrad.addColorStop(0, '#ffd666');
            venusGrad.addColorStop(0.5, '#e8a820');
            venusGrad.addColorStop(1, '#c07810');
            ctx.fillStyle = venusGrad;
            ctx.fillRect(0, 0, size, size);
            for(let i = 0; i < 30; i++) {
                ctx.beginPath();
                ctx.arc(Math.random() * size, Math.random() * size, Math.random() * 80 + 20, 0, Math.PI * 2);
                ctx.fillStyle = `rgba(255, 230, 160, ${Math.random() * 0.4})`;
                ctx.fill();
            }
            break;
            
        case 'earth':
            ctx.fillStyle = '#0a4fb0';
            ctx.fillRect(0, 0, size, size);
            const continents = [
                {x: 100, y: 150, w: 120, h: 80},
                {x: 250, y: 100, w: 150, h: 120},
                {x: 350, y: 200, w: 100, h: 150},
                {x: 80, y: 300, w: 80, h: 100},
                {x: 400, y: 350, w: 90, h: 70}
            ];
            continents.forEach(c => {
                ctx.fillStyle = '#1a8a20';
                ctx.beginPath();
                ctx.ellipse(c.x, c.y, c.w/2, c.h/2, 0, 0, Math.PI * 2);
                ctx.fill();
                for(let i = 0; i < 5; i++) {
                    ctx.fillStyle = `rgba(40, 100, 40, ${Math.random() * 0.6})`;
                    ctx.beginPath();
                    ctx.ellipse(c.x + (Math.random()-0.5)*c.w*0.6, c.y + (Math.random()-0.5)*c.h*0.6, c.w/6, c.h/6, 0, 0, Math.PI * 2);
                    ctx.fill();
                }
            });
            for(let i = 0; i < 15; i++) {
                ctx.fillStyle = `rgba(255, 255, 255, ${Math.random() * 0.5 + 0.2})`;
                ctx.beginPath();
                ctx.ellipse(Math.random() * size, Math.random() * size, Math.random() * 60 + 20, Math.random() * 30 + 10, 0, 0, Math.PI * 2);
                ctx.fill();
            }
            break;
            
        case 'mars':
            const marsGrad = ctx.createRadialGradient(size/2, size/2, 0, size/2, size/2, size);
            marsGrad.addColorStop(0, '#d45210');
            marsGrad.addColorStop(0.5, '#b34008');
            marsGrad.addColorStop(1, '#802000');
            ctx.fillStyle = marsGrad;
            ctx.fillRect(0, 0, size, size);
            ctx.fillStyle = 'rgba(255, 255, 255, 0.85)';
            ctx.beginPath();
            ctx.ellipse(size/2, 30, 80, 30, 0, 0, Math.PI * 2);
            ctx.fill();
            for(let i = 0; i < 50; i++) {
                ctx.beginPath();
                ctx.arc(Math.random() * size, Math.random() * size, Math.random() * 15 + 3, 0, Math.PI * 2);
                ctx.fillStyle = `rgba(80, 20, 0, ${Math.random() * 0.5})`;
                ctx.fill();
            }
            break;
            
        case 'jupiter':
            const jupiterColors = ['#e8d8a8', '#c49050', '#8a5820', '#604010', '#d8c080'];
            for(let y = 0; y < size; y += 25) {
                ctx.fillStyle = jupiterColors[Math.floor(y / 25) % jupiterColors.length];
                ctx.fillRect(0, y, size, 30);
            }
            ctx.fillStyle = '#d84830';
            ctx.beginPath();
            ctx.ellipse(350, 280, 60, 35, 0.2, 0, Math.PI * 2);
            ctx.fill();
            ctx.fillStyle = '#b03020';
            ctx.beginPath();
            ctx.ellipse(350, 280, 40, 22, 0.2, 0, Math.PI * 2);
            ctx.fill();
            break;
            
        case 'saturn':
            const saturnColors = ['#f8e090', '#e8b850', '#c89030', '#a87020', '#f0d080'];
            for(let y = 0; y < size; y += 30) {
                ctx.fillStyle = saturnColors[Math.floor(y / 30) % saturnColors.length];
                ctx.fillRect(0, y, size, 35);
            }
            break;
            
        case 'uranus':
            const uranusGrad = ctx.createLinearGradient(0, 0, 0, size);
            uranusGrad.addColorStop(0, '#80d8d8');
            uranusGrad.addColorStop(0.5, '#c0f0f0');
            uranusGrad.addColorStop(1, '#60c0c0');
            ctx.fillStyle = uranusGrad;
            ctx.fillRect(0, 0, size, size);
            for(let y = 0; y < size; y += 40) {
                ctx.fillStyle = `rgba(120, 180, 180, ${Math.random() * 0.4})`;
                ctx.fillRect(0, y, size, 20);
            }
            break;
            
        case 'neptune':
            const neptuneGrad = ctx.createRadialGradient(size/2, size/2, 0, size/2, size/2, size);
            neptuneGrad.addColorStop(0, '#3080f0');
            neptuneGrad.addColorStop(0.5, '#4050d0');
            neptuneGrad.addColorStop(1, '#2030a0');
            ctx.fillStyle = neptuneGrad;
            ctx.fillRect(0, 0, size, size);
            ctx.fillStyle = 'rgba(20, 30, 80, 0.7)';
            ctx.beginPath();
            ctx.ellipse(200, 250, 70, 40, 0.1, 0, Math.PI * 2);
            ctx.fill();
            for(let i = 0; i < 8; i++) {
                ctx.fillStyle = `rgba(100, 160, 255, ${Math.random() * 0.4})`;
                ctx.fillRect(0, i * 64 + 20, size, 15);
            }
            break;
            
        case 'sun':
            const sunGrad = ctx.createRadialGradient(size/2, size/2, 0, size/2, size/2, size/2);
            sunGrad.addColorStop(0, '#ffffff');
            sunGrad.addColorStop(0.3, '#ffee00');
            sunGrad.addColorStop(0.7, '#ff8800');
            sunGrad.addColorStop(1, '#ff4400');
            ctx.fillStyle = sunGrad;
            ctx.fillRect(0, 0, size, size);
            for(let i = 0; i < 20; i++) {
                const x = Math.random() * size;
                const y = Math.random() * size;
                const r = Math.random() * 30 + 10;
                ctx.beginPath();
                ctx.arc(x, y, r, 0, Math.PI * 2);
                ctx.fillStyle = `rgba(255, ${130 + Math.random() * 70}, 0, ${Math.random() * 0.6 + 0.3})`;
                ctx.fill();
            }
            break;
            
        // 卫星纹理
        case 'moon':
            ctx.fillStyle = '#d0d0d0';
            ctx.fillRect(0, 0, size, size);
            for(let i = 0; i < 150; i++) {
                ctx.beginPath();
                ctx.arc(Math.random() * size, Math.random() * size, Math.random() * 15 + 3, 0, Math.PI * 2);
                ctx.fillStyle = `rgba(60, 60, 60, ${Math.random() * 0.6})`;
                ctx.fill();
            }
            break;
            
        case 'phobos':
        case 'deimos':
            ctx.fillStyle = '#9a8060';
            ctx.fillRect(0, 0, size, size);
            for(let i = 0; i < 80; i++) {
                ctx.beginPath();
                ctx.arc(Math.random() * size, Math.random() * size, Math.random() * 12 + 2, 0, Math.PI * 2);
                ctx.fillStyle = `rgba(50, 40, 30, ${Math.random() * 0.5})`;
                ctx.fill();
            }
            break;
            
        case 'io':
            ctx.fillStyle = '#f8e0a0';
            ctx.fillRect(0, 0, size, size);
            for(let i = 0; i < 60; i++) {
                ctx.beginPath();
                ctx.arc(Math.random() * size, Math.random() * size, Math.random() * 30 + 10, 0, Math.PI * 2);
                ctx.fillStyle = `rgba(255, 200, 80, ${Math.random() * 0.5})`;
                ctx.fill();
            }
            ctx.fillStyle = 'rgba(255, 80, 30, 0.4)';
            for(let i = 0; i < 10; i++) {
                ctx.beginPath();
                ctx.arc(Math.random() * size, Math.random() * size, Math.random() * 20 + 5, 0, Math.PI * 2);
                ctx.fill();
            }
            break;
            
        case 'europa':
            ctx.fillStyle = '#f8f080';
            ctx.fillRect(0, 0, size, size);
            for(let i = 0; i < 30; i++) {
                ctx.beginPath();
                ctx.arc(Math.random() * size, Math.random() * size, Math.random() * 25 + 10, 0, Math.PI * 2);
                ctx.fillStyle = `rgba(180, 160, 100, ${Math.random() * 0.25})`;
                ctx.fill();
            }
            break;
            
        case 'ganymede':
            ctx.fillStyle = '#a8a8a8';
            ctx.fillRect(0, 0, size, size);
            for(let y = 0; y < size; y += 40) {
                ctx.fillStyle = `rgba(100, 100, 100, ${Math.random() * 0.4})`;
                ctx.fillRect(0, y, size, 25);
            }
            break;
            
        case 'callisto':
            ctx.fillStyle = '#787878';
            ctx.fillRect(0, 0, size, size);
            for(let i = 0; i < 200; i++) {
                ctx.beginPath();
                ctx.arc(Math.random() * size, Math.random() * size, Math.random() * 10 + 2, 0, Math.PI * 2);
                ctx.fillStyle = `rgba(40, 40, 40, ${Math.random() * 0.6})`;
                ctx.fill();
            }
            break;
            
        case 'titan':
            ctx.fillStyle = '#e0b020';
            ctx.fillRect(0, 0, size, size);
            for(let i = 0; i < 40; i++) {
                ctx.beginPath();
                ctx.arc(Math.random() * size, Math.random() * size, Math.random() * 40 + 15, 0, Math.PI * 2);
                ctx.fillStyle = `rgba(160, 120, 60, ${Math.random() * 0.4})`;
                ctx.fill();
            }
            break;
            
        case 'miranda':
        case 'ariel':
        case 'umbriel':
        case 'titania':
        case 'oberon':
            ctx.fillStyle = '#b8b8b8';
            ctx.fillRect(0, 0, size, size);
            for(let i = 0; i < 80; i++) {
                ctx.beginPath();
                ctx.arc(Math.random() * size, Math.random() * size, Math.random() * 12 + 3, 0, Math.PI * 2);
                ctx.fillStyle = `rgba(60, 60, 60, ${Math.random() * 0.5})`;
                ctx.fill();
            }
            break;
            
        case 'triton':
            ctx.fillStyle = '#b8d0e8';
            ctx.fillRect(0, 0, size, size);
            for(let i = 0; i < 50; i++) {
                ctx.beginPath();
                ctx.arc(Math.random() * size, Math.random() * size, Math.random() * 20 + 8, 0, Math.PI * 2);
                ctx.fillStyle = `rgba(80, 100, 130, ${Math.random() * 0.4})`;
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

// ========== 创建星空背景（球形星星）==========
function createStarField() {
    const starCount = 5000;
    
    // 使用 InstancedMesh 批量渲染球形星星
    const geometry = new THREE.SphereGeometry(0.8, 8, 8);
    const material = new THREE.MeshBasicMaterial({
        color: 0xffffff,
        transparent: true,
        opacity: 0.9
    });
    
    const stars = new THREE.InstancedMesh(geometry, material, starCount);
    
    const matrix = new THREE.Matrix4();
    const color = new THREE.Color();
    
    for (let i = 0; i < starCount; i++) {
        // 随机位置
        const x = (Math.random() - 0.5) * 2000;
        const y = (Math.random() - 0.5) * 2000;
        const z = (Math.random() - 0.5) * 2000;
        
        // 随机大小（0.5 到 1.5）
        const scale = Math.random() * 1.5 + 0.5;
        
        matrix.makeScale(scale, scale, scale);
        matrix.setPosition(x, y, z);
        stars.setMatrixAt(i, matrix);
        
        // 随机颜色（偏蓝白色）
        color.setHSL(0.6, 0.2, 0.5 + Math.random() * 0.5);
        stars.setColorAt(i, color);
    }
    
    stars.instanceMatrix.needsUpdate = true;
    stars.instanceColor.needsUpdate = true;
    
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

    const label = createPlanetLabel('太阳', '☀️');
    label.position.set(0, 12, 0);
    sun.add(label);

    const glowGeometry = new THREE.SphereGeometry(12, 32, 32);
    const glowMaterial = new THREE.MeshBasicMaterial({
        color: 0xffaa00,
        transparent: true,
        opacity: 0.3,
        side: THREE.BackSide
    });
    const glow = new THREE.Mesh(glowGeometry, glowMaterial);
    sun.add(glow);

    const sunLight = new THREE.PointLight(0xffffff, 4.5, 800);
    sunLight.position.set(0, 0, 0);
    scene.add(sunLight);

    const sunLight2 = new THREE.PointLight(0xffffcc, 2.25, 600);
    sunLight2.position.set(0, 0, 0);
    scene.add(sunLight2);

    const ambientLight = new THREE.AmbientLight(0x666666, 1.2);
    scene.add(ambientLight);

    return sun;
}

// ========== 行星数据配置（含卫星）==========
const planetData = [
    { name: '水星', emoji: '☿️', type: 'mercury', radius: 1.5, orbitRadius: 18, speed: 4.74, satellites: [] },
    { name: '金星', emoji: '♀️', type: 'venus', radius: 2.5, orbitRadius: 28, speed: 3.5, satellites: [] },
    { 
        name: '地球', emoji: '🌍', type: 'earth', radius: 2.8, orbitRadius: 40, speed: 2.98, 
        satellites: [
            { name: '月球', emoji: '🌙', type: 'moon', radius: 0.7, orbitRadius: 5, speed: 13.37 }
        ]
    },
    { 
        name: '火星', emoji: '♂️', type: 'mars', radius: 2.2, orbitRadius: 55, speed: 2.41, 
        satellites: [
            { name: '火卫一', emoji: '🪨', type: 'phobos', radius: 0.3, orbitRadius: 3.5, speed: 28 },
            { name: '火卫二', emoji: '🪨', type: 'deimos', radius: 0.2, orbitRadius: 5, speed: 20 }
        ]
    },
    { 
        name: '木星', emoji: '♃', type: 'jupiter', radius: 7, orbitRadius: 80, speed: 1.31, 
        satellites: [
            { name: '木卫一', emoji: '🔥', type: 'io', radius: 0.9, orbitRadius: 12, speed: 17.3 },
            { name: '木卫二', emoji: '❄️', type: 'europa', radius: 0.8, orbitRadius: 15, speed: 13.7 },
            { name: '木卫三', radius: 1.2, orbitRadius: 19, speed: 10.9, type: 'ganymede', emoji: '🌑' },
            { name: '木卫四', emoji: '🌑', type: 'callisto', radius: 1.1, orbitRadius: 25, speed: 8.2 }
        ]
    },
    { 
        name: '土星', emoji: '🪐', type: 'saturn', radius: 6, orbitRadius: 110, speed: 0.97, hasRing: true,
        satellites: [
            { name: '土卫六', emoji: '🟠', type: 'titan', radius: 1.3, orbitRadius: 20, speed: 6.3 }
        ]
    },
    { 
        name: '天王星', emoji: '⛢', type: 'uranus', radius: 4, orbitRadius: 140, speed: 0.68, 
        satellites: [
            { name: '天卫五', emoji: '🌑', type: 'miranda', radius: 0.4, orbitRadius: 7, speed: 15 },
            { name: '天卫一', emoji: '🌑', type: 'ariel', radius: 0.5, orbitRadius: 9, speed: 12 },
            { name: '天卫二', emoji: '🌑', type: 'umbriel', radius: 0.5, orbitRadius: 11, speed: 10 },
            { name: '天卫三', emoji: '🌑', type: 'titania', radius: 0.6, orbitRadius: 14, speed: 8 },
            { name: '天卫四', emoji: '🌑', type: 'oberon', radius: 0.6, orbitRadius: 17, speed: 6 }
        ]
    },
    { 
        name: '海王星', emoji: '♆', type: 'neptune', radius: 3.8, orbitRadius: 170, speed: 0.54, 
        satellites: [
            { name: '海卫一', emoji: '❄️', type: 'triton', radius: 0.8, orbitRadius: 10, speed: -4.4 }
        ]
    }
];

const planets = [];
const allOrbits = [];  // 存储所有轨道线
const allLabels = [];  // 存储所有标签

// ========== 创建轨道线 ==========
function createOrbitLine(radius, isSatellite = false) {
    const curve = new THREE.EllipseCurve(0, 0, radius, radius, 0, 2 * Math.PI, false, 0);
    const points = curve.getPoints(100);
    const geometry = new THREE.BufferGeometry().setFromPoints(points);
    const material = new THREE.LineBasicMaterial({
        color: isSatellite ? 0x888888 : 0x666666,
        transparent: true,
        opacity: isSatellite ? 0.3 : 0.45
    });

    const orbit = new THREE.Line(geometry, material);
    orbit.rotation.x = -Math.PI / 2;
    allOrbits.push(orbit);  // 保存到数组
    return orbit;
}

// ========== 创建卫星 ==========
function createSatellite(data, parent) {
    const geometry = new THREE.SphereGeometry(data.radius, 32, 32);
    const texture = createPlanetTexture(data.type);
    
    const material = new THREE.MeshStandardMaterial({
        map: texture,
        roughness: 0.6,
        metalness: 0.1,
        emissive: 0xffffff,
        emissiveIntensity: 0.15
    });

    const satellite = new THREE.Mesh(geometry, material);
    
    // 创建卫星轨道线并添加到行星
    const orbitLine = createOrbitLine(data.orbitRadius, true);
    parent.add(orbitLine);
    
    // 添加标签
    const label = createPlanetLabel(data.name, data.emoji);
    label.position.set(0, data.radius + 1.5, 0);
    satellite.add(label);
    
    parent.add(satellite);

    return {
        mesh: satellite,
        orbitRadius: data.orbitRadius,
        speed: data.speed,
        angle: Math.random() * Math.PI * 2
    };
}

// ========== 创建行星 ==========
function createPlanet(data) {
    const orbitLine = createOrbitLine(data.orbitRadius);
    scene.add(orbitLine);

    const geometry = new THREE.SphereGeometry(data.radius, 64, 64);
    const texture = createPlanetTexture(data.type);

    const material = new THREE.MeshStandardMaterial({
        map: texture,
        roughness: 0.6,
        metalness: 0.1,
        bumpScale: 0.05,
        emissive: 0xffffff,
        emissiveIntensity: 0.15
    });

    const planet = new THREE.Mesh(geometry, material);
    scene.add(planet);

    // 添加标签
    const label = createPlanetLabel(data.name, data.emoji);
    label.position.set(0, data.radius + 2, 0);
    planet.add(label);

    // 土星环
    if (data.hasRing) {
        createSaturnRing(planet);
    }
    
    // 创建卫星
    const satellites = [];
    if (data.satellites && data.satellites.length > 0) {
        data.satellites.forEach(satData => {
            satellites.push(createSatellite(satData, planet));
        });
    }

    return {
        mesh: planet,
        orbitRadius: data.orbitRadius,
        speed: data.speed,
        angle: Math.random() * Math.PI * 2,
        satellites: satellites
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

// ========== 小行星带 ==========
let asteroidBelt = null;      // 主小行星带（火星-木星之间）
let kuiperBelt = null;        // 柯伊伯带（海王星之外）

// 创建小行星带
function createAsteroidBelt(innerRadius, outerRadius, count, color = 0x888888) {
    const asteroidCount = count;
    const geometry = new THREE.IcosahedronGeometry(0.2, 0);  // 适中尺寸
    const material = new THREE.MeshStandardMaterial({
        color: color,
        roughness: 0.5,
        metalness: 0.3,
        emissive: color,
        emissiveIntensity: 0.6  // 增加自发光亮度
    });
    
    const asteroids = new THREE.InstancedMesh(geometry, material, asteroidCount);
    
    const matrix = new THREE.Matrix4();
    const position = new THREE.Vector3();
    const rotation = new THREE.Euler();
    const quaternion = new THREE.Quaternion();
    const scale = new THREE.Vector3();
    
    const asteroidData = [];  // 存储每颗小行星的运动数据
    
    for (let i = 0; i < asteroidCount; i++) {
        // 随机轨道半径
        const orbitRadius = innerRadius + Math.random() * (outerRadius - innerRadius);
        // 随机角度
        const angle = Math.random() * Math.PI * 2;
        // 随机倾斜（轻微偏离黄道面）
        const yOffset = (Math.random() - 0.5) * 6;
        
        position.set(
            Math.cos(angle) * orbitRadius,
            yOffset,
            Math.sin(angle) * orbitRadius
        );
        
        // 随机旋转
        rotation.set(
            Math.random() * Math.PI,
            Math.random() * Math.PI,
            Math.random() * Math.PI
        );
        quaternion.setFromEuler(rotation);
        
        // 随机大小（缩小范围）
        const s = Math.random() * 0.8 + 0.3;
        scale.set(s, s, s);
        
        matrix.compose(position, quaternion, scale);
        asteroids.setMatrixAt(i, matrix);
        
        // 保存运动数据
        asteroidData.push({
            orbitRadius: orbitRadius,
            angle: angle,
            yOffset: yOffset,
            speed: 0.0003 + Math.random() * 0.0005,  // 公转速度
            rotationSpeed: {
                x: (Math.random() - 0.5) * 0.02,
                y: (Math.random() - 0.5) * 0.02,
                z: (Math.random() - 0.5) * 0.02
            },
            scale: s
        });
    }
    
    asteroids.instanceMatrix.needsUpdate = true;
    scene.add(asteroids);
    
    return { mesh: asteroids, data: asteroidData, geometry, material };
}

// 更新小行星带动画
function updateAsteroidBelt(beltObj) {
    if (!beltObj || !beltObj.mesh.visible) return;
    
    const matrix = new THREE.Matrix4();
    const position = new THREE.Vector3();
    const rotation = new THREE.Euler();
    const quaternion = new THREE.Quaternion();
    const scale = new THREE.Vector3();
    
    beltObj.data.forEach((data, i) => {
        // 更新角度
        data.angle += data.speed;
        
        // 计算新位置
        position.set(
            Math.cos(data.angle) * data.orbitRadius,
            data.yOffset,
            Math.sin(data.angle) * data.orbitRadius
        );
        
        // 更新旋转
        rotation.x += data.rotationSpeed.x;
        rotation.y += data.rotationSpeed.y;
        rotation.z += data.rotationSpeed.z;
        quaternion.setFromEuler(rotation);
        
        // 使用保存的大小
        scale.set(data.scale, data.scale, data.scale);
        
        matrix.compose(position, quaternion, scale);
        beltObj.mesh.setMatrixAt(i, matrix);
    });
    
    beltObj.mesh.instanceMatrix.needsUpdate = true;
}

// ========== 初始化场景 ==========
function init() {
    createStarField();
    createSun();

    planetData.forEach(data => {
        planets.push(createPlanet(data));
    });

    // 创建主小行星带（火星和木星之间，约 55-80 轨道之间）
    asteroidBelt = createAsteroidBelt(60, 75, 2000, 0xa0a0a0);
    
    // 创建柯伊伯带（海王星之外，约 170+ 轨道）
    kuiperBelt = createAsteroidBelt(180, 220, 3000, 0x8090b0);

    const ambientLight = new THREE.AmbientLight(0x888888, 0.9);
    scene.add(ambientLight);
}

// ========== 动画循环 ==========
function animate() {
    requestAnimationFrame(animate);

    planets.forEach(planet => {
        // 行星绕太阳公转
        planet.angle += planet.speed * 0.001;
        planet.mesh.position.x = Math.cos(planet.angle) * planet.orbitRadius;
        planet.mesh.position.z = Math.sin(planet.angle) * planet.orbitRadius;
        planet.mesh.rotation.y += 0.005;
        
        // 卫星绕行星公转
        if (planet.satellites) {
            planet.satellites.forEach(satellite => {
                satellite.angle += satellite.speed * 0.002;
                satellite.mesh.position.x = Math.cos(satellite.angle) * satellite.orbitRadius;
                satellite.mesh.position.z = Math.sin(satellite.angle) * satellite.orbitRadius;
                satellite.mesh.rotation.y += 0.01;
            });
        }
    });
    
    // 更新小行星带动画
    updateAsteroidBelt(asteroidBelt);
    updateAsteroidBelt(kuiperBelt);

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

// ========== 开关控制 ==========
function toggleLabels(visible) {
    allLabels.forEach(label => {
        label.visible = visible;
    });
}

function toggleOrbits(visible) {
    allOrbits.forEach(orbit => {
        orbit.visible = visible;
    });
}

function setupControls() {
    const labelSwitch = document.getElementById('toggle-labels');
    const orbitSwitch = document.getElementById('toggle-orbits');
    const asteroidBeltSwitch = document.getElementById('toggle-asteroid-belt');
    const kuiperBeltSwitch = document.getElementById('toggle-kuiper-belt');
    
    if (labelSwitch) {
        labelSwitch.addEventListener('change', (e) => {
            toggleLabels(e.target.checked);
        });
    }
    
    if (orbitSwitch) {
        orbitSwitch.addEventListener('change', (e) => {
            toggleOrbits(e.target.checked);
        });
    }
    
    if (asteroidBeltSwitch) {
        asteroidBeltSwitch.addEventListener('change', (e) => {
            if (asteroidBelt) {
                asteroidBelt.mesh.visible = e.target.checked;
            }
        });
    }
    
    if (kuiperBeltSwitch) {
        kuiperBeltSwitch.addEventListener('change', (e) => {
            if (kuiperBelt) {
                kuiperBelt.mesh.visible = e.target.checked;
            }
        });
    }
}

// ========== 启动程序 ==========
init();
setupControls();
animate();
