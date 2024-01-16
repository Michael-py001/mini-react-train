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
        return typeof child === "object" ? child : createTextNode(child);
      }),
    },
  };
}
let root = null
function render(el, container) {
  nextWorkOfUnit = {
    // 在主入口中初始化任务队列
    dom: container,
    props: {
      children: [el],
    },
  };
  // 记录跟节点
  root = nextWorkOfUnit
}

let nextWorkOfUnit = null; // 当前正在工作的任务
function workLoop(deadline) {
  let shouldYield = false; // 是否要让出时间片
  // 有任务并且当前帧还没有结束
  while (!shouldYield && nextWorkOfUnit) {
    nextWorkOfUnit = performWorkOfUnit(nextWorkOfUnit); // 执行任务 返回下一个任务
    shouldYield = deadline.timeRemaining() < 1; // 没有时间了
  }
  if(!nextWorkOfUnit && root) { //当没有任务时，说明所有链表都处理完了，统一提交更新
    commitRoot()
  }
  requestIdleCallback(workLoop);
}

function commitRoot(fiber) {
  commitWork(root.child) // 提交更新 从根节点的第一个子节点开始
  root = null // 重置root节点
}

function commitWork(fiber) {
  //递归处理子节点
  if(!fiber) return
  fiber.parent.dom.append(fiber.dom) // 把根节点添加到dom上
  commitWork(fiber.child) // 递归处理子节点
  commitWork(fiber.sibling) // 递归处理兄弟节点

}

function createDom({ type, props }) {
  return type === "TEXT_ELEMENT"
    ? document.createTextNode(props.nodeValue)
    : document.createElement(type);
}
function updateProps(dom, props) {
  Object.keys(props).forEach((key) => {
    if (key !== "children") {
      //children特殊处理
      dom[key] = props[key];
    }
  });
}
function initChildren(fiber) {
  const children = fiber.props.children || [];
  let prevChild = null;
  children.forEach((child, index) => {
    //用一个对象保存当前节点的信息
    const newFiber = {
      parent: fiber,
      dom: null,
      props: child.props,
      type: child.type,
      child: null,
      sibling: null,
    };

    if (index === 0) {
      fiber.child = newFiber; // 设置第一个子节点
    } else {
      prevChild.sibling = newFiber; // 设置兄弟节点
    }
    prevChild = newFiber; // 保存上一个节点
  });
}
function performWorkOfUnit(fiber) {
  //1. 创建dom
  if (!fiber.dom) {
    // 没有dom节点才处理
    const dom = (fiber.dom = createDom(fiber)); // 保存dom
    // fiber.parent.dom.append(dom); // 把dom添加到父节点上
    // 2. 设置属性props
    updateProps(dom, fiber.props);
  }
  // 3. 处理children 树结构转换为链表 设置好指针
  initChildren(fiber);
  // 4. 返回下一个任务
  if (fiber.child) {
    // 有子节点 优先处理子节点
    return fiber.child;
  }
  if (fiber.sibling) {
    // 有兄弟节点 处理兄弟节点
    return fiber.sibling;
  }

  return fiber.parent?.sibling; // 没有子节点也没有兄弟节点 返回父节点的兄弟节点
}

requestIdleCallback(workLoop);

const React = {
  createElement,
  render,
};
export default React;
