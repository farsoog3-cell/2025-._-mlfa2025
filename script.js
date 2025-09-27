const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');
const progressBar = document.getElementById('progressBar');

let stitchPoints = [];
let fileBase64 = "";
let imgPreview = null;

const SERVER_URL = "https://2025mlfa-1.onrender.com";

document.getElementById('uploadBtn').addEventListener('click', async () => {
    const fileInput = document.getElementById('imageUpload');
    const formatSelect = document.getElementById('formatSelect');
    if(fileInput.files.length===0){alert("اختر صورة أولاً"); return;}
    const file = fileInput.files[0];
    const format = formatSelect.value;

    const formData = new FormData();
    formData.append('file', file);
    formData.append('format', format);

    progressBar.style.width='0%';

    try{
        const response = await fetch(`${SERVER_URL}/upload`, {method:'POST', body:formData});
        const data = await response.json();
        if(response.status!==200){alert("خطأ: "+(data.error||"فشل التحويل")); return;}

        stitchPoints = data.stitch_points;
        fileBase64 = data.file_base64;

        imgPreview = new Image();
        imgPreview.src = "data:image/png;base64," + data.preview_image;
        imgPreview.onload = ()=>{canvas.width=imgPreview.width; canvas.height=imgPreview.height; ctx.drawImage(imgPreview,0,0);}
        progressBar.style.width='100%';
        alert("تم التحويل بنجاح! اضغط ابدأ لرؤية محاكاة الإبرة.");
    }catch(err){alert("خطأ في الاتصال بالسيرفر");}
});

document.getElementById('startBtn').addEventListener('click', () => {
    if(stitchPoints.length===0){alert("لا توجد نقاط تطريز"); return;}
    animateStitches(0);
});

function animateStitches(index){
    if(index>=stitchPoints.length){
        const blob = b64toBlob(fileBase64,'application/octet-stream');
        const a = document.createElement('a');
        a.href = URL.createObjectURL(blob);
        a.download = `pattern.dst`;
        a.click();
        return;
    }
    const p = stitchPoints[index];
    ctx.fillStyle='red';
    ctx.fillRect(p.x,p.y,2,2);
    setTimeout(()=>animateStitches(index+1),5);
}

function b64toBlob(b64Data, contentType='', sliceSize=512){
    const byteCharacters = atob(b64Data);
    const byteArrays=[];
    for(let offset=0;offset<byteCharacters.length;offset+=sliceSize){
        const slice = byteCharacters.slice(offset, offset+sliceSize);
        const byteNumbers = new Array(slice.length);
        for(let i=0;i<slice.length;i++){byteNumbers[i]=slice.charCodeAt(i);}
        const byteArray = new Uint8Array(byteNumbers);
        byteArrays.push(byteArray);
    }
    return new Blob(byteArrays,{type:contentType});
}
