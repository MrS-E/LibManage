//Search
document.getElementById("search_btn").addEventListener('click', ()=> {
    const term = document.getElementById("search").value;
    if (term !== "") {
        fetch('/object/search?find=' + term)
            .then(res => res.json())
            .then(doc => {
                console.log(doc)
                document.getElementById("books").innerHTML = list_books(doc);
            })
            .catch((err) => console.error(err))
    }else{
        fetch('/object/all')
            .then(res => res.json())
            .then(doc => {
                    console.log(doc)
                    document.getElementById("books").innerHTML = list_books(doc);
            })
            .catch((err) => console.error(err))
    }
})

function list_books(books){
    books = books.reduce((r, e, i) => (i % 4 ? r[r.length - 1].push(e) : r.push([e])) && r, []); // from https://stackoverflow.com/questions/38048497/group-array-values-in-group-of-3-objects-in-each-array-using-underscore-js
    let out = "";
    console.log(books);
    for(let x=0; x<books.length; x++){
        console.log(books[x])
        out += "<div class='row mt-2'>"
        for(let y=0; y<books[x].length; y++){
            console.log(books[x][y])
            out += "<div class='col-3'>"
            out += book(books[x][y])
            out += "</div>"
        }
        out += "</div>"
    }
    return out
}

function book(book){
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