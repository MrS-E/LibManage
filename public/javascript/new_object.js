const form = {
    title: document.querySelector("input[name='title']"),
    author: document.querySelector("input[name='author']"),
    publisher: document.querySelector("input[name='publisher']"),
    isbn: document.querySelector("input[name='isbn']"),
    keywords: document.querySelector("input[name='keywords']"),
    type: document.querySelector("select[name='type']"),
    year: document.querySelector("input[name='year']"),
    blurb: document.querySelector("textarea[name='blurb']"),
    //small_desc: document.querySelector("textarea[name='small_desc']"),
    img: document.querySelector("input#img"),
    img_show: document.getElementById("image"),
    img_base64: document.querySelector("input[name='img_base64']"),
    img_desc: document.querySelector("input[name='img_desc']"),
    read: document.querySelector("input#read"),
    read_base64: document.querySelector("input[name='read_base64']"),
    page: document.querySelector("input[name='page']"),
    position: document.querySelector("input[name='position']")
}

form.isbn.addEventListener('change', (e)=>{
    //978-3-8668-0192-9
    const isbn = e.target.value;
    const isbn_array = isbn.replaceAll('-','').split('')
    let out = ""
    //console.log(isbn_array)
    if(isbn_array.length<=10){
        for (let x = 0; x < isbn_array.length; x++) {
            if (x === 0) out += isbn_array[x] + "-"
            else if (x <= 3) out += isbn_array[x]
            else if (x === 4) out += isbn_array[x] + "-"
            else if (x <= 8) out += isbn_array[x]
            else if (x <= 9) out += "-" + isbn_array[x]
        }
    }else {
        for (let x = 0; x < isbn_array.length; x++) {
            if (x <= 2) out += isbn_array[x]
            else if (x <= 3) out += "-" + isbn_array[x] + "-"
            else if (x <= 7) out += isbn_array[x]
            else if (x === 8) out += "-" + isbn_array[x]
            else if (x <= 11) out += isbn_array[x]
            else out += "-" + isbn_array[x]
        }
    }
    e.target.value = out;
    if(isbn_array.length>=10){
        fetch("https://www.googleapis.com/books/v1/volumes?q=isbn:"+isbn.replaceAll('-',''),  {mode: 'cors'})
            .then((response) => response.json())
            .then((data) => {
                if(data.items) {
                    form.title.value = data.items[0].volumeInfo.title ? data.items[0].volumeInfo.title : ""
                    //form.author.value = data.items[0].volumeInfo.authors[0]
                    form.author.value = ""
                    for (let d = 0; d < data.items[0].volumeInfo.authors.length; d++) {
                        form.author.value += data.items[0].volumeInfo.authors[d]
                        if (d + 1 !== data.items[0].volumeInfo.authors.length) {
                            form.author.value += ", "
                        }
                    }
                    form.publisher.value = data.items[0].volumeInfo.publisher ? data.items[0].volumeInfo.publisher : ""
                    form.year.value = data.items[0].volumeInfo.publishedDate ? data.items[0].volumeInfo.publishedDate.split('-')[0] : ""
                    form.img_show.src = data.items[0].volumeInfo.imageLinks.thumbnail
                    form.img_base64.value = data.items[0].volumeInfo.imageLinks.thumbnail
                    form.blurb.value = data.items[0].volumeInfo.description ? data.items[0].volumeInfo.description : ""
                    form.img_desc.value = data.items[0].volumeInfo.title ? data.items[0].volumeInfo.title + " Titelbild" : ""
                    //form.small_desc.value = data.items[0].searchInfo.textSnippet
                    form.page.value = data.items[0].volumeInfo.pageCount ? data.items[0].volumeInfo.pageCount : ""
                    form.keywords.value = ""
                    for (let d = 0; d < data.items[0].volumeInfo.categories.length; d++) {
                        form.keywords.value += data.items[0].volumeInfo.categories[d]
                        if (d + 1 !== data.items[0].volumeInfo.categories.length) {
                            form.keywords.value += ", "
                        }
                    }
                }
            });
    }
})

form.img.addEventListener('change', (e)=>{
    let reader = new FileReader()
    reader.readAsDataURL(e.target.files[0])
    reader.onload = () => {
        console.log(reader.result)
        console.log(form.img)
        form.img_show.src = reader.result
        form.img_base64.value = reader.result
    }
    reader.onerror = (err) => {
        console.error(err)
    }
})

form.read.addEventListener('change', (e)=>{
    let reader = new FileReader()
    reader.readAsDataURL(e.target.files[0])
    reader.onload = () => {
        console.log(reader.result)
        form.read_base64.value = reader.result
    }
    reader.onerror = (err) => {
        console.error(err)
    }
})

form.type.addEventListener('change', ()=>{
    if(form.type.options[form.type.selectedIndex].value.toString().split('-')[0] === 'E'){
        document.querySelector("label[for='read']").removeAttribute('style')
        form.read.removeAttribute('style')
        document.querySelector("label[for='position']").setAttribute('style', 'display:none;"')
        form.position.setAttribute('style', 'display:none;"')
        form.position.value=null
    }else{
        document.querySelector("label[for='read']").setAttribute('style', 'display:none;"')
        form.read.setAttribute('style', 'display:none;"')
        form.read_base64.value=null
        document.querySelector("label[for='position']").removeAttribute('style')
        form.position.removeAttribute('style')
    }
})