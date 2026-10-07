// app.js - Modul Principal de Control Cadru cu 6 Puncte

// Selectare elemente din DOM
const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');
const v1 = document.getElementById('vid1');
const v2 = document.getElementById('vid2');

let backgroundImg = new Image();
let showUI = true;
let showDots = true;
let currentMode = 'desktop';

// Structura principala: EXACT 6 puncte per strat
// Ordine puncte: 
// 0: Sus-Stânga,  1: Sus-Mijloc,  2: Sus-Dreapta
// 3: Jos-Stânga,  4: Jos-Mijloc,  2: Jos-Dreapta (index 5)
let layers = {
    v1: { 
        pts: [
            { x: 50,  y: 50 },  { x: 200, y: 50 },  { x: 350, y: 50 },
            { x: 50,  y: 300 }, { x: 200, y: 300 }, { x: 350, y: 300 }
        ] 
    },
    v2: { 
        pts: [
            { x: 400, y: 50 },  { x: 550, y: 50 },  { x: 700, y: 50 },
            { x: 400, y: 300 }, { x: 550, y: 300 }, { x: 700, y: 300 }
        ] 
    }
};

// Schimbare Mod Vizualizare (Smartphone / Desktop)
function setView(type) {
    currentMode = type;
    const resText = document.getElementById('res-indicator');
    if (type === 'mobile') {
        canvas.width = 390; 
        canvas.height = 844;
        canvas.style.width = '390px'; 
        canvas.style.height = '844px';
        if (resText) resText.innerText = "MOD: SMARTPHONE (390x844)";
    } else {
        canvas.width = window.innerWidth; 
        canvas.height = window.innerHeight;
        canvas.style.width = '100%'; 
        canvas.style.height = '100%';
        if (resText) resText.innerText = "MOD: DESKTOP (FULL)";
    }
}

// Configurare Evenimente (Mouse, Touch, File Uploads)
function setupEvents() {
    window.addEventListener('resize', () => { 
        if (currentMode === 'desktop') setView('desktop'); 
    });

    const bgInput = document.getElementById('bgInput');
    if (bgInput) {
        bgInput.onchange = (e) => { 
            if (e.target.files[0]) backgroundImg.src = URL.createObjectURL(e.target.files[0]); 
        };
    }

    const v1Input = document.getElementById('video1Input');
    if (v1Input) {
        v1Input.onchange = (e) => { 
            if (e.target.files[0]) { 
                v1.src = URL.createObjectURL(e.target.files[0]); 
                v1.play(); 
            }
        };
    }

    const v2Input = document.getElementById('video2Input');
    if (v2Input) {
        v2Input.onchange = (e) => { 
            if (e.target.files[0]) { 
                v2.src = URL.createObjectURL(e.target.files[0]); 
                v2.play(); 
            }
        };
    }

    let dragPt = null;
    let dragLayer = null;
    let lastMouse = { x: 0, y: 0 };

    canvas.onmousedown = (e) => {
        if (!showDots) return;
        const rect = canvas.getBoundingClientRect();
        const mouse = { 
            x: (e.clientX - rect.left) * (canvas.width / rect.width), 
            y: (e.clientY - rect.top) * (canvas.height / rect.height) 
        };

        // Verificăm dacă utilizatorul a dat click pe un punct din cele 6
        dragPt = null;
        for (let key in layers) {
            layers[key].pts.forEach(p => { 
                if (Math.hypot(p.x - mouse.x, p.y - mouse.y) < 25) {
                    dragPt = p; 
                }
            });
        }

        // Dacă nu s-a apasat pe un punct, verificăm dacă s-a dat click în interiorul stratului
        if (!dragPt) {
            for (let key in layers) {
                const p = layers[key].pts;
                const minX = Math.min(...p.map(pt => pt.x));
                const maxX = Math.max(...p.map(pt => pt.x));
                const minY = Math.min(...p.map(pt => pt.y));
                const maxY = Math.max(...p.map(pt => pt.y));

                if (mouse.x > minX && mouse.x < maxX && mouse.y > minY && mouse.y < maxY) {
                    dragLayer = layers[key];
                }
            }
        }
        lastMouse = mouse;
    };

    window.onmousemove = (e) => {
        if (!dragPt && !dragLayer) return;
        const rect = canvas.getBoundingClientRect();
        const mouse = { 
            x: (e.clientX - rect.left) * (canvas.width / rect.width), 
            y: (e.clientY - rect.top) * (canvas.height / rect.height) 
        };
        const dx = mouse.x - lastMouse.x;
        const dy = mouse.y - lastMouse.y;

        if (dragPt) { 
            dragPt.x = mouse.x; 
            dragPt.y = mouse.y; 
        } else if (dragLayer) { 
            dragLayer.pts.forEach(p => { 
                p.x += dx; 
                p.y += dy; 
            }); 
        }

        lastMouse = mouse;
        localStorage.setItem('v40_final', JSON.stringify({ v1: layers.v1.pts, v2: layers.v2.pts }));
    };

    window.onmouseup = () => { 
        dragPt = null; 
        dragLayer = null; 
    };
}

// Bucla Principală de Randare (Animation Loop)
function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Desenează imaginea de fundal dacă există
    if (backgroundImg.src) {
        ctx.drawImage(backgroundImg, 0, 0, canvas.width, canvas.height);
    }

    // Renderizare Clip Video / Măști pe baza celor 6 puncte
    [v1, v2].forEach((v, i) => {
        if (v && v.readyState >= 2) {
            const l = i === 0 ? layers.v1 : layers.v2;
            ctx.save(); 
            ctx.beginPath();

            // Trasare contur pe margini din 6 puncte (Mergem pe Sus: 0->1->2, apoi pe Jos înapoi: 5->4->3)
            ctx.moveTo(l.pts[0].x, l.pts[0].y); 
            ctx.lineTo(l.pts[1].x, l.pts[1].y); 
            ctx.lineTo(l.
