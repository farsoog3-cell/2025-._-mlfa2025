const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');
const progressBar = document.getElementById('progressBar');
const consoleLog = document.getElementById('consoleLog');

document.getElementById('uploadBtn').addEventListener('click', async () => {
    const fileInput = document.getElementById('imageUpload');
    if(fileInput.files.length === 0) { alert("اختر صورة أولاً"); return; }
    const file = fileInput.files[0];

    consoleLog.textContent += `\nتم اختيار الملف: ${file.name}`;

    const formData = new FormData();
    formData.append('file', file);

    progressBar.style.width = '0%';
    consoleLog.textContent += `\nبدأ رفع الملف إلى السيرفر...`;

    try {
        // رابط السيرفر Render endpoint
        const response = await fetch('https://2025mlfa-6.onrender.com/upload', {
            method: 'POST',
            body: formData
        });

        if(!response.ok) { 
            consoleLog.textContent += `\nحدث خطأ أثناء التحويل.`;
            alert("حدث خطأ أثناء التحويل"); 
            return; 
        }

        consoleLog.textContent += `\nتم معالجة الصورة وتحويلها بنجاح.`;

        const blob = await response.blob();
        const url = URL.createObjectURL(blob);

        // تنزيل الملف النهائي
        const a = document.createElement('a');
        a.href = url;
        a.download = `pattern.dst`;
        a.click();

        consoleLog.textContent += `\nتم تنزيل ملف DST.`;

        // عرض المعاينة على Canvas
        const img = new Image();
        img.onload = () => {
            canvas.width = img.width;
            canvas.height = img.height;
            ctx.drawImage(img,0,0);
            consoleLog.textContent += `\nتم عرض المعاينة.`;
        };
        img.src = URL.createObjectURL(file);

        progressBar.style.width = '100%';

    } catch(err) {
        consoleLog.textContent += `\nخطأ في الاتصال بالسيرفر: ${err}`;
        alert("خطأ في الاتصال بالسيرفر");
    }

});
