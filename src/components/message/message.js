import Vue from "vue";
import Main from "./message.vue";
import { isObject, isVNode } from "@/lib/types";

// 通过 Vue.extend 动态创建一个全局消息实例，整个页面复用同一个弹层。
const MessageConstructor = Vue.extend(Main);
let instance = null;

const createMessage = (options) => {
  if (Vue.prototype.$isServer) {
    return null;
  }

  if (!instance) {
    instance = new MessageConstructor({
      data: {
        ...options,
      },
    });
    instance.$mount();
  }

  // 由消息组件自己在关闭时回调 destroy，保证 DOM 和实例一起释放。
  instance.destroy = () => {
    document.body.removeChild(instance.$el);
    instance.$destroy();
    instance = null;
    return null;
  };

  instance.init(options);
  document.body.appendChild(instance.$el);
  return instance;
};

// 提供 success / warning / info / error 的快捷调用形式，业务侧直接传字符串即可。
["success", "warning", "info", "error"].forEach((type) => {
  createMessage[type] = (options) => {
    if (isObject(options) && !isVNode(options)) {
      return createMessage({
        ...options,
        type,
      });
    }

    return createMessage({
      type,
      text: options,
    });
  };
});

export default createMessage;
