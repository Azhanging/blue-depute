# blue-depute
委托管理与处理

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