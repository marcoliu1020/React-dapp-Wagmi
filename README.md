## deploy contract on hardhat node
open terminal
```shell=
cd Hardhat
npm install
npx hardhat node
npx hardhat run scripts/sample-script.js --network localhost
```

## run React
open terminal
```shell=
npm install
npm start
```

## hardhat nonce 問題
之前如果有和 hardhat node 互動過，需要重置帳戶將清除您的交易紀錄

設定 -> 進階 -> 重置帳戶