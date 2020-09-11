var express = require('express');
var router = express.Router();


const cookieParser = require('cookie-parser');
const path = require('path');

var LoadDiary = require('../../LoadDiary.js');; 
var LoadCategory = require('../../LoadCategory');
const ConfirmLogin = require('../../ConfirmLogin.js');
var utils = require('../../util');
var UserManageService = require('../../Service/User/UserManageService.js');

var app = require('../../app.js');
const bodyparser = require('body-parser');
const session = require('express-session');
const FileStore = require('session-file-store')(session);

var conn = app.conn;



router.use(cookieParser());
router.use(bodyparser.urlencoded({extended:true}));
router.use(bodyparser.json());

router.use(session({  // 2
  secret: 'keyboard cat',  // 암호화
  resave: false,
  saveUninitialized: true,
  store: new FileStore()
}));




router.post('/ConfirmLogin', async function(req, res){

  var UserInfo = await UserManageService.ConfirmLogin(conn, req.body.id, req.body.password);

  if(utils.isEmpty(UserInfo))
  {
    res.send("");
  }
  else
  {
    console.log(UserInfo.password);
    req.session.uid = UserInfo.uid;
    req.session.password = UserInfo.password;
    req.session.UserName = UserInfo.UserName;
    req.session.categoryNumber = UserInfo.categoryNumber;

    req.session.save(function(){
      res.send("");
    })
  }
});

router.post('/Logout', function(req, res){
  
  ConfirmLogin.Logout();

  //세션 삭제
  req.session.destroy(function(){
    req.session;
  });
    
  res.clearCookie("searchKeyword");
  res.clearCookie("firstDate");
  res.clearCookie("secondDate");

  res.send("");
});

router.post('/regist-process', function(req, res){
  ConfirmLogin.RegistUser(conn, req.body.id, req.body.password, req.body.name);
  res.send("");
});

router.get('/regist', function(req, res){
  
  res.render('RegistTemplate.ejs',{pageId:"", Permission:ConfirmLogin.Permission});
  
});



module.exports = router;