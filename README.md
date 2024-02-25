# blue-depute
多项的委托管理与处理

```javascript
import Depute from 'blue-depute';

const depute = new Depute({
  hooks:{
    //注册委托触发钩子
    on(){},
    //注销委托触发钩子
    off(){},
    //触发委托触发钩子
    emit(){}
  },
  //默认$处理
  eventIdSymbol: `$`
});

//委托处理
const deputeHandler = ()=> {
  //todo
};

//注册委托会返回对应的委托ID  =》 hooks.on
const deputeId = depute.on(`deputeName`, deputeHandler);

//触发委托 =》 hooks.emit
depute.emit(`deputeName`, (deputeEvent)=> {
  const {
    //委托数据
    data,
    //委托事件id
    eventId,
    type
  } = deputeEvent;
  //todo 
});

//对于off的使用
//传入deputeName，会对匹配到的handler移除处理
depute.off(`deputeName`, deputeHandler);
//传入deputeName，不提供handler，会删除所有的委托处理
depute.off(`deputeName`);
//传入deputeName$委托事件id，会对制定的委托id委托删除处理
depute.off(`deputeName$${deputeId}`);
```

### 相关方法

### on(type:string,handler:Function) 注册相关的委托与实现，当前方法会返回对应的委托id，想通的key支持多个委托注册

```javascript
const depute = new Depute();
const someHandler = (event)=>{console.log(`todo some:`, event);
const deputeId0 = depute.on(`some`,someHandler}); //0
const deputeId1 = depute.on(`some`,()=>{}); //1

depute.emit(`some`, {someData:`data`}); // 0 // 1
```

### once(type:string,handler:Function) 和on使用一样，只是once只调用一次使用，这里的自动销毁也会调用off的hooks
```javascript
depute.once(`some`, (event)=> {
  //todo 
});
```

### emit(type:string,data:any): DeputeEvent; 触发相关委托，给委托提供相关数据信息
```javascript
//以on的实例为例
depute.emit(`some`,{someData:1})
/* 
  在on中回调会回去到DeputeKey相关内容
  {
    data: {someData:1},
    type: `some`,
    eventId: 0,
  }
*/
```
emit也支持type + deputeId的调用
```javascript
depute.emit(`some$${deputeId0}`,{}) // 调用depute使用$定义 例如 some$1
```

### off(type:string,handler?:Function) 注销制定匹配到的委托实现
```javascript
//以on的实例为例
depute.off(`some`);  //这部分会删除所有的some相关委托
depute.off(`some`,someHandler);  //这部分会删除some匹配为someHandler的相关委托
depute.off(`some$${deputeId1}`); //这部分会删除some$id相关委托
```


on,off,emit相关的调用，都会触发对应的hook，once的自动销毁也不例外。





