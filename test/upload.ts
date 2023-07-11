import { Stream } from "stream";

const { WebsocketClient } = require('@cosmjs/tendermint-rpc');
// import { fromTendermint34Event } from "cosmjs";


async function decodeEvents(){
    const txHash = '9D68BACC15E3315FEAA29F3EF954FB5E9A86C84B4B1E93BB242B366BB6022BFE'

}

// let subscription: { unsubscribe: () => void; };

// const queryForBalanceUpdate = async () => {
//     try {
//         const websocket = new WebsocketClient('ws://localhost:4564',(error: any) =>
//       console.error(error)
//     );
//     const stream = websocket.listen({
//         jsonrpc: '2.0',
//         method: 'subscribe',
//         id: '0',
//         params: {
//           query: `tm.event = 'message'`,
//         },
//       });
//       subscription = stream.subscribe({
//         // The next function is called for each transaction event
//           next: (_res: any) => {
//             console.log('Matching transaction found' + JSON.stringify(_res));
//           },
//           error: (err: any) => {
//             throw err;
//           },
//           // The complete function is called when the subscription is completed
//           complete: () => {
//             websocket.disconnect();
//           },
//         });
//     } catch (err) {
//         console.error(err);
//         // Declare a function to disconnect from the WebSocket and unsubscribe from the event stream
//         disconnectFromWebsocket();
//       }
//     };
//     const disconnectFromWebsocket = () => {
//       if (subscription) {
//         subscription.unsubscribe();
//       }
//     };
//     // Add an event listener to clean up the WebSocket connection and unsubscribe when the process exits
//     process.on('exit', () => {
//       disconnectFromWebsocket();
//     });
    
//     queryForBalanceUpdate();













