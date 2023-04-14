fetch('/api/object/')
    .then(res => res.json())
    .then(doc => {
        console.log(doc)
    })
    .catch((err) => console.error(err))