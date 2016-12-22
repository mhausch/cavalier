
const reqip = exports = module.exports = function RequestIP(req) {
    this.request = req;

    // Array
    this.checkOrder = [];

    // workaround to get real client IP
    // most likely because our app will be behind a [reverse] proxy or load balancer
    this.checkOrder.push({ type: 'x-client-ip', value: req.headers['x-client-ip'] ? req.headers['x-client-ip'] : null });
    this.checkOrder.push({ type: 'x-forwarded-for', value: req.headers['x-forwarded-for'] ? req.headers['x-forwarded-for'] : null });
    this.checkOrder.push({ type: 'x-real-ip', value: req.headers['x-real-ip'] ? req.headers['x-real-ip'] : null });

    // more obsure ones below
    this.checkOrder.push({ type: 'x-cluster-client-ip', value: req.headers['x-cluster-client-ip'] ? req.headers['x-cluster-client-ip'] : null });
    this.checkOrder.push({ type: 'x-forwarded', value: req.headers['x-forwarded'] ? req.headers['x-forwarded'] : null });
    this.checkOrder.push({ type: 'forwarded-for', value: req.headers['forwarded-for'] ? req.headers['forwarded-for'] : null });
    this.checkOrder.push({ type: 'forwarded', value: req.headers['forwarded'] ? req.headers['forwarded'] : null });

    // remote address check
    this.checkOrder.push({ type: 'connection.remoteAdress', value: req.connection ? req.connection.remoteAddress : null });
    this.checkOrder.push({ type: 'socket.remoteAdress', value: req.socket ? req.socket.remoteAddress : null });
    this.checkOrder.push({ type: 'connection.socket.remoteAdress', value: (req.connection && req.connection.socket) ? req.connection.socket.remoteAddress : null });
    this.checkOrder.push({ type: 'info.remoteAdress', value: req.info ? req.info.remoteAddress : null });
};

reqip.prototype.getIP = function () {
    // search for the firstt not null 
    const ipAdress = this.checkOrder.find(item => item.value !== null);

    if (ipAdress.type === 'x-forwarded-for') {
        const forwardedIps = ipAdress.value.split(',');
        ipAdress.value = forwardedIps[0];
    }
    return ipAdress;
};

reqip.prototype.compareIP = function (item) {
    const ip = this.getIP();
    let isFine = false;

    // if the request exactly matches the given item
    if ((item.type === ip.type) && (item.value === ip.value)) {
        isFine = true;
    }
    return isFine;
};



