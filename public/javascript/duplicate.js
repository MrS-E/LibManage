async function main () {
    const books =await fetch_data()
    let data = 'duplicates'
    let duplicates =await get(data)
    console.log(books)
    console.log(duplicates)
    if(duplicates && books) render(duplicates, books)

    document.getElementById("search").addEventListener('click', () => {
        document.getElementById("myBar").style.width = "0%"
        const dup = compare_date(books)
        render(dup, books)
        put(data, dup)
    })
}
async function fetch_data(){
    const res = await fetch('/api/object/')
    return await res.json()
}
function compare_date(data){
    //two function (editDistance & similarity) from: https://stackoverflow.com/questions/10473745/compare-strings-javascript-return-of-likely
    function editDistance(s1, s2) {
        s1 = s1.toLowerCase();
        s2 = s2.toLowerCase();

        var costs = new Array();
        for (var i = 0; i <= s1.length; i++) {
            var lastValue = i;
            for (var j = 0; j <= s2.length; j++) {
                if (i === 0)
                    costs[j] = j;
                else {
                    if (j > 0) {
                        var newValue = costs[j - 1];
                        if (s1.charAt(i - 1) !== s2.charAt(j - 1))
                            newValue = Math.min(Math.min(newValue, lastValue),
                                costs[j]) + 1;
                        costs[j - 1] = lastValue;
                        lastValue = newValue;
                    }
                }
            }
            if (i > 0)
                costs[s2.length] = lastValue;
        }
        return costs[s2.length];
    }
    function similarity(s1, s2) {
        var longer = s1;
        var shorter = s2;
        if (s1.length < s2.length) {
            longer = s2;
            shorter = s1;
        }
        var longerLength = longer.length;
        if (longerLength === 0) {
            return 1.0;
        }
        return (longerLength - editDistance(longer, shorter)) / parseFloat(longerLength);
    }

    const length = 100/data.length
    const duplicates = []
    const checked = []

    for(let doc of data){
        if(!checked.includes(doc._id)) {
            const dup = {object: doc._id, simular: []}
            checked.push(doc._id)
            for (let obj of data) {
                if (!checked.includes(obj._id)) {
                    let percent = (similarity(doc.title, obj.title) + similarity(doc.author, obj.author)) / 2
                    if (percent >= 0.8) {
                        checked.push(obj._id)
                        dup.simular.push({object: obj._id, percent:percent})
                    }
                }
            }
            if(dup.simular.length>0) duplicates.push(dup)
        }
        move(length)
    }
    return duplicates
}
function put(data,files){
    /*if('caches' in window) {
        caches.open(data).then((cache) => {
            cache.put(data, files)
        })
    }else{*/
        window.sessionStorage.setItem(data, JSON.stringify(files))
    //}
}
function move(percent){
    let bar = document.getElementById("myBar")
    //console.log(bar.style.width)
    if(parseFloat(bar.style.width.split('%')[0])<=100) {
        bar.style.width = parseFloat(bar.style.width.split('%')[0]) + percent + "%"
    }
}
async function get(data){
    async function get_cache(data) {
        const cache = await caches.open(data)
        return await cache.match(data)
    }

    /*if('caches' in window){
        if(await get_cache(data)){ //duplicates already found
            console.log("cache")
            console.log(await get_cache(data))
            return await JSON.parse(get_cache(data))
        }
    }else{*/
        if(window.sessionStorage.getItem(data)){ //duplicates already found
            console.log("storage")
            return JSON.parse(window.sessionStorage.getItem(data))
        }else{
            return null
        }
    //}
}
function render(duplicates, books){
    function template(books, num) {
        slider.push({class: ("mySlides"+num), index: 1})
        let out ="<div class='slideshow-container mt-3'>"+
            "<a class='prev' onclick='plusSlides(-1, "+(slider.length-1)+")'>&#10094;</a>" +
            "<a class='next' onclick='plusSlides(1, "+(slider.length-1)+")'>&#10095;</a>"
        for(let book of books){
            out += "<div class='mySlides"+num+"'>" +
                "<div class='row'>" +
                "<div class='col-md-4 col-sm-6'>" +
                "<img class='img-rounded img-thumbnail' src='"+(book.img?book.img:"/image/no_img.png")+"' alt='"+(book.img_desc?book.img_desc:"kein Bild verfügbar")+"' style='height: 100%'/>" +
                "</div>" +
                "<div class='col-md-4 col-sm-6'>" +
                "<h6>"+book.title+"</h6>" +
                "<p>"+book.author+"</p>" +
                "<p>"+book.isbn+"</p>" +
                "<p>"+(book.position?book.position:"")+"</p>" +
                "</div>" +
                "<div class='col-md-4 col-sm-12 d-grid'>" +
                "<button class='btn btn-secondary mb-2 btn-block' id='"+book._id+"'>Löschen</button>" +
                "<form class='d-grid' action='/admin/edit/"+book._id+"' method='get'>" +
                "<button class='btn btn-primary btn-block' type='submit'>Bearbeiten</button>" +
                "</form>" +
                "</div>" +
                "</div>" +
                "</div>"
        }
        out += "</div>"

        document.getElementById("duplicates").innerHTML += out
        showSlides(1, slider.length-1);
    }
    document.getElementById("duplicates").innerHTML = ""
    for(let dop of duplicates){
        const book = []
        book.push(books.find(obj=>{return obj._id===dop.object}))
        for(let x of dop.simular){
            book.push(books.find(obj=>{return obj._id===x.object}))
        }
         template(book, dop.object)
    }
}

/*functions for carousel from https://www.w3schools.com/howto/howto_js_slideshow.asp*/
const slider =[]

function plusSlides(n, no) {
    showSlides(slider[no].index += n, no);
}

function showSlides(n, no) {
    let i;
    let x = document.getElementsByClassName(slider[no].class);
    if (n > x.length) {slider[no].index = 1}
    if (n < 1) {slider[no].index = x.length}
    for (i = 0; i < x.length; i++) {
        x[i].style.display = "none";
    }
    x[slider[no].index-1].style.display = "block";
}

/*entre point*/
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

main()