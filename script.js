const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');
const progressBar = document.getElementById('progressBar');

document.getElementById('uploadBtn').addEventListener('click', async () => {
    const fileInput = document.getElementById('imageUpload');
    if(fileInput.files.length === 0) { alert("اختر صورة أولاً"); return; }
    const file = fileInput.files[0];

    const formData = new FormData();
    formData.append('file', file);

    progressBar.style.width = '0%';

    // ضع هنا رابط السيرفر النهائي من Render
    const response = await fetch('https://2025mlfa-6.onrender.com/upload', {
        method: 'POST',
        body: formData
    });

    if(!response.ok) { alert("حدث خطأ في التحويل"); return; }

    const blob = await response.blob();
    const url = URL.createObjectURL(blob);

    // تنزيل الملف النهائي
    const a = document.createElement('a');
    a.href = url;
    a.download = `pattern.dst`;
    a.click();

    // عرض المعاينة على Canvas
    const img = new Image();
    img.onload = () => {
        canvas.width = img.width;
        canvas.height = img.height;
        ctx.drawImage(img,0,0);
    };
    img.src = URL.createObjectURL(file);

    progressBar.style.width = '100%';
});
