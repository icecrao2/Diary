var LoadEmotion = require('../../LoadEmotion');
const ConfirmLogin = require('../../ConfirmLogin.js');


module.exports = {

  AddEmotion : function(conn, EmotionName, uid){
    return new Promise(async function(resolve, reject){

      
      var emotionNumber = await ConfirmLogin.getEmotionNumber(conn, uid);
      
      LoadEmotion.InsertEmotion(conn, uid, EmotionName, emotionNumber[0].emotionNumber);
      
      ConfirmLogin.plusEmotionNumber(conn, uid, parseInt(emotionNumber[0].emotionNumber)+1);

      resolve();
    });
  },

  DeleteEmotion : function(conn, uid, EmotionId){

    return new Promise(async function(resolve, reject){
      await LoadEmotion.DeleteEmotion(conn, uid, EmotionId);

      resolve();
    });

  }

}
