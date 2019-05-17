/* eslint-disable no-console */
module.exports = {
  backoff(time) {
    const milliseconds = time * 1000;
    const start = (new Date()).getTime();
    while (((new Date()).getTime() - start) < milliseconds) {
      // Elapse time
    }
    return (new Date()).getTime() - start;
  },
  retryExternalServiceConnection(connectFunction, externalServiceName = 'External Service') {
    const { backoff } = this;
    const connectionWrapper = {
      connectAttempts: 0,
      backoffMultiplyer: 2,
      async connect() {
        const connection = await connectFunction();
        if (!connection && this.connectAttempts < 8) {
          console.log(`${externalServiceName}: Connection failed retrying again`);
          this.connectAttempts += 1;
          const time = backoff(this.backoffMultiplyer);
          this.backoffMultiplyer *= 1.5;
          console.log(`time: ${time}`);
          console.log(`attempts: ${this.connectAttempts}`);
          return this.connect();
        }
        return connection;
      },
    };
    return connectionWrapper.connect();
  },
};
