setup()
let objects = []
let aktuell = []
const sort = {
    type: "title",
    reverse: false
}

document.getElementsByClassName("kategorie")
document.getElementsByClassName("schlussel")
document.getElementsByClassName("year")
for(let el of document.querySelectorAll(".sort[name='sort']")){
    el.addEventListener('change', ()=>{
        document.querySelector('.sort[name="sort"]:checked').value === "norm"?sort.reverse=false:sort.reverse=true
        show_sort(aktuell)
    })
}
document.querySelector("select.sort").addEventListener('change', (e)=>{
    sort.type= e.target.value
    show_sort(aktuell)
})
document.getElementById("search_btn").addEventListener('click', search)
document.getElementById('search').addEventListener("click", (e)=>{
    e.target.value = "";
})

function setup(){
        fetch('/api/object/')
            .then(res => res.json())
            .then(doc => {
                show_sort(doc)
                write_keywords(doc)
                document.getElementById("max").value = new Date().toISOString().split('-')[0]
                objects = doc
                aktuell = doc
            })
            .catch((err) => console.error(err))
}
async function show_sort(books){
    //todo sort books
    console.log("sort")
    books = books.sort(function sorting(a, b) {
        if (sort.reverse && (a[sort.type] < b[sort.type])) return -1;
        if (sort.reverse && (a[sort.type] > b[sort.type])) return 1;
        if (!sort.reverse && (a[sort.type] < b[sort.type])) return 1;
        if (!sort.reverse && (a[sort.type] > b[sort.type])) return -1;
        return 0;
    })
    //todo show only books within the filters
    write_books(books);
}
async function write_books(books){
    function list_books(books){
        books = books.reduce((r, e, i) => (i % 4 ? r[r.length - 1].push(e) : r.push([e])) && r, []); // from https://stackoverflow.com/questions/38048497/group-array-values-in-group-of-3-objects-in-each-array-using-underscore-js
        let out = "";
        //insert books into liste
        for(let x=0; x<books.length; x++){
            out += "<div class='row mt-2'>"
            for(let y=0; y<books[x].length; y++){
                out += "<div class='col-3'>"
                out += gen_book(books[x][y])
                out += "</div>"
            }
            out += "</div>"
        }
        return out
    }
    function gen_book(book){
        if(!book.img) book.img = "/image/no_img.png"
        if(!book.img_desc) book.img_desc = "kein bild verfügbar"
        if(!book.small_desc) book.small_desc = ""
        if(!book.author) book.author = ""
        if(!book.title) book.title= ""
        return (
            "<div class='row' onclick='window.location.replace(\"/liste/" + book._id + "\")'>" +
            "<div class='col-6'>" +
            "<img class='img-thumbnail img-rounded' src=\'"+book.img+"\' alt=\'"+book.img_desc+"\'/>" +
            "</div>" +
            "<div class='col-6'>" +
            "<p><strong>"+book.title+"</strong><br/><span>"+book.author+"</span></p>" +
            "<span>"+book.small_desc+"</span>" +
            "</div>" +
            "</div>"
        )
    }

    document.getElementById("books").innerHTML = list_books(books);
}
async function write_keywords(books){
    let keywords = []
    for (let d of books){
        for (let k of d.keywords){
            if(!keywords.includes(k)){
                keywords.push(k)
            }
        }
    }
    keywords = keywords.sort()
    const accordion = document.querySelector("#collapseTwo .accordion-body")
    for(let key of keywords){
        const input = document.createElement("input")
        input.classList.add("schlussel")
        input.setAttribute("type", "checkbox")
        input.setAttribute("id", key)
        const label = document.createElement("label")
        label.classList.add("ps-1")
        label.setAttribute("for",key)
        label.innerText = key
        accordion.appendChild(input)
        accordion.appendChild(label)
        accordion.appendChild(document.createElement("br"))
    }
}
function test(arr, sub) { // function is from https://stackoverflow.com/questions/43750172/javascript-matching-strings-to-partial-matches
    sub = sub.toLowerCase();
    return arr.map(str => str
        .toLowerCase()
        .startsWith(sub.slice(0, Math.max(str.length - 1, 1)))
    );
}
function search(){
    const term = document.getElementById("search").value;
    aktuell = []
    for(let d of objects){
        if(test(d.keywords.concat([d.title, d.author, d.publisher, d.isbn]), term).includes(true)) aktuell.push(d)
    }
    show_sort(aktuell)
}