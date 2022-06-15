import "./App.css";

import React from "react";

import { useAccount, useDisconnect } from "wagmi";

import { chain, useConnect } from "wagmi";

import { useContractRead } from "wagmi";
import { useContractWrite } from "wagmi";

import CONTRACT from "./artifacts/contracts/Greeter.sol/Greeter.json";
const CONTRACT_ADDRESS = "0x5FbDB2315678afecb367f032d93F642f64180aa3";

function App() {
  const { data: account } = useAccount();
  const { disconnect } = useDisconnect();

  const { connect, connectors, error: errorConnect, isConnecting, pendingConnector } =
    useConnect({ chainId: chain.hardhat.id });
  // 1. 錢包跳出換鏈的請求
  // 2. 這只是請求，並不是在該鏈工作，需要確認 configureChains (index.js)

  const { data: greet } = useContractRead(
    {
      addressOrName: CONTRACT_ADDRESS,
      contractInterface: CONTRACT.abi,
    },
    "greet",
    {
      watch: true,
    }
  );

  const [itemText, setItemText] = React.useState("");
  const { write: setGreeting, isLoading: isSetGreetingLoading } =
    useContractWrite(
      {
        addressOrName: CONTRACT_ADDRESS,
        contractInterface: CONTRACT.abi,
      },
      "setGreeting",
      {
        args: [itemText],
      }
    );

  const setContract = async e => {
    e.preventDefault();

    setGreeting({
      args: [itemText],
      overrides: { from: account.address },
    });
  };

  return (
    <div className='App'>
      <div className='App-header'>
        {account ? (
          <div>
            {/* account */}
            <div>Connector: {account.connector?.name}</div>
            <div>Wallet: {account.address}</div>
            <button onClick={disconnect}>Disconnect</button>

            {/* 讀取合約 */}
            <div>Data: {greet?.toString()}</div>

            {/* 改變合約 */}
            <form className='form' onSubmit={setContract}>
              <input
                type='text'
                placeholder='Add Todo Item'
                value={itemText}
                onChange={e => {
                  setItemText(e.target.value);
                }}
              />
              <button type='submit'>
                set data {isSetGreetingLoading && "loading"}
              </button>
            </form>
          </div>
        ) : (
          <div>
            {/* connectors */}
            {connectors.map(connector => (
              <button
                disabled={!connector.ready}
                key={connector.id}
                onClick={() => connect(connector)}
              >
                {connector.name}
                {!connector.ready && " (unsupported)"}
                {isConnecting &&
                  connector.id === pendingConnector?.id &&
                  " (connecting)"}
              </button>
            ))}

            {/* errors */}
            {errorConnect && <div>{errorConnect.message}</div>}
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
