for(let d of document.getElementsByClassName('read')){
    d.addEventListener('click', (e)=>{
        const book = e.target.id
        fetch('/api/object/read/'+book, {method:"get"})
            .then((response)=>response.json())
            .then((res)=>{
                console.log(res.file)
                //window.open(res.file+(res.file.split('/')[1].split(';')[0].split('+')[0], '_blank').focus();
                const a = document.createElement("a")
                a.href = res.file
                a.download = res.name +"."+ res.file.split('/')[1].split(';')[0].split('+')[0]
                a.click()
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