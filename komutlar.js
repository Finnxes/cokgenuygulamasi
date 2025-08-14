window.onload = function() {
    grafikCiz(25);
};

// Izgara çizimini eski haline getir
function drawGrid(ctx, canvasW, canvasH, k) {
    const isDarkMode = document.body.classList.contains('dark-mode');
    ctx.strokeStyle = isDarkMode ? '#444' : '#000';
    ctx.lineWidth = 0.5;
    ctx.beginPath();
    
    // Dikey çizgiler
    for (let x = 0; x <= canvasW; x += k) {
        ctx.moveTo(x, 0);
        ctx.lineTo(x, canvasH);
    }
    
    // Yatay çizgiler
    for (let y = 0; y <= canvasH; y += k) {
        ctx.moveTo(0, y);
        ctx.lineTo(canvasW, y);
    }
    
    ctx.stroke();
}

// Çokgen çizimi için optimize edilmiş fonksiyon
function grafikCiz(deger) {
    const canvas = document.getElementById('cizimAlani');
    const ctx = canvas.getContext('2d', { alpha: false });
    
    const settings = {
        k: parseInt(deger),
        renkDoldur: document.getElementById('renkDoldur').checked,
        cevrelCember: document.getElementById('cevrelCember').checked,
        kenarSayisi: parseInt(document.getElementById('kenarSayisi').value),
        kenarUzunlugu: parseFloat(document.getElementById('kenarUzunlugu').value)
    };

    const dimensions = {
        width: canvas.width,
        height: canvas.height,
        centerX: canvas.width / 2,
        centerY: canvas.height / 2
    };

    // Canvas'ı temizle
    ctx.fillStyle = document.body.classList.contains('dark-mode') ? '#262626' : 'aliceblue';
    ctx.fillRect(0, 0, dimensions.width, dimensions.height);

    // Transform işlemleri
    ctx.save();
    ctx.translate(viewOffset.x, viewOffset.y);
    ctx.scale(zoomLevel, zoomLevel);

    // Izgara çiz
    drawGrid(ctx, dimensions.width, dimensions.height, settings.k);

    // Koordinat eksenleri
    ctx.beginPath();
    ctx.lineWidth = 2 / zoomLevel; // Çizgi kalınlığını zoom'a göre ayarla
    ctx.strokeStyle = '#F00';
    ctx.moveTo(0, dimensions.centerY);
    ctx.lineTo(dimensions.width, dimensions.centerY);
    ctx.moveTo(dimensions.centerX, 0);
    ctx.lineTo(dimensions.centerX, dimensions.height);
    ctx.stroke();

    // Çokgen çiz
    const calculations = calculatePolygonProperties(settings, dimensions);
    drawPolygon(ctx, calculations, settings, dimensions);

    ctx.restore();
    updateResults(calculations);
}

function calculatePolygonProperties(settings, dimensions) {
    const aci = 360 / settings.kenarSayisi;
    const a = settings.kenarUzunlugu / 2;
    const r = Math.abs(a / Math.sin((aci / 2) * (Math.PI / 180)));
    const h = Math.sqrt(r * r - a * a);
    const alan = (settings.kenarUzunlugu * h * settings.kenarSayisi) / 2;

    return {
        aci: aci,
        r: r,
        h: h,
        alan: alan
    };
}

function drawPolygon(ctx, calc, settings, dims) {
    const points = [];
    const angleStep = (2 * Math.PI) / settings.kenarSayisi;
    
    // Köşe noktalarını hesapla
    for (let i = 0; i < settings.kenarSayisi; i++) {
        const angle = i * angleStep;
        const x = dims.centerX + calc.r * settings.k * Math.cos(angle);
        const y = dims.centerY - calc.r * settings.k * Math.sin(angle);
        points.push({ x, y });
    }

    // Çokgeni çiz
    ctx.beginPath();
    ctx.moveTo(points[0].x, points[0].y);
    points.forEach(point => ctx.lineTo(point.x, point.y));
    ctx.closePath();

    // Renklendirme
    const cokgenRenk = document.getElementById('cokgenRenk').value;
    if (settings.renkDoldur) {
        ctx.fillStyle = cokgenRenk + "80";
        ctx.fill();
    }

    ctx.lineWidth = 2;
    ctx.strokeStyle = cokgenRenk;
    ctx.stroke();

    // Köşe noktaları
    points.forEach(point => {
        ctx.beginPath();
        ctx.arc(point.x, point.y, 3, 0, 2 * Math.PI);
        ctx.fillStyle = cokgenRenk;
        ctx.fill();
        ctx.strokeStyle = '#FFF';
        ctx.stroke();
    });

    // Çevrel çember
    if (settings.cevrelCember) {
        ctx.beginPath();
        ctx.arc(dims.centerX, dims.centerY, calc.r * settings.k, 0, 2 * Math.PI);
        ctx.strokeStyle = '#060';
        ctx.stroke();
    }
}

function updateResults(calc) {
    document.getElementById('textMerkezAci').textContent = calc.aci.toFixed(2);
    document.getElementById('textYariCap').textContent = calc.r.toFixed(2);
    document.getElementById('textYukseklik').textContent = calc.h.toFixed(2);
    document.getElementById('textAlan').textContent = calc.alan.toFixed(2);
}

function resimKaydet() {
    const canvas = document.getElementById("cizimAlani");
    const link = document.createElement('a');
    link.download = 'cokgen.png';
    link.href = canvas.toDataURL("image/png");
    link.click();
}

// Karanlık modu açma/kapatma fonksiyonu
function toggleDarkMode() {
    const darkModeToggle = document.getElementById("darkModeToggle");
    const body = document.body;
    
    if (darkModeToggle.checked) {
        body.classList.add("dark-mode");
        localStorage.setItem('darkMode', 'enabled');
        
        // Canvas'ı yeniden çiz
        grafikCiz(25);
    } else {
        body.classList.remove("dark-mode");
        localStorage.setItem('darkMode', 'disabled');
        
        // Canvas'ı yeniden çiz
        grafikCiz(25);
    }
}

// Sayfa yüklendiğinde karanlık mod tercihini kontrol et
document.addEventListener('DOMContentLoaded', () => {
    const darkMode = localStorage.getItem('darkMode');
    const darkModeToggle = document.getElementById("darkModeToggle");
    
    if (darkMode === 'enabled') {
        document.body.classList.add('dark-mode');
        darkModeToggle.checked = true;
    }
});

// Mobil menü kontrolü
document.getElementById('menuToggle').addEventListener('click', () => {
    document.getElementById('controlsPanel').classList.toggle('active');
});

// Tüm çizim kontrollerini tek bir fonksiyonda toplayalım
function yenidenCiz() {
    const olcek = parseInt(document.getElementById('olcek').value);
    if (animasyonId) {
        grafikCizAnimasyon(olcek, aci);
    } else {
        grafikCiz(olcek);
    }
}

// Event listener'ları güncelle
function updateInputValue(elementId, value) {
    const displayElement = document.getElementById(elementId + 'Value');
    if (displayElement) {
        displayElement.textContent = value;
    }
}

// Kenar sayısı kontrolü
document.getElementById('kenarSayisi').addEventListener('input', (e) => {
    const value = parseInt(e.target.value);
    updateInputValue('kenarSayisi', value);
    grafikCiz(document.getElementById('olcek').value);
});

// Kenar uzunluğu kontrolü
document.getElementById('kenarUzunlugu').addEventListener('input', (e) => {
    const value = parseFloat(e.target.value);
    updateInputValue('kenarUzunlugu', value);
    grafikCiz(document.getElementById('olcek').value);
});

// Ölçek kontrolü
document.getElementById('olcek').addEventListener('input', (e) => {
    document.getElementById('olcekValue').textContent = e.target.value;
    yenidenCiz();
});
document.getElementById('renkDoldur').addEventListener('change', yenidenCiz);
document.getElementById('cevrelCember').addEventListener('change', yenidenCiz);
document.getElementById('cokgenRenk').addEventListener('input', yenidenCiz);
document.getElementById('izometrikGorunum').addEventListener('change', yenidenCiz);

// Canvas boyutlandırma
function resizeCanvas() {
    const canvas = document.getElementById('cizimAlani');
    const container = canvas.parentElement;
    canvas.width = container.clientWidth - 32;
    canvas.height = container.clientHeight - 32;
    grafikCiz(25);
}

window.addEventListener('resize', resizeCanvas);
window.addEventListener('load', resizeCanvas);

let animasyonId = null;
let aci = 0;

function animasyonBaslat() {
    if (!animasyonId) {
        animasyonId = setInterval(() => {
            aci += 1;
            const olcek = parseInt(document.getElementById('olcek').value);
            grafikCizAnimasyon(olcek, aci);
        }, 50);
    }
}

function animasyonDurdur() {
    if (animasyonId) {
        clearInterval(animasyonId);
        animasyonId = null;
    }
}

function grafikCizAnimasyon(deger, donus) {
    const canvas = document.getElementById('cizimAlani');
    const ctx = canvas.getContext('2d', { alpha: false });
    const settings = {
        k: deger,
        renkDoldur: document.getElementById('renkDoldur').checked,
        cevrelCember: document.getElementById('cevrelCember').checked,
        kenarSayisi: parseInt(document.getElementById('kenarSayisi').value),
        kenarUzunlugu: parseFloat(document.getElementById('kenarUzunlugu').value)
    };
    
    const dimensions = {
        width: canvas.width,
        height: canvas.height,
        centerX: canvas.width / 2,
        centerY: canvas.height / 2
    };

    // Canvas temizle
    const isDarkMode = document.body.classList.contains('dark-mode');
    ctx.fillStyle = isDarkMode ? '#262626' : 'aliceblue';
    ctx.fillRect(0, 0, dimensions.width, dimensions.height);

    // Izgarayı çiz
    drawGrid(ctx, dimensions.width, dimensions.height, settings.k);

    // Koordinat eksenleri
    ctx.beginPath();
    ctx.lineWidth = 3;
    ctx.strokeStyle = '#F00';
    ctx.moveTo(0, dimensions.centerY);
    ctx.lineTo(dimensions.width, dimensions.centerY);
    ctx.moveTo(dimensions.centerX, 0);
    ctx.lineTo(dimensions.centerX, dimensions.height);
    ctx.stroke();

    // Çokgen hesaplamaları
    const calculations = calculatePolygonProperties(settings, dimensions);

    // İzometrik görünüm kontrolü
    const izometrik = document.getElementById('izometrikGorunum').checked;

    // Dönüşüm matrisini kaydet
    ctx.save();
    
    // Merkeze taşı, döndür ve geri getir
    ctx.translate(dimensions.centerX, dimensions.centerY);
    
    // İzometrik görünüm varsa uygula
    if (izometrik) {
        ctx.scale(1, 0.5);
        ctx.rotate(Math.PI / 6);
    }
    
    // Animasyon için döndürme
    ctx.rotate((donus * Math.PI) / 180);
    
    ctx.translate(-dimensions.centerX, -dimensions.centerY);

    // Çokgeni çiz
    drawPolygon(ctx, calculations, settings, dimensions);

    // Dönüşüm matrisini geri yükle
    ctx.restore();

    // Sonuçları güncelle
    updateResults(calculations);
}

function paylas() {
    const bilgiler = {
        kenarSayisi: document.getElementById('kenarSayisi').value,
        kenarUzunlugu: document.getElementById('kenarUzunlugu').value,
        alan: document.getElementById('textAlan').textContent
    };

    if (navigator.share) {
        navigator.share({
            title: 'Çokgen Bilgileri',
            text: `Kenar Sayısı: ${bilgiler.kenarSayisi}\nKenar Uzunluğu: ${bilgiler.kenarUzunlugu}\nAlan: ${bilgiler.alan}`
        });
    }
}

// Pan ve Zoom için global değişkenler
let isPanning = false;
let startPoint = { x: 0, y: 0 };
let viewOffset = { x: 0, y: 0 };
let zoomLevel = 1;

// Canvas eventi dinleyicileri ekle
function addCanvasEventListeners() {
    const canvas = document.getElementById('cizimAlani');

    // Mouse events
    canvas.addEventListener('mousedown', startPan);
    canvas.addEventListener('mousemove', pan);
    canvas.addEventListener('mouseup', endPan);
    canvas.addEventListener('mouseleave', endPan);
    canvas.addEventListener('wheel', zoom);

    // Touch events
    canvas.addEventListener('touchstart', handleTouchStart);
    canvas.addEventListener('touchmove', handleTouchMove);
    canvas.addEventListener('touchend', handleTouchEnd);
}

// Pan işlemleri
function startPan(e) {
    isPanning = true;
    startPoint = {
        x: e.clientX - viewOffset.x,
        y: e.clientY - viewOffset.y
    };
}

function pan(e) {
    if (!isPanning) return;
    
    viewOffset = {
        x: e.clientX - startPoint.x,
        y: e.clientY - startPoint.y
    };
    
    grafikCiz(document.getElementById('olcek').value);
}

function endPan() {
    isPanning = false;
}

// Zoom işlemi
function zoom(e) {
    e.preventDefault();
    
    const rect = e.target.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    const delta = e.deltaY;
    const zoomFactor = 0.1;
    const oldZoom = zoomLevel;
    
    if (delta > 0) {
        zoomLevel = Math.max(0.5, zoomLevel - zoomFactor);
    } else {
        zoomLevel = Math.min(3, zoomLevel + zoomFactor);
    }
    
    // Zoom merkez noktasını ayarla
    viewOffset.x += (x - viewOffset.x) * (1 - zoomLevel / oldZoom);
    viewOffset.y += (y - viewOffset.y) * (1 - zoomLevel / oldZoom);
    
    requestAnimationFrame(() => grafikCiz(document.getElementById('olcek').value));
}

// Dokunmatik ekran işlemleri
let lastTouchDistance = 0;

function handleTouchStart(e) {
    if (e.touches.length === 1) {
        isPanning = true;
        startPoint = {
            x: e.touches[0].clientX - viewOffset.x,
            y: e.touches[0].clientY - viewOffset.y
        };
    } else if (e.touches.length === 2) {
        // İki parmak için zoom
        lastTouchDistance = getTouchDistance(e.touches);
    }
}

function handleTouchMove(e) {
    e.preventDefault();
    
    if (e.touches.length === 1 && isPanning) {
        const touch = e.touches[0];
        viewOffset = {
            x: touch.clientX - startPoint.x,
            y: touch.clientY - startPoint.y
        };
        
        requestAnimationFrame(() => grafikCiz(document.getElementById('olcek').value));
    } else if (e.touches.length === 2) {
        const currentDistance = getTouchDistance(e.touches);
        const zoomChange = (currentDistance - lastTouchDistance) * 0.01;
        const oldZoom = zoomLevel;
        
        zoomLevel = Math.min(3, Math.max(0.5, zoomLevel + zoomChange));
        
        // Zoom merkez noktasını ayarla
        const centerX = (e.touches[0].clientX + e.touches[1].clientX) / 2;
        const centerY = (e.touches[0].clientY + e.touches[1].clientY) / 2;
        
        viewOffset.x += (centerX - viewOffset.x) * (1 - zoomLevel / oldZoom);
        viewOffset.y += (centerY - viewOffset.y) * (1 - zoomLevel / oldZoom);
        
        lastTouchDistance = currentDistance;
        
        requestAnimationFrame(() => grafikCiz(document.getElementById('olcek').value));
    }
}

function handleTouchEnd() {
    isPanning = false;
}

function getTouchDistance(touches) {
    return Math.hypot(
        touches[0].clientX - touches[1].clientX,
        touches[0].clientY - touches[1].clientY
    );
}

// Sayfa yüklendiğinde event listener'ları ekle
window.addEventListener('load', () => {
    addCanvasEventListeners();
    grafikCiz(25);
});
