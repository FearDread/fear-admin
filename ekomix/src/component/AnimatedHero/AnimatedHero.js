import React from "react";
import "./animated-hero.css";

const AnimatedHero = () => {

    return (
        <div className="hero-container">
            <p id='head1' className='animated-header'>Awesome designs</p>
            <p id='head2' className='animated-header'>Just</p>
            <p id='head3' className='animated-header'>For you</p>
            <p id='head4' className='animated-header'>simple and awesome all the time</p>
            <p id='head5' className='animated-header'>Welcome to BA designs</p>
                
                <button className="hero-button">Continue</button>
            
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