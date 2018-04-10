//道格拉斯数据压缩
//计算点到线的距离
function lenPoint2Line(targetPoint, originPoint, terminusPoint)
{
    //原始数据点坐标
    var paX = targetPoint[0], paY = targetPoint[1];
    var pbX = originPoint[0], pbY = originPoint[1];
    var pcX = terminusPoint[0], pcY = terminusPoint[1];

    //线段的长度
    var L = Math.sqrt((pbX - pcX)*(pbX - pcX) + (pbY - pcY)*(pbY - pcY));
    //计算判断点与线位置的参数
    var r = ((pbY - paY)*(pbY - pcY) - (pbX - paX)*(pcX - pbX)) / (L*L);
    //目标点在直线上投影点的位置
    var px = pbX + r*(pcX - pbX), py = pbY + r*(pcY - pbY);
    //点到投影点的距离
    var distance = Math.sqrt((px - paX)*(px - paX) + (py - paY)*(py - paY));

    return distance;
}

point1 = new Array(1,5);
point2 = new Array(0,1);
point3 = new Array(2,1);
var d = lenPoint2Line(point1, point2, point3);
console.log(d);
