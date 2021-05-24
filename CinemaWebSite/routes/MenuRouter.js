var express = require('express');
var router = express.Router();
const bl = require('../BL/BL');
const jwt = require('jsonwebtoken');


router.get('/', async function (req, res, next) {
    let flag='';
    if(req.session.admin){
        flag=true;
    }else{
        flag=false;
    }
    res.render('menu-page',{flag:flag})

})

module.exports = router;

    // const RSA_PRIVATE_KEY = 'secret';
    // console.log(req.headers)
    // var token = req.headers['x-access-token'];
    // let userId = await bl.getUserIdByUserName(req.session.UserName);

    // if (!token) {
    //     return res.status(401).send({ auth: false, message: 'No token provided.' });
    // }
    // jwt.verify(token, RSA_PRIVATE_KEY, function (err, decoded) {
    //     if (err){
    //         return res.status(500).send({ auth: false, message: 'Failed to authenticate token.' });
    //     }
    //     res.status(200).send(decoded);
    // });