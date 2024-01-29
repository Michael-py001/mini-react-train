import React from "./core/React.js";

// 实际上Vite会把jsx标签转成成下面的形式,这里引入了自己的React，所以用的是自己的React
// const App = React.createElement("div", { id: "root" }, "hi ", "hello world");
let countBar = 0;
function Bar() {
  console.log("Bar return");
  const update = React.update();
  function handleClick() {
    countBar++;
    update();
  }
  return (
    <div>
      bar {countBar}
      <button onClick={handleClick}>click</button>
    </div>
  );
}
let countFoo = 0;
function Foo() {
  console.log("Foo return");
  const update = React.update();
  function handleClick() {
    countFoo++;
    update();
  }
  return (
    <div>
      foo {countFoo}
      <button onClick={handleClick}>click</button>
    </div>
  );
}

let countApp = 0;
function App() {
  console.log("App return");
  const update = React.update();
  function handleClick() {
    countApp++;
    update();
  }
  return (
    <div>
      <Bar />
      <Foo />
      App {countApp}
      <button onClick={handleClick}>click</button>
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
