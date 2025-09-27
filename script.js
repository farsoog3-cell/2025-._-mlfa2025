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
    progressBar.style.width = '0%';

    const formData = new FormData();
    formData.append('file', file);
    formData.append('format', format);

    consoleLog.textContent += `\nبدأ رفع الملف إلى السيرفر...`;

    try {
        const response = await fetch('http://localhost:5000/upload', { // رابط السيرفر المحلي
            method: 'POST',
            body: formData
        });

        if(!response.ok) {
            consoleLog.textContent += `\nحدث خطأ أثناء التحويل.`;
            alert("حدث خطأ أثناء التحويل");
            return;
        }

        const data = await response.json();
        consoleLog.textContent += `\nتم معالجة الصورة وتحويلها بنجاح.`;

        // تنزيل ملف DST مباشرة
        const dstBlob = b64toBlob(data.dst_file, 'application/octet-stream');
        const a = document.createElement('a');
        a.href = URL.createObjectURL(dstBlob);
        a.download = data.filename;
        a.click();
        consoleLog.textContent += `\nتم تنزيل الملف بنجاح.`;

        // عرض المعاينة على Canvas
        const img = new Image();
        img.onload = () => {
            canvas.width = img.width;
            canvas.height = img.height;
            ctx.clearRect(0,0,canvas.width,canvas.height);
            ctx.drawImage(img,0,0);
        };
        img.src = "data:image/png;base64," + data.preview_image;

        progressBar.style.width = '100%';

    } catch(err) {
        consoleLog.textContent += `\nخطأ في الاتصال بالسيرفر: ${err}`;
        alert("خطأ في الاتصال بالسيرفر");
    }
});

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
