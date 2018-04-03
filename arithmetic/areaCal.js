/*
function antiMecProjectArith(x, y, B0, L0, a, b, e2, e_)
{
    var E = Math.E;
    var e = Math.sqrt(e2), e_ = Math.sqrt(e_2);
    var NB0 = ((a*a) / b) / Math.sqrt(1 + e_2 * Math.cos(B0)*Math.cos(B0));
    var K = NB0 * Math.cos(B0);
        
    var L = y/K + L0;
    var B = 0;
    //迭代十次获得B数值
    for ( var i = 0; i < 10; i++)
    {
        B = Math.PI/2-2*Math.atan(Math.pow(E,(-x/K))*Math.pow(E,(e/2)*Math.log((1-e*Math.sin(B))/(1+e*Math.sin(B)))));
    }
    console.log(B/Math.PI*180,L/Math.PI*180);
}
antiMecProjectArith(  5753326.023,9483462.947, 0, 0, 6378137, 6356752.3142, 0.006693421622966, 0.006738525414684)
*/

//面积计算
//判断转向
function judgeClockwise(prePointX, latPointX)
{
    if (prePointX <= latPointX)  return -1;  //逆时针，减面积
    else return 1;                          //顺时针，加面积
}
function findAreaBorder(areaPoints)
{
    //设置横竖轴最大最小标志，以墨卡托投影的最大最小值为标志
    var maxX = -20100000, maxY = -20100000, minX = 20100000, minY = 20100000; 
    var pointNum = areaPoints.length; 
    var corX, corY;             //当前X，Y
    for (var j = 0; j < pointNum; j++)
    {
        corX = areaPoints[j][0], corY = areaPoints[j][1];
        minX = (corX < minX) ? corX: minX;
        maxX = (corX > maxX) ? corX: maxX;
        minY = (corY < minY) ? corY: minY;
        maxY = (corY > maxY) ? corY: maxY;
    }//for point j
    var borderArray = new Array(minX, maxX, minY, maxY);
    return borderArray;
}
function countEachTArea(x1, x2, y1, y2)
{
    /*
    var a = GC.a, b = GC.b, e2 = GC.e2, e_2 = GC.e_2;
    var e = Math.sqrt(e2), e_ = Math.sqrt(e_2);
    //常数参数
    var A = 1 + (3/4)*Math.pow(e, 2) + (45/64)*Math.pow(e, 4) + (175/256)*Math.pow(e, 6) + (11025/16384)*Math.pow(e, 8) + (43659/65536)*Math.pow(e, 10) + (693693/1048572)*Math.pow(e, 12);
    var B = (3/4)*Math.pow(e, 2) + (45/64)*Math.pow(e, 4) + (175/256)*Math.pow(e, 6) + (11025/16384)*Math.pow(e, 8) + (43659/65536)*Math.pow(e, 10) + (693693/1048572)*Math.pow(e, 12);
    var C = (15/32)*Math.pow(e, 4) + (175/384)*Math.pow(e, 6) + (3675/8192)*Math.pow(e, 8) + (14553/32768 )*Math.pow(e, 10) + (231231/524288)*Math.pow(e, 12);
    var D = (35/96)*Math.pow(e, 6) + (735/2048)*Math.pow(e, 8) + (14553/40960)*Math.pow(e, 10) + (231231/655360)*Math.pow(e, 12);
    var E = (315/1024)*Math.pow(e, 8) + (6237/20480)*Math.pow(e, 10) + (99099/327680)*Math.pow(e, 12);
    var F = (693/2560)*Math.pow(e, 10) + (11011/40960)*Math.pow(e, 12);
    var G = (1001/4096)*Math.pow(e, 12);

    //计算参数
    var K = 2*a*a * (1 - e2) * Math.abs(x1 - x2);

    //计算面积
    var dy = Math.abs(y1 - y2);
    var my = (y1 + y2) * 2;
    var T = K * (A*Math.sin(dy/2)*Math.cos(my) - B*Math.sin((3*dy)/2)*Math.cos(3*my) + C*Math.sin((5*dy)/2)*Math.cos(5*my) - D*Math.sin((7*dy)/2)*Math.cos(7*my) + E*Math.sin((9*dy)/2)*Math.cos(9*my) - F*Math.sin((11*dy)/2)*Math.cos(11*my) + G*Math.sin((13*dy)/2)*Math.cos(13*my));
    */
    var T = (x2 - x1) * (y2 - y1);
    return T;
}
function countEachArea(areaPoints)
{
    var areaBorder = findAreaBorder(areaPoints);
    var minX = areaBorder[0], maxX = areaBorder[1], minY = areaBorder[2], maxY = areaBorder[3];
    var corArea = 0;
    var pointsNum = areaPoints.length;
    for ( var i = 0; i < pointsNum - 1; i++)
    {
        var point1 = areaPoints[i];
        var point2 = areaPoints[i + 1];
        corArea += /*judgeClockwise(point1[0], point2[0]) **/ countEachTArea(point1[0], point2[0], minY, point1[1]);
    }
    var areaLable = new Array(corArea, (minX + maxX)/2, (minY + maxY)/2);
    return areaLable;
}

var points = new Array(10);
points[0] = new Array(2,0);
points[1] = new Array(3,0);
points[2] = new Array(4,1);
points[3] = new Array(4,4);
points[4] = new Array(3,5);
points[5] = new Array(1,5);
points[6] = new Array(2,4);
points[7] = new Array(2,3);
points[8] = new Array(1,1);
points[9] = new Array(2,0);
var area = countEachArea(points);
console.log(area);

