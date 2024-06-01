window.onload = function() {
    grafikCiz(25);
};

function grafikCiz(deger) {
    const k = deger;
    const renkDoldur = document.getElementById('renkDoldur').checked;
    const cevrelCember = document.getElementById('cevrelCember').checked;
    const kenarSayisi = parseInt(document.getElementById('kenarSayisi').value);
    const kenarUzunlugu = parseFloat(document.getElementById('kenarUzunlugu').value);
    const canvas = document.getElementById('cizimAlani');
    const ctx = canvas.getContext('2d');
    const canvasW = canvas.width;
    const canvasH = canvas.height;
    const centerX = canvasW / 2;
    const centerY = canvasH / 2;

    ctx.clearRect(0, 0, canvasW, canvasH);

    // Koordinat eksenlerini çiz
    ctx.beginPath();
    ctx.moveTo(0, canvasH / 2);
    ctx.lineTo(canvasW, canvasH / 2);
    ctx.lineWidth = 3;
    ctx.strokeStyle = '#F00';
    ctx.stroke();

    ctx.beginPath();
    ctx.moveTo(canvasW / 2, 0);
    ctx.lineTo(canvasW / 2, canvasH);
    ctx.stroke();

    // Izgara çiz
    for (let j = 0; j < canvasW; j++) {
        ctx.beginPath();
        ctx.moveTo(0, j * k);
        ctx.lineWidth = 1;
        ctx.strokeStyle = '#000';
        ctx.lineTo(canvasW, j * k);
        ctx.stroke();

        ctx.beginPath();
        ctx.moveTo(j * k, 0);
        ctx.lineTo(j * k, canvasW);
        ctx.stroke();
    }

    // Çokgen hesaplamaları
    const aci = 360 / kenarSayisi;
    const a = kenarUzunlugu / 2;
    const pi = Math.PI;
    const r = a / Math.sin((aci / 2) * (pi / 180));
    const h = Math.sqrt(r * r - a * a);
    const alan = (h * kenarUzunlugu / 2) * kenarSayisi;

    // Çokgenin köşe noktalarını hesapla ve çiz
    const poly = [];
    for (let m = 0; m <= 360; m += aci) {
        const x0 = centerX + r * Math.cos(m * pi / 180) * k;
        const y0 = centerY - r * Math.sin(m * pi / 180) * k;
        poly.push(x0, y0);

        ctx.beginPath();
        ctx.arc(x0, y0, 5, 0, 2 * Math.PI, false);
        ctx.fillStyle = 'yellow';
        ctx.fill();
        ctx.lineWidth = 4;
        ctx.strokeStyle = '#00F';
        ctx.stroke();
    }

    // Çokgeni çiz
    ctx.beginPath();
    ctx.moveTo(poly[0], poly[1]);
    for (let item = 2; item < poly.length - 1; item += 2) {
        ctx.lineTo(poly[item], poly[item + 1]);
    }

    if (renkDoldur) {
        ctx.fillStyle = "rgba(102, 153, 255, 0.5)";
        ctx.fill();
    }

    ctx.lineWidth = 2;
    ctx.strokeStyle = '#F00';
    ctx.closePath();
    ctx.stroke();

    // Çevrel çemberi çiz
    if (cevrelCember) {
        ctx.beginPath();
        ctx.arc(centerX, centerY, r * k, 0, 2 * Math.PI, false);
        ctx.lineWidth = 2;
        ctx.strokeStyle = '#060';
        ctx.stroke();
    }

    // Hesaplanan değerleri güncelle
    document.getElementById('textMerkezAci').textContent = aci.toFixed(2);
    document.getElementById('textYariCap').textContent = r.toFixed(2);
    document.getElementById('textYukseklik').textContent = h.toFixed(2);
    document.getElementById('textAlan').textContent = alan.toFixed(2);
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
    } else {
        body.classList.remove("dark-mode");
    }
}
