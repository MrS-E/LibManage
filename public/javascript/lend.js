for(let d of document.getElementsByClassName('read')){
    d.addEventListener('click', (e)=>{
        //todo reading (ask function "components/ich/read)
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