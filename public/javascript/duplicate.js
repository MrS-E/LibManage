main()
async function main () {
    const books =await fetch_data()
    let data = 'duplicates'
    let duplicates =await get(data)
    console.log(books)
    console.log(duplicates)
    if(duplicates && books) render(duplicates, books)

    document.getElementById("search").addEventListener('click', () => {
        document.getElementById("myBar").style.width = "0%"
        console.log(compare_date(books))
        render(compare_date(books), books)
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
                    let percent = (similarity(doc.title, obj.title) + similarity(doc.author, obj.author) + similarity(doc.isbn, obj.isbn)) / 3
                    if (percent >= 0.6) {
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
function put_cache(data,files){
    caches.open(data).then((cache) => {
        cache.put(data, JSON.stringify(files))
    })
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

    if('caches' in window){
        if(await get_cache(data)){ //duplicates already found
            console.log("cache")
            console.log(await get_cache(data))
            return await JSON.parse(get_cache(data))
        }
    }else{
        if(window.sessionStorage.getItem(data)){ //duplicates already found
            console.log("storage")
            return window.sessionStorage.getItem(data)
        }else{
            return null
        }
    }
}
function render(duplicates, books){
    document.getElementById("duplicates")
    for(let dop of duplicates){
        const book = []
       book.push(books.find(obj=>{return obj._id===dop.object}))
        for(let x of dop.simular){
            book.push(books.find(obj=>{return obj._id===x.object}))
        }
    }
}

function template(books) {
    out ="" +
        "<div class='slideshow-container'>" +
            "<a class='prev' onclick='plusSlides(-1, 0)'>&#10094;</a>" +
            "<a class='next' onclick='plusSlides(1, 0)'>&#10095;</a>" +
            "<div class='mySlides1'>" +
                "<img src='img_nature_wide.jpg' style='width:100%' alt=''>" +
            "</div>" +
            "<div class='mySlides1'>" +
                "<img src='img_snow_wide.jpg' style='width:100%' alt=''>" +
            "</div>" +
            "<div class='mySlides1'>" +
                "<img src='img_mountains_wide.jpg' style='width:100%' alt=''>" +
            "</div>" +
        "</div>"
}


const slider =[
    {class:"mySlides1", index:1},
    {class:"mySlides2", index:1},
]
showSlides(1, 0);
showSlides(1, 1);

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