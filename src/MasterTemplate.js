import {Component} from "react";

import "./style.css"
import {Outlet} from "react-router-dom";
import {Col, Row} from "react-bootstrap";

export default class MasterTemplate extends Component {

    render() {
        return <div className="App">
            <aside class="sidebar position-fixed top-0 left-0 overflow-auto h-100 float-left"
                   id="show-side-navigation1">
                <i class="uil-bars close-aside d-md-none d-lg-none"
                   data-close="show-side-navigation1"></i>
                <div class="sidebar-header d-flex justify-content-center align-items-center px-3 py-4">
                    <img
                        class="rounded-pill img-fluid"
                        width="60"
                        src="https://red-sky.one/wp-content/uploads/2022/01/enigma-small.png"
                        alt=""/>
                    <div class="ms-2">
                        <h5 class="fs-6 mb-0">
                            <a class="text-decoration-none"
                               href="/#">Enigma SPO</a>
                        </h5>
                        <p class="mt-1 mb-0">Ticker one</p>
                    </div>
                </div>
                <div class="search position-relative text-center px-4 py-3 mt-2">
                </div>

                <ul class="categories list-unstyled">
                    <li class="">
                        <i class="uil-estate fa-fw"></i><a href="https://red-sky.one/"
                                                           target="_blank"
                                                           rel="noopener noreferrer">Pool website</a>
                    </li>
                    <li class="">
                        <i class="uil-bag"></i><a href="https://cardano-solutions.com/stake?t=FWXCfYBP82NG9ObGKhh1Fsb3Gmk35u&wallet=yoroi,flint,nami,eternl,gerowallet"
                                                  target="_blank"
                                                  rel="noopener noreferrer">Stake with one click</a>
                    </li>
                    <li class="">
                        <i class="uil-estate fa-fw"></i><a href="https://cexplorer.io/pool/pool18qzks8vdf0yu0u5ccf8aaj35q6zfutdcfgrssuvdjmgtyykr922"
                                                           target="_blank"
                                                           rel="noopener noreferrer">View us on ADApool</a>
                    </li>
                    <li class="">
                        <i class="uil-estate fa-fw"></i><a href="https://pooltool.io/pool/3805681d8d4bc9c7f298c24fdeca3406849e2db84a0708718d96d0b2/epochs"
                                                           target="_blank"
                                                           rel="noopener noreferrer">View us on pooltools</a>
                    </li>
                </ul>

                <Row>
                    <Col style={{color:"gray",marginTop:"10%",marginLeft:"15%"}} className={" ps-4"}>Cooked with ❤️️ by <br></br><a style={{color:"gray"}}href={"https://twitter.com/yungtechboy1"}>Yung</a> & <a style={{color:"gray"}}href={"https://twitter.com/EnigmA_SPO"}>one</a></Col>
                </Row>
            </aside>
            {/* <!-- End of side bar --> */}
            <Outlet/>



        </div>

    }
}