
module.exports = {
	
	//category 목록 생성에 사용될  mysql 함수 
	InsertEmotion: function(conn, uid, emotionname, emotionid){
		conn.query("insert into `diary`.`emotion`" + 
		" (`emotionid`," + 
		"`emotinoname`," + 
		"`UserID`) " + 
		"VALUES" + 
		" (?, ?, ?)", [emotionid, emotionname, uid], function(err, rows){
			if(err){console.log(err);}
			else{
				return rows;
			}
		}
	)},

	//category를 불러오는 메서드
	SelectEmotion: async function(conn, uid){
		return new Promise(function(resolve, reject){
			conn.query("select * from `diary`.`emotion` where UserId = ?",[uid], function(err,rows){
				if(err){console.log(err);}
				else{
					resolve(rows);
				}
			});
		});
	},

	DeleteEmotion: async function(conn, uid, emotionid){
		return new Promise(function(resolve, reject){
			conn.query("DELETE FROM `diary`.`emotion` where userid = ? and emotionid = ?", [uid, emotionid], 
			function(err, rows){
				if(err){console.log(err);}
				else{
					conn.query("UPDATE `diary`.`board` SET `emotion` = ? WHERE `emotion` = ?",[0, emotionid], function(err, rows){
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