// import logo from './logo.svg"';
// import './App.css';

import {Component} from "react";
import { Navigate } from 'react-router-dom';

export default class App extends Component {

    PoolCache = null;
    API_URL = 'https://api.koios.rest/api/v0/pool_list';
    API_HEADERS = {
        Accept: 'application/json',
    };

    constructor(props) {
        super(props);
        this.state = {
            Result: null
        }
    }

    async fetchPools(offset = 0, limit = 1000) {
        const response = await fetch(`${this.API_URL}?offset=${offset}&limit=${limit}`, {
            method: 'GET',
            headers: this.API_HEADERS,
        });
        return response.json();
    }

    onClickListener_Box(e,a,b=null,c=null){
        console.log("On Click Calllledddd With ",e,a,b,c)
        this.setState({"Result":<Navigate  to={"/result/"+e+"/"+a}/>})
        // sessionStorage.setItem("poolID", item.pool_id_bech32);
        // window.location.href = "result.html";

    }

    // componentDidMount() {
    // }

    Run1 = true
    // async componentWillMount() {
    async componentDidMount() {
        let offset = 0;
        let limit = 1000;
        // this.setState({PoolCache:await this.fetchPools(offset, limit)})
        //  await this.renderPools()//.then()
        if(this.PoolCache == null && this.Run1) {
            this.Run1 =false
            var f = await this.fetchPools(offset, limit)
                console.log("DONNEEEE", f)
            // this.fetchPools(offset, limit).then(value => {
            //     console.log("DONNEEEE", value)
                this.setState({PoolCache: f})
                this.PoolCache = f
            //     console.log("DONNEEEE2", value,this.PoolCache)
                this.renderPools(this.PoolCache).then()
            // })
        }
    }


    async renderPools(t = null) {
        let offset = 0;
        let limit = 1000;
        let hasMore = true;
        // const container = document.querySelector(".result");
        // console.log('CHecklkkkjk',container)
        var returnlist = []
        if(this.state?.PoolCache == null){
            // this.PoolCache = await this.fetchPools(offset, limit);
        }
        var search = this.state.search;
        // while (hasMore) {
            const pools = t ?? this.state.PoolCache
            console.log("TEST DA POOP DATA",pools)
            if(pools != null) {
                pools.forEach((item, index) => {
                    // create a new div element for each item

                    if (search != null) {
                        const lowercaseSearch = search.toLowerCase();
                        console.log("SEARCH CHECK", !item?.ticker?.toLowerCase().includes(lowercaseSearch), !item?.pool_id_bech32?.toLowerCase().includes(lowercaseSearch));
                        if (!item?.ticker?.toLowerCase().includes(lowercaseSearch) && !item?.pool_id_bech32?.toLowerCase().includes(lowercaseSearch)) {
                          return null;
                        }
                      }
                      
                    var randomColor = "#" + Math.floor(Math.random() * 16777215).toString(16);
                    var result = (
                        <div style={{backgroundColor: randomColor}}
                             className={"box"}
                             onClick={() => this.onClickListener_Box(item.ticker, item.pool_id_bech32)}>
                            <p>{item.ticker}</p><p>{item.pool_id_bech32}</p>
                        </div>
                    )
                    // const box = document.createElement("div");
                    // box.classList.add("box");
                    // generate a random color
                    // set the random color as the background-color of the box
                    // box.style.backgroundColor = color;
                    // insert the ticker and pool ID into the div
                    // box.innerHTML = `<!--<p>${item.ticker}</p><p>${item.pool_id_bech32}</p>-->`;
                    // add an event listener to the div that navigates to the result page and stores the pool ID in session
                    // storage
                    // box.addEventListener("click", event => {
                    //     sessionStorage.setItem("poolID", item.pool_id_bech32);
                    //     window.location.href = "result.html";
                    // });
                    // append the div to the container element
                    // container.appendChild(box);
                    returnlist.push(result)
                });
                offset += limit;
                hasMore = pools.length === limit;
            }else{
                hasMore = false
            }
            console.log("CHECK HAS MORE ",hasMore,pools)
        // }
        this.setState({Result:returnlist})
    }


    render() {
        if(this.state.Result == null) {
            // this.renderPools().then().catch(error => {
            //     // handle any errors that may have occurred
            // });
        }


        return (
            <div>
                {/* <!-- Main codes --> */}

                <section id="wrapper">
                    <nav class="navbar navbar-expand-md">
                        <div class="container-fluid mx-2">
                            <div class="navbar-header">
                                <a class="navbar-brand"
                                   href="/#">Vet<span class="main-color"> Cardano </span>Stake Pools</a>
                                <p class="navebar-text">See if Cardano pool that you are staking with is working or find
                                    out why it might not be!</p>
                            </div>
                        </div>
                    </nav>

                    <div class="p-4">
                        <br/>
                        <div class="welcome">
                            <div class="content rounded-3 p-3">
                                <div class="container">
                                    <form id="search-form">
                                        <input type="text"
                                               id="search"
                                               class="searchInput"
                                               name="search-input"
                                               placeholder="Enter pool Ticker (tickers are k Sensitive for this search)" onChange={(e)=>this.handleChange(e,this)} />
                                    </form>
                                    <br/>
                                    <div class="frame">
                                        <p style={{"font-family": "Andale Mono, monospace;"}}>
                                            Please stake some ADA to support our pool | Pool name: Enigma | Ticker: ONE
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <section class="charts mt-4">
                            <div class="chart-container p-3">
                                <h3 class="fs-6 mb-3">Pond of POOLS.</h3>
                                <div id="result"
                                     class="result">

                                    {this.state.Result}

                                    {/* <!-- Result will be displayed here --> */}
                                </div>
                                <div style={{"height": "auto"}}>
                                    <canvas id="chart3"
                                            width="100%"></canvas>
                                </div>

                            </div>
                        </section>
                    </div>
                </section>


            </div>
        );
    }

    async handleChange(e,t) {
        var v = e.target.value

        console.log("EVVVV",v)
        if(v == null || v.length == 0)return
        t.setState({"search":v});
        await this.renderPools();
    }
}

