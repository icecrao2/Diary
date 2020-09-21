var express = require('express');
var router = express.Router();


const cookieParser = require('cookie-parser');

var LoadDiary = require('../../LoadDiary.js');; 
var LoadCategory = require('../../LoadCategory');
const ConfirmLogin = require('../../ConfirmLogin.js');
var utils = require('../../util');
var DiaryService = require('../../Service/Diary/DiaryService.js');
var moment = require('moment'); 


var app = require('../../app.js');
const bodyparser = require('body-parser');
const session = require('express-session');
const FileStore = require('session-file-store')(session);


var conn = app.conn;


require('moment-timezone'); 
moment.tz.setDefault("Asia/Seoul");

router.use(cookieParser());
router.use(bodyparser.urlencoded({extended:true}));
router.use(bodyparser.json());

router.use(session({  // 2
  secret: 'keyboard cat',  // 암호화
  resave: false,
  saveUninitialized: true,
  store: new FileStore()
}));



router.post('/SearchingDiary', function(req, res){

	var FirstDate = req.body.FirstDate;
	var SecondDate = req.body.SecondDate;
	var SearchKeyword = req.body.SerachingKeyword;
  var SearchingAll = req.body.SearchingAll;

  console.log("DATE ==== " + FirstDate);

	res.cookie('searchKeyword', SearchKeyword);
	res.cookie('firstDate', FirstDate);
  res.cookie('secondDate', SecondDate);
  res.cookie('SearchingAll', SearchingAll);

  console.log("cookie = " + req.cookies.firstDate);

	res.send("");
});


router.post('/writeDiary', async function(req, res){

  await DiaryService.writeDiary(conn, req.session.uid, req.body.emotion, req.body.weather, req.body.category, req.body.title, req.body.content, null)
	
	res.send("");
});

router.get('/write', async function(req, res){

  var managing = await DiaryService.write(conn, req.session.uid);

  res.render('WriteTemplate.ejs', {
    weather:managing.weather,
    emotion:managing.emotion,
    category:managing.category
  });
});


router.get('/List/:pageNum', async function(req, res){

  var pageContent = await DiaryService.loadContent(conn, req.params.pageNum, req.session.uid);

  res.render('ContentTemplate.ejs', {
    title:pageContent[0].title,
    weather:pageContent[0].weather,
    emotion:pageContent[0].emotion,
    category:pageContent[0].category,
    content:pageContent[0].Content
  });
});


router.get('/:pageNum', async function(req, res){

  var PageInfo =  await DiaryService.Paging(
    conn, 
    req.cookies.searchKeyword, 
    req.cookies.firstDate, 
    req.cookies.secondDate, 
    req.params.pageNum, 
    req.session.uid, 
    req.cookies.SearchingAll
    );



  res.render('template.ejs',{
    PageNum:req.params.pageNum,   
    "search":PageInfo.Search,
    list:PageInfo.rows,
    UserId:req.session.uid, 
    UserPassword:req.session.password,
    UserName:req.session.UserName,
    Permission:ConfirmLogin.Permission
  });  
  
});





module.exports = router;