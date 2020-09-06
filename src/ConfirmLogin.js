module.exports = {

  Permission : false,

  Logout : function(){
    this.Permission = false;
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
      var done = conn.query("INSERT INTO diary.user VALUES (?, ?, ?)",[id, password, name],
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




