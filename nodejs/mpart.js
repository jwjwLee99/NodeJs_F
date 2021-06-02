// 모듈 : 많아진 코드를 정리 정돈하는 가장 큰 도구

var M = {
    v:'v',
    f:function(){
      console.log(this.v);
    }
}

M.f();
module.exports = M;