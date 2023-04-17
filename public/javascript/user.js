for(let d of document.querySelectorAll("button[name='clean']")) {
    d.addEventListener('click', (e) => {
        const user = e.target.id.split('_')[1]
        fetch("/api/user/clean", {
            headers: {'Accept': 'application/json', 'Content-Type': 'application/json'},
            method: "delete",
            body: JSON.stringify({user: user})
        }).catch(err => err)
    })
}

for(let d of document.querySelectorAll("button[name='delete']")) {
    d.addEventListener('click', (e) => {
        const user = e.target.id.split('_')[1]
        fetch("/api/user/", {
            headers: {'Accept': 'application/json', 'Content-Type': 'application/json'},
            method: "delete",
            body: JSON.stringify({user: user})
        }).catch(err => err)
            .then(() => window.location.reload())
    })
}

for(let d of document.querySelectorAll("button[name='update']")) {
    d.addEventListener('click', (e) => {
        const user = e.target.id.split('_')[1]
        const role = document.getElementById("select_"+user).value
        fetch("/api/user/update", {
            headers: {'Accept': 'application/json', 'Content-Type': 'application/json'},
            method: "put",
            body: JSON.stringify({id: user, role: role})
        }).catch(err => err)
        //.then(doc=>window.location.reload())
    })
}