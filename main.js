document.getElementById("embForm").addEventListener("submit", async (e)=>{
    e.preventDefault();
    const formData = new FormData(e.target);
    const res = await fetch("/embroidery", {method:"POST", body:formData});
    const data = await res.json();
    if(data.success){
        document.getElementById("embPreview").innerHTML = 
            `<p>📍 معاينة القالب:</p><img src="${data.preview_url}" style="max-width:100%; max-height:400px;">`;
        const dl = document.getElementById("downloadEmb");
        dl.href = data.download_url;
        dl.style.display = "inline-block";
    } else {
        alert("خطأ: " + data.error);
    }
});
