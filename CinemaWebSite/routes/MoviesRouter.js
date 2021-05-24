var express = require('express');
var router = express.Router();
const bl = require('../BL/bl')
let mov_id ='';

router.get('/', async function(req,res,next){
    if(req.session.login){
        res.render('movies-page',{addmovieFlag:false ,showMovies:false,permissions:[]});
    }else{
        res.redirect('login')
    }
})

router.post('/insertnewmovie', async function(req,res,next){
    if(req.session.login){
        let movie={
            name:req.body.moviename,
            genres:req.body.genres.split(","),
            imageurl:req.body.image,
            premiered:req.body.premiered
            }
            let response= await bl.addMovie(movie);
        let file1 = await bl.getMoviesList(req.body);
        res.render('movies-page',{addmovieFlag:false,showMovies:true,file:file1});
    }else{
        res.redirect('/login')
    }
})

router.get('/editmovie/:id', async function(req,res,next){
    if(req.session.login){
        let file1 = await bl.getMoviesList();
        mov_id = req.params.id;
        let movie = file1.data.filter(m=>m._id==mov_id);
        res.render('edit-movie-page',{movie:movie[0]});
        }else{
            res.redirect('/login')
        }


})

router.post('/updatemovie', async function(req,res,next){
    if(req.session.loing){
        let obj = {
            name:req.body.name,
            genres:req.body.genres,
            image:req.body.image,
            premiered:req.body.premiered
    }
    let response = await bl.updateMovie(mov_id,obj);

    res.render('movies-page',{addmovieFlag:false ,showMovies:false});
    }else{
        res.redirect('/login')
    }
})

router.get('/deletemovie/:id', async function(req,res,next){
    if(req.session.login){
        let id = req.params.id;
        let answer = await bl.deleteMovie(id)
        res.redirect('http://localhost:3000/movies/searchmovie?name=')
    }else{
        res.redirect('/login')
    }

})

router.get('/allmovies', async function(req,res,next){
    if(req.session.login && req.session.permissions.permissions.includes('view-movie')){
        let file1 = await bl.getFullMoviesList();
        res.render('movies-page',{addmovieFlag:false,showMovies:true,file:file1.data,permissions:[]});

    }else if(!req.session.login){
        res.redirect('/login')
    }else{
        res.render('movies-page',{addmovieFlag:false,showMovies:false,permissions:[]});   
    }

})

router.get('/addmovie', async function(req,res,next){
    if(req.session.login && req.session.permissions.permissions.includes('create-movie')){
        res.render('movies-page',{addmovieFlag:true,showMovies:false});
    }else if(!req.session.login){
        res.redirect('/login')
    }else{
        res.render('movies-page',{addmovieFlag:false,showMovies:false});
    }
})

router.get('/searchmovie', async function(req,res,next){
    if(req.session.login && req.session.permissions.permissions.includes('view-movie')){
        let file1 = await bl.getSearchedMovies(req.query.name);
        res.render('movies-page',{addmovieFlag:false,showMovies:true,file:file1});

    }else if(!req.session.login){
        res.render('/login');
    }else{
        res.render('movies-page',{addmovieFlag:false,showMovies:false});
    }

})


module.exports = router;