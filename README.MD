## action：##
```javascript
var Evoflux = require('evoflux');
module.exports = Evoflux.createAction("demo",{
  changeTitle:function(newTitle){
    return {
      action: "changeTitle",
      data: newTitle
    }
  }
})
```
this parameters "demo" is namespace and can ignore.

store：
```javascript
var Evoflux = require('evoflux');
module.exports = Evoflux.createStore("demo",{
  init:function(){
    this.data={
      title:"default title",
      subtitle: "default sub title",
      author: "default author"
    }
  },
  actions:{
    changeTitle:function(data){
      this.data.title = data.data;
    }
  }
})
```
this parameters "demo" must be same as createAction; actions.demo_changeTitle name must be  same as action value for createAction.