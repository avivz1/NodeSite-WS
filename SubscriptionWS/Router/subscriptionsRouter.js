const bl = require('../BL/bl')
let express = require('express');
let router = express.Router();

router.route('/getallmovies').get( async function(req,resp){
    let answer = await bl.getAllMovies();
    return resp.json(answer);
});

router.route('/newmoviesubscription').post( async function(req,resp){
    let answer = await bl.subscribeNewMovie(req.body);
    return resp.json(answer);
});

router.route('/getallmembers').get( async function(req,resp){
    let answer = await bl.getAllMembers();
    let subs = await bl.getAllSubs();
    return resp.json(answer);
});

router.route('/getallsubs').get( async function(req,resp){
    let answer = await bl.getAllSubs();
    return resp.json(answer);
});

router.route('/').get(async function (req,resp){
    let answer = await bl.updateMembersMoviesCollections();
    return resp.json(answer);
})

router.route('/addmovie').post(async function(req,resp){
    let respo = await bl.addMovie(req.body);
    return resp.json(respo);
})

router.route('/addnewmember').post(async function(req,resp){
    let respo = await bl.addMember(req.body);
    return resp.json(respo);
})

router.route('/deletemember').post(async function(req,resp){
    let respo = await bl.deleteMember(req.body[0]);
    return resp.json(respo);
})

router.route('/updatemember').put(async function(req,resp){
    let respo = await bl.updateMember(req.body);
    return resp.json(respo);
})


router.route('/updatemovie/:id').put(async function(req,resp){
    let id = req.params.id
    let respo = await bl.updateMovie(id,req.body);
    return resp.json(respo);
})

router.route('/deletemovie/:id').delete(async function(req,resp){
    let id = req.params.id;
    let respo = await bl.deleteMovie(id);
    return resp.json(respo);
})


module.exports= router;