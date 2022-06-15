// tool
const ethers = require("ethers");

// contract json file
const CONTRACT = require("./artifacts/contracts/Greeter.sol/Greeter.json");
const CONTRACT_ADDRESS = "0x5FbDB2315678afecb367f032d93F642f64180aa3";

// provider
const url = "http://127.0.0.1:8545";
const provider = new ethers.providers.JsonRpcProvider(url);

// HD
const mnemonic = "test test test test test test test test test test test junk";
const path = "m/44'/60'/0'/0/";

// walletMnemonics
const walletMnemonics = [
  ethers.Wallet.fromMnemonic(mnemonic, path + "0"),
  ethers.Wallet.fromMnemonic(mnemonic, path + "1"),
  ethers.Wallet.fromMnemonic(mnemonic, path + "2"),
  ethers.Wallet.fromMnemonic(mnemonic, path + "3"),
];

// wallets
const wallets = [
  walletMnemonics[0].connect(provider),
  walletMnemonics[1].connect(provider),
  walletMnemonics[2].connect(provider),
  walletMnemonics[3].connect(provider),
];

// contract
const contract = new ethers.Contract(CONTRACT_ADDRESS, CONTRACT.abi, wallets[0]);

// read contract
async function read() {
  let greet = await contract.greet();
  console.log(greet)
}

// write contract
async function write() {
  let tx =  await contract.setGreeting("Max");
  await tx.wait()
}

// write()
// read()


