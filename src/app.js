var express = require('express');
var db_config = require('./dbms/database.js');
var conn = db_config.init();
var app = express();
var iconv = require('iconv-lite');
const path = require('path');
const ConfirmLogin = require('./ConfirmLogin.js');
const bodyparser = require('body-parser');
const session = require('express-session');
const FileStore = require('session-file-store')(session);
var LoadDiary = require('./LoadDiary.js');
var moment = require('moment'); 
var LoadCategory = require('./LoadCategory');
var utils = require('./util');

require('moment-timezone'); 
moment.tz.setDefault("Asia/Seoul");

db_config.connect(conn);

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
  
    res.render('template.ejs',{UserId:req.session.uid, 
                              UserPassword:req.session.password,
                              UserName:req.session.UserName,
                              CategoryNumber:req.session.categoryNumber,
                              Permission:ConfirmLogin.Permission});
    console.log('Main Page');
});

app.post('/ConfirmLogin', async function(req, res){
  var rows = await ConfirmLogin.ConfirmIdPassword(conn, req.body.id, req.body.password);
  console.log(rows[0]);
  
  if(rows == false)
    ConfirmLogin.Permission = false;
  else
  {
    ConfirmLogin.Permission = true;
    req.session.uid = rows[0].id;
    req.session.password = rows[0].password;
    req.session.UserName = rows[0].name;
    req.session.categoryNumber = rows[0].categoryNumber;
    req.session.save(function(){
      res.send("");
    })
  }
});

app.post('/Logout', function(req, res){
  
  ConfirmLogin.Logout();

  //세션 삭제
  req.session.destroy(function(){
    req.session;
  });

  res.send("");
});

app.post('/regist-process', function(req, res){
  ConfirmLogin.RegistUser(conn, req.body.id, req.body.password, req.body.name);
  res.send("");
});

app.get('/regist', function(req, res){
  
  res.render('RegistTemplate.ejs',{pageId:"", Permission:ConfirmLogin.Permission});
  
});

app.get('/managing', async function(req, res){
  
  var categoryrows = await LoadCategory.SelectCategory(conn, req.session.uid);

  res.render('managing.ejs',{
    UserId:req.session.uid, 
    UserPassword:req.session.password,
    UserName:req.session.UserName,
    categorylist:categoryrows,
    Permission:ConfirmLogin.Permission
  });

});

app.post('/AddCategory', async function(req, res){

  var CategoryName = req.body.categoryname;
  var CategoryNumber = await ConfirmLogin.getCategoryNumber(conn, req.session.uid);

   LoadCategory.InsertCategory(conn, req.session.uid, CategoryName, CategoryNumber[0].categoryNumber);
  
  ConfirmLogin.plusCategoryNumber(conn, req.session.uid, parseInt(CategoryNumber[0].categoryNumber)+1);
  
  res.send("");
});


app.post('/DeleteCategory', async function(req, res){

  var CategoryNumber = req.body.categoryNumber;

   LoadCategory.DeleteCategory(conn, req.session.uid, CategoryNumber);
  
  res.send("");
});

app.get('/page', async function(req, res){
  
  var rows = await LoadDiary.LoadDiaryList(conn, 1, req.session.uid);
  var categoryrows = await LoadCategory.SelectCategory(conn, req.session.uid);

  rows = utils.matchingName(rows, categoryrows);

  res.render('template.ejs',{
    PageNum:"1", 
    categorylist:categoryrows,
    list:rows,
    UserId:req.session.uid, 
    UserPassword:req.session.password,
    UserName:req.session.UserName,
    Permission:ConfirmLogin.Permission
  }); 
  console.log("done");
});

app.get('/page/:pageNum', async function(req, res){

  var page = req.params.pageNum;
  var rows = await LoadDiary.LoadDiaryList(conn, page, req.session.uid);
  var categoryrows = await LoadCategory.SelectCategory(conn, req.session.uid);
  
  rows = utils.matchingName(rows, categoryrows);


  res.render('template.ejs',{
    PageNum:page,   
    list:rows,
    UserId:req.session.uid, 
    UserPassword:req.session.password,
    UserName:req.session.UserName,
    Permission:ConfirmLogin.Permission
  });  
});

app.get('/write', function(req, res){
  var Weather = [1,2,3,4];
  var Emotion = [1,2,3,4];
  var Category = [1,2,3,4];

  res.render('WriteTemplate.ejs', {
    weather:Weather,
    emotion:Emotion,
    category:Category
  });
});

app.post('/writeDiary', async function(req, res){
  var emotion = req.body.emotion;
 	var weather = req.body.weather;
	var category = req.body.category;
	var title = req.body.title;
  var content = req.body.content;
  var image = null;
  var date = moment().format('YYYY-MM-DD HH:mm:ss'); 

  console.log(date);

  var  rownum = await LoadDiary.InsertDiary(conn, req.session.uid, title, date, emotion, weather, category, content, image);
  res.send("");
});

app.listen(3000, function () {
  console.log('Listening on port 3000!');
});





