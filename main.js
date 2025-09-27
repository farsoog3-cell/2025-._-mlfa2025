const form=document.getElementById('form');
const imgPreview=document.getElementById('imgPreview');
const result=document.getElementById('result');
const logDiv=document.getElementById('log');
const canvas=document.getElementById('previewCanvas');
const ctx=canvas.getContext('2d');

form.addEventListener('change',e=>{
  const file=e.target.querySelector('input[type=file]').files[0];
  if(!file) return;
  imgPreview.src=URL.createObjectURL(file);
  imgPreview.style.display='block';
});

form.addEventListener('submit',async e=>{
  e.preventDefault();
  const fd=new FormData(form);
  result.innerHTML='';
  logDiv.innerHTML='جاري الرفع والمعالجة...';
  ctx.clearRect(0,0,canvas.width,canvas.height);

  try{
    const resp=await fetch('/upload',{method:'POST',body:fd});
    const data=await resp.json();
    logDiv.innerHTML=data.log.join('<br>');
    if(data.files){
      result.innerHTML=`
        <p>${data.message}</p>
        <a class="filelink" href="${data.files.stitches_csv}" download>تحميل ملف النقاط (.stitches.csv)</a>
        <a class="filelink" href="${data.files.dst}" download>تحميل ملف DST (.dst)</a>
        <a class="filelink" href="${data.files.dse}" download>تحميل ملف DSE (.dse.json)</a>
      `;
    }
    if(data.previewPoints){
      ctx.clearRect(0,0,canvas.width,canvas.height);
      ctx.fillStyle='red';
      const scale=Math.min(canvas.width/300,canvas.height/300);
      data.previewPoints.forEach(p=>ctx.fillRect(p.x*scale,p.y*scale,2,2));
    }
  }catch(err){
    console.error(err);
    logDiv.innerHTML='حدث خطأ أثناء المعالجة.';
  }
});
