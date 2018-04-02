function antiMecProjectArith(x, y, B0, L0, a, b/*, e2, e_2*/)
{
    e2 = 1 - (b/a) * (b/a);
    e_2 = (a/b) * (a/b) - 1;
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