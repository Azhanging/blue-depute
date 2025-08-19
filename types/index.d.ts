/**
 * 事件id类型
 */
declare type EventId = number;
/**
 * 委托事件详情数据
 */
declare class DeputeEvent {
    data: any;
    type: string;
    eventId: EventId;
    constructor(opts: {
        data: any;
        type: string;
        eventId: EventId;
    });
}
/**
 * 钩子类型
 */
export declare enum EVENT_HOOK_TYPES {
    ON = "on",
    OFF = "off",
    EMIT = "emit"
}
/**
 * Depute实例hooks处理
 */
declare type DeputeEventHooks = Partial<Record<EVENT_HOOK_TYPES, (event?: EventHookOpts) => void>>;
/**
 *  钩子事件配置
 */
interface EventHookOpts {
    name: EVENT_HOOK_TYPES;
    type: string;
    eventId?: EventId;
}
/**
 * 注册配置类型
 */
interface EventOnEventOpts {
    once?: boolean;
}
/**
 * 事件处理方法相关
 */
declare type EventHandler = (event?: DeputeEvent) => any;
/**
 * 事件项处理类型
 */
interface EventQueue {
    handler: EventHandler;
    eventId: EventId;
    opts?: EventOnEventOpts;
}
/**
 * 事件相关项类型
 */
interface EventTypeDefine {
    queue: EventQueue[];
    type: string;
}
/**
 * 委托类参数类型
 */
interface DeputeOpts {
    events?: {
        [eventType: string]: EventTypeDefine;
    };
    hooks?: DeputeEventHooks;
    eventIdSymbol?: string;
}
/**
 * 委托类：
 * 可在相关委托中委托事件进行处理
 */
declare class BlueDepute {
    static _eventId: EventId;
    opts: DeputeOpts;
    events: DeputeOpts["events"];
    hooks: DeputeEventHooks;
    constructor(opts?: DeputeOpts);
    /**
     * 注册委托：同一个事件委托可以存在多个，不设置相关的事件id处理，将会全部委托统一处理，
     * 如果提供了指定的事件委托id，这里会按照指定的委托id进行处理
     * */
    on(type: string, handler?: EventHandler, opts?: EventOnEventOpts): EventId;
    /**
     * 一次注册委托：适用该方法注册委托，只会进行一次性的消费后会自动注销委托，
     * 相关的注销hooks也会进行相关的执行处理
     */
    once(type: string, handler: EventHandler): number;
    /**
     * 注销委托,可针对指定的eventId进行注销处理，不存在eventId时，会对当前命中的type事件全部注销
     * */
    off(_type: string, handler?: EventHandler): boolean;
    /**
     * 处理委托
     * */
    emit(_type: string, data: any): boolean;
    /**
     * 执行相关hooks回调
     * */
    eventHook(opts: EventHookOpts): void;
    /**
     * 通用执行方法
     * */
    hook(ctx: any, handler: Function, args?: any[]): any;
    /**
     * 生成事件eventId
     * */
    genEventId(): EventId;
    /**
     * 查找委托类型对象
     * */
    findEvent(type: string): EventTypeDefine;
    /**
     * 获取与解析类型，对于类型可能存在指定eventId的处理
     * */
    getType(_type: string): [string, EventId];
}
export default BlueDepute;
