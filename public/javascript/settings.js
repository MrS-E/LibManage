document.getElementById('clean').addEventListener('click', ()=>{
    fetch("/api/user/clean", {method: "delete"}).catch(err=>err)
})

document.getElementById('delete').addEventListener('click', ()=>{
    fetch("/api/user/", {method: "delete"}).catch(err=>err)
        .then(()=>window.location.reload())
})