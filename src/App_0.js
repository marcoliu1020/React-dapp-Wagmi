import "./App.css";

import React from "react";

import {
  useConnect,
  useAccount,
  useNetwork,
  chain,
  useDisconnect,
  useContractRead,
  useContractWrite,
  configureChains,
} from "wagmi";

import CONTRACT from "./artifacts/contracts/Greeter.sol/Greeter.json"
const CONTRACT_ADDRESS = "0x5FbDB2315678afecb367f032d93F642f64180aa3"

function App() {
  const { connect, connectors, error: connectError, isConnecting, pendingConnector } =
    useConnect();

  const { data: account } = useAccount();

  const { activeChain, switchNetwork } = useNetwork({
    chainId: chain.hardhat.id,
  });

  const { disconnect } = useDisconnect();

  React.useEffect(() => {
    console.log(connectError);
  }, [connectError]);

  //
  //-- change chain
  //
  React.useEffect(() => {
    console.log(activeChain.id) // 31337
    console.log(chain.hardhat.id) // 1337 

    if (activeChain && activeChain.id !== chain.hardhat.id) {
      switchNetwork();
    }
  }, [activeChain, switchNetwork]);

  //
  //-- read contract
  //
  const {
    data: greet,
    isError: readError,
    isLoading: isReadLoading,
  } = useContractRead(
    {
      addressOrName: CONTRACT_ADDRESS,
      contractInterface: CONTRACT.abi,
    },
    "greet",
    { watch: true } // 自動監測
  );

  //
  //-- write contract
  //
  const [itemText, setItemText] = React.useState("");
  const { isLoading, write: setGreeting } = useContractWrite(
    {
      addressOrName: CONTRACT_ADDRESS,
      contractInterface: CONTRACT.abi,
    },
    "setGreeting"
  );

  const onButtonClick = e => {
    e.preventDefault();

    setGreeting({
      args: [itemText],
      overrides: { from: account.address },
    });
  };

  return (
    <div className='App'>
      <header className='App-header'>
        {/* 錢包連接 */}
        {account ? (
          <div>
            <div>錢包地址: {account.address}</div>
            <button onClick={disconnect}>取消連結</button>
          </div>
        ) : (
          <div>
            {connectors.map(connector => (
              <button
                disabled={!connector.ready}
                key={connector.id}
                onClick={() => connect(connector)}
              >
                {connector.name}
                {!connector.ready && " (不支援)"}
                {isConnecting &&
                  connector.id === pendingConnector?.id &&
                  " (連結中)"}
              </button>
            ))}
          </div>
        )}

        {/* 讀取合約 */}
        <div>
          {isReadLoading && <div>Read Loading...</div>}
          {account && greet && <div>{greet.toString()}</div>}
        </div>

        {/* 改變合約 */}
        <div>
          <form className='form' onSubmit={e => onButtonClick(e)}>
            <input
              type='text'
              placeholder='Add Todo Item'
              value={itemText}
              onChange={e => {
                setItemText(e.target.value);
              }}
            />
            <button type='submit'>change {isLoading && "loading"}</button>
          </form>
        </div>
      </header>
    </div>
  );
}

export default App;
