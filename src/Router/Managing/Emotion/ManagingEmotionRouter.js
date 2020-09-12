var express = require('express');
var router = express.Router();


const cookieParser = require('cookie-parser');

var app = require('../../../app.js');
const bodyparser = require('body-parser');
const session = require('express-session');
const FileStore = require('session-file-store')(session);
var ManagingEmotionService = require('../../../Service/Managing/ManagingEmotionService');


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


router.post('/AddEmotion', async function(req, res){

  var EmotionName = req.body.emotionname;

  await ManagingEmotionService.AddEmotion(conn, EmotionName, req.session.uid);

  res.send("");
});


router.post('/DeleteEmotion', async function(req, res){

  var EmotionId = req.body.emotionid;

  await ManagingEmotionService.DeleteEmotion(conn, req.session.uid, EmotionId);
  
  res.send("");
});



module.exports = router;