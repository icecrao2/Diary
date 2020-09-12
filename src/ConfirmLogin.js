module.exports = {

  Permission : false,

  Logout : function(){
    this.Permission = false;
  },

  getCategoryNumber: function(conn, Id){
    return new Promise(function(resolve,reject){
      conn.query("select categoryNumber from user where id = ?", [Id], function(err, rows){
        if(err){console.log(err);}
        else
        {
          console.log(rows);
          resolve(rows);
        }
      });
    });
  },

  getEmotionNumber: function(conn, Id){
    return new Promise(function(resolve,reject){
      conn.query("select emotionNumber from user where id = ?", [Id], function(err, rows){
        if(err){console.log(err);}
        else
        {
          console.log(rows);
          resolve(rows);
        }
      });
    });
  },

  plusCategoryNumber: function(conn, Id, categoryNum){
    return new Promise(function(resolve,reject){
      conn.query("update `diary`.`user` set `categoryNumber` = ? WHERE `id` = ?", [categoryNum ,Id], function(err, rows){
        if(err){console.log(err);}
        else
        {
          resolve(rows);
        }
      });
    });
  },

  plusEmotionNumber: function(conn, Id, emotionNumber){
    return new Promise(function(resolve,reject){
      conn.query("update `diary`.`user` set `emotionNumber` = ? WHERE `id` = ?", [emotionNumber ,Id], function(err, rows){
        if(err){console.log(err);}
        else
        {
          resolve(rows);
        }
      });
    });
  },

  ConfirmIdPassword : function(conn, Id, Password){
    return new Promise(function(resolve, reject){
      conn.query("Select * from user where Id = ? and password = ?", [Id, Password], 
      function(err, rows){
        if(err){console.log(err);}
        else{
          if(!rows[0])
          {
            resolve(false);
          }
          else
          {
            resolve(rows);
          }
        }
      });
    });
  },

  RegistUser : function(conn, id, password, name){
    return new (function(resolve, reject){
      var done = conn.query("INSERT INTO diary.user VALUES (?, ?, ?, ?)",[id, password, name, 1],
      function(err, rows){
        if(err){console.log(err);}
        else{
          return done;
        }
      }
    );
    });
  }
  
};




