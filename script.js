const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');

let stitchPoints = [];
let fileBase64 = "";
let filename = "";
let imgPreview = null;

const SERVER_URL = "https://2025mlfa-1.onrender.com";

// رفع الصورة فقط
document.getElementById('uploadBtn').addEventListener('click', async () => {
    const fileInput = document.getElementById('imageUpload');
    if(fileInput.files.length===0){alert("اختر صورة أولاً"); return;}
    const file = fileInput.files[0];

    imgPreview = new Image();
    imgPreview.src = URL.createObjectURL(file);
    imgPreview.onload = ()=>{
        canvas.width=imgPreview.width;
        canvas.height=imgPreview.height;
        ctx.drawImage(imgPreview,0,0);
    };
});

// بدء التحويل
document.getElementById('startBtn').addEventListener('click', async ()=>{
    const fileInput = document.getElementById('imageUpload');
    const formatSelect = document.getElementById('formatSelect');
    if(fileInput.files.length===0){alert("اختر صورة أولاً"); return;}
    const file = fileInput.files[0];
    const format = formatSelect.value;

    const formData = new FormData();
    formData.append('file', file);
    formData.append('format', format);

    try{
        const response = await fetch(`${SERVER_URL}/upload`, {method:'POST', body:formData});
        const data = await response.json();
        if(response.status!==200){alert("خطأ: "+(data.error||"فشل التحويل")); return;}

        stitchPoints = data.stitch_points;
        fileBase64 = data.file_base64;
        filename = data.filename;

        if(imgPreview){
            ctx.clearRect(0,0,canvas.width,canvas.height);
            imgPreview.src = "data:image/png;base64," + data.preview_image;
            imgPreview.onload = ()=>ctx.drawImage(imgPreview,0,0);
        }

        alert("تم تحويل الصورة إلى قالب تطريز بنجاح!");
    }catch(err){alert("خطأ في الاتصال بالسيرفر");}
});

// تنزيل الملف
document.getElementById('downloadBtn').addEventListener('click', ()=>{
    if(!fileBase64){alert("لا يوجد ملف للتنزيل. قم بالتحويل أولاً."); return;}
    const blob = b64toBlob(fileBase64,'application/octet-stream');
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = filename;
    a.click();
});

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
