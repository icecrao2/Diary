
module.exports = {

	matchingName: function(rows, managingrows, func){

		for(var a = 0 ; a < rows.length; a = a + 1)
		{
			for(var b = 0 ; b < managingrows.length; b = b + 1)
			{
				func(rows[a], managingrows[b]);
			}
		}

		return rows;
	},


	SetDefaultCategory: function(rows){
		for(var a = 0 ; a < rows.length; a = a + 1)
		{
			if(rows[a].category == 0)
			{
				rows[a].category = "기본";
			}
		}
		return rows;
	},

	isEmpty :function(value){ 
		if( value == "" || value == null || value == undefined || ( value != null && typeof value == "object" && !Object.keys(value).length ) )
			{ return true }
		else
			{ return false } 
	},
	
	matchingEveryName: function(rows, categoryrows, weatherrows, emotionrows){
		rows = this.SetDefaultCategory(rows);
    	rows = this.matchingName(rows, categoryrows, function(rows, categoryrows){
			if(rows.category == categoryrows.categorynum)
			{
				rows.category = categoryrows.categoryname;
			}
    	});
      
      	rows = this.matchingName(rows, weatherrows, function(rows, weatherrows){
			if(rows.weather == weatherrows.weatherid)
			{
				rows.weather = weatherrows.weathername;
			}
		});
      	rows = this.matchingName(rows, emotionrows, function(rows, emotionrows){
    	    if(rows.emotion == emotionrows.emotionid)
			{
				rows.emotion = emotionrows.emotionname;
			}
	  });
	  return rows;
	}

}