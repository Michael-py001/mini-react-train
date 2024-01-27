import React from "./core/React.js";

// 实际上Vite会把jsx标签转成成下面的形式,这里引入了自己的React，所以用的是自己的React
// const App = React.createElement("div", { id: "root" }, "hi ", "hello world");
function CounterWrap() {
  return <Counter></Counter>;
}
let count = 0;
let props = {id:'test'}

function Counter({num}) {
  function handleClick() {
    console.log("click");
    count++; 
    props = {} //验证props删除
    React.update();
  }
  return <div {...props}>
    <div >count: {count}</div>
    <button onClick={handleClick}>click</button>
  </div>;
}

function App() {
  return (
    <div>
      hello world
      <Counter num={10}/>
      {/* <CounterWrap /> */}
    </div>
  );
}

// const App = (
//   <div>
//     hello world
//     <CounterWrap />
//   </div>
// );

export default App;
