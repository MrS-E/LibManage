for(let d of document.getElementsByClassName('read')){
    d.addEventListener('click', (e)=>{
        const book = e.target.id
        e.target.disabled = true
        e.target.innerText = "Bitte warten"
        fetch('/api/object/read/'+book, {method:"get"})
            .then((response)=>response.json())
            .then((res)=>{
                console.log(res)
                //window.open(res.file+(res.file.split('/')[1].split(';')[0].split('+')[0], '_blank').focus();
                if(res.file) {
                    e.target.innerText = "Download started in kürze"
                    const a = document.createElement("a")
                    a.href = "data:"+res.book[0].contentType+";base64," + res.file
                    a.download = res.book[0].filename
                    a.click()
                    e.target.innerText = "Heruntergeladen"
                    a.remove()
                }else{
                    e.target.innerText = "Wurde nicht gefunden"
                }
            })
    })
}

for(let d of document.getElementsByClassName('return')){
    d.addEventListener('click', (e)=>{
        console.log(e.target)
        fetch('/api/object/return', {
            method: 'put',
            headers:{
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                id: e.target.id
            })
        })
            .then(
                ()=>{
               window.location.reload()
           }
        )
    })
}