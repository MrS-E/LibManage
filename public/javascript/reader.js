fetch('/api/object/read/'+book, {method:"get"})
    .then((response)=>response.text())
    .then((res)=>{
        console.log(res)
        /*if(res.file) {
            e.target.innerText = "Download started in kürze"
            const a = document.createElement("a")
            a.href = "data:"+res.book[0].contentType+";base64," + res.file
            a.download = res.book[0].filename
            a.click()
            e.target.innerText = "Heruntergeladen"
            a.remove()
        }else{
            e.target.innerText = "Wurde nicht gefunden"
        }*/
    })