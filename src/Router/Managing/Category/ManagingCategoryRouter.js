var express = require('express');
var router = express.Router();


const cookieParser = require('cookie-parser');

var app = require('../../../app.js');
const bodyparser = require('body-parser');
const session = require('express-session');
const FileStore = require('session-file-store')(session);
var ManagingCategoryService = require('../../../Service/Managing/ManagingCategoryService.js');


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


router.post('/AddCategory', async function(req, res){

  var CategoryName = req.body.categoryname;

  await ManagingCategoryService.AddCategory(conn, CategoryName, req.session.uid);

  res.send("");
});


router.post('/DeleteCategory', async function(req, res){

  var CategoryNumber = req.body.categoryNumber;

  await ManagingCategoryService.DeleteCategory(conn, req.session.uid, CategoryNumber);
  
  res.send("");
});



module.exports = router;