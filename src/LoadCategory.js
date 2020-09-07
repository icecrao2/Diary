
module.exports = {
	
	//category 목록 생성에 사용될  mysql 함수 
	InsertCategory: function(conn, uid, CategoryName, CategoryNumber){
		conn.query("insert into `diary`.`category`" + 
		" (`categorynum`," + 
		"`categoryname`," + 
		"`UserID`) " + 
		"VALUES" + 
		" (?, ?, ?)", [CategoryNumber, CategoryName, uid], function(err, rows){
			if(err){console.log(err);}
			else{
				return rows;
			}
		}
	)},

	//category를 불러오는 메서드
	SelectCategory: async function(conn, uid){
		return new Promise(function(resolve, reject){
			conn.query("select * from `diary`.`category` where UserId = ?",[uid], function(err,rows){
				if(err){console.log(err);}
				else{
					resolve(rows);
				}
			});
		});
	},

	DeleteCategory: async function(conn, uid, CategoryNumber){
		return new Promise(function(resolve, reject){
			conn.query("DELETE FROM `diary`.`category` where userid = ? and categorynum = ?", [uid, CategoryNumber], 
			function(err, rows){
				if(err){console.log(err);}
				else{
					conn.query("UPDATE `diary`.`board` SET `category` = ? WHERE `category` = ?",[0, CategoryNumber], function(err, rows){
						if(err){console.log(err);}
						else{
							resolve(rows);
						}
					})
				}
			});
		});
	}

}