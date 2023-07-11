# cosmos-ts

## Description
This is a demo that demonstartes on how to use typescript for Uploading, Instantiating and interacting with smart contracts deployed in Cosmos chain. It also deodes event logs from a transaction. This will be used as an reference to develop e2e demo script for DIVE package to test cross chain communication between Icon and Cosmos chain. 

### Prerequisties 
Install [DIVE Package](https://github.com/HugoByte/DIVE). 
After the Dive package is installed run the below command to start a cosmos chain(Ex here - Archway)
`kurtosis run . '{"action":"start_node","node_name":"cosmwasm"}' --enclave btp`

### To Run Demo 
#### Change Directory
`cd test`

#### Install Dependencies 
`npm install`

#### Run using
`make run`


