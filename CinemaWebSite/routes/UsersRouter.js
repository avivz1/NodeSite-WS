var express = require('express');
var router = express.Router();
const bl = require('../BL/bl')


router.get('/', function(req, res, next) {
  if(req.session.login){
    res.render('users-mng-page',{addUserFlag:false,showFlag:false,editFlag:false})
  }else{
    res.redirect('/login')
  }
});

//show- add user page
router.get('/adduser', function(req, res, next) {
  if(req.session.login){
    res.render('users-mng-page',{addUserFlag:true,showFlag:false,editFlag:false})
  }else{
    res.redirect('/login')
  }
});

//show- all users
router.get('/showusers',async function(req, res, next) {
  if(req.session.login){
    let answer = await bl.getAllUsersFullDetails();
    res.render('users-mng-page',{addUserFlag:false,showFlag:true,file:answer,editFlag:false})
  }else{
    res.redirect('/login')
  }
});

//show- edit user
router.post('/edituser',async function(req, res, next) {
  if(req.session.login){
    let user = await bl.getFullUserById(req.body.id);
    console.log(user)
    res.render('users-mng-page',{addUserFlag:false,showFlag:false,editFlag:true,file:user})
  }else{
    res.redirect('/login')
  }
});

//update user after edit
router.post('/updateuser',async function(req, res, next) {
  if(req.session.login){
    let user = req.body;
    console.log(user)
    let resp = await bl.updateUser(user)
    res.render('users-mng-page',{addUserFlag:false,showFlag:false,editFlag:false})
  }else{
    res.redirect('/login')
  }
});

//delete user
router.post('/deleteuser',async function(req, res, next) {
  if(req.session.login){
    let id = req.body.id;
    let answer = await bl.deleteUser(id);
    if(answer=="OK"){
      res.redirect('showusers')
    }
  }else{
    res.redirect('/login')
  }
});

//submit new user
router.post('/submituser',async function(req, res, next) {
  if(req.session.login){
    let resp = await bl.createFullUser(req.body)
    res.render('users-mng-page',{addUserFlag:false,showFlag:false,editFlag:false})
  }else{
    res.redirect('/login')
  }
});

module.exports = router;
