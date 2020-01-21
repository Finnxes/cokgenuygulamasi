//Sayfa ilk açıldığında grafik çizme fonksiyonunu çalıştırmak için

window.onload=function(){
    grafikCiz(25);
};
//Grafik Çizme Fonksiyonu
function grafikCiz(deger){
    //Gerekli Değişkenler
    var k=deger,
        renkDoldur=document.getElementById('renkDoldur').checked,
        cevrelCember=document.getElementById('cevrelCember').checked,
        kenarSayisi =document.getElementById('kenarSayisi').value,
        kenarUzunlugu =document.getElementById('kenarUzunlugu').value,
        canvas = document.getElementById('cizimAlani'),
        ctx = canvas.getContext('2d'),
//Çizim alanının eni boyu
        canvasW=canvas.width,
        canvasH=canvas.height,
//Çizim ekranının orta noktası
        centerX = canvasW/2,
        centerY = canvasH/2;
    ctx.clearRect(0,0,canvasW,canvasH);
    // X Eksenini Çiz
    ctx.beginPath();
    ctx.moveTo(0,canvasH/2);
    ctx.lineTo(canvasW,canvasH/2);
    ctx.lineWidth=3;
    ctx.strokeStyle='#F00';
    ctx.stroke();
    // Y Eksenini Çiz
    ctx.beginPath();
    ctx.moveTo(canvasW/2,0);//ilk nokta
    ctx.lineTo(canvasW/ 2,canvasH);
    ctx.stroke();
    //Kareleri ayarla
    for (var j=0;j<canvasW;j++){
        //yatay çizgiler
        ctx.beginPath();
        ctx.moveTo(0,j*k);
        ctx.lineWidth=1;
        ctx.strokeStyle='#000';
        ctx.lineTo(canvasW, j*k);
        ctx.stroke();
        //dikey çizgiler
        ctx.beginPath();
        ctx.moveTo(j*k,0);
        ctx.lineWidth=1;
        ctx.strokeStyle='#000';
        ctx.lineTo(j*k, canvasW);
        ctx.stroke();
    }
    // Çokgen için değişkenler
    var aci = 360/kenarSayisi,
        a = kenarUzunlugu/ 2,
        pi=Math.PI,
        r=a/(Math.sin((aci/2)*(pi/180))),
        h=Math.pow((r*r-a*a),0.5);
    // Çokgenin Alanı
    var alan=(h*kenarUzunlugu/2)*kenarSayisi;

    // x = r*cos(alfa)
    // y = r*sin(alfa)
    // Çokgenin köşe noktalarını bul
    var poly=[];
    for (var m=0;m<=360;m +=aci){
        var x0=centerX+r*Math.cos(m*pi/180)*k;
        var y0=centerY-r*Math.sin(m*pi/180)*k;
        poly.push(x0,y0);
        ctx.beginPath();
        ctx.arc(x0, y0, 5, 0, 2 * Math.PI, false);
        ctx.fillStyle = 'yellow';
        ctx.fill();
        ctx.lineWidth=4;
        ctx.strokeStyle='#00F';
        ctx.stroke();

    }
    // Çokgenin Kenarlarını çiz
    ctx.beginPath();
    ctx.moveTo(poly[0], poly[1]);
    for( item=2 ; item < poly.length-1 ; item+=2 ){
        ctx.lineTo( poly[item] , poly[item+1] );
    }
    if (renkDoldur){
        //ctx.globalAlpha=0.8;
        //ctx.fillStyle='#6699FF';
        ctx.fillStyle="rgba(102,153,255,0.5)";
        ctx.fill();
    }
    ctx.lineWidth=2;
    ctx.strokeStyle = '#f00';
    ctx.closePath();    
    ctx.stroke();
    // Çevrel çemberi çiz
    if (cevrelCember){
        ctx.beginPath();
        ctx.arc(centerX, centerY, r*k, 0, 2 * Math.PI, false);
        ctx.lineWidth=2;
        ctx.strokeStyle='#060';
        ctx.stroke();
    }
    document.getElementById('textMerkezAci').innerHTML=aci;
    document.getElementById('textYariCap').innerHTML=r;
    document.getElementById('textYukseklik').innerHTML=h;
    document.getElementById('textAlan').innerHTML=alan;
}

function resimKaydet(){
    var canvas = document.getElementById("cizimAlani");
    var data = canvas.toDataURL("image/png").replace("image/png", "image/octet-stream");
    //window.location.href = data;
    var dataUrl = canvas.toDataURL();
    window.open(dataUrl, "toDataURL() image", "width=1000, height=500");
}