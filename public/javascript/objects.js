for(let x of document.querySelectorAll("button.delete_btn")){
    x.addEventListener('click', (e)=>{
        fetch('/api/admin/'+e.target.id, {method:'delete'})
            .then(res => res.json())
            .then(doc => {
                if(doc.deletedCount > 0){
                    document.getElementById("book_"+e.target.id).remove()
                }
            })
    })
}

document.getElementById("search_btn").addEventListener('click', search)
document.getElementById('search').addEventListener("click", (e)=>{
    e.target.value = "";
})
document.getElementById('search').addEventListener("keydown", (e)=>{
    if(e.keyCode===13){
        search()
    }
})

function search(){
    function test(arr, sub) { // function is from https://stackoverflow.com/questions/43750172/javascript-matching-strings-to-partial-matches
        sub = sub.toLowerCase();
        return arr.map(str => str
            .toLowerCase()
            .startsWith(sub.slice(0, Math.max(str.length - 1, 1)))
        );
    }
    function show(books) {
        const tbody = document.querySelector('tbody')
        const html = []
        for (let b of books) {
            let out = "<tr id='book_"+b._id+"'>"
            for (let att of Array.from([b.title, b.author, b.publisher, b.isbn])) {
                out += "<td><span>"+att+"</span></td>"
            }
            out += "<td><button class='btn delete_btn' id='" + b._id + "'>Löschen</button><form action='/admin/edit/" + b._id + "' method='get'><button class='btn' type='submit'>Bearbeiten</button></form></td>"
            out += "</tr>"
            html.push(out)
        }
        tbody.innerHTML = html.join('')
    }

    const term = document.getElementById("search").value;
    fetch('/api/object/')
        .then(res => res.json())
        .then(doc => {
            const aktuell = []
            for(let d of doc){
                if(test(d.keywords.concat([d.title, d.author, d.publisher, d.isbn]), term).includes(true)) aktuell.push(d)
            }
            show(aktuell)
        })
}

