
module.exports = {

	LoadDiaryList : function(conn, PageNum, uid) {
		return new Promise(function(resolve, reject){
			conn.query("select * from board  where writer = ? order by boardid desc limit ?, ?",[uid, (PageNum-1)*7, 7], 
			function(err, rows){
				if(err){console.log(err);}
				else{
					resolve(rows);
				}
			})
		})
	},

	//뭔가 어설픈 오버로딩 기법
	SearchDiary: function(conn, uid, FirstDate, SecondDate, SearchKeyword, PageNum){

		var query;
		var parameter
		console.log("keyword = " + SearchKeyword);
		if(SearchKeyword  != 'undefined')
		{
			query = "select * from board where writer = ? and title like ? and date(date) between ? and ? order by boardid desc limit ?, ?";
			parameter = [uid, "%"+SearchKeyword+"%", FirstDate, SecondDate, (PageNum-1)*7, 7];
		}
		else
		{
			query = "select * from board where writer = ? and date(date) between ? and ? order by boardid desc limit ?, ?";
			parameter = [uid, FirstDate, SecondDate, (PageNum-1)*7, 7];
		}
		

		return new Promise(function(resolve, reject){
			
			conn.query(query, parameter, function(err, rows){
				if(err){console.log(err);}
				else{
					resolve(rows);
				}
			});
		});
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