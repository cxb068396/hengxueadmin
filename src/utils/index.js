/**
 * Created by PanJiaChen on 16/11/18.
 */

/**
 * Parse the time to string
 * @param {(Object|string|number)} time
 * @param {string} cFormat
 * @returns {string}
 */
export function parseTime(time, cFormat) {
  if (arguments.length === 0) {
    return null;
  }
  const format = cFormat || "{y}-{m}-{d} {h}:{i}:{s}";
  let date;
  if (typeof time === "undefined" || time === null || time === "null") {
    return "";
  } else if (typeof time === "object") {
    date = time;
  } else {
    if (typeof time === "string" && /^[0-9]+$/.test(time)) {
      time = parseInt(time);
    }
    if (typeof time === "number" && time.toString().length === 10) {
      time = time * 1000;
    }
    date = new Date(time);
  }
  const formatObj = {
    y: date.getFullYear(),
    m: date.getMonth() + 1,
    d: date.getDate(),
    h: date.getHours(),
    i: date.getMinutes(),
    s: date.getSeconds(),
    a: date.getDay()
  };
  const time_str = format.replace(/{(y|m|d|h|i|s|a)+}/g, (result, key) => {
    let value = formatObj[key];
    // Note: getDay() returns 0 on Sunday
    if (key === "a") {
      return ["日", "一", "二", "三", "四", "五", "六"][value];
    }
    if (result.length > 0 && value < 10) {
      value = "0" + value;
    }
    return value || 0;
  });
  return time_str;
}

/**
 * @param {number} time
 * @param {string} option
 * @returns {string}
 */
export function formatTime(time, option) {
  if (("" + time).length === 10) {
    time = parseInt(time) * 1000;
  } else {
    time = +time;
  }
  const d = new Date(time);
  const now = Date.now();

  const diff = (now - d) / 1000;

  if (diff < 30) {
    return "刚刚";
  } else if (diff < 3600) {
    // less 1 hour
    return Math.ceil(diff / 60) + "分钟前";
  } else if (diff < 3600 * 24) {
    return Math.ceil(diff / 3600) + "小时前";
  } else if (diff < 3600 * 24 * 2) {
    return "1天前";
  }
  if (option) {
    return parseTime(time, option);
  } else {
    return (
      d.getMonth() + 1 + "月" + d.getDate() + "日" + d.getHours() + "时" + d.getMinutes() + "分"
    );
  }
}

/**
 * @param {string} url
 * @returns {Object}
 */
export function getQueryObject(url) {
  url = url == null ? window.location.href : url;
  const search = url.substring(url.lastIndexOf("?") + 1);
  const obj = {};
  const reg = /([^?&=]+)=([^?&=]*)/g;
  search.replace(reg, (rs, $1, $2) => {
    const name = decodeURIComponent($1);
    let val = decodeURIComponent($2);
    val = String(val);
    obj[name] = val;
    return rs;
  });
  return obj;
}

/**
 * @param {string} input value
 * @returns {number} output value
 */
export function byteLength(str) {
  // returns the byte length of an utf8 string
  let s = str.length;
  for (var i = str.length - 1; i >= 0; i--) {
    const code = str.charCodeAt(i);
    if (code > 0x7f && code <= 0x7ff) s++;
    else if (code > 0x7ff && code <= 0xffff) s += 2;
    if (code >= 0xdc00 && code <= 0xdfff) i--;
  }
  return s;
}

/**
 * @param {Array} actual
 * @returns {Array}
 */
export function cleanArray(actual) {
  const newArray = [];
  for (let i = 0; i < actual.length; i++) {
    if (actual[i]) {
      newArray.push(actual[i]);
    }
  }
  return newArray;
}

/**
 * @param {Object} json
 * @returns {Array}
 */
export function param(json) {
  if (!json) return "";
  return cleanArray(
    Object.keys(json).map(key => {
      if (json[key] === undefined) return "";
      return encodeURIComponent(key) + "=" + encodeURIComponent(json[key]);
    })
  ).join("&");
}

/**
 * @param {string} url
 * @returns {Object}
 */
export function param2Obj(url) {
  const search = url.split("?")[1];
  if (!search) {
    return {};
  }
  return JSON.parse(
    '{"' +
      decodeURIComponent(search)
        .replace(/"/g, '\\"')
        .replace(/&/g, '","')
        .replace(/=/g, '":"')
        .replace(/\+/g, " ") +
      '"}'
  );
}

/**
 * @param {string} val
 * @returns {string}
 */
export function html2Text(val) {
  const div = document.createElement("div");
  div.innerHTML = val;
  return div.textContent || div.innerText;
}

/**
 * Merges two objects, giving the last one precedence
 * @param {Object} target
 * @param {(Object|Array)} source
 * @returns {Object}
 */
export function objectMerge(target, source) {
  if (typeof target !== "object") {
    target = {};
  }
  if (Array.isArray(source)) {
    return source.slice();
  }
  Object.keys(source).forEach(property => {
    const sourceProperty = source[property];
    if (typeof sourceProperty === "object") {
      target[property] = objectMerge(target[property], sourceProperty);
    } else {
      target[property] = sourceProperty;
    }
  });
  return target;
}

/**
 * @param {HTMLElement} element
 * @param {string} className
 */
export function toggleClass(element, className) {
  if (!element || !className) {
    return;
  }
  let classString = element.className;
  const nameIndex = classString.indexOf(className);
  if (nameIndex === -1) {
    classString += "" + className;
  } else {
    classString =
      classString.substr(0, nameIndex) + classString.substr(nameIndex + className.length);
  }
  element.className = classString;
}

/**
 * @param {string} type
 * @returns {Date}
 */
export function getTime(type) {
  if (type === "start") {
    return new Date().getTime() - 3600 * 1000 * 24 * 90;
  } else {
    return new Date(new Date().toDateString());
  }
}

/**
 * @param {Function} func
 * @param {number} wait
 * @param {boolean} immediate
 * @return {*}
 */
export function debounce(func, wait, immediate) {
  let timeout, args, context, timestamp, result;

  const later = function() {
    // 据上一次触发时间间隔
    const last = +new Date() - timestamp;

    // 上次被包装函数被调用时间间隔 last 小于设定时间间隔 wait
    if (last < wait && last > 0) {
      timeout = setTimeout(later, wait - last);
    } else {
      timeout = null;
      // 如果设定为immediate===true，因为开始边界已经调用过了此处无需调用
      if (!immediate) {
        result = func.apply(context, args);
        if (!timeout) context = args = null;
      }
    }
  };

  return function(...args) {
    context = this;
    timestamp = +new Date();
    const callNow = immediate && !timeout;
    // 如果延时不存在，重新设定延时
    if (!timeout) timeout = setTimeout(later, wait);
    if (callNow) {
      result = func.apply(context, args);
      context = args = null;
    }

    return result;
  };
}

/**
 * This is just a simple version of deep copy
 * Has a lot of edge cases bug
 * If you want to use a perfect deep copy, use lodash's _.cloneDeep
 * @param {Object} source
 * @returns {Object}
 */
export function deepClone(source) {
  if (!source && typeof source !== "object") {
    throw new Error("error arguments", "deepClone");
  }
  const targetObj = source.constructor === Array ? [] : {};
  Object.keys(source).forEach(keys => {
    if (source[keys] && typeof source[keys] === "object") {
      targetObj[keys] = deepClone(source[keys]);
    } else {
      targetObj[keys] = source[keys];
    }
  });
  return targetObj;
}

/**
 * @param {Array} arr
 * @returns {Array}
 */
export function uniqueArr(arr) {
  return Array.from(new Set(arr));
}

/**
 * @returns {string}
 */
export function createUniqueString() {
  const timestamp = +new Date() + "";
  const randomNum = parseInt((1 + Math.random()) * 65536) + "";
  return (+(randomNum + timestamp)).toString(32);
}

/**
 * Check if an element has a class
 * @param {HTMLElement} elm
 * @param {string} cls
 * @returns {boolean}
 */
export function hasClass(ele, cls) {
  return !!ele.className.match(new RegExp("(\\s|^)" + cls + "(\\s|$)"));
}

/**
 * Add class to element
 * @param {HTMLElement} elm
 * @param {string} cls
 */
export function addClass(ele, cls) {
  if (!hasClass(ele, cls)) ele.className += " " + cls;
}

/**
 * Remove class from element
 * @param {HTMLElement} elm
 * @param {string} cls
 */
export function removeClass(ele, cls) {
  if (hasClass(ele, cls)) {
    const reg = new RegExp("(\\s|^)" + cls + "(\\s|$)");
    ele.className = ele.className.replace(reg, " ");
  }
}

// 替换邮箱字符
export function regEmail(email) {
  if (String(email).indexOf("@") > 0) {
    const str = email.split("@");
    let _s = "";
    if (str[0].length > 3) {
      for (var i = 0; i < str[0].length - 3; i++) {
        _s += "*";
      }
    }
    var new_email = str[0].substr(0, 3) + _s + "@" + str[1];
  }
  return new_email;
}

// 替换手机字符
export function regMobile(mobile) {
  if (mobile.length > 7) {
    var new_mobile = mobile.substr(0, 3) + "****" + mobile.substr(7);
  }
  return new_mobile;
}

// 下载文件
export function downloadFile(obj, name, suffix) {
  const url = window.URL.createObjectURL(new Blob([obj]));
  const link = document.createElement("a");
  link.style.display = "none";
  link.href = url;
  const fileName = name + "." + suffix;
  // const fileName = parseTime(new Date()) + '-' + name + '.' + suffix
  link.setAttribute("download", fileName);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

/**
 * 采用非递归方式遍历树形数组，返回一个可用于for-of循环遍历的迭代器对象，每轮for-of循环都可以拿到此次遍历的节点和父节点
 * @param {array} array 待遍历的数组
 * @param {boolean} options.containRoot 遍历第一层节点（array直接子节点）时是否返回array本身
 * @param {string} options.children 数组中包含子节点的属性名称，不指定的话使用 children
 */
export function* iterTreeArray(array, options) {
  if(!Array.isArray(array)){
    throw Error(`iterTreeArray's first param needs a array type,not ${typeof array} type`)
  }
  // 检查配置
  let containRoot = options && options.containRoot ? options.containRoot : false;
  let childrenLabel =
    options && options.children && typeof options.children === "string"
      ? options.children
      : "children";
  const stack = [
    {
      value: containRoot?array: undefined,
      children: array,
    }
  ];
  while (stack.length > 0) {
    var top = stack.pop();
    var parent = top.value;
    var children = top.children;
    for (let n of children) {
      yield { node: n, parent: parent}
      if (n[childrenLabel] && Array.isArray(n[childrenLabel]) && n[childrenLabel].length > 0) {
        stack.push({
          value: n,
          children: n[childrenLabel]
        });
      }
    }
  }
}

/**
 * 将扁平化结数组转化为树形数组,默认将所有的字段添加到树对象上去
 */
function treeify(list, options) {
  "use strict";
  let textPropName = "label";
  let idPropName = "id";
  let pidPropName = "pid";
  let rootNodeValue = options;

  let tree = [];
  let queue = [{ pid: rootNodevalue, parent: tree }]; // 辅助操作队列
  while (queue.length > 0) {
    var { pid, parent } = queue.shift();
    list.forEach(ele => {
      if (ele[pidPropName] === pid) {
        let obj = object.assign({}, ele);
        // Object.keys().forEach(key => (obj[key] = ele[key]));
        obj.children = [];
        parent.push(obj);
        queue.push({ pid: ele[idPropName], parent: obj.children });
      }
    });
  }
  return tree;
}

// 去掉树形数组 长度为0的children 属性
export function deleteChildren(array){
  // console.log(iterTreeArray(array))
  for(let {node} of iterTreeArray(array)){
    if(node.children && node.children.length===0){
      delete node.children
    }
  }
  return array
}

/**
 * @func
 * @description: 非递归将数组转换成树形结构,该算法比递归效率更高，支持无限层级
 */
export function listToTree(list) {
  let map = {};
  let node;
  let roots = [];
  for (let i = 0; i < list.length; i++) {
    // list[i]._level = 1
    map[list[i].id] = i; // initialize the map
    list[i].children = []; // initialize the children
  }
  for (let i = 0; i < list.length; i++) {
    node = list[i];
    if (!!node.pid) {
      // node._level = list[map[node.pid]]._level + 1
      list[map[node.pid]].children.push(node);
    } else {
      roots.push(node);
    }
  }
  return roots;
}

// 防抖函数
// export function debounce(func,wait){
//   var timeout = null;
//   return function(){
//     var context = this;
//     var args = arguements;
//     clearTimeout(timeout);
//     timeout = setTimeout(function(){
//       func.apply(context,args)
//     },wait)
//   }
// }