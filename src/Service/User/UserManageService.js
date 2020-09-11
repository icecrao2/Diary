
var LoadDiary = require('../../LoadDiary.js');; 
var LoadCategory = require('../../LoadCategory');
const ConfirmLogin = require('../../ConfirmLogin.js');


module.exports =  {
  ConfirmLogin: function(conn, id, password){
    
    return new Promise(async function(resolve, reject){
     
      var rows = await ConfirmLogin.ConfirmIdPassword(conn, id, password);
      var UserInfo = {
        
      };

      if(rows == false){
        ConfirmLogin.Permission = false;
        resolve();
      }  
      else
      {
        ConfirmLogin.Permission = true;
        UserInfo.uid = rows[0].id;
        UserInfo.password = rows[0].password;
        UserInfo.UserName = rows[0].name;
        UserInfo.categoryNumber = rows[0].categoryNumber;

        resolve(UserInfo);
      }

    });
  },

}




