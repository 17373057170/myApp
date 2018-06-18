//算法：        矢量栅格相互转换
//作者：        邓珣    10160311
//时间：        2018/6/17
//最后修改时间： 2018/6/17

//测试多边形数组
//building.gen的1、2多边形
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
    backArray[2].push([430106.436000005,3260495.85700006]);
    backArray[2].push([430104.854999955,3260497.26699997]);
    backArray[2].push([430106.947999946,3260499.54199995]);
    backArray[2].push([430108.542999986,3260497.98199994]);
    backArray[2].push([430106.436000005,3260495.85700006]);
    backArray[0] = 2;
    return backArray;
}

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
            //在当前扫描线上，搜索线段的端点加入边表
            //遍历前后端点，只将向上的线段加入
            if ((j - 1 != 0) && (eachPArray[j - 1][1] >= eachPArray[j][1]))
                ET[i].push([eachPArray[j][0], eachPArray[j - 1][1],
                    (eachPArray[j][0] - eachPArray[j - 1][0])/(eachPArray[j][1] - eachPArray[j - 1][1])]);
            if ((j + 1 != polyPoints) && (eachPArray[j + 1][1] > eachPArray[j][1]))
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
        gridArray = fillGrid(AET, gridArray, eachPArray[0]);   //进行栅格转换
        var inPoint = AET.length;               //相交线段数
        //判断是不是到了顶点，如果与扫描线继续相加，加入下一组活性边表，否则删除
        for (var j = 1; j < inPoint; j++)
            if (AET[0] + 1 == AET[j][1])    //如果扫描线到此为止，将该线段从活性边表中删除
            {
                AET.splice(j--, 1);
                inPoint--;
            }
            else                        //扫描线继续相交，将X坐标进行变换
                AET[j][0] = AET[j][0] + AET[j][2];
        //将扫面线信息去除
        AET.shift();
    }
    return gridArray;
}

//遍历所有多边形，将其转为栅格
function transPoly2Grid(polys)
{
    var border = findborder(polys);
    var grids = createGridArray(border[3] - border[2] + 1, border[1] - border[0] + 1);
    //遍历所有多边形
    for (var i = 1; i <= polys[0]; i++)
        grids = transEachPoly2Grid(polys[i], grids);
    return grids;
}
//var polys = moveCoord(testArray(), findborder(testArray()), 0.5);
//transPoly2Grid(polys)
/**********************
 * 算法与网页交互部分
 **********************/
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
            polyXY[lineNum].push(parseInt(str[i++])); //多边形的标号
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
                polyXY[lineNum].push(parseInt(str[i + 1])); //多边形的标号
                i += 2;
            }
        }

        //将该点记录进入数组
        var XY = strs[i].split(',');
        polyXY[lineNum].push([parseFloat(XY[0]), parseFloat(XY[1])]);       //分配存储空间
    }//for
}
//读取文件并并进行相关操作
function readMapFile()
{  
    var polyFile = document.getElementById("openMapFile").files[0];  //获取文件
    var reader = new FileReader();  
    reader.readAsText(polyFile);  
    reader.onload=function(e)
    {
        var polys = polyStr2polyXY(this.result);      //将读取的数据转换为字符串形式
        var grid = transPoly2Grid(polys)              //转为栅格形式
        draw(grid);                                     //绘制栅格
        //var exPolys = allAreaLines(polyArray[drawSign++]);    //获得的纹理绘制数据的多边形数据
    }
}
