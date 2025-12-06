import React, { Suspense, useEffect } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useSelector } from "react-redux";

import TerminalAgent from "./interfaces/terminal";
import AIChatInterface from "./interfaces/chat"

import "./assets/css/main.css";


export const App = () => {

    return (
        <BrowserRouter>
            <Suspense>
                <Routes>
	    		    <Route path="/" element={<TerminalAgent/>} />
			        <Route path="/chat" element={<AIChatInterface/>} />
                </Routes>
            </Suspense>
        </BrowserRouter>

    )
}

export default App;
