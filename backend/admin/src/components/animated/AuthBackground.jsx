import React from "react";

const STREAKS = 14; // matches the 14 :nth-child rules in theme-dark.css

/**
 * Animated background for the auth pages (login, register).
 * Render once inside the page; the layer is fixed behind everything (z-index -1).
 *
 *   const Login = () => (
 *     <>
 *       <AuthBackground />
 *       <div className="card card-authentication1 mx-auto my-5"> ... </div>
 *     </>
 *   );
 */
const AuthBackground = () => (
    <div className="auth-bg" aria-hidden="true">
        <div className="auth-bg__stars">
            <i />
            <i />
            <i />
        </div>
        <div className="auth-bg__orb auth-bg__orb--1" />
        <div className="auth-bg__orb auth-bg__orb--2" />
        <div className="auth-bg__orb auth-bg__orb--3" />
        <div className="auth-bg__rain">
            {Array.from({ length: STREAKS }, (_, i) => (
                <i key={i} />
            ))}
        </div>
        <div className="auth-bg__floor">
            <div className="auth-bg__grid" />
        </div>
    </div>
);

export default AuthBackground;