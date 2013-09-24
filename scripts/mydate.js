function MyDate(dateStr)
{
	this.date = new Date(dateStr) || new Date();
	this.useUTC = true;
	
	this.setDateTime = function(dateStr)
	{
		this.date = new Date(dateStr);
		return this;
	}
	
	this.getMonthName = function ()
	{
		var month = -1;
		
		if(this.useUTC)
		{
			month = this.date.getUTCMonth();
		}
		else
		{
			month = this.date.getMonth();
		}
	
		switch(month)
		{
			case 0: return "January"; break;
			case 1: return "Feburary"; break;
			case 2: return "March"; break;
			case 3: return "April"; break;
			case 4: return "May"; break;
			case 5: return "June"; break;
			case 6: return "July"; break;
			case 7: return "August"; break;
			case 8: return "September"; break;
			case 9: return "October"; break;
			case 10: return "November"; break;
			case 11: return "December"; break;
		}
	}
	
	this.output = function()
	{
		var out = "";
		
		var hours = this.date.getUTCHours();
		var minutes = this.date.getUTCMinutes();
		
		out += this.getMonthName() + ' ';
		out += this.date.getUTCDate() + ', ';
		
    out += (hours < 10 ? "0" + hours : hours);
    out += ":";
    out += (minutes < 10 ? "0" + minutes : minutes);
		
		return out;
	}
}