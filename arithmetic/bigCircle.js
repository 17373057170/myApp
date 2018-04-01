function An2Ra(angle)
{
	return (angle / 180) * Math.PI;
}
function Ra2An(radian)
{
	return (radian/Math.PI)*180
}
a = 0
function bingyuan(bigyuanList, lat1, long1, lat2, long2, times)
{
	lat1 = An2Ra(lat1), long1 = An2Ra(long1);
	lat2 = An2Ra(lat2), long2 = An2Ra(long2);
	var Zlong = long2 - long1;
	
	var Bx = Math.cos(lat2) * Math.cos(Zlong);
	var By = Math.cos(lat2) * Math.sin(Zlong);
	var latm = Math.atan2((Math.sin(lat1) + Math.sin(lat2)), Math.sqrt((Math.cos(lat1) + Bx)*(Math.cos(lat1) + Bx) + By*By));
	var longm = long1 + Math.atan2(By, Math.cos(lat1) + Bx);
    bigyuanList[bigyuanList.length] = new Array(Ra2An(longm), Ra2An(latm));
	console.log(Ra2An(latm), Ra2An(longm));
    
    //利用递归分辨求算向上向下中点
	//bigyuanList = bingyuan(bigyuanList, lat1, long1, latm, longm, times + 1);
	//bigyuanList = bingyuan(bigyuanList, latm, longm, lat2, long2, times + 1);
	return bigyuanList;

}

var bigyuanList = new Array();
//bingyuan(bigyuanList, 39.8, 116.4, 48.52, 2.2, 0);
bingyuan(bigyuanList, 60.62, 65.83, 48.52, 2.2, 0);
console.log(bigyuanList.length);