import Ping from "web-pingjs"
// import tcpPingPort from "tcp-ping-port"

// var net = require('net');

export class PingClass {
    constructor() {
        // this.IP = ip
    }


    Ping(ip = "www.google.com",port = 80) {
        if (false) {
            // tcpPingPort(ip,port).then(online=>online?"yes":"no")

        } else {

            Ping(ip+":"+parseInt(port)).then(function (delta) {
                console.log('Ping time was ' + String(delta) + ' ms FOR >> ',ip+":"+parseInt(port)+800 );
            }).catch(function (err) {
                console.error('Could not ping remote URL', err);
            });
        }
    }
}