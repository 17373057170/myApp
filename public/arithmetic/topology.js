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




//判断角度大小，角度小于180°返回1，大于180°返回-1，等于180°返回0
function judgAngle(point0, point1, point2)
{
    var pos = (point0[1] - point1[0]) * point2[0] + (point1[0] - point0[0]) * point2[1] + point0[0] * point1[0]-point1[0] * point0[1];
    if (pos > 0)  return 1;
    else if (pos < 0) return -1;
    else    return 0;
}

//求算两条线之间的角度
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



var lineArray = setArray();
var pointArray = setPointXY(lineArray);
var P2P = setPoint2Point(pointArray, lineArray)
var angle = countAngle(pointArray[1], pointArray[P2P[1][0]], pointArray[P2P[1][1]])
return 0;
//读取跟文件，生成点对点表
//传入数组为