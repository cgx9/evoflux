"use strict";
var Promise = require('es6-promise').Promise;
var Dispatcher = require('./dispatcher');
var assign = require('object-assign');
/* Evoflux.createAction({
*    add:function(data){
*      return {
*        action:"action_type",／／必须有action或者actionType
*        data:data
*      }    
*    } 
*  })
*/ 
var Action = function(){
  this.__moduleName__ = "";
};
Action.prototype.__create__ = function(actions){
  for (var a in actions) {
    if(a === "mixins"){
      actions["mixins"].forEach(function(obj){
        if(typeof obj === "function"){
          assign(this, obj.prototype);
        }else{
          assign(this,obj);
        }
      }.bind(this))     
      continue
    }// add mixins support
    if(actions.hasOwnProperty(a)){
      this[a] = actions[a]
      // function(){
      //   Promise.resolve(actions[a].apply(this,arguments))//payload
      //     .then(function (payload) {
      //       console.log("this is action payload")
      //       return new Promise(function(resolve, reject){
      //         if(!payload){
      //           return reject();
      //         }
      //         if(!payload.actionType && !payload.action){
      //           setTimeout(function(){throw new Error("action must have a actionType or action")},0);
      //           return reject();
      //         }
      //         var action = payload.actionType || payload.action;
      //         if(this.__moduleName__){
      //           payload.action = this.__moduleName__ + '.'+ action;
      //         }//增加action的namespace，避免一个文件同时访问多个store时的action命名冲突。例如：“todo.add”
      //         Dispatcher.dispatch(payload);//发布事件
      //         resolve();
      //       }.bind(this));
            
      //     }.bind(this));
      // };
      
    }
  }//end for
  return this;
}
Action.prototype.dispatch = function(payload) {
  if(!payload.actionType && !payload.action){
      throw new Error("action must have a actionType or action");
    }
    var action = payload.actionType || payload.action;
    // delete payload.action;
    payload.action = action;
    delete payload.actionType;
    if(this.__moduleName__){
      payload.action = this.__moduleName__ + '.'+ action;
    }//增加action的namespace，避免一个文件同时访问多个store时的action命名冲突。例如：“todo.add”
    Dispatcher.dispatch(payload);//发布事件
};
module.exports = Action;