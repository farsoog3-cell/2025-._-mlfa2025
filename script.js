const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');
const progressBar = document.getElementById('progressBar');
const consoleLog = document.getElementById('consoleLog');

document.getElementById('uploadBtn').addEventListener('click', async () => {
    const fileInput = document.getElementById('imageUpload');
    const formatSelect = document.getElementById('formatSelect');

    if(fileInput.files.length === 0) { alert("اختر صورة أولاً"); return; }
    const file = fileInput.files[0];
    const format = formatSelect.value;

    consoleLog.textContent += `\nتم اختيار الملف: ${file.name} بصيغة ${format}`;

    const formData = new FormData();
    formData.append('file', file);
    formData.append('format', format);

    progressBar.style.width = '0%';
    consoleLog.textContent += `\nبدأ رفع الملف إلى السيرفر...`;

    try {
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
        a.download = `pattern.${format.toLowerCase()}`;
        a.click();

        consoleLog.textContent += `\nتم تنزيل الملف بنجاح.`;

        // عرض معاينة على Canvas
        const img = new Image();
        img.onload = () => {
            canvas.width = img.width;
            canvas.height = img.height;
            ctx.clearRect(0,0,canvas.width,canvas.height);
            ctx.drawImage(img,0,0);

            // إضافة تأثير نقاط خيوط Satin
            let imageData = ctx.getImageData(0,0,canvas.width,canvas.height);
            for(let i=0;i<imageData.data.length;i+=4){
                let gray = (imageData.data[i]+imageData.data[i+1]+imageData.data[i+2])/3;
                if(gray<200){
                    imageData.data[i] = 255;
                    imageData.data[i+1] = 255;
                    imageData.data[i+2] = 255;
                } else {
                    imageData.data[i] = 180;
                    imageData.data[i+1] = 50;
                    imageData.data[i+2] = 150;
                }
            }
            ctx.putImageData(imageData,0,0);
            consoleLog.textContent += `\nتم عرض المعاينة كصورة مطرزة.`;
        };
        img.src = URL.createObjectURL(file);

        progressBar.style.width = '100%';

    } catch(err) {
        consoleLog.textContent += `\nخطأ في الاتصال بالسيرفر: ${err}`;
        alert("خطأ في الاتصال بالسيرفر");
    }
});
