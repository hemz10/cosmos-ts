import * as fs from "fs";
import { exec, spawn } from "child_process";

// Function to execute a command in a Docker container's shell
// function executeCommandInDockerContainer(containerName: string, command: string) {
//   // Construct the Docker command to execute
//   const dockerCommand = `docker exec ${containerName} sh -c "${command}"`;

//   // Execute the Docker command
//   exec(dockerCommand, (error, stdout, stderr) => {
//     if (error) {
//       console.error(`Error executing command in Docker container: ${error}`);
//       return;
//     }

//     // Handle the output
//     console.log(`Command output:\n${stdout}`);
//     console.error(`Command error:\n${stderr}`);
//   });
// }

// // Example usage
// const containerName = 'my-container';
// const command = 'ls -l';

// executeCommandInDockerContainer(containerName, command);

const filePath = "/home/dell/practice/cosmos-ts/test/genesis/genesis.json";
const jsonString = fs.readFileSync(filePath, "utf-8");
const jsonData = JSON.parse(jsonString);
const address = jsonData.app_state.auth.accounts[1].address;
console.log(address);
const command =
  "archwayd tx bank send archway15d62mrmlhdy29ujk4y3drz06wyrcy3t0vtu4fq archway1x6salm28nfgzzezymaqm4c8p4sxwqe5exuy5jd 10stake --keyring-backend test \
--chain-id my-chain";

// const commando = `docker exec -it /cosmos--8634de40cfbf4f33815d6b50dd5bfd80 archwayd tx bank send archway1tyh7lxenkf954kgy0umyzhp6m6p8ujt85f0t5v archway1x6salm28nfgzzezymaqm4c8p4sxwqe5exuy5jd 10stake --chain-id my-chain -y`;
const commando = `docker exec /cosmos--8634de40cfbf4f33815d6b50dd5bfd80 archwayd tx bank send archway15d62mrmlhdy29ujk4y3drz06wyrcy3t0vtu4fq archway1x6salm28nfgzzezymaqm4c8p4sxwqe5exuy5jd 10stake --keyring-backend test \
--chain-id my-chain`;
// const command = 'docker';
const args = [
  "exec",
  "/cosmos--8634de40cfbf4f33815d6b50dd5bfd80",
  "archwayd",
  "keys",
  "list",
  "--keyring-backend",
  "test",
];

exec(commando, (error, stdout, stderr) => {
  if (error) {
    console.error(`Error executing docker exec: ${error.message}`);
    return;
  }

  console.log("Command executed successfully!");
  console.log("Output:", stdout);
});

// exec(commando, (error, stdout, stderr) => {
//   if (error) {
//     console.error(`Error executing command: ${error}`);
//     return;
//   }

//   console.log(`Command output: ${stdout}`);
// });

// const filePath = '/home/dell/practice/cosmos-ts/test/genesis/genesis.json'; // Path inside the container
// const jsonString = fs.readFileSync(filePath, 'utf-8');
// // console.log(jsonString)
// const jsonData = JSON.parse(jsonString);
// const address = jsonData.app_state.auth.accounts[1].address;
// console.log(address)

// const command = `archwayd query bank balances ${address} --denom stake --node tcp://127.0.0.1:4564`
// console.log(command)

// exec(command, (error, stdout, stderr) => {
//     if (error) {
//       console.error(`Error executing command: ${error}`);
//       return;
//     }

//     console.log(`Command output: ${stdout}`);
//   });
