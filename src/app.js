var express = require('express');
var db_config = require('./dbms/database.js');
var conn = db_config.init();
var app = express();
const path = require('path');
const ConfirmLogin = require('./ConfirmLogin.js');
const bodyparser = require('body-parser');
const session = require('express-session');
const FileStore = require('session-file-store')(session);
var LoadDiary = require('./LoadDiary.js');
var moment = require('moment'); 
var LoadCategory = require('./LoadCategory');
var utils = require('./util');
const cookieParser = require('cookie-parser');


module.exports={
  conn
}

app.use(function(req, res, next){

  if(req.path=='/User/ConfirmLogin' || req.path == '/User/regist' || ConfirmLogin.Permission)
  {
    next();
  }
  else
  {
    console.log(ConfirmLogin.Permission);
    res.render('BeforeLogintemplate.ejs');
  }
});



var DiaryRouter = require('./Router/Diary/DiaryRouter.js');
var ManagingRouter = require('./Router/Managing/ManagingRouter.js');
var UserManagerRouter = require('./Router/User/UserManageRouter.js');
app.use('/Diary', DiaryRouter);
app.use('/Managing', ManagingRouter);
app.use('/User', UserManagerRouter);




require('moment-timezone'); 
moment.tz.setDefault("Asia/Seoul");

db_config.connect(conn);


app.use(cookieParser());
app.use(bodyparser.urlencoded({extended:true}));
app.use(bodyparser.json());


app.use(session({  // 2
  secret: 'keyboard cat',  // 암호화
  resave: false,
  saveUninitialized: true,
  store: new FileStore()
}));

//app.set('views','./views');
app.set('views', path.join(__dirname, './views'));
app.set('view engine','ejs');



app.get('/', function (req, res) {
  
    res.render('BeforeLogintemplate.ejs',{
                              UserId:req.session.uid,
                              UserPassword:req.session.password,
                              UserName:req.session.UserName,
                              CategoryNumber:req.session.categoryNumber,
                              Permission:ConfirmLogin.Permission});
    console.log('Main Page');
});


app.listen(3000, function () {
  console.log('Listening on port 3000!');
});





