module.exports = {
    backoff(time, cb) {
        const milliseconds = time * 1000;
        const start = (new Date()).getTime();
        // Increment backoff time in cb
        cb();
        while (((new Date()).getTime() - start) < milliseconds) {
            // Elapse time
        }
        return (new Date()).getTime() - start;
    },
}