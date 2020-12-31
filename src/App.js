import React, {useState} from "react";
import Tweet from "./Tweet";

function App() {
  const [isRed, setRed] = useState(false);
  const [count, setCount] = useState(0);
  const [users, setUsers] = useState([
    {username: "ed", password: "mdp"},
    {username: "cecile", password: "mdp2"}
    ]);

  const increment = () => {
    setCount(count+1);
    setRed(!isRed);
  }

  const sayHello = () => {
    console.log('hello');
  };
  const counter = 0;
  return(
    <div className='app'>
      {users.map (user => (
        <Tweet name={user.username} message={user.password}/>
      ))}
      <h1 className={isRed ? 'red' : ''}>Change my color</h1>
      <button onClick={increment}>Increment</button>
      <h1>{count}</h1>
      <Tweet  name='Cecile' message='This is a random tweet'/>
      <Tweet name='Helo' message='Mosh is the best'/>
    </div>
  );

}

export default App;