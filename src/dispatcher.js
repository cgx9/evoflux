"use strict";
//source code from:bleeding-edge-sample-app
var Dispatcher = function(){
  this.handlers = [];
  this.isDispatching = false;
  this.pendingPayload = null;
}

Dispatcher.prototype.register = function(cb) {
  this.handlers.push({
    isPending:false,
    isHandled:false,
    callback:cb
  });
};

Dispatcher.prototype.dispatch = function(payload) {
  if(this.isDispatching){
    throw new Error("cannot dispatch");
  }
  this.handlers.forEach(function(handler){
    handler.isPending = false,
    handler.isHandled = false
  })
  this.pendingPayload = payload;
  this.isDispatching = true;//准备开始调度
  try{
    this.handlers.forEach(function(handler){
      if(!handler.isPending){
        handler.isPending = true;
        handler.callback(payload);
        handler.isHandled = true;
      }
    })
  }finally{
    this.isDispatching = false;
    this.pendingPayload = null;
  }
};
module.exports = new Dispatcher();