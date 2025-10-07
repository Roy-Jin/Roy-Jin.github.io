export default function debounce(fn,wait = 500,isImmediate = true){
  let timerId = null;
  let flag = true;
  if(isImmediate){
    return function(){
      clearTimeout(timerId);
      if(flag){
        fn.apply(this,arguments);
        flag = false
        }
      timerId = setTimeout(() => { flag = true},wait)
    }
  }
  return function(){
    clearTimeout(timerId);
    timerId = setTimeout(() => {
      fn.apply(this,arguments)
    },wait)
  }
}