
import "../../assets/css/spotlight.css"

export const SpotLight = (props) => {

    return ( 
        
        <>
        <div className="spotlight-container">

                       <div className="separator-animated-border animated-true"></div>
            <div className="slider-bg-light">
                
                <img className="blocksync-scroll-trigger fade_in animation-order-8" src="/assets/images/bg/light.svg" alt="Top Light Shape"/>
            </div>
            <div className="slider-bg-dot-shape">
                <div className="wrapper blocksync-scroll-trigger blocksync-stars-area fade_in animation-order-16">
                    <div className="blocksync-stars"></div>
                    <div className="blocksync-stars2"></div>
                    <div className="blocksync-stars3"></div>
                </div>
            </div>

        </div>

        </>
    )
}
export default SpotLight;