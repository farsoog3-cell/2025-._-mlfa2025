const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');
const progressBar = document.getElementById('progressBar');

let stitchPoints = [];
let dstBase64 = "";
let imgPreview = null;

const SERVER_URL = "https://2025mlfa-1.onrender.com";

document.getElementById('uploadBtn').addEventListener('click', async () => {
    const fileInput = document.getElementById('imageUpload');
    if(fileInput.files.length === 0) { alert("اختر صورة أولاً"); return; }
    const file = fileInput.files[0];

    const formData = new FormData();
    formData.append('file', file);

    progressBar.style.width = '0%';

    try {
        const response = await fetch(`${SERVER_URL}/upload`, { method: 'POST', body: formData });
        const data = await response.json();

        if(response.status !== 200) {
            alert("خطأ: " + (data.error || "فشل التحويل"));
            return;
        }

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
    if(stitchPoints.length
