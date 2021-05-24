var express = require('express');
var router = express.Router();
const bl = require('../BL/bl')

router.get('/', async function (req, res, next) {
    if (req.session.login) {
        res.render('subscriptions-page', { showFlag: false, addFlag: false, editFlag: false });
    } else {
        res.redirect('/login');
    }
})

router.get('/allmembers', async function (req, res, next) {
    if (req.session.login && req.session.permissions.permissions.includes('view-subscriptions')) {
        let members = await bl.getAllFullMembers();
        let movies = await bl.getMoviesList();
        res.render('subscriptions-page', { showFlag: true, file: members, addFlag: false, editFlag: false, moviesList: movies });
    } else if (!req.session.login) {
        res.redirect('/login')
    } else {
        res.render('subscriptions-page', { showFlag: false, file: members, addFlag: false, editFlag: false });
    }

})

router.post('/newmoviesubscription', async function (req, res, next) {
    if (req.session.login && req.session.permissions.permissions.includes('update-subscriptions')) {
        let response = await bl.subscribeToNewMovie(req.body);
        if (response.data == 'OK') {
            res.redirect('/subscriptions/allmembers')
        } else {
            res.redirect('/subscriptions');
        }
    } else {
        res.redirect('/login');
    }
})

router.get('/addmember', async function (req, res, next) {
    if (req.session.login && req.session.permissions.permissions.includes('create-subscriptions')) {
        res.render('subscriptions-page', { showFlag: false, addFlag: true, editFlag: false });
    } else if (!req.session.login) {
        res.redirect('/login')
    } else {
        res.render('subscriptions-page', { showFlag: false, addFlag: false, editFlag: false });
    }
})

router.get('/editmember/:name', async function (req, res, next) {
    if (req.session.login) {
        let name = req.params.name;
        let member = await bl.getMember(name)
        res.render('subscriptions-page', { showFlag: false, addFlag: false, editFlag: true, file: member[0] });
    } else {
        res.render('/menupage');
    }
})

router.get('/deletemember/:name', async function (req, res, next) {
    if (req.session.login && req.session.permissions.permissions.includes('delete-subscriptions')) {
        let name = req.params.name;
        let member = await bl.getMember(name);
        let answer = await bl.deleteMember(member);
        if (answer.data == 'Deleted') {
            res.redirect('/subscriptions/allmembers')
        } else {
            res.redirect('/')
        }
    }else if(!req.session.login){
        res.redirect('/login')
    }else{
        res.redirect('/menupage')
    }

})

router.post('/updatemember', async function (req, res, next) {
    if (req.session.login && req.session.permissions.permissions.includes('update-subscriptions')) {
        let member = req.body;
        let answer = await bl.updateMember(member);
        res.render('subscriptions-page', { showFlag: false, addFlag: false, editFlag: false });
    }else if(!req.session.login){
        res.redirect('/login')
    }else{
        res.render('subscriptions-page', { showFlag: false, addFlag: false, editFlag: false });
    }

})

router.post('/submitnewmember', async function (req, res, next) {
    if(req.session.login && req.session.permissions.permissions.includes('create-subscriptions')){
        let resp = await bl.addNewMember(req.body);
        if (resp.data == 'Created') {
            res.render('subscriptions-page', { showFlag: false, addFlag: false, editFlag: false });
        } else {
            res.render('subscriptions-page', { showFlag: false, addFlag: true, editFlag: false });
        }
    }else if(!req.session.login){
        res.redirect('/login')
    }else{
        res.redirect('/menupage')
    }

})



module.exports = router;