var LoadCategory = require('../../LoadCategory');
const ConfirmLogin = require('../../ConfirmLogin.js');


module.exports = {

  AddCategory : function(conn, CategoryName, uid){
    return new Promise(async function(resolve, reject){

      
      var CategoryNumber = await ConfirmLogin.getCategoryNumber(conn, uid);
      
      LoadCategory.InsertCategory(conn, uid, CategoryName, CategoryNumber[0].categoryNumber);
      
      ConfirmLogin.plusCategoryNumber(conn, uid, parseInt(CategoryNumber[0].categoryNumber)+1);

      resolve();
    });
  },

  DeleteCategory : function(conn, uid, CategoryNumber){

    return new Promise(async function(resolve, reject){
      await LoadCategory.DeleteCategory(conn, uid, CategoryNumber);

      resolve();
    });

  }

}
