import React, { Suspense, useEffect } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useSelector } from "react-redux";

import Layout from "./layout/Layout";
import Home from "./pages/Home";
import About from "./pages/About";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Shop from "./pages/Shop";
import Contact from "./pages/Contact";

import store from "./features/store";



export const App = () => {

    return (
        <BrowserRouter>
            <Suspense >
                <Routes>

                    <Route path="/" element={<Layout />}>

                        <Route index element={<Home />} />
                        <Route path="/about" element={<About />} />
                        <Route path="/shop" element={<Shop />} />
                        <Route path="/contact" element={<Contact />} />
                        <Route path="/login" element={<Login />} />
                        <Route path="/register" element={<Register />} />

                    </Route>
                </Routes>
            </Suspense>
        </BrowserRouter>

    )
}

export default App;