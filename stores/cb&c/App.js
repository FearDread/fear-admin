import React, { Suspense, useEffect } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useSelector } from "react-redux";

import Layout from "./layout/layout";
import Home from "./pages/home.jsx";

import store from "./features/store";

import "assets/css/bootstrap.min.css"
import "assets/css/all.min.css";
import 'assets/css/swiper-bundle.min.css';
import "assets/css/animate.css";
import "assets/css/nice-select.css";
import "assets/css/style.css";

export const App = () => {


    return (
        <BrowserRouter>
            <Suspense >
                <Routes>

                    <Route path="/" element={<Layout />}>

                        <Route index element={<Home />} />

                    </Route>
                </Routes>
            </Suspense>
        </BrowserRouter>

    )
}