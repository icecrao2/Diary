
module.exports = {
	
	//weather를 불러오는 메서드

	SelectWeather: async function(conn){
		return new Promise(function(resolve, reject){
			conn.query("select * from `diary`.`weather`", function(err,rows){
				if(err){console.log(err);}
				else{
					resolve(rows);
				}
			});
		});
	}

}