import React, { useEffect } from "react";
import "./App.css";

function App() {
  const checkIfWalletIsConnected = () => {
    const { ethereum } = window;

    if (!ethereum) {
      console.log("makeSure you have metamask");
    } else {
      console.log("we have ethereum object: ", ethereum);
    }
  };

  useEffect(() => {
    checkIfWalletIsConnected();
  }, []);

  return (
    <div className="App">
      <h1>Hello world</h1>
    </div>
  );
}

export default App;
