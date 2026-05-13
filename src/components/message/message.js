import Vue from "vue";
import Main from "./message.vue";
import { isObject, isVNode } from "@/lib/types";

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
