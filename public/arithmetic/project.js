function An2Ra(angle)
{
	return (angle / 180) * Math.PI;
}

function LambertProject(B, L, B0, B1, B2, L0, a, b, e2)
{
	//将原始参数转变为弧度制
	B0 = An2Ra(B0);
	B1 = An2Ra(B1);
	B2 = An2Ra(B2);
	L0 = An2Ra(L0);
	//将原始数据转化为弧度制
	B = An2Ra(B);
	L = An2Ra(L);
	console.log(B0,B1,B2,L0,B,L)
	
	//获得B1B2的m值
	var mB1 = Math.cos(B1) / Math.sqrt(1 - e2*Math.sin(B1)*Math.sin(B1));
	var mB2 = Math.cos(B2) / Math.sqrt(1 - e2*Math.sin(B2)*Math.sin(B2));
	console.log('mB1' + mB1)
	console.log('mB2' + mB2)
	//获得B1B2的t值
	var tB0 = Math.tan(Math.PI/4 - B0/2) / Math.sqrt((1 - Math.sqrt(e2)*Math.sin(B0)) / ((1 + Math.sqrt(e2)*Math.sin(B0)), Math.sqrt(e2)/2));
	var tB1 = Math.tan(Math.PI/4 - B1/2) / Math.sqrt((1 - Math.sqrt(e2)*Math.sin(B1)) / ((1 + Math.sqrt(e2)*Math.sin(B1)), Math.sqrt(e2)/2));
	var tB2 = Math.tan(Math.PI/4 - B2/2) / Math.sqrt((1 - Math.sqrt(e2)*Math.sin(B2)) / ((1 + Math.sqrt(e2)*Math.sin(B2)), Math.sqrt(e2)/2));
	console.log('tB0' + tB0)
	console.log('tB1' + tB1)
	console.log('tB2' + tB2)
	//获得n值
	var n = Math.log(mB1/mB2) / Math.log(tB1/tB2);
	console.log('n' + n)
	//获得F值
	var F = mB1 / (n * Math.pow(tB1, n));		
	console.log('F' + F)
	//获得r0
	var r0 = a * F * Math.pow(tB0, n);
	console.log('r0' + r0)
	//获得theTa值
	var theTa = n * (L - L0);
	console.log('theTa' + theTa)
	
	//获得B的t值
	var tB = Math.tan(Math.PI/4 - B/2) / Math.sqrt((1 - Math.sqrt(e2)*Math.sin(B)) / ((1 + Math.sqrt(e2)*Math.sin(B)), Math.sqrt(e2)/2));
	console.log('tB' + tB)
	//获得r值
	var r = a * F * Math.pow(tB, n); 
	console.log('r' + r)
	
	//计算坐标
	var XL = r * Math.sin(theTa);	//经度
	var YB = r0 - r * Math.cos(theTa);	//纬度
	console.log(XL)
	console.log(YB)
	var XY = new Array(XL, YB);
	return XY;
}

LambertProject(47.37, 88.08, 0, 20, 40, 105, 6378245, 6356863.01877, 0.006738525414684)


function MercatorProject(B, L, B0, L0, a, b, e2, e_2)
{
	//将原始参数转变为弧度制
	B0 = An2Ra(B0);
	L0 = An2Ra(L0);
	//将原始数据转化为弧度制
	B = An2Ra(B);
	L = An2Ra(L);
	
	//求B0的N值
	var NB0 = ((a*a) / b) / Math.sqrt(1 + e_2 * Math.cos(B0)*Math.cos(B0));
	//求K值
	var K = NB0 * Math.cos(B0);
	console.log(K)
	//计算坐标
	var XL = K * (L - L0);
	var YB = K * Math.log(Math.tan(Math.PI/4 + B/2)*Math.pow(((1 - Math.sqrt(e2)*Math.sin(B))/(1 - Math.sqrt(e2)*Math.sin(B))), Math.sqrt(e2)/2))
	console.log(XL)
	console.log(YB)

	var XY = new Array(XL, YB);
	return XY;
}

MercatorProject(47.73, 88.08, 0, 0, 6378245, 6356863.01877, 0.006693421622966, 0.006738525414684)
