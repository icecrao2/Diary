var express = require('express');
var router = express.Router();


const cookieParser = require('cookie-parser');
var LoadCategory = require('../../LoadCategory');
const ConfirmLogin = require('../../ConfirmLogin.js');


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



router.get('/', async function(req, res){
  
  var categoryrows = await LoadCategory.SelectCategory(conn, req.session.uid);

  res.render('managing.ejs',{
    UserId:req.session.uid, 
    UserPassword:req.session.password,
    UserName:req.session.UserName,
    categorylist:categoryrows,
    Permission:ConfirmLogin.Permission
  });

});


router.post('/AddCategory', async function(req, res){

  var CategoryName = req.body.categoryname;
  var CategoryNumber = await ConfirmLogin.getCategoryNumber(conn, req.session.uid);

   LoadCategory.InsertCategory(conn, req.session.uid, CategoryName, CategoryNumber[0].categoryNumber);
  
  ConfirmLogin.plusCategoryNumber(conn, req.session.uid, parseInt(CategoryNumber[0].categoryNumber)+1);
  
  res.send("");
});


router.post('/DeleteCategory', async function(req, res){

  var CategoryNumber = req.body.categoryNumber;

   LoadCategory.DeleteCategory(conn, req.session.uid, CategoryNumber);
  
  res.send("");
});



module.exports = router;