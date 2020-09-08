var express = require('express');
const cookieParser = require('cookie-parser');
const bodyparser = require('body-parser');
var router = express.Router();

router.use(cookieParser());
router.use(cookieParser());
router.use(bodyparser.urlencoded({extended:true}));
router.use(bodyparser.json());


router.post('/SearchingDiary', function(req, res){

	var FirstDate = req.body.FirstDate;
	var SecondDate = req.body.SecondDate;
	var SearchKeyword = req.body.SerachingKeyword;

  console.log("DATE ==== " + FirstDate);

	res.cookie('searchKeyword', SearchKeyword);
	res.cookie('firstDate', FirstDate);
	res.cookie('secondDate', SecondDate);

  console.log("cookie = " + req.cookies.firstDate);

	res.send("");
});


module.exports = router;