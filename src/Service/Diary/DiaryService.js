
const cookieParser = require('cookie-parser');

var LoadDiary = require('../../LoadDiary.js');; 
var LoadCategory = require('../../LoadCategory');
var LoadWeather = require('../../LoadWeather');
var LoadEmotion = require('../../LoadEmotion');
const ConfirmLogin = require('../../ConfirmLogin.js');
var utils = require('../../util');
var moment = require('moment'); 

const bodyparser = require('body-parser');
const session = require('express-session');
const FileStore = require('session-file-store')(session);


require('moment-timezone'); 
moment.tz.setDefault("Asia/Seoul");

module.exports = {

  writeDiary : function(conn, uid, emotion, weather, category, title, content, image){
    return new Promise(async function(resolve, reject){
      
    	var date = moment().format('YYYY-MM-DD HH:mm:ss'); 
      await LoadDiary.InsertDiary(conn, uid, title, date, emotion, weather, category, content, image);
      
      resolve("");
    })
  },

  write: function(conn, uid){
    return new Promise(async function(resolve, reject){
      
      var categoryrows = await LoadCategory.SelectCategory(conn, uid);
      var Weather = await LoadWeather.SelectWeather(conn);
      var Emotion = [1,2,3,4];

      resolve({
        weather:Weather,
        emotion:Emotion,
        category:categoryrows
      });
    });
  },

  Paging: function(conn, keyword, FirstDate, SecondDate, page, uid, SearchingAll){

    return new Promise(async function(resolve, reject){
      
      
      var rows;
      var categoryrows = await LoadCategory.SelectCategory(conn, uid);
      var weatherrows = await LoadWeather.SelectWeather(conn);
      var emotionrows = await LoadEmotion.SelectEmotion(conn, uid);

      var Search = {

      };
      

      if(!utils.isEmpty(FirstDate))
      {
        rows = await LoadDiary.SearchDiary(conn, uid, FirstDate, SecondDate, keyword ,page);
      }
      else
      {
        rows = await LoadDiary.LoadDiaryList(conn, page, uid);
      }

      rows = utils.SetDefaultCategory(rows);
      rows = utils.matchingName(rows, categoryrows, function(rows, categoryrows){
        if(rows.category == categoryrows.categorynum)
				{
					rows.category = categoryrows.categoryname;
				}
      });
      
      rows = utils.matchingName(rows, weatherrows, function(rows, weatherrows){
        if(rows.weather == weatherrows.weatherid)
				{
					rows.weather = weatherrows.weathername;
				}
      });
      rows = utils.matchingName(rows, emotionrows, function(rows, emotionrows){
        if(rows.emotion == emotionrows.emotionid)
        {
          rows.emotion = emotionrows.emotionname;
        }
      });

      if(SearchingAll)
      {
        Search = {
          'keyword':'',
          'FirstDate':'',
          'SecondDate':''
        };
      }
      else
      {
        Search = {
          'keyword':keyword,
          'FirstDate':FirstDate,
          'SecondDate':SecondDate
        };
      }
      
      resolve({
        Search:Search,
        rows:rows
      });
    });
    
  }
}