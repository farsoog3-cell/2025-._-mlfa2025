const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');
let imgData = null;

document.getElementById('imageUpload').addEventListener('change', function(e){
    const file = e.target.files[0];
    if(!file) return;
    const img = new Image();
    img.onload = () => {
        const maxSize = 300;
        let w = img.width, h = img.height;
        if(w>h){ if(w>maxSize){ h *= maxSize/w; w = maxSize;} } 
        else { if(h>maxSize){ w *= maxSize/h; h = maxSize;} }
        canvas.width=w; canvas.height=h;
        ctx.drawImage(img,0,0,w,h);
        imgData = ctx.getImageData(0,0,w,h);
    }
    img.src = URL.createObjectURL(file);
});

document.getElementById('downloadBtn').addEventListener('click', function(){
    if(!imgData) { alert("قم برفع صورة أولاً"); return; }

    const emb = new Embroidery();
    const width = imgData.width;
    const height = imgData.height;

    // كل بكسل داكن = نقطة تطريز
    for(let y=0; y<height; y+=5){ 
        for(let x=0; x<width; x+=5){
            const i = (y*width + x)*4;
            const avg = (imgData.data[i]+imgData.data[i+1]+imgData.data[i+2])/3;
            if(avg<128){
                emb.addStitch(x, y);
            }
        }
    }

    // تصدير DST
    const dstData = emb.toDST();
    const blob = new Blob([dstData], {type: "application/octet-stream"});
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = "template.dst";
    link.click();
});