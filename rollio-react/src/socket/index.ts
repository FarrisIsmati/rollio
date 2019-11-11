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
      // Update Region Data
        // If new active Vendor
          // Append to Daily Active Vendors
      // Update All Vendor Data
        // If vendor exists 
          // Update data
        // If vendor is new
          // Append to object

      // ------------------------------
      // ^ This should Rerender Map Pins
    })
  }
}