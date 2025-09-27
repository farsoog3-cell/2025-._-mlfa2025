const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');
const progressBar = document.getElementById('progressBar');

let stitchPoints = [];
let dstBase64 = "";
let imgPreview = null;

document.getElementById('uploadBtn').addEventListener('click', async () => {
    const fileInput = document.getElementById('imageUpload');
    if(fileInput.files.length === 0) { alert("اختر صورة أولاً"); return; }
    const file = fileInput.files[0];

    const formData = new FormData();
    formData.append('file', file);

    progressBar.style.width = '0%';

    try {
        const response = await fetch('http://localhost:5000/upload', { method: 'POST', body: formData });
        if(!response.ok) { alert("خطأ أثناء رفع الصورة"); return; }

        const data = await response.json();
        stitchPoints = data.stitch_points;
        dstBase64 = data.dst_file;

        imgPreview = new Image();
        imgPreview.src = "data:image/png;base64," + data.preview_image;
        imgPreview.onload = () => {
            canvas.width = imgPreview.width;
            canvas.height = imgPreview.height;
            ctx.drawImage(imgPreview,0,0);
        };

        progressBar.style.width = '100%';
        alert("تم رفع الصورة بنجاح! اضغط على ابدأ لرؤية محاكاة الإبرة.");
    } catch(err) { alert("خطأ في الاتصال بالسيرفر"); }
});

document.getElementById('startBtn').addEventListener('click', () => {
    if(stitchPoints.length === 0) { alert("لا توجد نقاط تطريز"); return; }
    animateStitches(0);
});

function animateStitches(index) {
    if(index >= stitchPoints.length) {
        // انتهت الحركة، تنزيل ملف DST
        const blob = b64toBlob(dstBase64, 'application/octet-stream');
        const a = document.createElement('a');
        a.href = URL.createObjectURL(blob);
        a.download = "pattern.dst";
        a.click();
        return;
    }

    // رسم النقطة الحالية
    ctx.drawImage(imgPreview,0,0);
    ctx.fillStyle = "red";
    const pt = stitchPoints[index];
    ctx.beginPath();
    ctx.arc(pt.x, pt.y, 2, 0, Math.PI*2);
    ctx.fill();

    setTimeout(()=>animateStitches(index+1), 20); // تأخير بين الغرز (20ms)
}

// تحويل Base64 إلى Blob
function b64toBlob(b64Data, contentType='', sliceSize=512){
    const byteCharacters = atob(b64Data);
    const byteArrays = [];
    for(let offset=0; offset < byteCharacters.length; offset += sliceSize){
        const slice = byteCharacters.slice(offset, offset + sliceSize);
        const byteNumbers = new Array(slice.length);
        for(let i=0;i<slice.length;i++){ byteNumbers[i] = slice.charCodeAt(i); }
        const byteArray = new Uint8Array(byteNumbers);
        byteArrays.push(byteArray);
    }
    return new Blob(byteArrays, {type: contentType});
}
