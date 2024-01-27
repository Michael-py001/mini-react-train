// 4 封装createTextNode
function createTextNode(text) {
  return {
    type: "TEXT_ELEMENT",
    props: {
      nodeValue: text,
      children: [],
    },
  };
}
//5 封装createElement
function createElement(type, props, ...children) {
  return {
    type,
    props: {
      ...props,
      children: children.map((child) => {
        const isTextNode =
          typeof child === "string" || typeof child === "number";
        return isTextNode ? createTextNode(child) : child;
        // return typeof child === "object" ? child : createTextNode(child);
      }),
    },
  };
}
// work in progress
let wipRoot = null;
let currentRoot = null;
function render(el, container) {
  wipRoot = {
    // 在主入口中初始化任务队列
    dom: container,
    props: {
      children: [el],
    },
  };
  nextWorkOfUnit = wipRoot; // 记录当前正在工作的任务
}

let nextWorkOfUnit = null; // 当前正在工作的任务
function workLoop(deadline) {
  let shouldYield = false; // 是否要让出时间片
  // 有任务并且当前帧还没有结束
  while (!shouldYield && nextWorkOfUnit) {
    nextWorkOfUnit = performWorkOfUnit(nextWorkOfUnit); // 执行任务 返回下一个任务
    shouldYield = deadline.timeRemaining() < 1; // 没有时间了
  }
  if (!nextWorkOfUnit && wipRoot) {
    //当没有任务时，说明所有链表都处理完了，统一提交更新
    commitRoot();
  }
  requestIdleCallback(workLoop);
}

function commitRoot(fiber) {
  commitWork(wipRoot.child); // 提交更新 从根节点的第一个子节点开始
  currentRoot = wipRoot; // 保存当前根节点
  wipRoot = null; // 重置root节点
}

// 提交更新
function commitWork(fiber) {
  //递归处理子节点
  if (!fiber) return;

  let fiberParent = fiber.parent; //记录父节点

  //使用while循环找到有dom节点的父节点，解决嵌套函数组件的问题
  while (!fiberParent.dom) {
    // (因为函数组件没有dom)如果父节点没有dom节点，就一直往上找，直到找到有dom节点的父节点
    fiberParent = fiberParent.parent;
  }
  if (fiber.effectTag === "UPDATE" && fiber.dom) {
    updateProps(fiber.dom, fiber.props, fiber.alternate?.props);
  } else if (fiber.effectTag === "PLACEMENT" && fiber.dom) {
    // 有节点才添加(函数组件没有dom)
    fiberParent.dom.append(fiber.dom); // 把根节点添加到dom上
  }
  commitWork(fiber.child); // 递归处理子节点
  commitWork(fiber.sibling); // 递归处理兄弟节点
}

function createDom({ type, props }) {
  return type === "TEXT_ELEMENT"
    ? document.createTextNode(props.nodeValue)
    : document.createElement(type);
}
function updateProps(dom, nextProps, prevProps) {
  // Object.keys(nextProps).forEach((key) => {
  //   if (key !== "children") {
  //     //children特殊处理
  //     if (key.startsWith("on")) {
  //       // 以on开头的属性是事件
  //       const eventName = key.slice(2).toLowerCase(); // 截取事件名
  //       dom.addEventListener(eventName, nextProps[key]); // 给dom添加事件
  //     } else {
  //       dom[key] = nextProps[key];
  //     }
  //   }
  // });

  /***
   * 1.new 没有 old 有 删除 比如 old: {id:1} new:{} 删除id
   * 2.new 有 old 没有 添加
   * 3.new 有 old 有 更新
   */
  // 1.删除
  Object.keys(prevProps).forEach((key) => {
    if (key !== "children") {
      if (!(key in nextProps)) {
        dom.removeAttribute(key);
      }
    }
  });

  // 2.更新 3.添加 2和3可以合并
  Object.keys(nextProps).forEach((key) => {
    if (key !== "children") {
      if (prevProps[key] !== nextProps[key]) { // 如果属性值不同
        //children特殊处理
        if (key.startsWith("on")) {
          // 以on开头的属性是事件
          const eventName = key.slice(2).toLowerCase(); // 截取事件名
          dom.removeEventListener(eventName, prevProps[key]); // 移除旧的事件
          dom.addEventListener(eventName, nextProps[key]); // 给dom添加事件
        } else {
          dom[key] = nextProps[key];
        }
      }
    }
  });
}
function initChildren(fiber, children) {
  let oldFiber = fiber.alternate?.child; // 旧的fiber的第一个子节点
  let prevChild = null;
  children.forEach((child, index) => {
    const isSameType = child && oldFiber && oldFiber.type === child.type; // 判断是否是同一个节点
    let newFiber;
    if (isSameType) {
      // update
      newFiber = {
        parent: fiber,
        dom: oldFiber.dom, // 复用旧的dom节点
        props: child.props,
        type: child.type,
        child: null,
        sibling: null,
        effectTag: "UPDATE", // 更新节点
        alternate: oldFiber, // 保存上一次的fiber
      };
    } else {
      // add
      //用一个对象保存当前节点的信息
      newFiber = {
        parent: fiber,
        dom: null,
        props: child.props,
        type: child.type,
        child: null,
        sibling: null,
        effectTag: "PLACEMENT", // 新增节点
      };
    }
    if (oldFiber) {
      oldFiber = oldFiber.sibling; // 旧的fiber的兄弟节点
    }
    if (index === 0) {
      fiber.child = newFiber; // 设置第一个子节点
    } else {
      prevChild.sibling = newFiber; // 设置兄弟节点
    }
    prevChild = newFiber; // 保存上一个节点
  });
}

function updateFunctionComponent(fiber) {
  const children = [fiber.type(fiber.props)];
  initChildren(fiber, children);
}

function updateHostComponent(fiber) {
  if (!fiber.dom) {
    const dom = (fiber.dom = createDom(fiber)); // 保存dom
    updateProps(dom, fiber.props, {});
  }
  const children = fiber.props.children;
  initChildren(fiber, children);
}

function performWorkOfUnit(fiber) {
  const isFunctionComponent = fiber.type instanceof Function;
  if (isFunctionComponent) {
    updateFunctionComponent(fiber);
  } else {
    updateHostComponent(fiber);
  }
  // 4. 返回下一个任务
  if (fiber.child) {
    // 有子节点 优先处理子节点
    return fiber.child;
  }
  let nextFiber = fiber;
  while (nextFiber) {
    // 往上一直找 直到找到有兄弟节点的父节点
    if (nextFiber.sibling) return nextFiber.sibling; // 有兄弟节点 返回兄弟节点
    nextFiber = nextFiber.parent; // 没有兄弟节点 返回父节点(解决渲染两个函数组件的情况)
  }
  return fiber.parent?.sibling; // 没有子节点也没有兄弟节点 返回父节点的兄弟节点
}

requestIdleCallback(workLoop);

function update() {
  wipRoot = {
    // 在主入口中初始化任务队列
    dom: currentRoot.dom,
    props: currentRoot.props,
    alternate: currentRoot, // 记录上一次的fiber
  };
  nextWorkOfUnit = wipRoot; // 记录当前正在工作的任务
}
const React = {
  createElement,
  render,
  update
};
export default React;
