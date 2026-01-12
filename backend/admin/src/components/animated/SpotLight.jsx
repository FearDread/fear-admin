
import "../../assets/css/spotlight.css"

export const SpotLight = (props) => {

    return ( 
        
        <>
        <div className="spotlight-container">
                        <div class="tmp-banner-circle">
                <img class="tmp-banner-circle-1" src="/assets/images/circle-iamge/01.svg" alt="circle-image"/>
                <img class="tmp-banner-circle-2" src="/assets/images/circle-iamge/02.svg" alt="circle-image"/>
                <img class="tmp-banner-circle-3" src="/assets/images/circle-iamge/03.svg" alt="circle-image"/>
                <img class="tmp-banner-circle-4" src="/assets/images/circle-iamge/04.svg" alt="circle-image"/>
            
                <img class="tmp-banner-circle-2" src="/assets/images/circle-iamge/02.svg" alt="circle-image"/>
                <img class="tmp-banner-circle-3" src="/assets/images/circle-iamge/03.svg" alt="circle-image"/>
               
            </div>
                       <div class="separator-animated-border animated-true"></div>
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