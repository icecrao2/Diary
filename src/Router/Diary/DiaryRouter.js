var express = require('express');
var router = express.Router();


const cookieParser = require('cookie-parser');

var LoadDiary = require('../../LoadDiary.js');; 
var LoadCategory = require('../../LoadCategory');
const ConfirmLogin = require('../../ConfirmLogin.js');
var utils = require('../../util');
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
	var emotion = req.body.emotion;
	var weather = req.body.weather;
	var category = req.body.category;
	var title = req.body.title;
	var content = req.body.content;
	var image = null;
	var date = moment().format('YYYY-MM-DD HH:mm:ss'); 

	console.log(date);

	await LoadDiary.InsertDiary(conn, req.session.uid, title, date, emotion, weather, category, content, image);
	res.send("");
});

router.get('/write', async function(req, res){

  var categoryrows = await LoadCategory.SelectCategory(conn, req.session.uid);

  var Weather = [1,2,3,4];
  var Emotion = [1,2,3,4];

  res.render('WriteTemplate.ejs', {
    weather:Weather,
    emotion:Emotion,
    category:categoryrows
  });
});


router.get('/:pageNum', async function(req, res){


  console.log("cookie = " + req.cookies.searchKeyword);
 
	var keyword = req.cookies.searchKeyword;
	var FirstDate = req.cookies.firstDate;
  var SecondDate = req.cookies.secondDate;

  var Search = {
    'keyword':keyword,
    'FirstDate':FirstDate,
    'SecondDate':SecondDate
  };

  var page = req.params.pageNum;

  
  var rows = await LoadDiary.LoadDiaryList(conn, page, req.session.uid);
  var categoryrows = await LoadCategory.SelectCategory(conn, req.session.uid);
  

  if(!utils.isEmpty(FirstDate))
  {
    rows = await LoadDiary.SearchDiary(conn, req.session.uid, FirstDate, SecondDate, keyword ,page);
  }

  rows = utils.matchingName(rows, categoryrows);

  if(req.cookies.SearchingAll)
  {
    Search = {
      'keyword':'',
      'FirstDate':'',
      'SecondDate':''
    };
  }

  res.render('template.ejs',{
    PageNum:page,   
    "search":Search,
    list:rows,
    UserId:req.session.uid, 
    UserPassword:req.session.password,
    UserName:req.session.UserName,
    Permission:ConfirmLogin.Permission
  });  
  
});





module.exports = router;