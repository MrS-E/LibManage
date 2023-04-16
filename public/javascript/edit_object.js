document.querySelector("button#submit").addEventListener('click', ()=>{
    const updated = {}
    for(let field of document.querySelectorAll("input")){
        updated[field.name] = field.value;
    }
    updated[document.querySelector('textarea').name]=document.querySelector('textarea').value
    updated.keywords = updated.keywords.split(', ')
    console.log(updated)

    fetch('/api/object/'+window.location.href.split('/')[window.location.href.split('/').length-1].split('?')[0], {method:"put", headers: {"Content-Type": "application/json",}, body: JSON.stringify(updated)})
        .then((res)=>res.json())
        .then((data)=>{
            console.log(data)
            window.location.replace('/admin')
        })

})