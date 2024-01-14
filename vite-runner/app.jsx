import React from "./core/React.js";

// 实际上Vite会把jsx标签转成成下面的形式,这里引入了自己的React，所以用的是自己的React
// const App = React.createElement("div", { id: "root" }, "hi ", "hello world");
function AppOne() {
  return <div>hello world</div>
}
const App = <div>hello world</div>

console.log(App);
console.log(AppOne);
export default App;
