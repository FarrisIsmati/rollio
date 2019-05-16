module.exports = {
  backoff(time) {
    const milliseconds = time * 1000;
    const start = (new Date()).getTime();
    while (((new Date()).getTime() - start) < milliseconds) {
      // Elapse time
    }
    return (new Date()).getTime() - start;
  },
};
