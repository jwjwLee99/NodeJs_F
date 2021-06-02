// var members = ['JW', 'JLee', 'WWJ'];
// console.log(members[1]); // JLee
 
// var roles = {
//   'programmer':'JW',
//   'designer' : 'JLee',
//   'manager' : 'WWJ'
// }
// console.log(roles.designer); //JLee

var members = ['JW', 'JLee', 'WWJ'];
console.log(members[1]); //JLee
var i = 0;
while(i < members.length){
  console.log('array loop', members[i]);
  i = i + 1;
}
 
var roles = {
  'programmer':'JW',
  'designer' : 'JLee',
  'manager' : 'WWJ'
}
console.log(roles.designer); //JLee
console.log(roles['designer']); //JLee
 
for(var n in roles){ // n == 객체의 식별자 (key)
  console.log('object => ', n, 'value => ', roles[n]);
}