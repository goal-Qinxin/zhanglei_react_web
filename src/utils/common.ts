
/**
 * 单例模式
 * @param {*} fn 目标函数
 * 使用方式: 1:先实例化一个对象 const newFn = getSingle(fn)
 *          2: 执行函数 newFn()
 */
export function getSingle(fn: any): any {
    let instance: any = null;
    return function () {
        if (!instance) {
            instance = fn.apply(this, arguments);
        }

        return instance;
    };
}

/**
 * 实现缓存递归执行函数功能,原理是让已经执行过的函数的结果缓存起来,当再次想要执行时直接返回结果
 * @param {function} fn 递归调用的函数,且有返回值
 * @param {Object} cache 用来缓存的对象
 * 使用方法: 1: 实例化一个对象: const fn = cacheProxy(需要递归调用的函数)
 *           2: 执行递归函数:  fn()
 */
export function cacheProxy(fn: any, cache: {}): any {
    cache = cache || {};

    return function (arg: any) {
        //如果缓存数据中没有这个参数对应的值
        if (!cache.hasOwnProperty(arg)) {
            (cache as any)[arg] = fn(arg);
        }
        //缓存递归执行结果
        return (cache as any)[arg];
    };
};

/**
 * 防抖， 一段时间内没有再执行则执行完一次，否则重新执行
 * @param {*} fn 目标函数
 * 使用： 1. 实例化一个对象: const fn = debounce(函数)
 *        2. 执行fn()
 */
export function debounce(fn: any, time: number = 500): any {
    let timeout: any = null;
    return function () {
        if (timeout !== null) clearTimeout(timeout);
        timeout = setTimeout(() => {
            fn.apply(this, arguments);
        }, time);
    };
};

/**
 * 节流, 一段时间只能执行一次
 * @param {*} fn 目标函数
 * 使用: 1. 实例化一个对象: const fn = throttle(函数)
 *       2. 执行fn()
 */
export function throttle(fn: any, time: number = 500): any {
    let timer: any = null;
    return function () {
        if (!timer) {
            timer = setTimeout(function () {
                fn.apply(this, arguments);
                timer = null;
            }, time);
        }
    };
};

/**
 * 生成GUID(全局唯一标识符32位，UUID的一种)
 * 其中4表示UUID生成算法版本
 */
export const getGUID = () => {
    let str = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'
    return str.replace(/[xy]/g, function (c) {
        var r = Math.random() * 16 | 0,
            v = c == 'x' ? r : (r & 0x3 | 0x8);
        return v.toString(16);
    });
}

/**
 * 随机一定范围内的数字
 * @param max 最大值
 * @param min 最小值
 */
export function randomNumber(max = 1, min = 0) {
    if (min >= max) {
        return max;
    }
    return Math.floor(Math.random() * (max - min) + min);
}

/**
 * 顺序执行数组中的函数或promise，返回对应的结果数组
 */
export const asyncSequentializer = (() => {

    // 包装成Promise
    const toPromise = (x: Promise<any> | ((...rest: any[]) => any)) => {
        if (x instanceof Promise) { // if promise just return it
            return x;
        }
        if (typeof x === 'function') {
            // if function is not async this will turn its result into a promise
            // if it is async this will await for the result
            return (async () => await x())();
        }
        return Promise.resolve(x)
    }

    return (list: any[]) => {
        const results: any[] = [];
        return list
            .reduce((lastPromise, currentPromise) => {
                return lastPromise.then((res: any) => {
                    results.push(res); // collect the results
                    return toPromise(currentPromise);
                });
            }, toPromise(list.shift()))
            // collect the final result and return the array of results as resolved promise
            .then((res: any) => Promise.resolve([...results, res]));
    }
})();

/**
 * 深度克隆拷贝
 * @param obj 
 */
export const deepClone = (obj: any) => {
    let clone = obj;
    if (obj && typeof obj === "object") {
        clone = new obj.constructor();
        Object.getOwnPropertyNames(obj).forEach(
            prop => (clone[prop] = deepClone(obj[prop]))
        );
    }
    return clone;
};



