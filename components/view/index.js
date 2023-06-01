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

    async function get_books(book_number){
        const user = await users.findOne({_id:req.session.userid})
        let books = []
        const count = await object.count()
        if(user.history.length<=0){
            console.log("random")
            for(let d = 0; d<book_number; d++) {
                const skip = Math.abs(Math.floor(Math.random() * (count - 4)));
                const obj = await object.findOne({_id:skip>=0?skip:0})
                if(obj && !books.includes(obj)) {
                    books.push(obj)
                }else if(count >=4){
                    d--;
                }
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
        return books
    }
    if(req.session.loggedin) {
        const book_number = 4
        let books
        do{
            books = await get_books(book_number)
        }while(!books.every((element) => element !== null && element !== undefined))

        res.render('sites/index', {user: req.session.username, name:req.session.name, books: books})
    }else{+
        res.redirect('/')
    }
}

exports.forgotten = function (req, res){
    res.render('auth/forgotten')
}