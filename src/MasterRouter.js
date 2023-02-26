import {Component} from "react";
import {BrowserRouter as Router, Route, Routes} from 'react-router-dom';
import MasterTemplate from "./MasterTemplate";
import App from "./App";
import NotFound from "./NotFound";
import PoolPage from "./PoolPage";

export default class MasterRouter extends Component {
    render() {
        return (
            <Router>
                <Routes>
                    <Route>
                        <Route path="/"
                               element={<MasterTemplate fullscreen={false}/>}>
                            <Route path="/home"
                                   caseSensitive={false}
                                   element={<App/>}/>
                            <Route path="/result/:id/:key"
                                   caseSensitive={false}
                                   element={<PoolPage/>}/>

                            <Route path="/" caseSensitive={false} element={<App/>}/>
                            <Route path="*"
                                   caseSensitive={false}
                                   element={<NotFound/>}/>
                        </Route>

                    </Route>
                </Routes>
            </Router>
        )
    }
}