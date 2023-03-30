const object = require('../../src/db/models/object');
const users = require('../../src/db/models/user')

exports.register = function(req, res){
    if(req.query.error){
        res.render('auth/register', {error: req.query.error});
    }
    res.render('auth/register');
}

exports.login = function (req, res) {
    if(req.query.error){
        res.render('auth/login', {error: req.query.error});
    }
    res.render('auth/login');
}

exports.home = async function (req, res){
    if(req.session.loggedin) {
        const book_number = 4
        const user = await users.findOne({_id:req.session.userid})
        let books = []
        const count = await object.count()
        if(user.history.length<=0){
            console.log("random")
            for(let d = 0; d<book_number; d++) {
                const skip = Math.floor(Math.random() * (count - 4));
                books.push(await object.findOne({_id:skip}))
            }
        }else{
            console.log("console")
            let keywords = []
            for(let d of user.history){
                for(let k of (await object.findOne({_id:d.book})).keywords){
                    keywords.push(k)
                }
            }
            keywords = sorter(keywords)
            keywords.sort((a,b)=>(a[1]-b[1]))
            for(let d = 0; d<book_number; d++){
                if(d%2===0 && keywords.length>=d){
                    const count = await object.count({keywords: keywords[d][0] ? keywords[d][0] : ""})
                    const skip = Math.floor(Math.random() * (count - 4));
                    books = books.concat(await object.find({keywords: keywords[d][0] ? keywords[d][0] : ""}).limit(1).skip(skip < 0 ? 0 : skip))
                }else{
                    const skip = Math.floor(Math.random() * (count - 4));
                    books.push(await object.findOne({_id:skip}))
                }
            }

        }
        console.log(books)
        res.render('sites/index', {user: req.session.username, name:req.session.name, books: books})
    }else{+
        res.redirect('/login')
    }
}

function sorter(arr){
    const c = {}
    const out = []
    for(let d of arr){
        c[d] = c[d] ? c[d] + 1 : 1
    }
    arr = [...new Set(arr)]
    for (let d of arr){
        out.push([d, c[d]])
    }
    return out
}