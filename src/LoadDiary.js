
module.exports = {

	LoadDiaryList : function(conn, PageNum) {
		return new Promise(function(resolve, reject){
		conn.query("select * from board order by boardid desc limit ?, ?",[(PageNum-1)*7, 7], 
		function(err, rows){
			if(err){console.log(err);}
			else{
				resolve(rows);
			}
		})
	})
	},


	//이부분 테스트 및 수정 필요 
	InsertDiary : function(conn, id, title, date, emotion, weather, category, content, image){
		
		return new Promise(function(resolve, reject){
			conn.query('INSERT INTO `diary`.`board`'+
						'(`writer`,`title`,`date`,`emotion`,`weather`,`category`,`Content`,`image`)' +
						'VALUES' + 
						'(?,?,?,?,?,?,?,?)', [id, title, date, emotion, weather, category, content, image],
						function(err, rows){
							if(err){console.log(err);}
							else{
								console.log(rows.insertId);
								resolve(rows.insertId);
							}
						} 
			)
		});
	}
}