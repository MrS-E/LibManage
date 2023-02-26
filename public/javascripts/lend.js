for(let d of document.getElementsByClassName('read')){
    d.addEventListener('click', (e)=>{

    })
}

for(let d of document.getElementsByClassName('return')){
    d.addEventListener('click', (e)=>{
        console.log(e.target)
        fetch('/object/return', {
            method: 'post',
            headers:{
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                id: e.target.id
            })
        })
    })
}