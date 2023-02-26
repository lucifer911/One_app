var express = require("express");
var router = express.Router();
const blake2 = require('blake2');

const axios = require('axios');
// const tcpPing = require('tcp-ping');
const tcpPing = require('tcp-ping-node');
const ping = require('ping');
const request = require('request');

const {tcpPingPort} = require("tcp-ping-port")
const https = require("https");
const CacheManager = require("../CacheManager");



class TopManager {
    Data = {}
    MapIP = {}
    MapPretty = {}

    constructor(data) {
        this.Data = data
        console.log(data)
        var d = data['Producers']
        for (var a in d) {
            var v = d[a]
            // var prettyname = v.addr+":"+v.port
            // this.MapPretty[prettyname] = v
            this.MapIP[v.addr] = v
        }
    }

    findHost(ip, port = -1) {
        if (this.MapIP.hasOwnProperty(ip)) {
            var found = this.MapIP[ip]
            if (port !== -1) {
                if (port == found.port) {
                    return found
                }
            }
            return found
        }
        return null
    }
}

this.TopManager = null

var findAddrInTop = (addy) => {
    if (this.TopManager != null) return this.TopManager.findHost(addy)
    return null
}


var getTopUpdater = async () => {
    var a = await axios.get("https://explorer.cardano-mainnet.iohk.io/relays/topology.json")
    if (a.data != null) {
        this.CCache.addEntry("Topology", a.data)
        this.TopManager = new TopManager(a.data)
    } else {
        console.log("YOOO HUGE ERRRRRRR", a)
    }
}

getTopUpdater().then()

var getDataFromRelayEntry = async (relay, aa, tt) => {
    let host;
    if (relay.dns) {
        host = relay.dns;
    } else if (relay.srv) {
        host = relay.srv;
    } else if (relay.ipv4) {
        host = relay.ipv4;
    } else if (relay.ipv6) {
        host = relay.ipv6;
    }
    var hh = host
    var pp = relay.port
    console.log("ON ", hh, pp)
    // PingData[hh + ":" + pp] = await tcpPingPort(hh, pp)
    maxPingPerEntry = 10
    var ipentry = []
    var iprunn = 0
    for (var i = 0; i < maxPingPerEntry; i++) {
        // var rr = await tcpPing.ping({host: host, port: relay.port,timeout: 3000})
        iprunn++
        tcpPing.ping({host: host, port: relay.port, timeout: 3000}).then(r => {
            ipentry.push(r)
            iprunn--
        })
        await sleep(250)
        // ipentry.push(rr)
        console.log("Pinged the ", aa, " ENTY", i, "/", maxPingPerEntry, iprunn)
    }
    while (iprunn > 0) {
        console.log("SLPPEEEEEPPPP21", iprunn)
        await sleep(50)
    }

    console.log("======================")
    //AVERAGE
    var timeaverage = -1
    var pinged = -1
    for (var az in ipentry) {
        var val = ipentry[az]
        if (!val.success) continue
        if (pinged === -1) {
            pinged = 1
        } else {
            pinged++
        }
        if (timeaverage === -1) {
            timeaverage = parseInt(val.time)
        } else {
            timeaverage += parseInt(val.time)
            timeaverage /= 2
        }
    }
    console.log("!!!!!!!!!!!!!!!!!!EEEEEND======================")

    var z = findAddrInTop(hh)

    var r = {}
    r[hh + ":" + pp] = {AverageTime: timeaverage, Pinged: pinged, TriedPings: maxPingPerEntry, HostTopo: z ?? false}//await
                                                                                                                    // tcpPingPort(hh,
    // pp)
// return r
    tt.PingData[hh + ":" + pp] = {
        AverageTime: timeaverage,
        Pinged: pinged,
        TriedPings: maxPingPerEntry,
        HostTopo: z ?? false
    }//await
    // tcpPingPort(hh,
    // pp)
    console.log("NEW PING DATA", tt.PingData, host, hh)

    //     , function (err, data) {
    //     console.log(`Relay ${host}:${relay.port} ping result:`);
    //     console.log(data);
    // });

    // console.log("KETYYYY",rr)
}
var sleep = (ms) => {
    return new Promise(resolve => setTimeout(resolve, ms));
}

/* GET /api/Ping */

this.CCache = new CacheManager()
// this.CCache = undefined;
router.get("/Ping/:poolhash", async (req, res, next) => {
    var ip = req.params.poolhash ?? "pool18qzks8vdf0yu0u5ccf8aaj35q6zfutdcfgrssuvdjmgtyykr922"
    // var port = req.params.port


    if (this.CCache.hasEntry(ip)) {
        var kv = this.CCache.getEntry(ip)
        var time = kv[0]
        if (new Date().getTime() < new Date(time)) {


            // this.setState({Data: poolData, ServerData: poolServerData})
            res.json({...kv[1],CacheManagerVersion: 1});
            return
        }
    }else{
        console.log("OH NO THERE WAS NO ENTRY!!!!",ip, (this.CCache.Data),this.CCache,this.MapIP)
    }


    const queryData = {
        _pool_bech32_ids: [ip]
    };

    var a = await axios.post('https://api.koios.rest/api/v0/pool_info', queryData, {
        headers: {
            Accept: 'application/json', 'Content-Type': 'application/json'
        }
    }).catch(e => {
        console.log("Eeeeoerrr", e)
    })


    const relays = a.data[0].relays.filter(relay => {
        return relay.dns !== null || relay.srv !== null || relay.ipv4 !== null || relay.ipv6 !== null || relay.port !== null;
    });
    var hh = null
    var pp = null

    this.PingData = {}

    this.Running = 0
    for (var aa in Object.keys(relays)) {
        var relay = relays[aa]
        console.log("Getting Data for!!!", relay)
        this.Running++
        getDataFromRelayEntry(relay, aa, this).then((a) => this.Running--)
        // this.PingData= {...PingData,rrrr}

    }

    while (this.Running > 0) {
        console.log("WAITTT", this.Running, this.PingData)
        await sleep(10)
    }
    var calculatedHash = null
    const metaUrl = a?.data[0]?.meta_url;
    const metaHash = a?.data[0]?.meta_hash;
    var az = await axios.get(metaUrl, {
        responseType: 'arraybuffer',
        httpsAgent: new https.Agent({
            rejectUnauthorized: false
        })
    }).catch(e => {
        calculatedHash = null
        console.log("MASSIVE ERROR!!!", metaUrl,e)
        // console.log("MASSIVE ERROR!!!", e.keys)
    });
    if(az==null){
        az = await axios.get(metaUrl.replace(/^https:/, 'http:'), {
            responseType: 'arraybuffer',
            httpsAgent: new https.Agent({
                rejectUnauthorized: false
            })
        }).catch(e => {
            calculatedHash = null
            console.log("MASSIV222E ERROR!!!", e)
            // console.log("MASSIVE ERROR!!!", e.keys)
        });
    }
    if(az != null) {
        // console.log("TESTING THE DDDD", az)
        console.log("TESTING THE DDDD", az.data)
        var metadata = az.data
        const hash = blake2.createHash('blake2b', {digestLength: 32});
        hash.update(Buffer.from((metadata), 'utf8'));
        // hash.update(JSON.stringify(metadata));
        calculatedHash = hash.digest('hex');
        console.log(calculatedHash)
        if (calculatedHash === metaHash) {
            console.log("The metadata is valid");
        } else {
            console.log("The metadata has been tampered with");
        }
    }else calculatedHash = null


    // request(metaUrl, { encoding: null }, (error, response, body) => {
    //     if (error) {
    //         console.error(error);
    //         return;
    //     }
    //     // Create a new Blake2b hash with a digest length of 32 bytes
    //     const hash = blake2.createHash('blake2b', { digestLength: 32 });
    //
    //     // Update the hash with the file contents
    //     hash.update(body);
    //
    //     // Get the encrypted hash in hex format
    //     const calculatedHash = hash.digest('hex');
    //     console.log(calculatedHash)
    //     // Compare the meta_hash and calculatedHash
    //     if (calculatedHash === metaHash) {
    //         console.log("The metadata is valid");
    //     } else {
    //         console.log("The metadata has been tampered with");
    //     }
    // });

    // var a = axios({
    //  method: 'post',
    //  url: 'https://api.koios.rest/api/v0/pool_info',
    //  headers: {
    //   Accept: 'application/json',
    //   'Content-Type': 'application/json'
    //  },
    //  data: queryData
    // })
    //     .then(function (response) {
    //
    //     })
    //     .catch(function (error) {
    //      console.error(error);
    //     });

    // this.CCache.addEntry(a,[new Date().getTime()+5*60000,{PingData: this.PingData, Hash: calculatedHash}])
    this.CCache.addEntry(ip,[new Date().getTime()+5*60000,{PingData: this.PingData, Hash: calculatedHash}])

    res.json({PingData: this.PingData, Hash: calculatedHash});
});


module.exports = router;
