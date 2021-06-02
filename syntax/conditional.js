var args = process.argv;
console.log(args[2]);

console.log('A');
console.log('B');
if(args[2] === '1'){ //args 배열에서 2번째 입력값에 의해 true, false
  console.log('C1'); //true
} else {
  console.log('C2'); // false
}
console.log('D');