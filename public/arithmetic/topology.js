//多边形拓扑生成算法

//设置数组实例
function setArray()
{
    var lineArray = new Array(9);
    lineArray[0] = 8;
    lineArray[1] = new Array(3);
    lineArray[1][0] = [120,210];
    lineArray[1][1] = [180,210];
    lineArray[1][2] = [180,140];
    lineArray[2] = new Array(3);
    lineArray[2][0] = [180,140];
    lineArray[2][1] = [180,115];
    lineArray[2][2] = [85,115];
    lineArray[3] = new Array(3);
    lineArray[3][0] = [85,115];
    lineArray[3][1] = [30,115];
    lineArray[3][2] = [30,170];
    lineArray[4] = new Array(3);
    lineArray[4][0] = [30,170];
    lineArray[4][1] = [30,210];
    lineArray[4][2] = [120,210];
    lineArray[5] = new Array(2);
    lineArray[5][0] = [120,210];
    lineArray[5][1] = [97,174];
    lineArray[6] = new Array(3);
    lineArray[6][0] = [180,140];
    lineArray[6][1] = [158,163];
    lineArray[6][2] = [97,174];
    lineArray[7] = new Array(5);
    lineArray[7][0] = [85,115];
    lineArray[7][1] = [128,129];
    lineArray[7][2] = [70,141];
    lineArray[7][3] = [110,157];
    lineArray[7][4] = [97,174];
    lineArray[8] = new Array(3);
    lineArray[8][0] = [30,170];
    lineArray[8][1] = [70,162];
    lineArray[8][2] = [97,174];

    return lineArray;
}

//判断点是否存储在数组中
function judgePointIn(point, pointArray)
{
    //判断数组为空直接返回负值
    if (pointArray.length == 0)
        return -1;
    
    var pointNum = pointArray.length;       //数组中存储的点的数目
    var start = pointArray[0]? 0: 1;        //判断数组从哪一位开始存储点坐标
    for (var i = start; i < pointNum; i++)
    {
        //如果点存在于数组中，返回位置
        if (point[0] == pointArray[i][0] && point[1] == pointArray[i][1])
            return i;
    }
    return -1;       //当点不在数组中，返回负值
}

//设置存储结点的数组
function setPointXY(polyArray)
{
    var points = new Array(), pointCou = 1;     //存储点的数组、当前存储点数
    
    for (var i = 1; i <= polyArray[0]; i++)
    {
        var line = polyArray[i], pointNum = line.length;
        for (var j = 0; j < pointNum; j++)
        {
            //如果点不存在就存储到数组中
            if (judgePointIn(line[j], points) > 0)  continue
            points[pointCou++] = line[j];
        }
    }
    points[0] = pointCou - 1;
    return points;
}

//设置与点点关系数组
function setPoint2Point(points, polyArray)
{
    var point2point = new Array();
    //查找所有点的联系点
    for (var i = 1; i <= points[0]; i++)
    {
        point2point[i] = new Array();
        //遍历所有线 查找与该点相邻的点 并保存联系
        for ( var j = 1; j <= polyArray[0]; j++)
        {
            var position = judgePointIn(points[i], polyArray[j]);
            //当前线段不包含该点
            if (position < 0)   continue;
            //加入该点下一个点与该点的联系
            if (position + 1 != polyArray[j].length)
            {
                var pointAddPos = judgePointIn(polyArray[j][position + 1], points);
                if (point2point[i].length == 0 || point2point[i].indexOf(pointAddPos) == -1)
                    point2point[i].push(pointAddPos);
            }
            //加入该点上一个点与该点的联系
            if (position != 0)
            {
                var pointAddPos = judgePointIn(polyArray[j][position - 1], points);
                if (point2point[i].length == 0 || point2point[i].indexOf(pointAddPos) == -1)
                    point2point[i].push(pointAddPos);
            }

        }
    }

    return point2point;
}

//根据点点联系数组，建立二维数组记录弧段遍历情况
function arcTran(point2point)
{
    var pointNum = point2point.length;          //总点数
    var arcArray = new Array(pointNum), arcs;   //弧段数组
    
    //初始化二维数组
    arcArray[0] = pointNum;
    for (var i = 1; i < pointNum; i++)
    {
        arcArray[i] = new Array(pointNum);
        for (var j = 0; j <pointNum; j++)
            arcArray[i][j] = 0;
    }

    //将两点之间存在弧的置为1
    for (var i = 1; i < pointNum; i++)
    {
        var arcNum = (arcs = point2point[i]).length;
        for (var j = 0; j < arcNum; j++)
            arcArray[i][arcs[j]] = 1;
    }

    return arcArray;
}



//判断角度大小，角度小于180°返回1，大于180°返回-1，等于180°返回0
function judgAngle(point0, point1, point2)
{
    var  pos = (point0[0] - point2[0])*(point1[1] - point2[1]) - (point0[1] - point2[1])*(point1[0] - point2[0]);
    //var pos = (point0[1] - point1[0]) * point2[0] + (point1[0] - point0[0]) * point2[1] + point0[0] * point1[0]-point1[0] * point0[1];
    if (pos > 0)  return 1;
    else if (pos < 0) return -1;
    else    return 0;
}

//求算两条线之间的角度
//point0、point1、point2分别表示当前点，前点、后点
function countAngle(point0, point1, point2)
{
    //通过三条线得出两个向量
    var line1 = [point1[0] - point0[0], point1[1] - point0[1]];
    var line2 = [point2[0] - point0[0], point2[1] - point0[1]];
    //通过向量计算夹角
    var cos0 = (line1[0]*line2[0] + line1[1]*line2[1])/(Math.sqrt(line1[0]*line1[0]+line1[1]*line1[1])*Math.sqrt(line2[0]*line2[0]+line2[1]*line2[1]));
    var angle = 180 * (Math.acos(cos0) / Math.PI);
    //判断角度大小 并计算出最终角度
    var anglePosition = judgAngle(point0, point1, point2);
    if (anglePosition < 0)
        return 360 - angle;
    else 
        return angle;
}

//判断数组元素是否全为零，是返回false
//如果不是，返回用过最少的弧段
function judgeArc(point2point, arcArray, point)
{
    var arcNum = point2point[point].length;     //能够连接的弧段数，单方向
    var i, arc;
    //判断所有弧段是否全记录为0，如果是返回false
    for (i = 0; i < arcNum; i++)
    {
        arc = point2point[point][i];
        if (arcArray[point][arc] != 0 || arcArray[arc][point] != 0)
            break
    }
    if (i == arcNum)        
        return false;

    //判断是否有弧段剩余两次使用次数
    for (i = 0; i < arcNum; i++)
    {
        arc = point2point[point][i];
        //当前弧段剩余遍历次数两次，返回当前弧段
        if ((arcArray[point][arc] + arcArray[arc][point]) == 2)
            return point2point[point][i];
    }

    //判断在本次方向上是否存在剩余使用次数
    for (i = 0; i < arcNum; i++)
    {        
        arc = point2point[point][i];
        //本次方向没有用过，返回当前弧段
        if (arcArray[point][arc])   
            return point2point[point][i];
    }

    return false;
}

//查找数组中的最小值，并返回下标
function findMin(valueArray)
{
    var min = Infinity, minS;          //申明最小值、最小值下标
    var arcNum = valueArray.length;
    //遍历数组，查找最小值
    for (var i = 0; i < arcNum; i++)
    {
        if((min = (valueArray[i] < min? valueArray[i]: min)) == valueArray[i])
            minS = i; 
    }

    return minS;        //返回下标
}

//通过左转算法得到角度最小的下一条弧度下一条弧段
function findNextArc(arcUse, pointArray, pointA, pointB)
{
    var nextArc = new Array();      //下一条弧段预备点
    var pointNum = arcUse.length;   //总顶点数

    //记录可以用的弧段
    for (var i = 1; i < pointNum; i++)
        if(arcUse[pointB][i] == 1 && i != pointA)
            nextArc.push(i);
    
    //分别计算每个弧段的左转角度
    var arcNum = nextArc.length;
    var arcsAngle = new Array(arcNum);
    for (var i = 0; i <arcNum; i++)
        arcsAngle[i] = countAngle(pointArray[pointB], pointArray[pointA], pointArray[nextArc[i]]);

    //返回左转角度最小的弧段
    return nextArc[findMin(arcsAngle)];
}

//通过左转算法递归完成单个多边形
//传出当前多边形的点数组、弧段使用数组
function completePoly(startP, secondP, pointArray, arcUse, polyPs)
{
    var nextP = findNextArc(arcUse, pointArray, startP, secondP);
    //将点存入多边形数组，更改弧段数据
    polyPs.push(nextP);     
    arcUse[secondP][nextP] = 0;
    
    //回到起点，记录该弧段结束递归
    if (nextP == polyPs[0])   return [polyPs,arcUse];

    //不是起点，递归找到起点
    completePoly(secondP, nextP, pointArray, arcUse, polyPs);

    //返回多边形和弧段数组
    return [polyPs, arcUse];   
}

//在当前顶点生成所有多边形
function pointPolys(points, point2point, arcUse, topoPolys, pointA, pointB)
{
    //生成当前弧段多边形，并存储到相应的数组中
    var getNew = completePoly(pointA, pointB, points, arcUse, topoPolys[topoPolys[0]]);
    topoPolys[topoPolys[0]] = getNew[0];
    arcUse = getNew[1];

    //获得下一个拓扑构建多边形的起始弧段，并判断是否可以构建多边形
    //如果可以，用左转算法构建多边形并存入数组
    while (arcUse[pointA][pointC = topoPolys[topoPolys[0]][topoPolys[topoPolys[0]].length - 2]])
    {
        //分配内存并记录弧段
        topoPolys[++topoPolys[0]] = new Array();
        topoPolys[topoPolys[0]].push(pointA, pointC);
        arcUse[pointA][pointC] = 0;
        //生成当前弧段多边形，并存储到相应的数组中
        getNew = completePoly(pointA, pointC, points, arcUse, topoPolys[topoPolys[0]]);
        topoPolys[topoPolys[0]] = getNew[0];
        arcUse = getNew[1];    
    }

    return [topoPolys,arcUse];
}

//
function left(polyArray)
{
    var pointsArray = setPointXY(polyArray);            //获得点数组
    var P2P = setPoint2Point(pointsArray, polyArray);   //获得点关系数组
    var arcsArray = arcTran(P2P);                       //生成弧段数组
    var topoArray = new Array();                        //申明存储拓扑面的数组、当前存储拓扑面数
    topoArray[0] = 0;                                   //数组第一位用来存储当前构建多边形的数量

    //依次遍历所有顶点进行左转算法
    for (var pointCou = 1; pointCou <= pointsArray[0]; pointCou++)
    {
        //判断顶点的边是否全部遍历过，如果是，进行下一个定点
        var startArc = judgeArc(P2P, arcsArray, pointCou);
        if ( startArc == false)
            continue;
        
        //使用该弧段，并记录本次使用
        arcsArray[pointCou][startArc] = 0;
        //将弧段记录到多边形中
        topoArray[++topoArray[0]] = new Array();
        topoArray[topoArray[0]].push(pointCou, startArc);
        var tempdata = pointPolys(pointsArray, P2P, arcsArray, topoArray, pointCou, startArc);
        topoArray = tempdata[0];
        arcsArray = tempdata[1];
    }

    return topoArray;
}

var linesArray = setArray();
var polysArray = left(linesArray);
/*
var  duobianxing = [1,2,3,4,5,6,1];
var pointArray = new Array();
pointArray[0] = 6;
pointArray[1] = [1,3];
pointArray[2] = [2,2];
pointArray[3] = [2,1];
pointArray[4] = [0,0];
pointArray[5] = [1,1];
pointArray[6] = [0,2];
*/
//找到当前多边形的上下左右边界
function findAreaBorder(areaPoints, pointsArray)
{
    //设置横竖轴最大最小标志，以墨卡托投影的最大最小值为标志
    var maxX = -Infinity, maxY = -Infinity, minX = Infinity, minY = Infinity; 
    var pointNum = areaPoints.length; 
    var corX, corY;             //当前X，Y
    for (var j = 0; j < pointNum; j++)
    {
        corX = pointsArray[areaPoints[j]][0], corY = pointsArray[areaPoints[j]][1];
        minX = (corX < minX) ? corX: minX;
        maxX = (corX > maxX) ? corX: maxX;
        minY = (corY < minY) ? corY: minY;
        maxY = (corY > maxY) ? corY: maxY;
    }//for point j

    return [minX, maxX, minY, maxY];
}

//计算单个多边形的面积
function countEachArea(areaPoints, pointsArray)
{
    //获得当前多边形边界
    var areaBorder = findAreaBorder(areaPoints, pointsArray);
    var minX = areaBorder[0], maxX = areaBorder[1], minY = areaBorder[2], maxY = areaBorder[3];
    var corArea = 0;            //记录当前所计算的面积
    var pointsNum = areaPoints.length;      //当前多边形的点数
    //遍历所有点，根据梯形计算面积
    for ( var i = 0; i < pointsNum - 1; i++)
    {
        //获得点的坐标
        var x1 = pointsArray[areaPoints[i]][0], y1 = pointsArray[areaPoints[i]][1];
        var x2 = pointsArray[areaPoints[i + 1]][0], y2 = pointsArray[areaPoints[i + 1]][1];
        corArea += (((y2 - minY) + (y1 - minY)) * (x2 - x1)) / 2;
    }
    return corArea;
}

//计算所有多边形的面积
function countArea(topoArray, pointsArray)
{
    var areaArray = new Array();        //存储面积的数组
    for (var i = 1; i <= topoArray[0]; i++)
        areaArray[i - 1] = [i, countEachArea(topoArray[i], pointsArray)];
    return areaArray;
}

//将面积为正的多边形和面积为负的多边形分开并排序
function sortByarea(polysArea)
{
    //设置排序方式，按照面积绝对值从小到大排列
    function compByArea(a, b)
    {
        return (Math.abs(a[1]) > Math.abs(b[1]));
    }

    //给正负多边形分配数组内存
    var neAreaPoly = new Array();
    var conAreaPoly = new Array();

    //对数组证负进行分类
    var areaNum = polysArea.length;
    for (var i = 0; i < areaNum; i++)
    {
        if(polysArea[i][1] < 0)
            neAreaPoly.push(polysArea[i]);
        else
            conAreaPoly.push(polysArea[i]);
    }

    //处理负多边形，面积为负绝对值最大的多边形为图像的外侧，删除
    neAreaPoly.sort(compByArea).pop();
    //对正负数组进行排序并输出
    return [neAreaPoly, conAreaPoly.sort(compByArea)];
}

//判断一个点是否在多边形中
function judgePinA(point, area)
{
    var nCross = 0;         //记录当射线的于多边形的交点数
    var pointNum = area.length - 1;

    //通过水平射线，遍历多边形每一个点
    for (var i = 0; i < pointNum; i++)
    {
        //记录前后两个点
        var fPoint = area[i], nPoint = area[i + 1];
        //线是水平的，跳过
        if (fPoint[1] == nPoint[1])
            continue;
        //如果点在线段的上方或下方，跳过
        if (point[1] < (fPoint[1]<nPoint[1]? fPoint[1]: nPoint[1]))
            continue;
        if (point[1] > (fPoint[1]>nPoint[1]? fPoint[1]: nPoint[1]))
            continue;
        //判断横向是否于线段相交
        if (((point[1]-fpoint[1])*(npoint[0]-fpoint[0])/(npoint[1]-fpoint[1])+fpoint[0]) < point[0])
            nCross++
    }
    //通过相交次数判断是否在内
    if (nCross % 2 == 1)
        return true;
    else
        return false;
}

//判断多边形包含关系
//包含返回是，不包含返回否
function judgeContain(pointsArray, topoArray, areaArray, neAreaN, conAreaN)
{
    //判断面积是否符合
    if (-areaArray[neAreaN] > areaArray[conAreaN])
        return false;
    
    //判断外接矩形之间的关系
    //获得最小外接矩形
    var cR = findAreaBorder(topoArray[conAreaN], pointsArray);
    var nR = findAreaBorder(topoArray[neAreaN], pointsArray);
    //判断矩形是否相交或包含，不是返回否
    if((Math.abs(cR[0]+cR[1]-nR[0]-nR[1]) > (cR[1]-cR[0]+nR[1]-nR[0])) || (Math.abs(cR[2]+cR[3]-nR[2]-nR[3]) > (cR[3]-cR[2]+nR[3]-nR[2])));
        return false;
    
    //判断负多边形的所有点是否都在正多边形中
    var neAreaPN = topoArray[neAreaN] - 1;
    for (var i = 0; i < neAreaPN; i++)
        if (!judgePinA(topoArray[neAreaN][i], topoArray[conAreaN]))
            return false;

    return true;
}

//完成岛的判断并构建组合多边形
function judgeIs(polyArray, topoArray)
{
    var pointArray = setPointXY(polyArray);
    //计算每个多边形的面积
    var areaCountArray = countArea(topoArray, pointArray);
    //按照正负分类并排序
    var temp = sortByarea(areaCountArray);
    var neAreas = temp[0], conAreas = temp[1];
    var neAreaNum = neAreas.length, conAreaNum = conAreas.length;
    
    //将面积为负的多边形删除
    for (var i = 0; i <neAreaNum; i++)
        topoArray.splice(neAreaNum[i][0],1);
    topoArray[0] = topoArray.length - 1;
    //增加岛判断因子，0表示简单多边形，其他表示带岛多边形指向的岛
    for (var i = 1; i <= topoArray[0]; i++)
        topoArray.unshift(0);
    
    //如果没有面积为负的多边形，返回
    if (neAreaNum == 0)
        return topoArray;

    //判断包含关系
    for (var i = 0; i < neAreaNum; i++)
    {
        var nArea = neAreas[i][0];
        for (var j = 0; i < conAreaNum; i++)
        {
            cArea = conAreaNum[j][0];
            if (judgeContain(pointArray, topoArray, areaArray, nArea, cArea))
            {
                topoArray[cArea][0] = nArea;
                continue;
            }    
            
        }
    }
    return topoArray;
}

var aa = sortByarea(countArea(polysArray, setPointXY(linesArray)));
var ne = aa[0];
var con = aa[1];
//岛的判断



