import React, { Suspense, useEffect } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useSelector } from "react-redux";

import AgentTerminal from "./interfaces/terminal";
import AgentWebInterface from "./interfaces/chat"

export const App = () => {

    return (
        <BrowserRouter>
            <Suspense >
                <Routes>

	    		<Route path="/terminal" element={<AgentTerminal/>} />
			<Route path="/chat" element={<AgentWebInterface/>} />
                </Routes>
            </Suspense>
        </BrowserRouter>

    )
}

export default App;
