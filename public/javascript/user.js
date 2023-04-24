const user = []

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

for(let d of document.querySelectorAll(".user")){
    user.push({
        _id: d.querySelector(".email").id,
        salutation: d.querySelector(".salutation").innerText,
        firstName: d.querySelector(".firstName").innerText,
        lastName: d.querySelector(".lastName").innerText,
        role: d.querySelector(".role").value,
        email: d.querySelector(".email").innerText
    })
}

document.getElementById('search').addEventListener("click", (e)=>{
    e.target.value = "";
})
document.getElementById('search').addEventListener("keydown", (e)=>{
    if(e.keyCode===13){
        search()
    }
})
document.getElementById('search_btn').addEventListener('click', search)

function search(){
    const found = []
    let out = ""
    const search = document.getElementById('search').value
    for(let d of user){
        if(d['firstName'].includes(search) || d['lastName'].includes(search) || d['role'].includes(search)){
            found.push(d)
        }
    }
    for(let d of found){
        out += "<div class='row rounded mt-2 border-dark border user' id='"+d._id+"'>" +
            "<div class='col-md-4 col-sm-6'>" +
            "<p class='salutation'>"+d.salutation+"</p>" +
            "<p><span class='firstName'>"+d.firstName+"</span><br><span class='lastName'>"+d.lastName+"</span></p>"+
            "</div>" +
            "<div class='col-md-4 col-sm-6 border-start border-dark mt-3 mb-3'>" +
            "<p class='email'>"+d.email+"</p>" +
            "<select class='form-control role' id='select_"+d._id+"'>" +
            "<option value='user' "+(d.role==="user"?"selected":"")+">Nutzer</option>" +
            "<option value='worker' "+(d.role==="worker"?"selected":"")+">Mitarbeiter</option>" +
            "<option value='admin' "+(d.role==="admin"?"selected":"")+">Admin</option>" +
            "</select>" +
            "</div>" +
            "<div class='col-md-4 col-sm-12 d-grid gap-2 mt-2 mb-2'>" +
            "<button class='btn btn-block btn-outline-secondary' id='clean_"+d._id+"' name='clean'>Clean History</button>" +
            "<button class='btn btn-block btn-secondary' id='delete_"+d._id+"' name='delete'>Löschen</button>" +
            "<button class='btn btn-block btn-primary' id='update_"+d._id+"' name='update'>Updaten</button>" +
            "</div>" +
            "</div>"
    }
    document.getElementById('user').innerHTML=out
}
