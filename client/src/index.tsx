import React from "react";
import ReactDOM from "react-dom";
import {Router} from "react-router";
import {createBrowserHistory} from "history";

import App from "./App/App";

const history = createBrowserHistory();

const rootElement = document.getElementById("root");
ReactDOM.render(
    <React.StrictMode>
        <Router history={history}>
            <App/>
        </Router>
    </React.StrictMode>,
    rootElement
);
