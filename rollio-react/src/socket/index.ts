// DEPENDENCIES
import socketIOClient from 'socket.io-client';

// CONFIG
import { VENDOR_API } from '../config';

// @ts-ignore
const socket = socketIOClient(VENDOR_API);

export default {
  onRecieveTwitterData: () => {
    socket.on('TWITTER_DATA', (data: any) => {
      console.log(data)
    })
  }
}