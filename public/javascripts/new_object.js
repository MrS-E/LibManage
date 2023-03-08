const form = {
    title: document.querySelector("input[name='title']"),
    author: document.querySelector("input[name='author']"),
    publisher: document.querySelector("input[name='publisher']"),
    isbn: document.querySelector("input[name='isbn']"),
    keywords: document.querySelector("input[name='keywords']"),
    type: document.querySelector("select[name='type']"),
    year: document.querySelector("input[name='year']"),
    blurb: document.querySelector("textarea[name='blurb']"),
    small_desc: document.querySelector("textarea[name='small_desc']"),
    img: document.querySelector("input[name='img']"),
    img_desc: document.querySelector("input[name='img_desc']"),
    read: document.querySelector("input[name='read']"),
    page: document.querySelector("input[name='page']")
}
console.log(form);

form.isbn.addEventListener('change', (e)=>{
    //978-3-8668-0192-9
    const isbn = e.target.value;
    const isbn_array = isbn.replaceAll('-','').split('')
    let out = ""
    //console.log(isbn_array)
    for(let x = 0; x<isbn_array.length; x++){
        if(x<=2) out += isbn_array[x]
        else if(x<=3) out += "-"+isbn_array[x] + "-"
        else if(x<=7) out += isbn_array[x]
        else if(x===8) out += "-"+isbn_array[x]
        else if(x<=11) out += isbn_array[x]
        else out += "-" + isbn_array[x]
    }
    e.target.value = out;
    if(isbn_array.length===13){
        fetch("https://www.googleapis.com/books/v1/volumes?q=isbn:"+isbn.replaceAll('-',''),  {mode: 'cors'})
            .then((response) => response.json())
            .then((data) => {
                form.title.value = data.items[0].volumeInfo.title
                form.author.value = data.items[0].volumeInfo.authors[0]
                form.publisher.value = data.items[0].volumeInfo.publisher
                form.year.value = data.items[0].volumeInfo.publishedDate.split('-')[0]
                form.blurb.value = data.items[0].volumeInfo.description
                form.img_desc.value = data.items[0].volumeInfo.title + " Titlebild"
                form.small_desc.value = data.items[0].searchInfo.textSnippet
                form.page.value = data.items[0].volumeInfo.pageCount
                for(let d of data.items[0].volumeInfo.categories){
                    form.keywords.value += d + ", "
                }
            });
    }
})