//UTF-8
//左转算法构建多边形
//作者：10160311
//最后修改时间：2018.5.21

//设置数组实例
function setArray()
{
    /*
    //环状线测试数据
    var linesArray = new Array();
    linesArray[0] = 1;
    linesArray[1] = new Array(4);
    linesArray[1][0] = [130,200];
    linesArray[1][1] = [175,190];
    linesArray[1][2] = [150,180];
    linesArray[1][3] = [130,200];
    */
    //全部测试数据，包含3个岛
    var lineArray = new Array(12);
    lineArray[0] = lineArray.length - 1;
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
    lineArray[9] = new Array(4);
    lineArray[9][0] = [130,200];
    lineArray[9][1] = [175,190];
    lineArray[9][2] = [150,180];
    lineArray[9][3] = [130,200];
    lineArray[10] = new Array(4);
    lineArray[10][0] = [60,180];
    lineArray[10][1] = [40,190];
    lineArray[10][2] = [70,180];
    lineArray[10][3] = [60,180];
    lineArray[11] = new Array(4);
    lineArray[11][0] = [152,180];
    lineArray[11][1] = [176,190];
    lineArray[11][2] = [170,176];
    lineArray[11][3] = [152,180];

    return lineArray;
}


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
/***************************************** 
 *操作获得相关数组，输入数据为存储线的数组
 *获得点坐标数组、点点关系数组（一维、二维）
 *包括3个传出参数的函数和1个辅助判断函数
 ****************************************/
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
        for ( var j = 1; j  <= polyArray[0]; j++)
        {
            var position = judgePointIn(points[i], polyArray[j]);
            //当前线段不包含该点
            if (position < 0)   continue;
            //存在该点，加入该点下一个点与该点的联系
            //如果为环状，并且点为线段记录的0号点，记录0号点与其他点的联系
            if (polyArray[j][polyArray[j].length - 1][0] == polyArray[j][0][0] && polyArray[j][polyArray[j].length - 1][1] == polyArray[j][0][1] && position == 0)
                point2point[i].push(judgePointIn(polyArray[j][polyArray[j].length - 2],points));
            //判断当前点的前后连接
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


/***********************************************
 * 传入数据为点坐标数组、点点关系数组（一维、二维）
 * 获得左转拓扑构建的所有面并传出
 * 包括8个函数，只有1个函数的数据作为最终数据传出
 ***********************************************/
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

//左转算法，拓扑生成所有多边形
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


/**********************************************
 * 处理多边形的岛，传入数据为线数据、左转算法结果
 * 处理所有岛并合并
 * 包括10个函数，只有1个函数返回最终数组
 **********************************************/
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

//去除数组中前一部分的数组元素
function disArray(myArray)
{
    var end = myArray.length;
    var start = 0;
    for ( ; start < end; start++)
       if (myArray[start].length == undefined)
            break;
    
    return myArray.slice(start);
}

//判断一个点是否在多边形中
function judgePinA(pointsArray, pointN, area)
{
    var nCross = 0;         //记录当射线的于多边形的交点数
    var pointNum = area.length - 1;
    var point = pointsArray[pointN];

    //通过水平射线，遍历多边形每一个点
    for (var i = 0; i < pointNum; i++)
    {
        //记录前后两个点
        var fPoint = pointsArray[area[i]], nPoint = pointsArray[area[i + 1]];
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
    if (-areaArray[neAreaN - 1][1] >= areaArray[conAreaN - 1][1])
        return false;

    //判断多边形记录点的起始位置
    var conPoly = disArray(topoArray[conAreaN]);
    var nePoly = disArray(topoArray[neAreaN]);
    
    //判断外接矩形之间的关系
    //获得最小外接矩形
    var cR = findAreaBorder(conPoly, pointsArray), nR = findAreaBorder(nePoly, pointsArray);
    //判断矩形是否相交或包含，不是返回否
    if ((Math.abs(cR[0]+cR[1]-nR[0]-nR[1]) >= (cR[1]-cR[0]+nR[1]-nR[0])) || Math.abs(cR[2]+cR[3]-nR[2]-nR[3]) >= (cR[3]-cR[2]+nR[3]-nR[2]))
        return false;
    
    //判断负多边形的所有点是否都在正多边形中
    var neAreaPN = nePoly.length - 1;
    for (var i = 0; i < neAreaPN; i++)
        if (!judgePinA(pointsArray, nePoly[i], conPoly))
            return false;

    return true;
}

//查询负多边形对应的正多边形
function qArea(neArea, topoArray)
{
    var neAP = neArea.length;
    for (var i = 1; i <= topoArray[0]; i++)
    {
        var topoPoly = disArray(topoArray[i])
        if(topoPoly.length != neAP)
            continue;
        for (var j = 0; j < neAP; j++)
        {
            if (neArea[neAP-j-1] != topoPoly[j])    break;      //存在一个数不相等，结束
            if (j == neAP - 1)  return i;       //所有数都相等，返回多边形编号
        }
    }
}

//将岛多边形的数组指向岛多边形编号
function adjustTopo(topoArray)
{
    for (var i = 1; i <= topoArray[0]; i++)
    {
        var corPoly = topoArray[i];
        //不存在岛多边形，将岛判别标志设为0
        if(corPoly[0].length == undefined)    
        {
            topoArray[i].unshift(Array(0));
            continue;   
        }
        var temp = new Array();
        while (corPoly[0].length != undefined)
        {
            temp.push(qArea(corPoly[0], topoArray));
            corPoly.shift();
        }
        topoArray[i].unshift(temp);
    }
    return topoArray;
}

//完成岛的判断并构建组合多边形，如果第一位的长度不为0，那么多边形含岛
//返回添加岛后的数组
function judgeIs(polyArray, topoArray)
{
    var pointArray = setPointXY(polyArray);
    //计算每个多边形的面积
    var areaCountArray = countArea(topoArray, pointArray);
    //按照正负分类并排序
    var temp = sortByarea(areaCountArray);
    var neAreas = temp[0], conAreas = temp[1];
    var neAreaNum = neAreas.length, conAreaNum = conAreas.length;
    
    //如果没有面积为负的多边形，返回
    if (neAreaNum == 0)
        return adjustTopo(topoArray);

    //判断包含关系
    var deleteNArea = new Array();
    for (var i = 0; i < conAreaNum; i++)
    {   //遍历所有正多边形，查找含有岛的正多边形
        var cArea = conAreas[i][0];
        for (var j = 0; j < neAreas.length; j++)
        {   //遍历所有负多边形，查看当前多边形是否含有岛
            var nArea = neAreas[j][0];
            if (judgeContain(pointArray, topoArray, areaCountArray, nArea, cArea))
            {   //将负多边形加入正多边形，并在负多边形数组中删除该多变形
                topoArray[cArea].unshift(topoArray[nArea]);
                deleteNArea.push(nArea);
                neAreas.splice(j--, 1);
                continue;
            }//if
        }//for j
    }//for i

    //将面积为负的多边形删除
    function com(a, b) { return a<b;}
    deleteNArea.sort(com);
    for (var i = 0; i < deleteNArea.length; i++)
        topoArray.splice(deleteNArea[i],1);
    topoArray[0] = topoArray.length - 1;

    return adjustTopo(topoArray);
}
judgeIs(setArray(), left(setArray()));

/***********************************************
 * 绘制多边形拓扑结果和图形到网页
 * 传入数组为先数据和多边形数据，无传出
 * 包括5个函数，其中1个输出文本，4个绘制图形并标号
 ***********************************************/
//找到二维数组中所有点的边界
function findBorder(pointArray)
{
    var maxX = -Infinity, maxY = -Infinity, minX = Infinity, minY = Infinity; 
    var pointNum = pointArray.length;
    for (var i = pointArray[0].length == undefined? 0: 1; i < pointNum; i++)
    {
        var corX = pointArray[i][0], corY = pointArray[i][1];
        if (corX < minX)    minX = corX;
        if (corX > maxX)    maxX = corX;
        if (corY < minY)    minY = corY;
        if (corY > maxY)    maxY = corY;
    }
    return [minX, maxX, minY, maxY];
}
//绘制拓扑面
//绘制单个面
function drawPoly(polyPoints, pointArray, polyNum, pCanvas, dScale, yMax, color)
{
    //找到开始记录数据的下标
    var start = polyPoints.length == undefined? 0: 1;
    var pointNum = polyPoints.length;
    var poly = new Array();
    for (var i = start; i < pointNum; i++)
        poly.push(pointArray[polyPoints[i]]);
    pCanvas.fillStyle = color;                    //设置线色
    pCanvas.beginPath();
    pCanvas.moveTo(poly[0][0] * dScale, (yMax - poly[0][1]) * dScale + 100);
    for (var i = 0; i < pointNum - start; i++)
        pCanvas.lineTo(poly[i][0] * dScale, (yMax - poly[i][1]) * dScale + 100);
    pCanvas.closePath();
    pCanvas.fill();

    return ;
}
//标注多边形
function lablePoly(topoArray, pointArray, pCanvas, dScale, yMax)
{
    for (var i = 1; i <= topoArray[0]; i++)
    {
        var pointNum = topoArray[i].length;
        var start = topoArray[i].length == undefined? 0: 1;
        var poly = new Array();
        for (var j = start; j < pointNum; j++)
            poly.push(pointArray[topoArray[i][j]]);
        //找到多边形的边界
        var polyBorder = findBorder(poly);
        pCanvas.font = "20px 黑体";
        pCanvas.fillStyle = "black";
        pCanvas.fillText("A" + String(i), polyBorder[0] * dScale, (yMax - polyBorder[3] + 8) * dScale + 100);
    }
    return ;
}
//绘制所有面，并处理岛
function draw(topoArray, polyArray)
{
    //获得数据
    var points = setPointXY(polyArray);
    var border = findBorder(points);
    var dataWidth = border[1] - border[0], dataHeight = border[3] - border[2];
    //创建div
    var drawDiv = document.createElement("div")
    drawDiv.id = "drawDiv";
    document.getElementById("container").appendChild(drawDiv);
    //创建画布并加入到div
    var canvas = document.createElement("canvas");
    canvas.id = "myCanvas";
    canvas.width = drawDiv.offsetWidth, canvas.height = drawDiv.offsetHeight;
    drawDiv.appendChild(canvas);
    var drawCanvas = canvas.getContext("2d");
    drawCanvas.lineWidth = 2;                          //设置线宽

    //获得绘制比例尺
    var scale = canvas.width / (dataWidth + border[0]*2);
    //开始逐个多边形绘制
    //设置颜色数组
    var colors = ["red", "orange", "yellow", "green", "blue", "purple", "gray"];
    var recordIs = new Array();     //记录岛多边形
    for (var i = 1; i <= topoArray[0]; i++)
    {
        //如果多边形存在岛，将岛记录下来
        if (topoArray[i][0].length != 0) recordIs.push(topoArray[i][0]);
        //绘制多边形
        drawPoly(topoArray[i], points, i, drawCanvas, scale, border[3], colors[i%7]);
    }
    //重新绘制岛，岛的颜色统一为粉色
    for (var i = 0; i < recordIs.length; i++)
        for (var j = 0; j < recordIs[i].length; j++)
            drawPoly(topoArray[recordIs[i][j]], points, recordIs[i][j], drawCanvas, scale, border[3], "pink")
                
    //标注多边形
    lablePoly(topoArray, points, drawCanvas, scale, border[3]);

    return ;
}
//将结果显示到屏幕上
function showResult(polyArray)
{
    //创建div
    var writeDiv = document.createElement("div");
    writeDiv.id = "writeDiv";
    //创建文本
    var text = document.createElement("div");
    text.innerHTML = "左转算法结果:<br>";
    writeDiv.appendChild(text);
    //循环遍历数组，将数组中的数据输出
    for (var i = 1; i <= polyArray[0]; i++)
    {
        text = document.createElement("div");
        str = "  A" + i + ":";
        var corPoly = polyArray[i], pointNum = corPoly.length;
        if (corPoly[0].length != 0)
        {
            var temp = ""
            for (var j = 0; j < corPoly[0].length; j++)
                temp += String(corPoly[0][j]) + " ";
            str += "（含岛：" + temp + ")";
        }
        str += " " + corPoly[1];
        for (var j = 2; j < pointNum; j++)
            str += "->" + corPoly[j] + " ";
        text.innerHTML = str + "<br>";
        writeDiv.appendChild(text);
    }//for
    //将所有装入容器
    document.getElementById("container").appendChild(writeDiv);
    return ;
}