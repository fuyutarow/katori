 import React, { useState, useEffect } from 'react';
 import './App.css';

 const Counter = () => {
   const [count, setCount] = useState(0);

   useEffect(() => {
     document.title = `You clicked ${count} times`;
   });

   return (
     <div>
       <p>You clicked {count} times</p>
       <button onClick={() => setCount(count + 1)}>
         Click me
       </button>
     </div>
   );
 }

 const App = () => {
   return (
     <div className="App">
       <header className="App-header">
         <img src="/icons/512x512.png" className="App-logo" alt="logo" />
         <Counter />
         <p>
           Edit <code>src/App.tsx</code> and save to reload.
         </p>
         <a
           className="App-link"
           href="https://reactjs.org"
           target="_blank"
           rel="noopener noreferrer"
         >
           Learn React
         </a>
       </header>
     </div>
   );
 }

 export default App;
