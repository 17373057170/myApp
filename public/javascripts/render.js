//绘制算法
//多边形数组从第一位开始存储
//点数组从第0位开始存储
//平行线填充，角度用斜率表示，平行线的间隔用线段之间的距离表示
//测试多边形
function setPoly()
{
    var poly = new Array();
    poly.push([1,3]);
    poly.push([3,3]);
    poly.push([2,1]);
    poly.push([1,1]);
    poly.push([1,0]);
    poly.push([0,1]);
    poly.push([0,2]);
    poly.push([1,3]);
    return poly;
}


/****************************************
 * 全局变量
 * 记录当前输入的所有多边形数据和数据范围
 ****************************************/
var polyArray = new Array();    //存储地图图层的数组
var layerNum = 0;               //记录当前图层数，和绘制纹理标志
var WAL = new Array(4);         //记录当前地图绘制的范围minx,miny,width,height

/****************************************************
 * 根据绘制的角度，绘制的间隔，确定图像或线条要绘制的位置
 * 将要绘制的路径与多边形数组存储到一起
 *****************************************************/
//求算当前多边形的最小外接矩形
function findAreaBorder(points)
{
    //设置横竖轴最大最小标志，以墨卡托投影的最大最小值为标志
    var maxX = -Infinity, maxY = -Infinity, minX = Infinity, minY = Infinity; 
    var pointNum = points.length;
    var corX, corY;             //当前X，Y
    for (var i = 0; i < pointNum; i++)
    {
        corX = points[i][0], corY = points[i][1];
        minX = (corX < minX) ? corX: minX;
        maxX = (corX > maxX) ? corX: maxX;
        minY = (corY < minY) ? corY: minY;
        maxY = (corY > maxY) ? corY: maxY;
    }

    return [minX, maxX, minY, maxY];
}

//获取每个矩形中每条平行线经过的定点
function acLines(bRectangle, interval, angle)
{
    var xLen = (bRectangle[3] - bRectangle[2]) / angle;         //获得横向线沿伸的长度
    var borInterval = interval / Math.sin(Math.atan(angle));    //获得在横向上的间隔距离
    var lineNum = parseInt((xLen + bRectangle[1] - bRectangle[0] )/ borInterval) + 1;                           //直线条数
    var start = angle < 0? bRectangle[0] - xLen: bRectangle[0]; //获得直线绘制的起点位置
    
    var pOnLine = new Array();
    //依次压入直线
    for (var i = 1; i <= lineNum; i++)
        pOnLine.push([bRectangle[0] + i*borInterval, bRectangle[3]])
    
    return pOnLine;
}

//求算点到直线的距离，带符号
//直线表示为[斜率，经过的点]
function countP2L(point, line)
{
    //得到直线参数
    var k = line[0], b = -line[1][0]*k + line[1][1];
    //判断点在直线的方位
    var pos = (k*point[0] - point[1] + b) < 0? -1: 1;
    //求算点到直线的距离
    return (k*point[0] - point[1] + b)/ Math.sqrt(k*k + 1);

}

//判断线与线的关系，如果不相交返回false，相交返回交点位置
//line1是纹理的直线方程，[斜率，经过的点坐标]
//line2是多边形中的线段，[point1, point2]
function judgeL2L(line1, line2)
{
    //获得直线参数和点到直线的距离
    var k = line1[0], b = -line1[1][0]*k + line1[1][1];
    var d1 = (k*line2[0][0] - line2[0][1] + b)/ Math.sqrt(k*k + 1);
    var d2 = (k*line2[1][0] - line2[1][1] + b)/ Math.sqrt(k*k + 1);

    if (d1*d2 > 0)  return false;   //不相交，直接返回
    var lScale = Math.abs(d1)/(Math.abs(d1) + Math.abs(d2));    //求算线段的比例
    //返回交点坐标
    return [line2[0][0] - lScale * (line2[0][0] - line2[1][0]), line2[0][1] - lScale * (line2[0][1] - line2[1][1])];
}

//判断一个点是否在多边形中
function judgePinA(point, poly)
{
    var nCross = 0;         //记录当射线的于多边形的交点数
    var pointNum = poly.length - 1;

    //通过水平射线，遍历多边形每一个点
    for (var i = 0; i < pointNum; i++)
    {
        //记录前后两个点
        var fPoint = poly[i], nPoint = poly[i + 1];
        //线是水平的，跳过
        if (fPoint[1] == nPoint[1])
            continue;
        //如果点在线段的上方或下方，跳过
        if (point[1] < (fPoint[1]<nPoint[1]? fPoint[1]: nPoint[1]))
            continue;
        if (point[1] > (fPoint[1]>nPoint[1]? fPoint[1]: nPoint[1]))
            continue;
        //判断横向是否于线段相交
        var a = (parseFloat(point[1]-fPoint[1]) * parseFloat(nPoint[0]-fPoint[0])) / parseFloat(nPoint[1]-fPoint[1]) + fPoint[0];
        if (a  < point[0])
            //判断与前的线是不是水平的，如果是水平表明与端点相交，只能算一次
            if (point[1] != fPoint[1])
                nCross++;
    }
    //通过相交次数判断是否在内
    if (nCross % 2 == 1)
        return true;
    else
        return false; 
}

//以x坐标为标志，从小到大的排序规则
function com(a, b) 
{ 
    return a[0] > b[0];
}
//计算线和多边形的交点个数，并记录
//多边形由点集组成，线[斜率，经过的点坐标]
function judgeL2A(poly, line)
{
    var pointNum = poly.length - 1;
    var node = new Array();         //记录交点数组

    for(var i = 0; i < pointNum; i++)
    {
        var tempPoint = judgeL2L(line, [poly[i], poly[i+1]]);
        if (tempPoint == false) continue;       //没有交点
        //判断是不是线段端点计算了两次，如果不是，记录该点
        if (node.length == 0)
            node.push(tempPoint);
        else if (node[node.length -1][0] != poly[i][0] || node[node.length -1][1] != poly[i][1])
            node.push(tempPoint);
    }

    //如果直线与多边形没有交点
    if (node.length == 0)   return false;
    //通过横坐标进行排序
    node.sort(com);
    //通过终点判断线段是否在多边形内部，如果是，以线段形式计入数组
    var result = new Array();
    for (var i = 0; i < node.length - 1; i++)
    {
        var mPoint = [(node[i][0]+node[i+1][0]) / 2, (node[i][1]+node[i+1][1]) / 2];
        if (judgePinA(mPoint, poly))
            result.push([node[i], node[i+1]]);
    }
    
    return result;
}

//求算一个多边形中的所有平行线
function eachVena(poly, lineData)
{
    //求算所有纹理的直线方程
    var lines = acLines(findAreaBorder(poly), lineData.interval, lineData.angle);
    var lineNum = lines.length;
    var areaLines = new Array();        //记录多边形的所有纹理线段

    //遍历所有直线，求在多边形内部的线段坐标
    for (var i = 0; i < lineNum; i++)
    {
        var segments = judgeL2A(poly, [lineData.angle, lines[i]]);
        if (segments != false)
            for (var j = 0; j < segments.length; j++)
                areaLines.push(segments[j]);
    }
    return areaLines;
}

//求算所有多边形的纹理线段
function allAreaLines(polys, lineData)
{
    var exPoly = new Array();
    for (var i = 1; i <= polys[0]; i++)
        exPoly.push(eachVena(polys[i], lineData));
    exPoly.unshift(exPoly.length)
    return exPoly;
}


/**********************
 * 绘制所有图形和纹理
 *********************/
//找到所有图形的边界
function findBorder(pointArray)
{
    var maxX = -Infinity, maxY = -Infinity, minX = Infinity, minY = Infinity; 
    //遍历所有多边形
    for (var i = 1; i <= pointArray[0]; i++)
    {
        var pointNum = pointArray[i].length
        //遍历一个多边形的所有点
        for (var j = 0; j < pointNum; j++)
        {
            var corX = pointArray[i][j][0], corY = pointArray[i][j][1];
            if (corX < minX)    minX = corX;
            if (corX > maxX)    maxX = corX;
            if (corY < minY)    minY = corY;
            if (corY > maxY)    maxY = corY;
        }
    }
    return [minX, maxX, minY, maxY];
}
//根据当前文件数设置纹理绘制数据
function setStyle(dScale, drawSign)
{
    if (drawSign == 0)      //绘制平行线纹理
        return {veinData:{interval:4, angle:1}, lineColor:'black' ,lineQuality: 1/dScale};
    else                    //绘制点图像填充纹理
        return {veinData:{interval:3, angle:0.0001}, lineColor:'green', radis: 2/dScale};
}
//绘制单个面的边界
function drawPoly(poly, pCanvas)
{
    //找到开始记录数据的下标
    var pointNum = poly.length;
    pCanvas.beginPath();
    pCanvas.moveTo(poly[0][0], poly[0][1]);
    for (var i = 0; i < pointNum; i++)
        pCanvas.lineTo(poly[i][0], poly[i][1]);
    pCanvas.closePath();
    pCanvas.stroke();

    return ;
}
//绘制矩形点状物
function drawPoint(point, pInterval, pCanvas)
{
    point[1] =point[1] - pInterval/2;        //重新设置位置
    var interval = pInterval / 8;
    //绘制纹理黑色部分
    pCanvas.fillStyle = "black";                       
    //pCanvas.fillRect(point[0] - 7*interval, point[1] +  7*interval, 2*interval, 2*interval);                //填充矩形
    //绘制绿色部分
    pCanvas.fillStyle = "green";                       
    pCanvas.fillRect(point[0] - 4*interval, point[1] + 3*interval, interval, interval);                //填充矩形
    pCanvas.fillRect(point[0] - 3*interval, point[1] + 2*interval, 2*interval, interval);                //填充矩形
    pCanvas.fillRect(point[0] - interval, point[1] + 3*interval, interval, interval);                //填充矩形
}
//分割线段，返回的位置为绘制图形的右下角
function cutLine(line, pInterval)
{
    //初始化点数组
    var points = new Array();
    //求算线段长度
    var lineLen = Math.sqrt(Math.pow(line[0][0] - line[1][0], 2) + Math.pow(line[0][1] - line[1][1], 2));
    //线段上需要绘制的点数
    var pointNum = parseInt(lineLen/pInterval);
    //将点加入点数组，并返回数组
    for (var i = 1; i <= pointNum; i++)
        points.push([line[0][0] + pInterval*i, line[0][1]]);
    
    return points;
}
//绘制单个纹理线段
function drawEachLine(line, pCanvas, drawData, drawSign)
{
    var lineData = drawData.veinData;
    if (drawSign == 0)  //绘制平行线纹理
    {
        pCanvas.lineWidth = lineData.lineQuality;                   //设置线宽
        pCanvas.strokeStyle = drawData.lineColor;                   //设置线色
        pCanvas.beginPath();
        pCanvas.moveTo(line[0][0], line[0][1]);
        pCanvas.lineTo(line[1][0], line[1][1]);
        pCanvas.closePath();
        pCanvas.stroke();
    }
    if (drawSign == 1)
    {
        //获得绘制的点数据
        var pInterval = drawData.veinData.interval;     //点间隔
        var pointArray = cutLine(line, pInterval);
        var pointNum = pointArray.length;
        //循环，绘制所有点
        for (var i = 0; i < pointNum; i++)
            drawPoint(pointArray[i], pInterval, pCanvas);
    }

}
//绘制单个图形的纹理
function drawVein(veins, pCanvas, drawData, drawSign)
{
    //获得纹理条数
    var lineNum = veins.length;
    for (var i = 0; i < lineNum; i++)
        drawEachLine(veins[i], pCanvas, drawData, drawSign);
}

//绘制图形数组和绘制样式绘制
function draw(polyArray)
{
    var corPolyArray = polyArray[layerNum - 1];         //获得当前地图
    var drawDiv, canvas;         //定义div，canvas
    //找到当前地图所有地物的边界，并加载到全局变量中记录下来
    var border = findBorder(corPolyArray);
    var dataWidth = border[1] - border[0], dataHeight = border[3] - border[2];
    if (layerNum == 1)      //第一次加载地图，创建Div和canvas
    {
        WAL = [border[0], border[2], dataWidth, dataHeight];          //记录当前地图范围
        //创建div，并加入网页中
        drawDiv = document.createElement("div")
        drawDiv.id = "drawDiv";
        document.getElementById("container").appendChild(drawDiv);
        //创建画布并加入到div
        canvas = document.createElement("canvas");
        canvas.id = "myCanvas";
        drawDiv.appendChild(canvas);        //加入到div中
    }
    else                    //不是第一次加载地图，修改Div和canvas的宽高
    {
        //获得div和canvas
        drawDiv = document.getElementById("drawDiv");
        canvas = document.getElementById("myCanvas");
        //确定当前地图的长宽与之前的关系，确定最终长宽，并记录
        dataWidth = WAL[2] < dataWidth? dataWidth: WAL[2];
        dataHeight = WAL[3] < dataHeight? dataHeight: WAL[3];
        //重新确定起始位置
        border[0] = WAL[0] < border[0]? WAL[0]: border[0];
        border[2] = WAL[1] < border[2]? WAL[1]: border[2];
        WAL = [border[0], border[2], dataWidth, dataHeight];
    }
    //设置div的高度
    drawDiv.style.height = dataHeight * (drawDiv.offsetWidth / dataWidth) + "px";
    //设置canvas长宽
    canvas.width = drawDiv.offsetWidth, canvas.height = drawDiv.offsetHeight
    //获得绘制句柄
    var drawCanvas = canvas.getContext("2d");
    //获得绘制比例尺
    var scale = (canvas.width - 20) / dataWidth;
    //缩小画布比例尺，并翻转画布，使坐标原点位于画布左下角，并与边界上下留出间隔
    drawCanvas.translate(10, canvas.height * (1 - 10/canvas.width));
    drawCanvas.scale(scale, -scale);
    //移动坐标系，使绘制从最小值开始
    drawCanvas.translate(-border[0], -border[2]);          
    //依次绘制所有图层
    for (var i = 0; i < layerNum; i++)
    {
        corPolyArray = polyArray[i];        //获得图层数据
        var drawSign = corPolyArray[corPolyArray.length - 1];  //获得当前纹理绘制标志
        //获得根据当前文件数设置纹理绘制数据
        var drawStyle = setStyle(scale, drawSign);
        drawCanvas.strokeStyle = drawStyle.lineColor;       //设置边界线色
        drawCanvas.lineWidth = 1 / scale;                   //设置边界线宽

        //绘制所有闭合曲线边界
        for (var j = 1; j <= corPolyArray[0]; j++)
            drawPoly(corPolyArray[j], drawCanvas)

        //绘制纹理
        var exPolys = allAreaLines(corPolyArray, drawStyle.veinData);        //获得的纹理绘制数据
        for (var j = 1; j <= exPolys[0]; j++)
            drawVein(exPolys[j], drawCanvas, drawStyle, drawSign);
    }   

}

/**
 * 算法与网页交互部分
 */
//将从网页中读取的字符串转换为数组形式
function polyStr2polyXY(polyStr)
{
    var lineNum = 1, pointNum = 0;        //记录已经读取行数、当前线点数
    var polyXY = new Array();  
    var strs = polyStr.split("\n");     //设置分割
    for (var i = 0; i <= strs.length ;i++)
    {
        if( i == 0)   //为第一条线增加存储空间
        {
            polyXY[lineNum] = new Array();
            i++;
        }
        if(strs[i].indexOf("END") >= 0)
        {
            if(strs[i+1].indexOf("END") >= 0)    //文件结束
            {
                polyXY[0] = lineNum;            //记录总线段的条数
                return polyXY;
            }
            else                                //当前线段结束
            {
                polyXY[++lineNum] = new Array(); //为下一条线分配空间
                i += 2;
                pointNum = 0;                   //当前线段点数记录归零
            }
        }

        //将该点记录进入数组
        var XY = strs[i].split(',');
        polyXY[lineNum][pointNum] = new Array(2);       //分配存储空间
        polyXY[lineNum][pointNum][0] = parseFloat(XY[0]);
        polyXY[lineNum][pointNum++][1] = parseFloat(XY[1]);
    }//for
}
//判断读取的文件，设置纹理绘制标志
function setDrawSign(fileName)
{
    if (fileName == 'Building.gen')     return 0;
    else if (fileName == 'vegrgn.gen')  return 1;
    else
        document.write("文件名错误");
}
//读取文件并并进行相关操作
function readMapFile()
{  
    var polyFile = document.getElementById("openMapFile").files[0];  //获取文件
    var reader = new FileReader();  
    reader.readAsText(polyFile);  
    reader.onload=function(e)
    {
        polyArray[layerNum] = polyStr2polyXY(this.result);      //将读取的数据转换为字符串形式
        polyArray[layerNum++].push(setDrawSign(polyFile.name))  //每个图层的数组最后一位放置纹理绘制标志
        draw(polyArray);                                        //绘制图层
        //var exPolys = allAreaLines(polyArray[drawSign++]);        //获得的纹理绘制数据的多边形数据
    }
}
//console.log(acLines([0,10,0,10], Math.sqrt(2),1));
//console.log(judgeL2L([1, [0,0]], [[0,1],[2,1]]))
//console.log(judgeL2A(setPoly(), [1, [0,0]]));
//console.log(findAreaBorder(setPoly()));
//var lineData = {interval:Math.sqrt(2)/4, angle:1};
//eachVena(setPoly(), lineData)