/**
 * 事件id类型
 */
type TEventId = number;

/**
 * 委托事件详情数据
 */
class DeputeEvent {
  data: any;
  type: string;
  eventId: TEventId;
  constructor(opts: { data: any; type: string; eventId: TEventId }) {
    this.data = opts.data;
    this.type = opts.type;
    this.eventId = opts.eventId;
  }
}

/**
 * Depute实例hooks处理
 */
interface TDeputeEventHooks {
  on?: Function;
  off?: Function;
  emit?: Function;
}

/**
 * 注册配置类型
 */
interface TEventOnEventOpts {
  //是否一次消费
  once?: boolean;
}

/**
 * 事件项处理类型
 */
interface TEventItem {
  handler: Function;
  eventId: TEventId;
  opts?: TEventOnEventOpts;
}

/**
 * 事件相关项类型
 */
interface TEvent {
  queue: TEventItem[];
  type: string;
}

/**
 * 委托类参数类型
 */
interface TDeputeOpts {
  events?: {
    [eventType: string]: TEvent;
  };
  hooks?: TDeputeEventHooks;
  //事件id标记，用于切割使用
  eventIdSymbol?: string;
}

//空函数
function noop() {}

/**
 * 委托类：
 * 可在相关委托中委托事件进行处理
 */
class BlueDepute {
  //自增的事件id存储
  static _eventId: TEventId = 0;
  //配置
  opts: TDeputeOpts;
  //委托事件存储
  events: TDeputeOpts["events"];
  //钩子处理
  hooks: TDeputeEventHooks;
  //构造器
  constructor(opts: TDeputeOpts = {}) {
    //配置项
    this.opts = Object.assign(
      {
        eventIdSymbol: `$`,
      },
      opts
    );
    //收集委托事件
    this.events = {};
    //相关委托钩子
    this.hooks = Object.assign(
      {
        on() {},
        off() {},
        emit() {},
      },
      opts.hooks
    );
  }

  /**
   * 注册委托：同一个事件委托可以存在多个，不设置相关的事件id处理，将会全部委托统一处理，
   * 如果提供了指定的事件委托id，这里会按照指定的委托id进行处理
   * */
  on(
    type: string,
    handler: Function = noop,
    opts: TEventOnEventOpts = {}
  ): TEventId {
    const { events } = this;
    let current: TEvent = events[type];
    if (!current) {
      //创建事件容器
      current = events[type] = {
        queue: [],
        type: type,
      };
    }
    //生成事件eventId
    const eventId = this.genEventId();
    //写入到队列中处理
    current.queue.push({
      //事件处理
      handler,
      //记录事件eventId
      eventId,
      //配置存储
      opts,
    });
    //执行的相关on钩子
    this.eventHook({
      name: `on`,
      //事件类型
      type,
      //记录事件eventId
      eventId,
    });
    return eventId;
  }

  /**
   * 一次注册委托：适用该方法注册委托，只会进行一次性的消费后会自动注销委托，
   * 相关的注销hooks也会进行相关的执行处理
   */
  once(type: string, handler: Function) {
    return this.on(type, handler, {
      once: true,
    });
  }

  /**
   * 注销委托,可针对指定的eventId进行注销处理，不存在eventId时，会对当前命中的type事件全部注销
   * */
  off(_type: string, handler?: Function): boolean {
    const [type, eventId] = this.getType(_type);
    const current: TEvent = this.findEvent(type);
    if (!current) return false;
    const { queue } = current;
    //不存在，全部处理删除
    if (handler === undefined) {
      //删除所有的
      while (queue.length) {
        const current = queue.pop();
        //执行的相关off钩子
        this.eventHook({
          name: `off`,
          //事件类型
          type,
          //事件ID
          eventId: current.eventId,
        });
      }
      return true;
    }
    let index = -1;
    while (
      (index = queue.findIndex(
        (item) =>
          (eventId === undefined || eventId === item.eventId) &&
          item.handler === handler
      )) !== -1
    ) {
      let current: TEventItem = null;
      //全量删除
      if (eventId === undefined) {
        current = queue.splice(index, 1)[0];
      } else if (queue[index].eventId === eventId) {
        //指定eventId处理删除
        current = queue.splice(index, 1)[0];
      }
      //执行的相关off钩子
      this.eventHook({
        name: `off`,
        //事件类型
        type,
        //事件ID
        eventId: current.eventId,
      });
    }
    return true;
  }

  /**
   * 处理委托
   * */
  emit(_type: string, data: any): boolean {
    const [type, eventId] = this.getType(_type);
    const current = this.findEvent(type);
    if (!current) {
      console.log(`warn not find ${type} event in current Depute`);
      return false;
    }
    current.queue.forEach((item) => {
      if (!(eventId === undefined || item.eventId === eventId)) return;
      //执行相关的委托处理
      this.hook(this, item.handler, [
        //委托详情
        new DeputeEvent({
          data,
          type,
          eventId: item.eventId,
        }),
      ]);
      //执行的相关off钩子
      this.eventHook({
        name: `emit`,
        //事件类型
        type,
        eventId: item.eventId,
      });
      //是否一次消费,消费后删除该事件处理
      if (item.opts.once) {
        this.off(
          `${type}${this.opts.eventIdSymbol}${item.eventId}`,
          item.handler
        );
      }
    });
    return true;
  }

  /**
   * 执行相关hooks回调
   * */
  eventHook(opts: { name: string; type: string; eventId?: TEventId }) {
    const { hooks } = this;
    const currentHook = hooks[opts.name];
    if (!currentHook) return;
    this.hook(this, currentHook, [opts]);
  }

  /**
   * 通用执行方法
   * */
  hook(ctx: any, handler: Function, args: any[] = []) {
    if (typeof handler === `function`) {
      return handler.apply(ctx, args);
    }
    return handler;
  }

  /**
   * 生成事件eventId
   * */
  genEventId(): TEventId {
    return ++BlueDepute._eventId;
  }

  /**
   * 查找委托类型对象
   * */
  findEvent(type: string): TEvent {
    return this.events[type] || null;
  }

  /**
   * 获取与解析类型，对于类型可能存在指定eventId的处理
   * */
  getType(_type: string): [string, TEventId] {
    const [type, _eventId] = _type.split(this.opts.eventIdSymbol);
    let eventId: TEventId = parseInt(_eventId);
    if (!eventId) {
      eventId = undefined;
    }
    return [type, eventId];
  }
}

export default BlueDepute;
