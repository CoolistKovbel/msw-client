import { ethers } from "ethers";
import React, { useEffect, useState } from "react";
import "./App.css";
import abi from "./utils/MswPortal.json";

function App() {
  const [currentAccount, setCurrentAccount] = useState("");
  const [approverS, setApproverS] = useState("");
  const [quoruM, setQuoruM] = useState("");

  const contractAddress = "0x6e9F7074b894D2AD7B8bb73B18250280BefC7cC5";
  const contractAbi = abi.abi;

  const checkIfWalletIsConnected = async () => {
    try {
      const { ethereum } = window;

      if (!ethereum) {
        console.log("makeSure you have metamask");
      } else {
        console.log("we have ethereum object: ", ethereum);
      }

      const accounts = await ethereum.request({
        method: "eth_requestAccounts",
      });

      if (accounts.length !== 0) {
        const account = accounts[0];
        console.log("Found an authorized account: ", account);
        setCurrentAccount(account);
      } else {
        console.log("No account found");
      }

      const provider = new ethers.providers.Web3Provider(ethereum);
      const signer = provider.getSigner();
      const mswPortalContract = new ethers.Contract(
        contractAddress,
        contractAbi,
        signer
      );

      const approvers = await mswPortalContract.getApprovers();
      const quorum = await mswPortalContract.quorum();

      setApproverS(approvers);
      setQuoruM(quorum);
    } catch (error) {
      console.log(error);
    }
  };

  const createTransfer = async (amount, to) => {
    try {
      const { ethereum } = window;

      if (ethereum) {
        const provider = new ethers.providers.Web3Provider(ethereum);
        const signer = provider.getSigner();
        const mswPortalContract = new ethers.Contract(
          contractAddress,
          contractAbi,
          signer
        );

        let trans = await mswPortalContract.createTransfer(amount, to);
        console.log(trans);
      } else {
        console.log("obj doesnt exist");
      }
    } catch (error) {}
  };

  useEffect(() => {
    checkIfWalletIsConnected();
  }, []);

  return (
    <div className="App">
      <header>
        <ul>
          <li>Approvers: {approverS.join(", ")}</li>
          <li>Quorum: {quoruM.toString()}</li>
        </ul>
      </header>

      <h1>Hello {currentAccount}</h1>

      <div>
        <form>
          <label htmlFor="amount">Amount: </label>
          <input id="amount" type="text" />
          <label htmlFor="to">To: </label>
          <input id="to" type="text" />
          <button>Submit</button>
        </form>
      </div>
    </div>
  );
}

export default App;
