const mul=(x)=>{
  return (y)=>x*y
}
const double=mul(5)
console.log(double(10))
const arr=[1,5,4,6,4]
function f(str,n){
  let arr=[]
  for (i in str){
    arr.push(str[i].repeat(n))
  }
  return arr.join('')
}
console.log(f('ABC',2))