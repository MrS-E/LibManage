setup()
let objects = []
let aktuell = []
const sort = {
    sort: "title",
    reverse: false,
    type: [],
    keywords: []
}

function setup(){
        fetch('/api/object/')
            .then(res => res.json())
            .then(doc => {
                show_sort(doc)
                write_keywords(doc)
                add_eventListener()
                document.getElementById("max").value = new Date().toISOString().split('-')[0]
                objects = doc
                aktuell = doc
            })
            .catch((err) => console.error(err))
}
function show_sort(books){
    //todo sort books
    books = Array.from(books) //without that aktuell will be overwritten
    console.log("sort")
    //type
    console.log(sort)
    if(sort.type.length!==0){ //all selected categories must be
        for(let d=0 ;d < books.length; d++){
            if (!sort.type.includes(books[d].typ)) {
                books.splice(books.indexOf(books[d]), 1)
                d--
            }
        }
    }

    //keywords
    if(sort.keywords.length!==0){ //all keywords need to be for filled
        for(let d=0 ;d < books.length; d++){
            for(let key of sort.keywords) {
                if (!(books[d].keywords.includes(key))) {
                    books.splice(books.indexOf(books[d]), 1)
                    d--
                    break;
                }
            }
        }
    }

    /*if(sort.keywords.length!==0){ //only one keyword has to be for filled (functional)
        for(let d=0 ;d < books.length; d++){
            if(!books[d].keywords.some(r=> sort.keywords.includes(r))) { //from https://stackoverflow.com/questions/16312528/check-if-an-array-contains-any-element-of-another-array-in-javascript
                books.splice(books.indexOf(books[d]), 1)
                d--
            }
        }
    }*/

    //sorting
     books.sort((a, b) => {
         let textA = a[sort.sort].toUpperCase().replace(' ', '')
         let textB = b[sort.sort].toUpperCase().replace(' ', '')
         return (!sort.reverse) ? (textA < textB) ? -1 : (textA > textB) ? 1 : 0 : (textA < textB) ? 1 : (textA > textB) ? -1 : 0
     })

    write_books(books)
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
function write_keywords(books){
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
function add_eventListener(){
    //search
    document.getElementById("search_btn").addEventListener('click', search)
    document.getElementById('search').addEventListener("click", (e)=>{
        e.target.value = "";
    })
    //type
    for(let el of document.getElementsByClassName("kategorie")){
        el.addEventListener('change', (e)=>{
            if(sort.type.includes(e.target.id)){
                sort.type.splice(sort.type.indexOf(e.target.id), 1)
            }else{
                sort.type.push(e.target.id)
            }
            show_sort(aktuell)
        })
    }
    //keywords
    for(let el of document.getElementsByClassName("schlussel")){
        el.addEventListener('change', (e)=>{
            if(sort.keywords.includes(e.target.id)){
                sort.keywords.splice(sort.keywords.indexOf(e.target.id), 1)
            }else{
                sort.keywords.push(e.target.id)
            }
            show_sort(aktuell)
        })
    }
    console.log(document.getElementsByClassName("year"))
    //sort
    for(let el of document.querySelectorAll(".sort[name='sort']")){
        el.addEventListener('change', ()=>{
            document.querySelector('.sort[name="sort"]:checked').value === "norm"?sort.reverse=false:sort.reverse=true
            show_sort(aktuell)
        })
    }
    document.querySelector("select.sort").addEventListener('change', (e)=>{
        sort.sort= e.target.value
        show_sort(aktuell)
    })
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