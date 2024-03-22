import React from "react";
import "./animated-hero.css";

const AnimatedHero = () => {

    return (
        <div className="hero-container">
            <p id='head1' className='animated-header'>Welcom to E-KomiX!</p>
            <p id='head2' className='animated-header'>We got ... </p>
            <p id='head3' className='animated-header'>Cards, Comics, Coins, and Collectibles</p>
            <p id='head4' className='animated-header'>Browse our Collection!</p>

                <button className="hero-button" onClick={(e) => {window.location.href="/products" }}>Shop Now!</button>
            
            <div className='light x1'></div>
            <div className='light x2'></div>
            <div className='light x3'></div>
            <div className='light x4'></div>
            <div className='light x5'></div>
            <div className='light x6'></div>
            <div className='light x7'></div>
            <div className='light x8'></div>
            <div className='light x9'></div>
        </div>
    )
}

export default AnimatedHero;