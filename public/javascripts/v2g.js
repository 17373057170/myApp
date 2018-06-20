//算法：        矢量栅格相互转换
//作者：        邓珣    10160311
//时间：        2018/6/17
//最后修改时间： 2018/6/20

//测试多边形数组
//building.gen的1、2、3多边形
function testArray()
{
    var backArray = new Array();
    backArray[1] = new Array();
    backArray[1].push(1);
    backArray[1].push([430137.63900004,3260528.88600003]);
    backArray[1].push([430127.56300002,3260540.18400004]);
    backArray[1].push([430134.534000025,3260546.40300003]);
    backArray[1].push([430143.465000056,3260536.388]);
    backArray[1].push([430144.259000049,3260537.09600004]);
    backArray[1].push([430146.314999992,3260534.76099995]);
    backArray[1].push([430141.894999973,3260530.88199998]);
    backArray[1].push([430141.002000041,3260531.88500005]);
    backArray[1].push([430137.63900004,3260528.88600003]);
    backArray[2] = new Array();
    backArray[2].push(2);
    backArray[2].push([430000,3260489.38812949]);
    backArray[2].push([430000.402000035,3260489.21299998]);
    backArray[2].push([430000,3260487.97710501]);
    backArray[2].push([430000,3260489.38812949]);
    backArray[3] = new Array();
    backArray[3].push(3);
    backArray[3].push([430106.436000005,3260495.85700006]);
    backArray[3].push([430104.854999955,3260497.26699997]);
    backArray[3].push([430106.947999946,3260499.54199995]);
    backArray[3].push([430108.542999986,3260497.98199994]);
    backArray[3].push([430106.436000005,3260495.85700006]);
    backArray[0] = 3;
    return backArray;
}

//颜色数组
var colorList = ["LightPink", "Green", "LightYellow", "Orchid", "LightSteelBlue", "MediumPurple", "SlateGray", "Blue", "Aqua", "Olive", "Orange", "Red"]

/***********************************
 * 通过x-扫描线算法，将矢量转为栅格
 * 主要通过9个函数 绘下不绘上
 ***********************************/
//获得所有多边形过或当前多边形的边界
function findborder(polyArray)
{
    //判断当前传入的为单个或多个多边形，并进行转换
    var polys = polyArray[1].length == 2? polys = [1, polyArray]: polyArray;
    var minX = Infinity, maxX = -Infinity, minY = Infinity, maxY = -Infinity;
    //遍历所有多边形，找到边界
    for (var i = 1; i <= polys[0]; i++)
    {
        var poly = polys[i], polyPoints = poly.length;
        for (var j = 1; j < polyPoints; j++)
        {
            minX = minX < poly[j][0]? minX: poly[j][0];
            maxX = maxX > poly[j][0]? maxX: poly[j][0];
            minY = minY < poly[j][1]? minY: poly[j][1];
            maxY = maxY > poly[j][1]? maxY: poly[j][1];
        }
    }
    return [minX, maxX, minY, maxY];        //传出结果
}

//将原始坐标减去边界坐标，并根据栅格的大小获得转换栅格的坐标
function moveCoord(polyArray, borderArray, gridSize)
{
    //遍历所有多边形的所有点，完成坐标转换
    for (var i = 1; i <= polyArray[0]; i++)
    {
        var polyPoints = polyArray[i].length;
        for (var j = 1; j < polyPoints; j++)
        {
            polyArray[i][j][0] = parseInt((polyArray[i][j][0] - borderArray[0]) / gridSize) + 1;
            polyArray[i][j][1] = parseInt((polyArray[i][j][1] - borderArray[2]) / gridSize) + 1;
            //如果两个点经过计算重合，将一个点去除
            if (j != 1 && (polyArray[i][j][0] == polyArray[i][j - 1][0] && polyArray[i][j][1] == polyArray[i][j - 1][1]))
            {
                polyArray[i].splice(j--, 1);
                polyPoints--;
            }
        }
        //如果一个多边形的边数不超过两条边，将该多边形删除
        if (polyArray[i].length <= 4)
        {
            polyArray.splice(i--, 1);
            polyArray[0]--;
        }
    }
    return polyArray;
}

//定义边表桶的排序方式
function sortET(a, b)
{
    if (a[0] != b[0])
        return a[0] > b[0];
    else 
        return a[2] > b[2];
}

//通过点数据，生成边表
function createET(eachPArray, polyBorder)
{
    var polyPoints = eachPArray.length;             //当前多边形点的个数
    //构建边表数组并初始化
    var ETLen = polyBorder[1] - polyBorder[0] + 2;
    var ET = new Array(ETLen);  
    for (var i = 1; i < ETLen; i++)
    {
        ET[i] = new Array();
        ET[i].push(i + polyBorder[0] - 1);
    }
    ET[0] = ETLen - 1;
    //遍历所有扫描线构建边表
    for (var i = 1; i <= ET[0]; i++)
    {
        for (var j = 1; j < polyPoints; j++)
        {
            //如果线段的起点不在当前扫描线上，跳过
            if (eachPArray[j][1] != ET[i][0])  continue;
            //在当前扫描线上，搜索线段的端点加入边表，遍历前后端点，只将向上的线段加入
            //如果线段为水平，删除点
            if ((j - 1 != 0) && (eachPArray[j - 1][1] >= eachPArray[j][1]) && (eachPArray[j][1] != eachPArray[j - 1][1]))
                ET[i].push([eachPArray[j][0], eachPArray[j - 1][1],
                    (eachPArray[j][0] - eachPArray[j - 1][0])/(eachPArray[j][1] - eachPArray[j - 1][1])]);
            if ((j + 1 != polyPoints) && (eachPArray[j + 1][1] > eachPArray[j][1]) && (eachPArray[j][1] != eachPArray[j + 1][1]))
                ET[i].push([eachPArray[j][0], eachPArray[j + 1][1],
                    (eachPArray[j][0] - eachPArray[j + 1][0])/(eachPArray[j][1] - eachPArray[j + 1][1])]);
        }
    }
    //将每个桶中的边进行排序
    for (var i = 1; i < ET[0]; i++)
        ET[i].sort(sortET);
    return ET;
}

//构建存储栅格的数组并赋值为背景值
//第一位存储栅格的大小
function createGridArray(gHeight, gWidth)
{
    var grids = new Array(gHeight + 1);
    for (var i = 1; i <= gHeight; i++)
    {
        grids[i] = new Array(gWidth + 1);
        for (var j = 0; j <= gWidth; j++)
            grids[i][j] = 0;
    }
    grids[0] = [gHeight, gWidth];
    return grids;
}

//将一条扫描线上的点进行转换
function fillGrid(AET, grid, polyCode)
{
    //将当前活性边表的数据转为栅格
    var inPoint = AET.length;
    for (var i = 1; i < inPoint; i += 2)
    {
        var start = parseInt(AET[i][0]);
        var end = parseInt(AET[i + 1][0]) - ((AET[i + 1][0] == parseInt(AET[i + 1][0]))? 1: 0);
        //相邻两个点之间没有间隔，进行下一个相邻判断
        if(start > end)
            continue;
        //相邻两个点之间有间隔，进行填充
        for (var j = start; j <= end; j++)
            grid[AET[0]][j] = polyCode;
    }
    return grid;
}

//通过扫面线和活性边算法，将单个多边形转换为栅格数据
//绘上不绘下，绘左不绘右
function transEachPoly2Grid(eachPArray, gridArray)
{
    var pBorder = findborder(eachPArray).slice(2,4);    //找到当前多边形的上下边界
    var ET = createET(eachPArray, pBorder);             //构造边表
    var AET = new Array();                              //构建活性边表，并赋初值
    //利用活性边表遍历边表，将两个点之间的间隔填充为多边形
    for (var i = 1; i <= ET[0]; i++)
    {
        //为活性边表添加数据
        AET = AET.concat(ET[i].slice(1));       //将边表中该扫描线新增线段添加进来
        AET.sort(sortET);                       //将所有线段进行排序
        AET.unshift(ET[i][0]);                  //添加扫描线信息
        if (AET[1] == undefined)    break;      //扫描线上没有内容，结束转换
        gridArray = fillGrid(AET, gridArray, eachPArray[0]);   //进行栅格转换
        //判断是不是到了顶点，如果与扫描线继续相加，加入下一组活性边表，否则删除
        for (var j = 1; j < AET.length; j++)
            if (AET[0] + 1 == AET[j][1])    //如果扫描线到此为止，将该线段从活性边表中删除
                AET.splice(j--, 1);
            else                            //扫描线继续相交，将X坐标进行变换
                AET[j][0] = AET[j][0] + AET[j][2];
        //将扫面线信息去除
        AET.shift();
    }
    return gridArray;
}

//重新对多边形进行移动，消除已经删除的多边形的影响
function remove(polys, border)
{
    var butt =  border[0] - 1, left = border[2] - 1;
    for (var i = 1; i <= polys[0]; i++)
    {
        var pointNum = polys[i].length;
        for (var j = 1; j < pointNum; j++)
        {
            polys[i][j][0] -= butt;
            polys[i][j][1] -= left;
        }
    }
    return polys
}

//遍历所有多边形，将其转为栅格
function transPoly2Grid(polys)
{
    var border = findborder(polys);
    //重新对多边形进行移动，消除已经删除的多边形的影响
    if (border[0] != 1 || border[2] != 1)
    {
        remove(polys, border);
        border = findborder(polys);
    }
    //构建栅格数组
    var grids = createGridArray(border[3] - border[2] + 1, border[1] - border[0] + 1);
    //遍历所有多边形，生成栅格数据
    for (var i = 1; i <= polys[0]; i++)
        grids = transEachPoly2Grid(polys[i], grids);
    return grids;
}

//算法调试
//var polys = testArray();
//var grid = transPoly2Grid(moveCoord(polys, findborder(polys), 0.5));
//var a = 0;

/*******************************
 * 绘制矢量和栅格图像
 * 栅格绘制为等大的正方形的填充
 *******************************/
//绘制所有闭合曲线
function drawPolys(polys, pCanvas)
{
    //遍历所有多边形并绘制
    for (var i = 1; i <= polys[0]; i++)
    {
        var poly = polys[i], pointNum = poly.length;
        pCanvas.strokeStyle = colorList[i % 12];
        pCanvas.beginPath();
        pCanvas.moveTo(poly[1][0], poly[1][1]);
        for (var j = 2; j < pointNum; j++)
            pCanvas.lineTo(poly[j][0], poly[j][1]);
        pCanvas.closePath();
        pCanvas.stroke();
    }
}

//绘制矢量图像
function drawVector(polyArray)
{
    //找到当前地图边界
    var border = findborder(polyArray);
    var dataWidth = border[1] - border[0], dataHeight = border[3] - border[2];
    //创建div和画布
    var drawDiv = document.createElement("div");
    drawDiv.id = "vectorDiv";
    document.getElementById("container").appendChild(drawDiv);
    //定义div高度
    drawDiv.style.height = dataHeight * (drawDiv.offsetWidth / dataWidth) + "px";
    //创建canvas并定义长宽
    var canvas = document.createElement("canvas");
    canvas.id = "myCanvas";
    drawDiv.appendChild(canvas);
    canvas.width = drawDiv.offsetWidth, canvas.height = drawDiv.offsetHeight
    var drawCanvas = canvas.getContext("2d");       //获得绘制句柄
    //获得绘制比例尺
    var scale = (canvas.width - 20) / dataWidth;    //左右各留10px边界

    //处理绘制坐标系
    //缩小画布比例尺，并翻转画布，使坐标原点位于画布左下角，并与边界上下留出间隔
    drawCanvas.translate(5, canvas.height * (1 - 10/canvas.width));
    drawCanvas.scale(scale, -scale);
    //移动坐标系，使绘制从最小值开始
    drawCanvas.translate(-border[0], -border[2]);     
    
    //绘制多边形
    drawPolys(polyArray, drawCanvas);
}

//遍历矩阵，绘制栅格
function drawCells(grids, pCanvas)
{
    for (var i = 1; i <= grids[0][0]; i++)
        for (var j = 1; j <= grids[0][1]; j++)
            if (grids[i][j] != 0)
            {
                pCanvas.fillStyle = colorList[grids[i][j] % 12];        //设置绘制颜色
                pCanvas.fillRect(j ,i , 1, 1);
            }
}

//绘制栅格图像
function drawGrid(gridArray)
{
    //当前栅格大小
    var dataWidth = gridArray[0][1], dataHeight = gridArray[0][0];
    //创建div和画布
    var drawDiv = document.createElement("div");
    drawDiv.id = "gridDiv";
    document.getElementById("container").appendChild(drawDiv);
    //定义div高度
    drawDiv.style.height = dataHeight * (drawDiv.offsetWidth / dataWidth) + "px";
    //创建canvas并定义长宽
    var canvas = document.createElement("canvas");
    canvas.id = "myCanvas";
    drawDiv.appendChild(canvas);
    canvas.width = drawDiv.offsetWidth, canvas.height = drawDiv.offsetHeight
    //获得绘制比例尺
    var scale = (canvas.width - 20) / dataWidth;    //左右各留10px边界

    //处理绘制坐标系
    var drawCanvas = canvas.getContext("2d");       //获得绘制句柄
    //缩小画布比例尺，并翻转画布，使坐标原点位于画布左下角，并与边界上下留出间隔
    drawCanvas.translate(5, canvas.height * (1 - 10/canvas.width));
    drawCanvas.scale(scale, -scale);
    //drawCanvas.translate(-border[0], -border[2]);     
    
    //绘制栅格
    drawCells(gridArray, drawCanvas);
}

/*******************************
 * 处理拓扑得到的多边形数据
 * 将岛删除，并将点号换为点坐标
 *******************************/
//处理拓扑数据
function dealTopo(topoArray, points)
{
    //将第一个存储岛数据的数组删除并增加多边形编号，并将点号换为坐标
    for (var i = 1; i <= topoArray[0]; i++)
    {
        topoArray[i][0] = i;
        var pointNum = topoArray[i].length;
        for (var j = 1; j < pointNum; j++)
            topoArray[i][j] = points[topoArray[i][j]].slice(0,2);        
    }
    return topoArray;
}

/**********************
 * 算法与网页交互部分
 * 通过按钮读取文件，并将文件内容转换为字符串形式
 * 将字符串数据转换为数组数据，并对数据进行操作并绘制
 **********************/
/*
//将从网页中读取的字符串转换为数组形式
function polyStr2polyXY(polyStr)
{
    var lineNum = 1;                    //记录已经读取行数
    var polyXY = new Array();  
    var strs = polyStr.split("\n");     //设置分割
    for (var i = 0; i <= strs.length ;i++)
    {
        if( i == 0)   //为第一条线增加存储空间
        {
            polyXY[lineNum] = new Array();
            polyXY[lineNum].push(parseInt(strs[i++])); //多边形的标号
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
                polyXY[lineNum].push(parseInt(strs[i + 1])); //多边形的标号
                i += 2;
            }
        }

        //将该点记录进入数组
        var XY = strs[i].split(',');
        polyXY[lineNum].push([parseFloat(XY[0]), parseFloat(XY[1])]);       //分配存储空间
    }//for
}
*/
//读取文件并并进行相关操作
function readFile()
{  
    var polyFile = document.getElementById("openMapFile").files[0];  //获取文件
    var reader = new FileReader();  
    reader.readAsText(polyFile);  
    reader.onload=function(e)
    {
        var polys = polyStr2polyXY(this.result);                //将读取的数据转换为字符串形式
        var topoPoly = judgeIs(polys, left(polys))      //拓扑得到多边形
        topoPoly = dealTopo(topoPoly, setPointXY(polys))    //处理拓扑数据
        var grid = transPoly2Grid(moveCoord(topoPoly, findborder(topoPoly), 0.5))              //转为栅格形式
        drawVector(topoPoly);          //绘制矢量数据
        drawGrid(grid);             //绘制栅格数据
    }
}