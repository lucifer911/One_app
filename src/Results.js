import {Component} from "react";
import axios from "axios";
import PropTypes from "prop-types";
import {PingClass} from "./Components/Hidden/PingClass";
import {Button, Col, OverlayTrigger, Row, Tooltip} from "react-bootstrap";

export default class Results extends Component {

    constructor(p) {
        super(p)
        this.P = p.Key
        this.state = {Data: null, ServerData: null}
        this.PoolInfo = false
        this.ServerOnline = true
    }


    // componentWillMount() {
    // }

    async componentWillMount() {
        if (this.PoolInfo == false) {
            await this.getPoolInfo()
            this.PoolInfo = true
        }
    }

    async getPoolInfo(a = this.P) {
        // Set the API endpoint and request body
        const apiUrl = 'https://api.koios.rest/api/v0/pool_info';
        const requestBody = {
            _pool_bech32_ids: [a ?? sessionStorage.getItem("poolID")]
        };


        // Send the POST request and retrieve the response data
        const response = await axios.post(apiUrl, JSON.stringify(requestBody), {
            method: 'POST', headers: {
                'Access-Control-Allow-Origin': '*', 'Accept': 'application/json', 'Content-Type': 'application/json'
            }
        }).catch(e => console.error(e));
        const responseServer = await axios.get("http://localhost:3030/Ping/" + (a ?? sessionStorage.getItem("poolID")), {
            headers: {
                'Access-Control-Allow-Origin': '*', 'Accept': 'application/json', 'Content-Type': 'application/json'
            }
        }).catch(e => console.error(e));
        const responseServerJson = await responseServer?.data ?? null;
        const responseJson = await response.data;

        this.ServerOnline = responseServerJson != null
        console.log("CHECK DATAAAAa", responseServerJson, responseJson)

        // Create a table to display the data
        let tableContent = '<table>';

        // Get the object from the responseJson array
        var poolData = responseJson[0] ?? {};
        var poolServerData = responseServerJson ?? {};
//////////////////////////////////////////////////////////////////////////////////1111
        console.log("PDDD", poolData, response.data, requestBody)
        // Get the pool status value
        var poolStatus = poolData?.pool_status ?? null;
        // Get the pool_id_bech32 value
        var pool_id_bech32 = poolData.pool_id_bech32 ?? null;
        // Get the active_epoch_no value
        var active_epoch_no = poolData.active_epoch_no ?? null;
        // Get the margin value
        var margin = poolData.margin ?? null;
        // Get the meta_hash value
        var metahash = poolData.meta_hash ?? null;

        // Get the pledge value
        var pledge = (poolData.pledge / 1000000).toFixed(0) + " ADA";
        var live_pledge = (poolData.live_pledge / 1000000).toFixed(0) + " ADA";
        // Get the relay value
        // var relays = poolData.relays ?? null;
//         if (relays != null) {
//             var relay = relays[0];
//             var relayUrl = `ws://${relay.ip}:${relay.port}`;
//             var socket = new WebSocket(relayUrl);
//             // socket.onopen = function () {
//             //     socket.send('ping');
//             //     setTimeout(() => {
//             //         if (socket.readyState === WebSocket.OPEN) {
//             //             socket.close();
//             //             relay_status = "<td class='fail'>Offline</td>"
//             //         }
//             //     }, 5000);
//             // }
//             //
//             // socket.onmessage = function (event) {
//             //     if (event.data === 'pong') {
//             //         relay_status = "<td class='pass'>Online</td>"
//             //     }
//             // }
//             if (relays && relays.length > 0) {
//                 const relay = relays[0];
//                 // WebSocket code here
//             } else {
//                 console.log("No relays found or relays variable is not defined")
//                 relay_status = "<td class='fail'>Not found</td>"
//             }
//
//
// //////////////////////////////////////////////////////////////////////////////////////////////////////2222
//             //Add new column
//             const registrationStatus = poolStatus === "registered" ? "<td class='pass'>Registered</td>" : "<td
// class='fail'>Not Registered</td>"; // Add new column for pool_id_bech32 const pool_id_status = pool_id_bech32 ? "<td
// class='pass'>Found</td>" : "<td class='fail'>Not Found</td>"; // Add new column for active_epoch_no const
// active_epoch_status = active_epoch_no ? "<td class='pass'>Active</td>" : "<td class='fail'>Deceased</td>"; // Add
// new column for margin const margin_status = margin ? "<td class='pass'>Pass</td>" : "<td class='pass'>Pass</td>";
// const marginInPercent = (margin * 100).toFixed(2) + "%";  // Add new column for meta hash const meta_hash = metahash
// ? "<td class='pass'>Matched</td>" : "<td class='fail'>Missmatched</td>"; // Add new column for pledge const
// pledge_status = live_pledge > pledge ? "<td class='pass'>Pass</td>" : "<td class='fail'>Fail</td>"; // Add new
// column for relay var relay_status = relays ? "<td class='pass'>Found</td>" : "<td class='fail'>Not Found</td>";   //
// Add the CSS class based on the pool status if (poolData.pool_status === "registered") {
// document.getElementById("poolStatus").classList.add("found"); } else {
// document.getElementById("poolStatus").classList.add("not-found"); }
// /////////////////////////////////////////////////////////////////////////////////////////////////3333 // Add row to
// the table tableContent += `<tr>${registrationStatus}<td>Pool Status</dt><td>${poolStatus}</td></tr>`; // Add the
// pool_id_bech32 value to the table tableContent += `<tr>${pool_id_status}<td>Pool
// ID</td><td>${pool_id_bech32}</td></tr>`; // Add the active epoch no value to the table tableContent +=
// `<tr>${active_epoch_status}<td>Active Since</td><td>${active_epoch_no}</td></tr>`; // Add the margin value to the
// table tableContent += `<tr>${margin_status}<td>Margin</td><td>${marginInPercent}</td></tr>`; // Add the meta hash
// value to the table tableContent += `<tr>${meta_hash}<td>Registerd Hash<br/>Metadata
// hash</td><td>${metahash}</td></tr>`; // Add the pledge balue to the table tableContent +=
// `<tr>${pledge_status}<td>Pledge</td><td>Declare Pledge ${pledge}<br/>Live Pledge${live_pledge}</td></tr>`; // relay
// // Iterate through the relays array for (const relay of relays) { let relayString = ""; for (const key in relay) {
// if (relay[key] !== null) { relayString += `${key}: ${relay[key]}<br/>`; } if (key === "ip_address" && relay[key]) {
// } } tableContent += `<tr><td>${relayString}</td></tr>`; tableContent +=
// `<tr>${relay_status}<td>Relay</td><td>${relayString}</td></tr>`;  // return [poolData, relayString, relay_status]  }
//   tableContent += '</table>';  // Display the table in the result element //
// document.getElementById('poolStatus').innerHTML = tableContent; }
        console.log("CHECK DATAAAAaFFF", poolData, poolServerData)
        this.setState({Data: poolData, ServerData: poolServerData})
        // this.Cache.addEntry(a,{Data: poolData, ServerData: poolServerData})
    }

    render() {

        if (this.state.Data == null) {
            return <div>
                <h1>Pool Data</h1>
                <table>
                    <tr>
                        <td>Pool Status</td>
                        <td>Loading</td>
                    </tr>
                    <tr>
                        <td>Pool ID</td>
                        <td>Loading</td>
                    </tr>
                    <tr>
                        <td>Active Since</td>
                        <td>EPOCH: Loading</td>
                    </tr>
                    <tr>
                        <td>Margin</td>
                        <td>Margin: Loading| Margin %: Loading</td>
                    </tr>
                    <tr>
                        <td>Declared Meta Hash<br/>Actual Meta Hash</td>
                        <td> Loading <br/> {this.P}</td>
                    </tr>
                    <tr>
                        <td>Pledge</td>
                        <td>Declare Pledge Loading<br/>Live Pledge Loading</td>
                    </tr>
                    <tr>
                        <td>Relays</td>
                        <td>Loading</td>
                    </tr>
                </table>
            </div>
        }


        // this.Ping = new PingClass()
        var data = this.state.Data
        var marginInPercent = (data.margin * 100).toFixed(2) + "%";
        var pledge = (data.pledge / 1000000).toFixed(0) + " ADA";
        var live_pledge = (data.live_pledge / 1000000).toFixed(0) + " ADA";
        const pledge_status = live_pledge > pledge ? "<td class='pass'>Pass</td>" : "<td class='fail'>Fail</td>";


        this.FailedRelays = -1;// -1 = Unintialized, 0 = is initialized
        this.FailedHostTopo = 0;// -1 = Unintialized, 0 = is initialized

        //Found
        var ft = <h4 className={"foundTitle"}>Found</h4>
        var fitu = <h4 className={"foundTitle topostring"}>Found In Topology Updater</h4>
        var mt = <h4 className={"foundTitle"}>Hashes Match</h4>
        var pt = <h4 className={"foundTitle"}>Pass</h4>
        var rt = <h4 className={"foundTitle"}>Registered</h4>
        //Not Found
        var nft = <h4 className={"notFoundTitle"}>Not Found</h4>
        var nfitu = <h4 className={"notFoundTitle topostring"}>Not Found In Topology Updater</h4>
        var nmt = <h4 className={"notFoundTitle"}>Hashes Do Not Match</h4>
        var npt = <h4 className={"notFoundTitle"}>Fail</h4>
        var nrt = <h4 className={"notFoundTitle"}>Not Registered</h4>


        console.log("1221 - PRECHECK ")
        data.relays?.forEach(a => {
            console.log("1221 - IN LOOP START", a)

            var prettyName = a.dns ?? a.ipv4
            var port = a.port
            var un = prettyName + ":" + port
            var cache = this.state.ServerData
            if (cache != null) {
                console.log("1221 - HAS SD")

                if (cache.PingData.hasOwnProperty(un)) {

                    var ud = cache.PingData[un]
                    console.log("1221 - HAS PROP", ud.Pinged, this.FailedRelays)
                    if (ud.Pinged > 0) {
                        return;
                    } else {
                        // console.log("1221 - HAS FAILLLLEDDD",ud.Pinged,this.FailedRelays)
                        var aa = this.FailedRelays
                        if (aa == -1) {
                            this.FailedRelays = 1
                        } else {
                            this.FailedRelays++
                        }

                        // console.log("1221 - HAS FAILLLLEDDD",ud.Pinged,this.FailedRelays)
                    }
                }
            }
        })


        return (<div>
                <h1>Pool Data</h1>
                <Row>
                    <Col xs={12}>
                        <h3>Pool Name: {this.state.Data.meta_json.name}</h3>
                        <h5>Live Delegators: {this.state.Data.live_delegators}</h5>
                        <h5>Live Stake-Pledge
                            Diff: {this.state.Data.live_stake / 1000000 - this.state.Data.live_pledge / 1000000 > 0 ?
                                <span style={{color: "green", fontSize: "30px"}}>+</span> : <span style={{
                                    color: "red",
                                    fontSize: "30px"
                                }}>-</span>} {this.state.Data.live_stake / 1000000 - this.state.Data.live_pledge / 1000000} ADA</h5>
                    </Col>
                    <Col xs={12}>
                    <hr/>
                    </Col>
                </Row>
                <table>
                    <tr>
                        <td>{data?.pool_status.toLowerCase() === "registered" ? rt : nrt}</td>
                        <td>Pool Status</td>
                        <td>{data?.pool_status}</td>
                    </tr>
                    <tr>
                        <td>{data?.pool_id_bech32 != null && data?.pool_id_bech32.length > 0 ? ft : nft}</td>
                        <td>Pool ID</td>
                        <td>{data?.pool_id_bech32}</td>
                    </tr>
                    <tr>
                        <td>{data?.active_epoch_no != null ? ft : nft}</td>
                        <td>Active Since</td>
                        <td>EPOCH: {data?.active_epoch_no}</td>
                    </tr>
                    <tr>
                        <td>{data?.margin != null ? ft : nft}</td>
                        <td>Margin</td>
                        <td>Margin: {data?.margin} | Margin %: {marginInPercent}</td>
                    </tr>
                    <tr>
                        <td>{this.state.ServerData.Hash == data?.meta_hash ? mt : nmt}</td>
                        <td>Declared Metadata Hash<br/><br/>Actual Meta Hash</td>
                        <td> {data?.meta_hash} <br/><br/> {(() => {
                            if (this.state.ServerData == null) {
                                return "Unable to calculate hash!"
                            } else {
                                return this.state.ServerData.Hash//+"!11111"
                            }

                        })()
                        }</td>
                    </tr>
                    {/*{(()=>{*/}
                    {/*    if(this.state.ServerData == null){*/}
                    {/*        return "Unable to calculate hash!"*/}
                    {/*    }else if(this.state.ServerData.Hash == data?.meta_hash){*/}
                    {/*        return <tr>*/}
                    {/*            <td colSpan={2}>*/}
                    {/*            <Row>*/}
                    {/*                <Col xs={12} className={"text-center"} style={{backgroundColor:"green",color:"white"}}>Metadata Hash Matches</Col>*/}
                    {/*            </Row>*/}
                    {/*            </td>*/}
                    {/*        </tr>*/}
                    {/*    }*/}

                    {/*})()*/}
                    {/*}*/}

                    <tr>

                        <td>{pledge <= live_pledge ? pt : npt}</td>
                        <td>Pledge</td>
                        <td>Declare Pledge {pledge}<br/>Live Pledge {live_pledge}</td>
                    </tr>
                    <tr>
                        {(() => {

                            data.relays?.map(a => {

                                var prettyName = a.dns ?? a.ipv4
                                var port = a.port
                                var un = prettyName + ":" + port
                                var cache = this.state.ServerData
                                if (cache != null && cache.PingData.hasOwnProperty(un)) {
                                    var ud = cache.PingData[un]
                                    if (ud.Pinged > 0) {
                                        var placement = 'top'
                                        if (ud.HostTopo == false || ud.HostTopo == null) this.FailedHostTopo++
                                    }

                                }
                            })

                            return null
                        })()}

                        <td>{(this.FailedRelays == 0 || this.FailedRelays == -1) && this.FailedHostTopo == 0 ? pt : [npt]} </td>
                        <td>Relays</td>


                        <td>{data.relays?.map(a => {

                            var prettyName = a.dns ?? a.ipv4
                            var port = a.port
                            var un = prettyName + ":" + port
                            var cache = this.state.ServerData
                            if (cache != null) {
                                if (cache.PingData.hasOwnProperty(un)) {
                                    var ud = cache.PingData[un]
                                    if (ud.Pinged > 0) {
                                        var placement = 'top'
                                        // if(ud.HostTopo == false || ud.HostTopo == null)this.FailedHostTopo++
                                        return <Row>
                                            <Col xs={6}>
                                                <Row>
                                                    {/*<Col xs={2}>*/}
                                                    {/*    <OverlayTrigger*/}
                                                    {/*    key={placement}*/}
                                                    {/*    placement={placement}*/}
                                                    {/*    overlay={*/}
                                                    {/*        <Tooltip id={`tooltip-${placement}`}>*/}
                                                    {/*            Tooltip on <strong>{placement}</strong>.*/}
                                                    {/*        </Tooltip>*/}
                                                    {/*    }*/}
                                                    {/*>*/}
                                                    {/*    <Button variant="secondary">Tooltip on {placement}</Button>*/}
                                                    {/*</OverlayTrigger>*/}
                                                    {/*</Col>*/}
                                                    <Col xs={10}>
                                                        <div>{prettyName}:{port}</div>
                                                        <div>{ud.HostTopo != false ? fitu : nfitu}</div>
                                                        {/*<h3>{this.FailedHostTopo}</h3>*/}
                                                    </Col>
                                                </Row>
                                            </Col>
                                            <Col xs={6}>
                                                <div style={{color: "white", backgroundColor: "green"}}>
                                                    <div>Average Ping Time: {ud.AverageTime.toFixed(3)} ms</div>
                                                    <div>Ping Success Rate: {ud.Pinged / ud.TriedPings * 100}%</div>

                                                    {/*{JSON.stringify(ud)}*/}
                                                </div>
                                            </Col></Row>
                                    } else {
                                        var aa = this.FailedRelays
                                        if (aa == -1) {
                                            aa = 1
                                        } else {
                                            this.FailedRelays++
                                        }

                                        return <Row>
                                            <Col xs={6}>
                                                <Row>
                                                    <div>{prettyName}:{port}</div>
                                                </Row>
                                            </Col>
                                            <Col xs={6}>
                                                <div style={{color: "white", backgroundColor: "red"}}>
                                                    <div>Average Ping Time: {ud.AverageTime.toFixed(3)} ms</div>
                                                    <div>Ping Success Rate: {ud.Pinged / ud.TriedPings * 100}%</div>
                                                    {/*<div>DEBUG: {this.FailedRelays}</div>*/}
                                                    {/*{JSON.stringify(ud)}*/}
                                                </div>
                                            </Col>
                                        </Row>
                                    }
                                }
                            }
                            if (!this.ServerOnline) {
                                return <Row>
                                    <Col xs={6}>
                                        <div>{prettyName}:{port}</div>
                                    </Col>
                                    <Col xs={6}>
                                        <div style={{color: "white", backgroundColor: "Gray"}}>
                                            <div>\\\\\\\......Pinging Service Offline..../////</div>
                                            <div>\\\\\\\\\\......No Tests Ran....////////////</div>
                                            {/*<div>Average Ping Time: {ud.AverageTime.toFixed(3)} ms</div>*/}
                                            {/*<div>Ping Success Rate: {ud.Pinged / ud.TriedPings * 100}%</div>*/}

                                            {/*{JSON.stringify(ud)}*/}
                                        </div>
                                    </Col>
                                </Row>
                            }
                            return <Row>
                                <Col xs={6}>
                                    <div>{prettyName}:{port}</div>
                                </Col>
                                <Col xs={6}>
                                    <div style={{color: "black", backgroundColor: "Yellow"}}>
                                        <div>\\\\\\\......Pinging..../////</div>
                                        {/*<div>Average Ping Time: {ud.AverageTime.toFixed(3)} ms</div>*/}
                                        {/*<div>Ping Success Rate: {ud.Pinged / ud.TriedPings * 100}%</div>*/}

                                        {/*{JSON.stringify(ud)}*/}
                                    </div>
                                </Col>
                            </Row>


                            // var r = this.Ping.Ping(prettyName,port)

                            return (
                                <div>{JSON.stringify(a)}</div>
                            )
                        })}
                        </td>
                    </tr>
                    <tr>
                        <td colSpan={4}
                            className={"text-center"}><h3>Pool Check: {this.state.ServerData.Hash == data?.meta_hash &&
                        data?.pool_id_bech32 != null && data?.pool_id_bech32.length > 0 && data?.active_epoch_no != null &&
                        data?.margin != null &&
                        this.FailedRelays == 0 &&
                        pledge <= live_pledge &&
                        this.FailedRelays == 0 || this.FailedRelays == -1 &&
                        data?.pool_status.toLowerCase() === "registered" ? pt : npt}</h3></td>
                    </tr>

                </table>
            </div>
        )
    }

}

Results.propTypes = {
    Key: PropTypes.string.isRequired,

}