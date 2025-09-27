const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');
const consoleLog = document.getElementById('consoleLog');

let stitchPoints = [];
let fileBase64 = "";
let filename = "";
let imgPreview = null;

const SERVER_URL = "https://2025mlfa-1.onrender.com";

function log(msg){
    consoleLog.textContent += `\n${msg}`;
    consoleLog.scrollTop = consoleLog.scrollHeight;
}

// بدء التحويل
document.getElementById('startBtn').addEventListener('click', async ()=>{
    const fileInput = document.getElementById('imageUpload');
    const formatSelect = document.getElementById('formatSelect');
    if(fileInput.files.length===0){alert("اختر صورة"); return;}
    const file = fileInput.files[0];
    const format = formatSelect.value;

    imgPreview = new Image();
    imgPreview.src = URL.createObjectURL(file);
    imgPreview.onload = ()=>{
        canvas.width=imgPreview.width;
        canvas.height=imgPreview.height;
        ctx.drawImage(imgPreview,0,0);
    };

    log("بدأ التحويل...");
    const formData = new FormData();
    formData.append('file', file);
    formData.append('format', format);

    try{
        const response = await fetch(`${SERVER_URL}/upload`, {method:'POST', body:formData});
        const data = await response.json();
        if(response.status!==200){alert("خطأ:"+data.error); log("فشل التحويل"); return;}

        stitchPoints = data.stitch_points;
        fileBase64 = data.file_base64;
        filename = data.filename;

        log("تم إنشاء القالب بنجاح!");
        animateStitches(0);
    }catch(err){alert("خطأ في الاتصال بالسيرفر"); log("خطأ الاتصال بالسيرفر");}
});

// تنزيل الملف
document.getElementById('downloadBtn').addEventListener('click', ()=>{
    if(!fileBase64){alert("لا يوجد ملف لتحميل"); return;}
    const blob = b64toBlob(fileBase64,'application/octet-stream');
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = filename;
    a.click();
    log("تم تنزيل الملف: "+filename);
});

// رسم مسار الإبرة والخيط على القالب
function animateStitches(index){
    if(index>=stitchPoints.length) { log("انتهى مسار الإبرة"); return; }
    const p = stitchPoints[index];
    ctx.fillStyle='red';
    ctx.fillRect(p.x,p.y,2,2);
    setTimeout(()=>animateStitches(index+1),5);
}

// تحويل Base64 إلى Blob
function b64toBlob(b64Data, contentType='', sliceSize=512){
    const byteCharacters = atob(b64Data);
    const byteArrays=[];
    for(let offset=0; offset<byteCharacters.length; offset+=sliceSize){
        const slice = byteCharacters.slice(offset, offset+sliceSize);
        const byteNumbers = new Array(slice.length);
        for(let i=0;i<slice.length;i++){byteNumbers[i]=slice.charCodeAt(i);}
        const byteArray = new Uint8Array(byteNumbers);
        byteArrays.push(byteArray);
    }
    return new Blob(byteArrays,{type:contentType});
}
