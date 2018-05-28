//四叉树坐标算法
//给定矩阵
corMatrix = [[1, 1, 1, 1, 2, 2, 3, 3],[1, 1, 1, 1, 2, 2, 3, 3],[1, 1, 1, 1, 4, 4, 5, 5],[1, 1, 1, 1, 4, 4, 5, 5],
[6, 6, 7, 8,13,13,14,14],[6, 6, 9,10,13,13,14,14],[11,11,12,12,15,16,19,19],[11,11,12,12,17,18,19,19]];
//行列增加规则
ruleIJ = [[0, 0], [0, 1], [1, 0], [1, 1]]

//整型前补位0
function setZero(num, n)
{
    return (Array(n).join(0) + num).slice(-n); 
}
//通过横纵坐标计算位置的编号，传入坐标为十进制
function countNumber(Id, Jd)
{
    var Ib = parseInt(Id).toString(2), Jb = parseInt(Jd).toString(2);
    var numberlen = (Ib.length > Jb.length)? Ib.length: Jb.length;
    var numberArray =  new Array(), number = "";
    
    //将缺少的位数补位0
    Ib = setZero(Ib, numberlen), Jb = setZero(Jb, numberlen);
    //逐位相加，计算地址
    for (var i = 0; i <numberlen; i++)
        number += (parseInt(Ib[i] * 2) + parseInt(Jb[i])).toString();
    return number;
}

//判断当前区域中的元素是不是全部相等
function judgeEqual(startI, startJ, diGradNum)
{
    var standard = corMatrix[startI][startJ];
    for (var i = 0; i < diGradNum; i++)
    {
        for (var j = 0; j < diGradNum; j++)
            if (corMatrix[startI + i][startJ + j] != standard) return false;
    }
    return true;
}

//分割当前矩阵
function divisionMatrix(resultArray, startI, startJ, areaGradNum, depth)
{
    //矩阵不能再分割，直接返回当前方块
    if (areaGradNum == 1)
    {
        resultArray.push({address:countNumber(startI, startJ), depth:depth, num:corMatrix[startI][startJ]}); 
        return resultArray;
    }

    var diGradNum = areaGradNum / 2;                    //分割单区域格网数
    
    //四个方向分割当前区域
    for (var rule = 0; rule < 4; rule++)
    {
        //当前区域起始位置
        var corStartI = startI + diGradNum * ruleIJ[rule][0];
        var corStartJ = startJ + diGradNum * ruleIJ[rule][1];
        //判断当前一个区域是否值全部相同
        if (judgeEqual(corStartI, corStartJ, diGradNum))
            resultArray.push({address:countNumber(corStartI / diGradNum, corStartJ / diGradNum), depth:depth, num:corMatrix[corStartI][corStartJ]}); 
        else
        {
            divisionMatrix(resultArray, corStartI, corStartJ, diGradNum, depth + 1);
        }
    }
    return resultArray;
}

//morton地址反算
function antiAddress(address)
{
    var strLen = address.length;
    var Ib = "", Jb = "";
    for (var n = 0; n < strLen; n++)
    {
        switch(parseInt(address[n]))
        {
            case 0:
                Ib += "0", Jb += "0";
                break;          
            case 1:
                Ib += "0", Jb += "1";
                break;
            case 2:
                Ib += "1", Jb += "0";
                break;
            case 3:
                Ib += "1", Jb += "1";
                break;
        }
    }//for

    return Array(parseInt(Ib,2).toString(10), parseInt(Jb, 2).toString(10));
}

//将morton码还原为一般矩阵
function antiMorton(aaa)
{
    var temp = new Array();
    for (var i = 0; i < 8; i++)
    {
        temp[i] = new Array(8);
    }
    var len = aaa.length;
    var big = 8;
    for (var i = 0; i < len; i++)
    {
        var XY = antiAddress(aaa[i].address);
        var areaBig = big/(Math.pow(2,aaa[i].depth));
        var x = XY[0]* areaBig;
        var y = XY[1]* areaBig;
        var number = aaa[i].num;
        for (var j = 0; j < areaBig; j++)
        {
            for (var m = 0; m < areaBig; m++)
                temp[x+j][y+m] = number;
        }
    }
    return temp;
}
//console.log(Math.log(n)/Math.log(2))
var resultArray = new Array();
var ab = divisionMatrix(resultArray, 0, 0, corMatrix.length, 1)
for (var i = 0; i < ab.length; i++)
    console.log(ab[i])
var a = antiAddress(ab[4].address)
console.log(a[0], a[1])
var temp = antiMorton(ab)
for (var i = 0; i < temp.length; i++)
    console.log(temp[i])

