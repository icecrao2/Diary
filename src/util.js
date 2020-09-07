
module.exports = {

	matchingName: function(rows, categoryrows){

		rows = this.SetDefaultCategory(rows);

		for(var a = 0 ; a < rows.length; a = a + 1)
		{
			for(var b = 0 ; b < categoryrows.length; b = b + 1)
			{
				if(rows[a].category == categoryrows[b].categorynum)
				{
					rows[a].category = categoryrows[b].categoryname;
				}
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
	}
}