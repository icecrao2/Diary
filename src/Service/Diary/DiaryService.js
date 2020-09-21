
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

  loadContent : function(conn, boardid, uid){
    return new Promise(async function(resolve, reject){

      boardid = parseInt(boardid);

      var categoryrows = await LoadCategory.SelectCategory(conn, uid);
      var weatherrows = await LoadWeather.SelectWeather(conn);
      var emotionrows = await LoadEmotion.SelectEmotion(conn, uid);
      var rows = await LoadDiary.SelectDiary(conn, boardid);

      rows = utils.matchingEveryName(rows, categoryrows, weatherrows, emotionrows);

      resolve(rows);
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
      else if(!utils.isEmpty(keyword))
      {
        rows = await LoadDiary.SearchDiary(conn, uid, '1997-02-22', '2100-12-31', keyword, page);
      }
      else
      {
        rows = await LoadDiary.LoadDiaryList(conn, page, uid);
      }

      rows = utils.matchingEveryName(rows, categoryrows, weatherrows, emotionrows);

      console.log("Why this not? :: " + SearchingAll);
      if(SearchingAll == 'true')
      {
        console.log("true!!!!");
        Search = {
          'keyword':'',
          'FirstDate':'',
          'SecondDate':''
        };
      }
      else
      {
        console.log("false!!!!");
        Search = {
          'keyword':keyword,
          'FirstDate':FirstDate,
          'SecondDate':SecondDate
        };
      }
      
      console.log(Search);
      console.log(FirstDate);
      resolve({
        Search:Search,
        rows:rows
      });
    });
    
  }
}