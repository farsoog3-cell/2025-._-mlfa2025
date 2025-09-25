const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');
const progressBar = document.getElementById('progressBar');

document.getElementById('uploadBtn').addEventListener('click', async () => {
    const fileInput = document.getElementById('imageUpload');
    if(fileInput.files.length === 0) { alert("اختر صورة أولاً"); return; }
    const file = fileInput.files[0];
    const format = document.getElementById('formatSelect').value;

    const formData = new FormData();
    formData.append('file', file);
    formData.append('format', format);

    progressBar.style.width = '0%';

    // ضع هنا رابط السيرفر النهائي بعد رفعه على Render
    const response = await fetch('https://YOUR_SERVER_URL/upload', {
        method: 'POST',
        body: formData
    });

    if(!response.ok) { alert("حدث خطأ في التحويل"); return; }

    const blob = await response.blob();
    const url = URL.createObjectURL(blob);

    // تحميل الملف النهائي
    const a = document.createElement('a');
    a.href = url;
    a.download = `pattern.${format.toLowerCase()}`;
    a.click();

    // عرض المعاينة على Canvas (صورة أصلية)
    const img = new Image();
    img.onload = () => {
        canvas.width = img.width;
        canvas.height = img.height;
        ctx.drawImage(img,0,0);
    };
    img.src = URL.createObjectURL(file);

    progressBar.style.width = '100%';
});
