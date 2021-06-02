// 함수는 구문이면서 동시에 값이기도 한다.
//이런 특성을 이용하면 서로 연관되 데이터(변수)와 처리(함수)를 
//그룹핑해서 정리 정돈 가능
//소프트웨어의 복잡도를 낮출수있다.

var f = function(){
    console.log(1+1);
    console.log(1+2);
}
var a = [f];
a[0]();
   
var o = {
    func:f
}
o.func();