document.querySelector("button[name='clean']").addEventListener('click', (e)=>{
    const user = e.target.id.split('_')[1]
    fetch("/api/user/clean", {method:"delete", body: JSON.stringify({user: user})}).catch(err=>err)
})

document.querySelector("button[name='delete']").addEventListener('click', (e)=>{
    const user = e.target.id.split('_')[1]
    fetch("/api/user/", {method:"delete", body: JSON.stringify({user: user})}).catch(err=>err)
        .then(doc=>window.location.reload())
})

document.querySelector("button[name='update']").addEventListener('click', (e)=>{
    const role = document.getElementById("role").value
    const user = e.target.id.split('_')[1]
    fetch("/api/user/update", {method:"put", body: JSON.stringify({id: user, role: role})}).catch(err=>err)
        .then(doc=>window.location.reload())
})