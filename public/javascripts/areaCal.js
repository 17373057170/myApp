var projectSign = 0;        //记录投影状态，偶数为墨卡托投影，奇数为未投影
var myMap = new Array();    //首位记录总线段数
var areaList = new Array(); //存储地区面积和中心位置数组
var gCoordinates84 = { a:6378137, b:6356752.3142};      //84坐标系参数
var areaNum;                //显示面积的区域的编号
//多边形编号与区域名称编号
var areaCode = new Array();
areaCode[1] = "连云港";
areaCode[7] = "徐州";
areaCode[8] = "宿迁";
areaCode[9] = "盐城";
areaCode[10] = "淮安";
areaCode[11] = "泰州";
areaCode[12] = "南通";
areaCode[13] = "扬州";
areaCode[14] = "南京";
areaCode[15] = "镇江";
areaCode[16] = "常州";
areaCode[17] = "无锡";
areaCode[18] = "苏州"

//计算84坐标系剩余参数
function gCoor84Cal(gCoordinate)
{
    var a = gCoordinate.a, b = gCoordinate.b;
    var e2 = 1 - (b/a) * (b/a);
    var e_2 = (a/b) * (a/b) - 1;
    var newGCoordinate = { a:a, b:b, e2:e2, e_2:e_2};

    return newGCoordinate;
}
//角度弧度相互转换
function An2Ra(angle) { return (angle / 180) * Math.PI; }
function Ra2An(angle) { return (angle / Math.PI) * 180; }

//判断旋转方向
function judgeClockwise(prePointX, latPointX)
{
    if (prePointX <= latPointX)  return -1;  //逆时针，减面积
    else return 1;                          //顺时针，加面积
}
//找到单个区域的最大最小值
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
    return Array(minX, maxX, minY, maxY);
}
//计算单个梯形的面积
function countEachTArea(x1, x2, y1, y2, GC)
{
    var a = GC.a, b = GC.b, e2 = GC.e2, e_2 = GC.e_2;
    var e = Math.sqrt(e2), e_ = Math.sqrt(e_2);
    //常数参数
    //var A = 1 + (3/4)*Math.pow(e, 2) + (45/64)*Math.pow(e, 4) + (175/256)*Math.pow(e, 6) + (11025/16384)*Math.pow(e, 8) + (43659/65536)*Math.pow(e, 10) + (693693/1048576)*Math.pow(e, 12);
    var A = 1 + (1/2)*Math.pow(e, 2) + (3/8)*Math.pow(e, 4) + (5/16)*Math.pow(e, 6);
    //var B = (3/4)*Math.pow(e, 2) + (45/64)*Math.pow(e, 4) + (175/256)*Math.pow(e, 6) + (11025/16384)*Math.pow(e, 8) + (43659/65536)*Math.pow(e, 10) + (693693/1048572)*Math.pow(e, 12);
    //var B = (3/8)*Math.pow(e, 2) + (15/32)*Math.pow(e, 4) + (525/1024)*Math.pow(e, 6) + (2205/4096)*Math.pow(e, 8) + (72765/131072)*Math.pow(e, 10) + (297297/524288)*Math.pow(e, 12);
    var B = (1/6)*Math.pow(e, 2) + (3/16)*Math.pow(e, 4) + (3/16)*Math.pow(e, 6);
    //var C = (15/32)*Math.pow(e, 4) + (175/384)*Math.pow(e, 6) + (3675/8192)*Math.pow(e, 8) + (14553/32768 )*Math.pow(e, 10) + (231231/524288)*Math.pow(e, 12);
    //var C = (15/256)*Math.pow(e, 4) + (105/1024)*Math.pow(e, 6) + (2205/16384)*Math.pow(e, 8) + (10395/65536)*Math.pow(e, 10) + (1486485/8388608)*Math.pow(e, 12);
    var C = (3/80)*Math.pow(e, 4) + (1/16)*Math.pow(e, 6);
    //var D = (35/96)*Math.pow(e, 6) + (735/2048)*Math.pow(e, 8) + (14553/40960)*Math.pow(e, 10) + (231231/655360)*Math.pow(e, 12);
    //var D = (35/3072)*Math.pow(e, 6) + (105/4096)*Math.pow(e, 8) + (10395/262144)*Math.pow(e, 10) + (55055/1048576)*Math.pow(e, 12);
    var D = (1/112)*Math.pow(e, 6);
    var E = (315/1024)*Math.pow(e, 8) + (6237/20480)*Math.pow(e, 10) + (99099/327680)*Math.pow(e, 12);
    //var E = (315/131072)*Math.pow(e, 8) + (3465/524288)*Math.pow(e, 10) + (99099/8388608)*Math.pow(e, 12);
    var F = (693/2560)*Math.pow(e, 10) + (11011/40960)*Math.pow(e, 12);
    //var F = (693/1310720)*Math.pow(e, 10) + (9009/5242880)*Math.pow(e, 12);
    var G = (1001/4096)*Math.pow(e, 12);
    //var G = (1001/8388608)*Math.pow(e, 12);
    //计算参数
    var K = 2*a*a * (1 - e2) * An2Ra(x2 - x1);
    //计算面积
    var dy = An2Ra(y2 - y1);
    var my = An2Ra(y1 + y2) / 2;
    //var T = K * (A*Math.sin(dy/2)*Math.cos(my) - B*Math.sin((3*dy)/2)*Math.cos(3*my) + C*Math.sin((5*dy)/2)*Math.cos(5*my) - D*Math.sin((7*dy)/2)*Math.cos(7*my) + E*Math.sin((9*dy)/2)*Math.cos(9*my) - F*Math.sin((11*dy)/2)*Math.cos(11*my) + G*Math.sin((13*dy)/2)*Math.cos(13*my));
    var T = K * (A*Math.sin(dy/2)*Math.cos(my) - B*Math.sin((3*dy)/2)*Math.cos(3*my) + C*Math.sin((5*dy)/2)*Math.cos(5*my) - D*Math.sin((7*dy)/2)*Math.cos(7*my));
    return T;
}
//计算单个区域的面积
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
        corArea += countEachTArea(point2[0], point1[0], point1[1], minY, gCoor84Cal(gCoordinates84));
    }
    var areaLable = new Array(corArea, (minX + maxX)/2, (minY + maxY)/2);
    return areaLable;
}
//计算所有区域的面积，并存入数组
function countArea(mapDraw)
{
    var areas = new Array();
    for (var i = 1; i <= mapDraw[0]; i++)
        areas[i] = countEachArea(mapDraw[i]);
    areas[0] = mapDraw[0];
    return areas;
}
//进行墨卡托投影反算
function antiMecProjectArith(mapDraw)
{
    //投影转换算法
    function antiMecProjectArith(x, y, B0, L0, a, b, e2, e_2)
    {
        //设置已知常数
        var E = Math.E, PI = Math.PI;
        var e = Math.sqrt(e2), e_ = Math.sqrt(e_2);
        //求算变量
        var NB0 = ((a*a) / b) / Math.sqrt(1 + e_2 * Math.cos(B0)*Math.cos(B0));
        var K = NB0 * Math.cos(B0);
        //求算经纬度坐标
        var L = y/K + L0;
        var B = 0;
        //迭代十次获得B数值
        for ( var i = 0; i < 10; i++)
            B = PI/2 - 2*Math.atan(Math.pow(E, (-x/K)) * Math.pow(E, (e/2)*Math.log((1-e*Math.sin(B)) / (1+e*Math.sin(B)))));
        
        var LB = new Array(Ra2An(L), Ra2An(B));
        return LB;
    }
    //通过公式变换所有点坐标的值
    var GC = gCoor84Cal(gCoordinates84);
    for (var i = 1; i <= mapDraw[0]; i++)
    {
        var eachLine = mapDraw[i];
        for (var j = 0; j < eachLine.length; j++)
            eachLine[j] = antiMecProjectArith(eachLine[j][1], eachLine[j][0], 0, 0, GC.a, GC.b, GC.e2, GC.e_2);
    }
    return mapDraw;
}
//找到地图绘制的边界
function findBorder(mapArray)
{
    //设置横竖轴最大最小标志，以墨卡托投影的最大最小值为标志
    var maxX = -20100000, maxY = -20100000, minX = 20100000, minY = 20100000; 
    var lineNum = mapArray.length, pointNum;        //地图总线段数目，一条线段点数
    var corX, corY;             //当前X，Y
    for (var i = 1; i < lineNum; i++)
    {
        lineArray = mapArray[i]
        pointNum = lineArray.length;
        for (var j = 0; j < pointNum; j++)
        {
            corX = lineArray[j][0], corY = lineArray[j][1];
            minX = (corX < minX) ? corX: minX;
            maxX = (corX > maxX) ? corX: maxX;
            minY = (corY < minY) ? corY: minY;
            maxY = (corY > maxY) ? corY: maxY;
        }//for point j
    }//for line i
    var borderArray = new Array(minX, maxX, minY, maxY);
    return borderArray;
}
//加入网格并进行投影反算
function completeMap(mapArray)
{
    var mapDraw = new Array();      //存储需要绘制的图形数据，全部以点的形式存储
    //存储地图数据
    for (var i = 1; i <= mapArray[0]; i++)  mapDraw[i] = mapArray[i].slice();
    //记录地图线段数
    mapDraw[0] = mapArray[0]; 

    //进行墨卡托投影反算，并计算面积
    if (projectSign)    
    {
        mapDraw = antiMecProjectArith(mapDraw);
        areaList = countArea(mapDraw);
    }
    
    return mapDraw;
}
//在网页上绘制地图
function drawMap(mapArray)
{
    var rawDrawPoints = completeMap(mapArray);
    //获得画布的长宽定标
    var mapDrawBorder = findBorder(rawDrawPoints);
    var W2HRatio = (mapDrawBorder[1] - mapDrawBorder[0]) / (mapDrawBorder[3] - mapDrawBorder[2]);
    var interval, minX = mapDrawBorder[0], maxX = mapDrawBorder[1], minY = mapDrawBorder[2] ,maxY = mapDrawBorder[3];
    if (W2HRatio >= 1.5)
        interval = 900/(mapDrawBorder[1] - mapDrawBorder[0]);
    else
        interval = 600/(mapDrawBorder[3] - mapDrawBorder[2]);
    var startInter = 70;
    var mapWidth = interval * (mapDrawBorder[1] - mapDrawBorder[0]) + startInter*2;
    var mapHeight = interval * (mapDrawBorder[3] - mapDrawBorder[2]) + startInter*2;

    //设置画布长宽
    var mapDrawDiv = document.createElement("canvasDiv");
    mapDrawDiv.style.height = mapHeight + "px";
    mapDrawDiv.style.width = mapWidth + "px";
    var myCanvas = document.getElementById("mapDrawing");
    if (myCanvas == null)
    {
        myCanvas = document.createElement("canvas");
        myCanvas.id = "mapDrawing";    
        document.getElementById("canvasDiv").appendChild(myCanvas);
    }
    myCanvas.width = mapWidth;
    myCanvas.height = mapHeight;

    //绘制
    var drawCanvas = myCanvas.getContext("2d");
    //绘制地图
    drawCanvas.lineWidth = 1.3;                           //设置线宽
    drawCanvas.strokeStyle = "black";                    //设置线色
    for (var i = 1; i <= rawDrawPoints[0]; i++)
    {
        var lineList = rawDrawPoints[i];
        drawCanvas.beginPath();
        drawCanvas.moveTo((lineList[0][0] - minX) * interval + startInter, (maxY - lineList[0][1]) * interval + startInter);
        for (var j = 1; j < lineList.length; j++)
            drawCanvas.lineTo((lineList[j][0]- minX) * interval + startInter, (maxY - lineList[j][1]) * interval + startInter);
        drawCanvas.stroke();                                //绘制线条
    }
    if (projectSign == 0)   return;

    //绘制地图边框
    drawCanvas.lineWidth = 2;                           //设置线宽
    drawCanvas.strokeStyle = "gray";                    //设置线色
    drawCanvas.beginPath();
    drawCanvas.moveTo((minX - minX) * interval + startInter, (maxY - minY) * interval + startInter);
    drawCanvas.lineTo((maxX - minX) * interval + startInter, (maxY - minY) * interval + startInter);            drawCanvas.lineTo((maxX - minX) * interval + startInter, (maxY - minY) * interval + startInter);
    drawCanvas.lineTo((maxX - minX) * interval + startInter, (maxY - maxY) * interval + startInter);
    drawCanvas.lineTo((minX - minX) * interval + startInter, (maxY - maxY) * interval + startInter);
    drawCanvas.lineTo((minX - minX) * interval + startInter, (maxY - minY) * interval + startInter);
    drawCanvas.stroke()
    
    //地图范围数字
    drawCanvas.strokeStyle = "black";                    //设置字色
    drawCanvas.font = "20px 黑体";
    drawCanvas.fillText(minY.toFixed(2),(maxX - minX) * interval + startInter, (maxY - minY) * interval + startInter);
    drawCanvas.fillText(maxY.toFixed(2),(maxX - minX) * interval + startInter, (maxY - maxY) * interval + startInter + 20);
    drawCanvas.fillText(minX.toFixed(2),(minX - minX) * interval + startInter, (maxY - minY) * interval + startInter + 20);
    drawCanvas.fillText(maxX.toFixed(2),(maxX - minX) * interval , (maxY - minY) * interval + startInter + 20);

    //标注面积，并高亮该区域
    if (areaNum != null)
    {
        drawCanvas.fillStyle = "yellow";
        var lineList = rawDrawPoints[areaNum];
        drawCanvas.beginPath();
        drawCanvas.moveTo((lineList[0][0] - minX) * interval + startInter, (maxY - lineList[0][1]) * interval + startInter);
        for (var j = 1; j < lineList.length; j++)
            drawCanvas.lineTo((lineList[j][0]- minX) * interval + startInter, (maxY - lineList[j][1]) * interval + startInter);
        drawCanvas.fill();                                //绘制线条
        drawCanvas.font = "15px 黑体";
        drawCanvas.fillStyle = "black";
        drawCanvas.fillText(areaList[areaNum][0].toFixed(2),(areaList[areaNum][1] - minX) * interval + startInter, (maxY - areaList[areaNum][2]) * interval + startInter);
    }
    
   
    /*
    //判断每一线条所代表的市级单位
    drawCanvas.lineWidth = 3;                           //设置线宽
    drawCanvas.strokeStyle = "blue";                    //设置线色
    for (var i = 9; i <= 9; i++)
    {
        var lineList = rawDrawPoints[i];
        drawCanvas.beginPath();
        drawCanvas.moveTo((lineList[0][0] - minX) * interval + startInter, (maxY - lineList[0][1]) * interval + startInter);
        for (var j = 1; j < lineList.length; j++)
            drawCanvas.lineTo((lineList[j][0]- minX) * interval + startInter, (maxY - lineList[j][1]) * interval + startInter);
        drawCanvas.stroke();                                //绘制线条
    }
    */

    return;
}
//选中了某一个区域
function setArea()
{
    var obj = document.getElementById("selectE"); //定位id
    areaNum = obj.options[obj.selectedIndex].value; //选中地区的编号
    //对画布进行重绘
    var canvas = document.getElementById("mapDrawing");
    canvas.parentNode.removeChild(canvas);
    drawMap(myMap);
}
//将读取的字符串转换为数组形式，并以一定格式存入数组
function mapStr2mapXY(mapStr)
{
    var lineNum = 1;        //记录已经读取行数
    var pointNum = 0;       //记录当前线点数
    var mapXY = new Array();  
    var strs = mapStr.split("\n");     //设置分割
    for (var i = 0; i <= strs.length ;i++)
    {
        if( i == 0)   //为第一条线增加存储空间
        {
            mapXY[lineNum] = new Array();
            i++;
        }
        if(strs[i].indexOf("END") >= 0)
        {
            if(strs[i+1].indexOf("END") >= 0)    //文件结束
            {
                mapXY[0] = lineNum;
                return mapXY;
            }
            else                                //当前线段结束
            {
                mapXY[++lineNum] = new Array(); //为下一条线分配空间
                i += 2;
                pointNum = 0;
            }
        }
        //将该点记录进入数组
        var XY = strs[i].split(',');
        mapXY[lineNum][pointNum] = new Array(2);       //分配存储空间
        mapXY[lineNum][pointNum][0] = parseFloat(XY[0]);
        mapXY[lineNum][pointNum++][1] = parseFloat(XY[1]);
    }//for
    return;
}
//读取地图文件
function readMapFile()
{  
    var mapFile = document.getElementById("openMapFile").files[0];  //获取文件
    var reader = new FileReader();  
    reader.readAsText(mapFile);  
    reader.onload = function(e)
    {
        myMap = mapStr2mapXY(this.result)   //将读取的字符串转为数字
        //document.write(myMap);
        drawMap(myMap);     //绘制原始地图
    }     
    return;
}
//改变投影标志，并重新绘制地图
function setProjectSign()
{
    if(projectSign == 0)
    {
        //创建一个下拉选取框
        var selectE = document.getElementById("selectE");
        selectE.style.display = "";
        for(var i = 0; i< areaCode.length; i++)
            if(areaCode[i] != null)
                selectE.options.add (new Option(areaCode[i], String(i)));
    }
    projectSign += 1;
    drawMap(myMap);     //根据规定的投影绘制地图
    return;
        
}
