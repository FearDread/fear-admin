import { useSelector } from 'react-redux';
import OwlCarousel from 'react-owl-carousel';
import 'owl.carousel/dist/assets/owl.carousel.css';
import 'owl.carousel/dist/assets/owl.theme.default.css';

const Recommended = ({ data }) => {
    const productData = useSelector(state => state.product.data)

    return (
        <>

            <div className="reconded-procuts d-inline-block w-100 py-5">
                <h2>  Recommended  </h2>
                <OwlCarousel className='like-slide owl-carousel owl-theme mt-4' loop margin={10} nav>
                    {productData && productData?.slice(6, 12).map((item) => {
                        return (
                            <a href={'/product/' + item._id} className="shop-items super-items overflow-hidden d-inline-block w-100 position-relative" data-aos="fade-left">
                                <div className="img-box-div position-relative">
                                    <img alt="srt" src={item?.images && item?.images[0]?.url} />
                                    <span className="off">{item._id}</span>
                                </div>
                                <div className="details-shopi">
                                    <div className="row align-items-center">
                                        <div className="col-8">
                                            <h5 className="text-white"> {item.title}
                                                <span className="d-block"> {item.category} </span>
                                            </h5>
                                        </div>
                                        <div className="col-4">
                                            <h3 className="text-center"> ${item.price} <span className="d-block"> ${item.discount || 0} </span> </h3>
                                        </div>
                                    </div>

                                </div>

                            </a>
                        )
                    })}


                </OwlCarousel>
            </div>
        </>
    )
}

export default Recommended;