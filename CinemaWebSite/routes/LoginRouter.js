var express = require('express');
var router = express.Router();
const bl = require('../BL/bl');
const session = require('express-session');

    
//Get Login Page
router.get('/', function (req, res, next) {
    res.redirect('login')
});

router.get('/login', function (req, res, next) {
    res.render('login-page',{token:''});
});

router.get('/login/createuser', function (req, res, next) {
    res.render('createuser-page', { flag: true});
});

router.post('/login/createuser/create', async function (req, res, next) {
    let answer = await bl.createPasswordByUserName(req.body)
    console.log('1')
    if (answer) {
        res.redirect('/login')
    }
    res.render('createuser-page', { flag: false })
});

router.post('/validatelogin', async function (req, res, next) {
        let answer = await bl.isUserShouldLogin(req.body.UserName, req.body.Password);
        if (answer == true) {
            let userId = await bl.getUserIdByUserName(req.body.UserName);
            console.log(userId)

            let userPermissions = await bl.getPermissionsByUserId(userId);
            req.session.permissions=userPermissions;
            if(req.body.UserName=='a'){
                req.session.admin=true;
                req.session.login=true;
            }else{
                req.session.admin=false;
                req.session.login=true;
            }
            res.redirect('menupage');
        } else {
            res.redirect('login');
        }

            // let userId = await bl.getUserIdByUserName(req.body.UserName);
            // let token = bl.generateToken(userId);
            // console.log(token)
            // res.render('login-page',{token:token,request:reqMok});
            // // res.setHeader({'x-access-token':token});
            // res.set("X-Access-Token" [token]);
            // res.set("X-Access-Token" ,token);
            // res.set({
            //     'X-Access-Token': token
            // });
});



module.exports = router;
