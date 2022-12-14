import { ethers } from "ethers";
import React, { useEffect, useState } from "react";
import "./App.css";
import abi from "./utils/MswPortal.json";

function App() {
  const [currentAccount, setCurrentAccount] = useState("");
  const [approverS, setApproverS] = useState(undefined);
  const [quoruM, setQuoruM] = useState("");
  const [transfer, setTransfer] = useState(undefined);
  const [allTransfers, setAllTransfers] = useState([]);

  const contractAddress = "0x5EF38936337294581d04141457511f6cFA9f5186";
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
      const transfers = await mswPortalContract.getTransfers();

      setApproverS(approvers);
      setQuoruM(quorum);
      console.log(transfers);
      setAllTransfers(transfers);
    } catch (error) {
      console.log(error);
    }
  };

  const createTransfer = async (transfer) => {
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

        let trans = await mswPortalContract.createTransfer(
          transfer.amount,
          transfer.to
        );

        await trans.wait();

        console.log("Transfer created: ", trans.hash);
        console.log(trans);
      } else {
        console.log("obj doesnt exist");
      }
    } catch (error) {
      console.log(error);
    }
  };

  const approveTransfer = async (id) => {
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

        let trans = await mswPortalContract.approveTransfer(id);

        await trans.wait();

        console.log("Transfer created: ", trans.hash);
        console.log(trans);
      } else {
        console.log("obj doesnt exist");
      }
    } catch (error) {
      console.log(error);
    }
  };

  const updateTransfer = (e, field) => {
    const value = e.target.value;
    setTransfer({
      ...transfer,
      [field]: value,
    });
  };

  const submit = (e) => {
    e.preventDefault();
    createTransfer(transfer);
    setTransfer({
      amount: "",
      to: "",
    });
  };

  useEffect(() => {
    checkIfWalletIsConnected();
  }, []);

  return (
    <div className="App">
      <h1>Hello {currentAccount}</h1>
      <header>
        <ul>
          <li>
            Approvers: <br />
            {!approverS ? "no approvers" : approverS.join(", ")}
          </li>
          <li>
            Quorum: <br />
            {quoruM.toString()}
          </li>
        </ul>
      </header>

      <div className="createTransfer">
        <h2 className="headings">Create transfer</h2>
        <form onSubmit={(e) => submit(e)}>
          <label htmlFor="amount">Amount: </label>
          <input
            id="amount"
            type="text"
            onChange={(e) => updateTransfer(e, "amount")}
          />
          <label htmlFor="to">To: </label>
          <input
            id="to"
            type="text"
            onChange={(e) => updateTransfer(e, "to")}
          />
          <button>Submit</button>
        </form>
      </div>

      <div className="transferList">
        <h2 className="headings">Transfers</h2>
        <table>
          <thead>
            <tr>
              <td>ID</td>
              <td>AMOUNT</td>
              <td>TO</td>
              <td>APPROVALS</td>
              <td>SENT</td>
            </tr>
          </thead>
          <tbody>
            {allTransfers.length > 0
              ? allTransfers.map((trans) => (
                  <tr>
                    <td>{trans.id.toString()}</td>
                    <td>{trans.amount.toString()}</td>
                    <td>{trans.to.toString()}</td>
                    <td>
                      {trans.approvals.toString()}
                      <button
                        className="approveButton"
                        onClick={() => approveTransfer(trans.id.toString())}
                      >
                        Approve
                      </button>
                    </td>
                    <td>{trans.sent ? "yes" : "no"}</td>
                  </tr>
                ))
              : "no"}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default App;
