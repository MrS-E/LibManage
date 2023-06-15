for(let d of document.getElementsByClassName('read')){
    d.addEventListener('click', (e)=>{
        const book = e.target.id
        const initText = e.target.innerText
        const file = e.target.name
        switch (file.split('/')[file.split('/').length-1]){
            case "E-Video":
                fetch('/api/object/'+book)
                    .then((response)=>response.json())
                    .then((res)=> {
                        document.querySelector('.popup').style.display = 'flex'
                        document.querySelector('.popup-inner .container').innerHTML = ("<video poster='"+res.img+"' controls>" +
                            "<source src='/api/object/stream/" + book + "'/>" +
                            "</video>")
                    })
                break
            case "E-Audio":
                document.querySelector('.popup').style.display = 'flex'
                document.querySelector('.popup-inner .container').innerHTML = ("<audio controls>" +
                    "<source src='/api/object/stream/"+book+"'/>" +
                    "</audio>")
                break
            default:
                e.target.disabled = true
                fetch('/api/object/read/'+book)
                    .then((response)=>response.json())
                    .then((res)=>{
                        //console.log(res)
                        e.target.disabled = false
                        if(res.file) {
                            console.log(file.split('/')[0].split('.')[file.split('/')[0].split('.').length-1])
                            switch (file.split('/')[0].split('.')[file.split('/')[0].split('.').length-1]){
                                case "pdf":
                                    document.querySelector('.popup').style.display = 'flex'
                                    document.querySelector('.popup-inner .container').innerHTML = ('<object data="data:application/pdf;base64,'+res.file+'" type="application/pdf" class="internal"><embed src="data:application/pdf;base64,'+res.file+'" type="application/pdf"/></object>')
                                    break
                                /*case "epub": should work, but doesn't
                                    document.querySelector('.popup').style.display = 'flex'
                                    document.querySelector('.popup-inner .container').innerHTML = "<div id='epubreader'></div>"
                                    const book = ePub("data:application/epub+zip;base64,"+res.file)
                                    book.renderTo(document.getElementById("epubreader"),{ method: "continuous",flow: "paginated", width: "100%", height: "100%" }).display();
                                    break*/
                                case "txt":
                                    document.querySelector('.popup').style.display = 'flex'
                                    document.querySelector('.popup-inner .container').innerHTML = new TextDecoder().decode(new Uint8Array([...atob(res.file)].map(char => char.charCodeAt(0))));
                                    break
                                default:
                                    e.target.disabled = true
                                    e.target.innerText = "Download started in kürze"
                                    const a = document.createElement("a")
                                    a.href = "data:"+res.book[0].contentType+";base64," + res.file
                                    a.download = res.book[0].filename
                                    a.click()
                                    e.target.innerText = "Heruntergeladen"
                                    a.remove()
                                    break
                            }
                        }else{
                            e.target.innerText = "Wurde nicht gefunden"
                        }
                    })
                break
        }
    })
}

for(let d of document.getElementsByClassName('return')){
    d.addEventListener('click', (e)=>{
        console.log(e.target)
        fetch('/api/object/return', {
            method: 'put',
            headers:{
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                id: e.target.id
            })
        })
            .then(
                ()=>{
               window.location.reload()
           }
        )
    })
}

function saveBase64AsFile(base64Data, fileName, contentType) {
    const blob = new Blob(new Uint8Array([...atob(base64Data)].map(char => char.charCodeAt(0))), {type: contentType});
    window.showSaveFilePicker().then(async (handle) => {
        const writable = await handle.createWritable();
        await writable.write(blob);
        await writable.close();

        console.log('File saved in temporary storage.');
    }).catch((error) => {
        console.error('Error:', error);
    });
    }
