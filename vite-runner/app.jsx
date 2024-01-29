import React from "./core/React.js";

// 实际上Vite会把jsx标签转成成下面的形式,这里引入了自己的React，所以用的是自己的React
// const App = React.createElement("div", { id: "root" }, "hi ", "hello world");
let showBar = false;

function Counter({ num }) {
  const foo = (
    <div>
      foo
      <div>child</div>
      <div>child</div>
    </div>
  );
  // function Foo() {
  //   return <div>foo</div>;
  // }
  const bar = <div>bar</div>;
  function handleShowBar() {
    showBar = !showBar;
    React.update();
  }
  return (
    <div>
      Counter
      {showBar && foo}
      <button onClick={handleShowBar}>showBar</button>
    </div>
  );
}

function App() {
  return (
    <div>
      hello world
      <Counter num={10} />
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
