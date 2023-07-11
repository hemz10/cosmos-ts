import { DirectSecp256k1HdWallet } from "@cosmjs/proto-signing";
import dotenv from "dotenv";
import fs from "fs";
import { SigningCosmWasmClient } from "@cosmjs/cosmwasm-stargate";
import { fromTendermintEvent, GasPrice, calculateFee } from "@cosmjs/stargate";
import * as base64js from "base64-js";
import { exec } from "child_process";

// configure dotenv
dotenv.config();

const defaultGasPrice = GasPrice.fromString("0stake");

async function main() {
  // Define all chain details here
  const network = {
    chainId: "my-chain",
    endpoint: "http://localhost:4564",
    prefix: "archway",
  };

  // Get mnemonics from env file
  const mnemonic: string = process.env.MNEMONIC as string;

  // create an wallet from mnemonic and get the account address
  const wallet = await DirectSecp256k1HdWallet.fromMnemonic(mnemonic, {
    prefix: network.prefix,
  });
  const accounts = await wallet.getAccounts();
  const accountAddress = accounts[0].address;
  console.log(accountAddress);

  const destinationAddress = process.env.COSMOS_ADDRESS as string;

  // Create an signing client with created wallet
  const signingClient = await SigningCosmWasmClient.connectWithSigner(
    network.endpoint,
    wallet,
    {
      gasPrice: defaultGasPrice,
    }
  );

  // // // To Check if the client is connected to local chain
  const block = await signingClient.getBlock();
  console.log(block);

  // Get Test Account with stake
  const testAccount = await getTestAccountWithStake();
  const testAddress = testAccount.substring(8, testAccount.length).trim();
  console.log(testAddress);

  // // To Get balance of given account address and transfer balance if 0
  const bal = await signingClient.getBalance(accountAddress, "stake");
  if (bal.amount == "0") {
    console.log(
      "No Balance in Signer account, Transferring balance to Signer account"
    );
    await getStake(testAddress!, accountAddress);
  }
  await new Promise(f => setTimeout(f, 5000));
  const baln = await signingClient.getBalance(accountAddress, "stake");
  console.log(baln);

  // // Upload contract
  const wasmCode = fs.readFileSync("hackatom.wasm");
  const encoded = Buffer.from(wasmCode).toString("base64");
  const contractData = base64js.toByteArray(encoded);
  const gasPrice = GasPrice.fromString("0.00025stake");
  const uploadFee = calculateFee(1_500_000, gasPrice);
  const uploadResult = await signingClient.upload(
    accountAddress,
    contractData,
    uploadFee,
    ""
  );
  const txHash = uploadResult.transactionHash;

  // To decode event logs from transaction
  const txResult = await signingClient.getTx(txHash);
  const events = txResult?.events;
  for (const event of events!) {
    const decodedEvent = fromTendermintEvent(event);

    console.log(decodedEvent);
  }

  // Instantiate a contract
  const codeId = uploadResult.codeId;
  console.log(codeId);
  const msg = {
    verifier: accountAddress,
    beneficiary: destinationAddress,
  };
  const instantiateOptions = {
    memo: "Instantiating a new contract",
    funds: [
      {
        denom: "stake",
        amount: "10",
      },
    ],
    admin: accountAddress,
  };
  const instantiateResult = await signingClient.instantiate(
    accountAddress,
    codeId,
    msg,
    "my-instance-label",
    uploadFee,
    instantiateOptions
  );
  const contractAddress = instantiateResult.contractAddress;
  console.log(contractAddress);

  // To query contract
  const qmsg = {
    verifier: {},
  };
  const res = await signingClient.queryContractSmart(contractAddress, qmsg);
  console.log(res);

  const execMsg = {
    release: {},
  };
  const defaultExecuteFee = calculateFee(1_500_000, defaultGasPrice);
  const exeResult = await signingClient.execute(
    accountAddress,
    contractAddress,
    execMsg,
    defaultExecuteFee
    // {
      // amount: [{ amount: "2", denom: "stake" }],
      // gas: "5000000000",
    // }
  );
  console.log(exeResult);
}

async function getStake(testaddress: string, destaddress: string) {
  const dockerID = await getContainerIdByPartialName();
  console.log(dockerID);

  const commando = `docker exec ${dockerID} archwayd tx bank send ${testaddress} ${destaddress} 9000000stake --keyring-backend test \
--chain-id my-chain -y`;

  exec(commando, (error, stdout, stderr) => {
    if (error) {
      console.error(`Error executing docker exec: ${error.message}`);
      return;
    }

    console.log("Command executed successfully!");
    console.log("Output:", stdout);
  });
}

async function getTestAccountWithStake(): Promise<string> {
  const dockerID = await getContainerIdByPartialName();
  const command = `docker exec ${dockerID} archwayd keys list --keyring-backend test |  grep 'address:'`;
  return new Promise<string>((resolve, reject) => {
    exec(command, (error, stdout, stderr) => {
      if (error) {
        console.error(`Error executing docker exec: ${error.message}`);
        reject(error);
        return;
      }
      const output = stdout.trim();
      resolve(output);
    });
  });
}

async function getContainerIdByPartialName(): Promise<string> {
  const command = 'docker ps -aqf "name=cosmos"';

  return new Promise<string>((resolve, reject) => {
    exec(command, (error, stdout, stderr) => {
      if (error) {
        console.error(`Error executing docker exec: ${error.message}`);
        reject(error);
        return;
      }
      const dockerID = stdout.trim();
      resolve(dockerID);
    });
  });
}
main();
