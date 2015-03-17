"use strict";
var Promise = require('es6-promise').Promise;
var Dispatcher = require('./dispatcher');
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
    if(actions.hasOwnProperty(a)){
      this[a] = function(){
        Promise.resolve(actions[a].apply(this,arguments))//payload
          .then(function (payload) {
            return new Promise(function(resolve, reject){
              if(!payload){
                return reject();
              }
              if(!payload.actionType && !payload.action){
                setTimeout(function(){throw new Error("action must have a actionType or action")},0);
                return reject();
              }
              var action = payload.actionType || payload.action;
              if(this.__moduleName__){
                payload.action = this.__moduleName__ + '.'+ action;
              }//增加action的namespace，避免一个文件同时访问多个store时的action命名冲突。例如：“todo.add”
              Dispatcher.dispatch(payload);//发布事件
              resolve();
            }.bind(this));
            
          }.bind(this));
      };
      
    }
  }//end for
  return this;
}
module.exports = Action;
