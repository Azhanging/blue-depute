/*!
 * 
 * blue-depute.js 1.0.0
 * (c) 2016-2024 Blue
 * Released under the MIT License.
 * https://github.com/azhanging/blue-depute
 * time:Fri, 23 Feb 2024 10:09:22 GMT
 * 
 */
(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory();
	else if(typeof define === 'function' && define.amd)
		define([], factory);
	else if(typeof exports === 'object')
		exports["BlueDepute"] = factory();
	else
		root["BlueDepute"] = factory();
})(typeof self !== 'undefined' ? self : this, function() {
return /******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, { enumerable: true, get: getter });
/******/ 		}
/******/ 	};
/******/
/******/ 	// define __esModule on exports
/******/ 	__webpack_require__.r = function(exports) {
/******/ 		if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 			Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 		}
/******/ 		Object.defineProperty(exports, '__esModule', { value: true });
/******/ 	};
/******/
/******/ 	// create a fake namespace object
/******/ 	// mode & 1: value is a module id, require it
/******/ 	// mode & 2: merge all properties of value into the ns
/******/ 	// mode & 4: return value when already ns object
/******/ 	// mode & 8|1: behave like require
/******/ 	__webpack_require__.t = function(value, mode) {
/******/ 		if(mode & 1) value = __webpack_require__(value);
/******/ 		if(mode & 8) return value;
/******/ 		if((mode & 4) && typeof value === 'object' && value && value.__esModule) return value;
/******/ 		var ns = Object.create(null);
/******/ 		__webpack_require__.r(ns);
/******/ 		Object.defineProperty(ns, 'default', { enumerable: true, value: value });
/******/ 		if(mode & 2 && typeof value != 'string') for(var key in value) __webpack_require__.d(ns, key, function(key) { return value[key]; }.bind(null, key));
/******/ 		return ns;
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "./static";
/******/
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/**
 * 委托事件详情数据
 */
var DeputeEvent = /** @class */ (function () {
    function DeputeEvent(opts) {
        this.data = opts.data;
        this.type = opts.type;
        this.eventId = opts.eventId;
    }
    return DeputeEvent;
}());
//空函数
function noop() { }
/**
 * 委托类：
 * 可在相关委托中委托事件进行处理
 */
var BlueDepute = /** @class */ (function () {
    //构造器
    function BlueDepute(opts) {
        if (opts === void 0) { opts = {}; }
        //配置项
        this.opts = Object.assign({
            eventIdSymbol: "$",
        }, opts);
        //收集委托事件
        this.events = {};
        //相关委托钩子
        this.hooks = Object.assign({
            on: function () { },
            off: function () { },
            emit: function () { },
        }, opts.hooks);
    }
    /**
     * 注册委托：同一个事件委托可以存在多个，不设置相关的事件id处理，将会全部委托统一处理，
     * 如果提供了指定的事件委托id，这里会按照指定的委托id进行处理
     * */
    BlueDepute.prototype.on = function (type, handler, opts) {
        if (handler === void 0) { handler = noop; }
        if (opts === void 0) { opts = {}; }
        var events = this.events;
        var current = events[type];
        if (!current) {
            //创建事件容器
            current = events[type] = {
                queue: [],
                type: type,
            };
        }
        //生成事件eventId
        var eventId = this.genEventId();
        //写入到队列中处理
        current.queue.push({
            //事件处理
            handler: handler,
            //记录事件eventId
            eventId: eventId,
            //配置存储
            opts: opts,
        });
        //执行的相关on钩子
        this.eventHook({
            name: "on",
            //事件类型
            type: type,
            //记录事件eventId
            eventId: eventId,
        });
        return eventId;
    };
    /**
     * 一次注册委托：适用该方法注册委托，只会进行一次性的消费后会自动注销委托，
     * 相关的注销hooks也会进行相关的执行处理
     */
    BlueDepute.prototype.once = function (type, handler) {
        return this.on(type, handler, {
            once: true,
        });
    };
    /**
     * 注销委托,可针对指定的eventId进行注销处理，不存在eventId时，会对当前命中的type事件全部注销
     * */
    BlueDepute.prototype.off = function (_type, handler) {
        var _a = this.getType(_type), type = _a[0], eventId = _a[1];
        var current = this.findEvent(type);
        if (!current)
            return false;
        var queue = current.queue;
        //不存在，全部处理删除
        if (handler === undefined && eventId === undefined) {
            //删除所有的
            while (queue.length) {
                var current_1 = queue.pop();
                //执行的相关off钩子
                this.eventHook({
                    name: "off",
                    //事件类型
                    type: type,
                    //事件ID
                    eventId: current_1.eventId,
                });
            }
            return true;
        }
        var index = -1;
        while ((index = queue.findIndex(function (item) {
            return (eventId === undefined && item.handler === handler) || (eventId === item.eventId);
        })) !== -1) {
            var current_2 = null;
            //全量删除
            if (eventId === undefined) {
                current_2 = queue.splice(index, 1)[0];
            }
            else if (queue[index].eventId === eventId) {
                //指定eventId处理删除
                current_2 = queue.splice(index, 1)[0];
            }
            //执行的相关off钩子
            this.eventHook({
                name: "off",
                //事件类型
                type: type,
                //事件ID
                eventId: current_2.eventId,
            });
        }
        return true;
    };
    /**
     * 处理委托
     * */
    BlueDepute.prototype.emit = function (_type, data) {
        var _this = this;
        var _a = this.getType(_type), type = _a[0], eventId = _a[1];
        var current = this.findEvent(type);
        if (!current) {
            console.log("warn not find " + type + " event in current Depute");
            return false;
        }
        current.queue.forEach(function (item) {
            if (!(eventId === undefined || item.eventId === eventId))
                return;
            //执行相关的委托处理
            _this.hook(_this, item.handler, [
                //委托详情
                new DeputeEvent({
                    data: data,
                    type: type,
                    eventId: item.eventId,
                }),
            ]);
            //执行的相关off钩子
            _this.eventHook({
                name: "emit",
                //事件类型
                type: type,
                eventId: item.eventId,
            });
            //是否一次消费,消费后删除该事件处理
            if (item.opts.once) {
                _this.off("" + type + _this.opts.eventIdSymbol + item.eventId, item.handler);
            }
        });
        return true;
    };
    /**
     * 执行相关hooks回调
     * */
    BlueDepute.prototype.eventHook = function (opts) {
        var hooks = this.hooks;
        var currentHook = hooks[opts.name];
        if (!currentHook)
            return;
        this.hook(this, currentHook, [opts]);
    };
    /**
     * 通用执行方法
     * */
    BlueDepute.prototype.hook = function (ctx, handler, args) {
        if (args === void 0) { args = []; }
        if (typeof handler === "function") {
            return handler.apply(ctx, args);
        }
        return handler;
    };
    /**
     * 生成事件eventId
     * */
    BlueDepute.prototype.genEventId = function () {
        return ++BlueDepute._eventId;
    };
    /**
     * 查找委托类型对象
     * */
    BlueDepute.prototype.findEvent = function (type) {
        return this.events[type] || null;
    };
    /**
     * 获取与解析类型，对于类型可能存在指定eventId的处理
     * */
    BlueDepute.prototype.getType = function (_type) {
        var _a = _type.split(this.opts.eventIdSymbol), type = _a[0], _eventId = _a[1];
        var eventId = parseInt(_eventId);
        if (!eventId) {
            eventId = undefined;
        }
        return [type, eventId];
    };
    //自增的事件id存储
    BlueDepute._eventId = 0;
    return BlueDepute;
}());
/* harmony default export */ __webpack_exports__["default"] = (BlueDepute);


/***/ })
/******/ ])["default"];
});
//# sourceMappingURL=blue-depute.js.map