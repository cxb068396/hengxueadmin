class Event {
  constructor() {
    this.list = [];
  }
  // 监听消息
  listen(key, fn) {
    if (!this.list[key]) {
      this.list[key] = [];
    }
    this.list[key].push(fn);
  }
  // 发布消息
  notify(key, ...args) {
    if (!this.list[key] || this.list[key].length == 0) {
      return;
    }
    this.list[key].forEach(fn => {
      fn(...args);
    });
  }
  // 删除消息
  remove(key, fn) {
    const fns = this.list[key];
    if (!fns) {
      return false;
    }
    if (!fn) {
      this.list[key] = [];
    } else {
      this.list[key] = this.list[key].filter(_fn => _fn !== fn);
      // for(let i = this.list[key].length;i>0;i++){
      //     if(this.list[key] === fn){
      //         this.list[key].splice(i,1)
      //     }
      // }
    }
  }
}

const eventCenter = {
  list: []
}

eventCenter.listen = function(key, fn){
  if (!this.list[key]) {
    this.list[key] = [];
  }
  this.list[key].push(fn);
}

eventCenter.notify = function(key, ...args){
  if (!this.list[key] || this.list[key].length == 0) {
    return;
  }
  this.list[key].forEach(fn => {
    fn(...args);
  });
}

eventCenter.remove = function(key, fn){
  const fns = this.list[key];
    if (!fns) {
      return false;
    }
    if (!fn) {
      this.list[key] = [];
    } else {
      this.list[key] = this.list[key].filter(_fn => _fn !== fn);
      // for(let i = this.list[key].length;i>0;i++){
      //     if(this.list[key] === fn){
      //         this.list[key].splice(i,1)
      //     }
      // }
    }
}

export default Event