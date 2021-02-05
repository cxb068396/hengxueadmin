//这里需要引入vuex
//  import store from './store';

let wsConnection = {
  $ws: null,
  lockReturn: false,
  timeout: 60 * 1000 * 5,
  timeoutObj: null,
  timeoutNum: null,
  serverTimeoutObj: null,
  path: "",
  maxLink: 5,  // 最大重连次数
  currentLink: 1,
  cb: null,
  //初始化webSocket长连接
  initWebSocket: function(path, cb) {
    const baseUrl = process.env.VUE_APP_WS_API;
    this.$ws = new WebSocket(baseUrl + path);
    this.$ws.onopen = this.wsOpen;
    this.$ws.onclose = this.wsClose;
    this.$ws.onmessage = msg => {
      this.wsMsg;
      cb && cb(msg);
    }
    this.$ws.onerror = this.wsError;
    this.path = path;
    this.cb = cb
  },
  //打开websocket
  wsOpen: function(e) {
    //开始websocket心跳
    wsConnection.startWsHeartbeat();
    //  console.log('ws success')
  },
  wsClose: function(e) {
    console.log(e, "ws close");
  },
  wsMsg: function(msg) {
    //每次接收到服务端消息后 重置websocket心跳
    wsConnection.resetHeartbeat();
  },
  wsError: function(err) {
    //  console.log(err, 'ws error');
    wsConnection.reconnect();
  },
  //重启websocket
  reconnect: function() {
    let _this = this;
    if (_this.lockReturn) {
      return;
    }
    if (_this.currentLink >= _this.maxLink) {
      return;
    }
    _this.lockReturn = true;
    _this.currentLink++;
    _this.timeoutNum && clearTimeout(_this.timeoutNum);
    _this.timeoutNum = setTimeout(function() {
      _this.initWebSocket(_this.path, _this.cb);
      _this.lockReturn = false;
    }, 3000);
  },
  startWsHeartbeat: function() {
    let _this = this;
    _this.timeoutObj && clearTimeout(_this.timeoutObj);
    _this.serverTimeoutObj && clearTimeout(_this.serverTimeoutObj);
    _this.timeoutObj = setInterval(function() {
      //判断websocket当前状态
      if (_this.$ws.readyState != 1) {
        _this.reconnect();
      }
    }, _this.timeout);
  },
  //重置websocket心跳
  resetHeartbeat: function() {
    let _this = this;
    clearTimeout(_this.timeoutObj);
    clearTimeout(_this.serverTimeoutObj);
    _this.startWsHeartbeat();
  }
};

//抛出websocket对象
export default wsConnection;
