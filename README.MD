# evoflux  

## Installation
```javascript
npm install evoflux
```
you must have browserify and it does not support amd.  
需要使用browserify,目前暂不支持amd。

# Demo

## view:  
```javascript
var React = require("react");
var Store = require("../stores/storedemo");
var ComponentDemo = require("../components/componentdemo");
var Actions = require("../actions/actiondemo");
var ViewDemo = React.createClass({
  getInitialState:function(){
    return {data:{title:"demo title"}};
  },
  componentDidMount: function() {
    Store.addChangeListener(function(data) {
      this.setState({
        data: data
      });
    }.bind(this));
  },
  handleChange:function(e){
    Actions.changeTitle(e.target.value);
  },
  render: function() {
    return (
      <ComponentDemo title={this.state.data.title} handleChange={this.handleChange} />
    );
  }

});
module.exports = ViewDemo;
```
view只需添加Store的监听，调用action的方法即可。

## action(actiondemo.js)：
```javascript
var Evoflux = require('evoflux');
module.exports = Evoflux.createAction("demo",{
  changeTitle:function(newTitle){
    superagent.get("url")
      .end(function(err,res){
        this.dispatcher({
          action: "changeTitle",
          data: newTitle
        })
    }.bind(this))
  }
})
```
this parameters "demo" is namespace and can ignore.  
第一个参数不是必须，它是作为命名空间使用。方法里必须有名为action或actionType的属性。

## store(storedemo.js)：
```javascript
var Evoflux = require('evoflux');
module.exports = Evoflux.createStore("demo",{
  init:function(){
    this.data={
      title:"default title"
    }
    this.triggerTo={
      action2:"update"
    }
  },
  addChangeListener:function(cb){
    this.on(this.changeEvent,function(){
      cb(this.data);
    }.bind(this));
  },
  actions:{
    changeTitle:function(data){
      this.data.title = data.data;
    },
    action2:function(data){
      this.data = data.data;
    }
  }
})
``` 
当store需要监听其他store对应的的action时，给actions里的方法加命名空间。如： 
```javascript
actions:{
    "otherNameSpace.changeTitle":function(data){
      this.data.title = data.data;
    }
  }
```

this parameters "demo" must be same as createAction; actions.demo_changeTitle name must be  same as action value for createAction.  
第一个参数是作为命名空间使用，需要与createAction一致。store的actions里的方法对应createAction里的方法，方法名必须与createAction里方法里的action的值一致。当调用action的方法时，stores里actions下与它值一样名称的方法也会触发执行。 
actions里的方法默认会触发store的change事件，如果需要触发特定的事件，需要配置在this.triggerTo。key为action名，value为事件名。 勿在actions里的方法直接写this.emit或this.trigger。
store里可用的事件方法：this.on(event,cb)、this.off(event,cb)、this.offAll()