for(let x of document.querySelectorAll("button.delete_btn")){
    x.addEventListener('click', (e)=>{
        fetch('/admin/'+e.target.id, {method:'delete'})
            .then(res => res.json())
            .then(doc => {
                if(doc.deletedCount > 0){
                    document.getElementById("book_"+e.target.id).remove()
                }
            })
    })
}