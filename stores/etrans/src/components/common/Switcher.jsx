
const ColorSwitcher = () => {

    return (
        <>
            <div className="switcher-wrapper">
                <div className="switcher-btn"> <i className='bx bx-cog bx-spin'></i>
                </div>

                <div className="switcher-body">
                    <div className="d-flex align-items-center">
                        <h5 className="mb-0 text-uppercase">Theme Customizer</h5>
                        <button type="button" className="btn-close ms-auto close-switcher" aria-label="Close"></button>
                    </div>
                    <p className="mb-0">Gaussian Texture</p>
                    <hr />
                    <ul className="switcher">
                        <li id="theme1"></li>
                        <li id="theme2"></li>
                        <li id="theme3"></li>
                        <li id="theme4"></li>
                        <li id="theme5"></li>
                        <li id="theme6"></li>
                    </ul>
                    <hr />
                    <p className="mb-0">Gradient Background</p>
                    <hr />
                    <ul className="switcher">
                        <li id="theme7"></li>
                        <li id="theme8"></li>
                        <li id="theme9"></li>
                        <li id="theme10"></li>
                        <li id="theme11"></li>
                        <li id="theme12"></li>
                        <li id="theme13"></li>
                        <li id="theme14"></li>
                        <li id="theme15"></li>
                    </ul>
                </div>

            </div>
        </>

    );
}

export default ColorSwitcher;