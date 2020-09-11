var LoadEmotoin = require('../../LoadEmotion.js');
const ConfirmLogin = require('../../ConfirmLogin.js');


module.exports = {

  AddEmotion : function(conn, EmotionName, uid){
    return new Promise(async function(resolve, reject){

      
      var CategoryNumber = await ConfirmLogin.getCategoryNumber(conn, uid);
      
      LoadEmotoin.InsertCategory(conn, uid, EmotionName, CategoryNumber[0].categoryNumber);
      
//      ConfirmLogin.plusCategoryNumber(conn, uid, parseInt(CategoryNumber[0].categoryNumber)+1);

      resolve();
    });
  },

  DeleteEmotion : function(conn, uid, EmotionId){

    return new Promise(async function(resolve, reject){
      await LoadEmotoin.DeleteCategory(conn, uid, EmotionId);

      resolve();
    });

  }

}
