import React, { useEffect } from "react";
import { useSelector } from "react-redux";
import BannerSub from "../components/Banner/BannerSub"
import Brands from "../components/Brands/Brands";
import DetailedItem from "../components/Product/DetailedItem";
import CollectionItem from "../components/Product/CollectionItem";
import { Product } from "../features/products/slice";
import { store } from "../features/store";

const Collection = (products) => {
  const productState = useSelector(state => state?.product?.data)
  const { loading } = useSelector(state => state?.product);

  useEffect(() => {

    store.dispatch(Product.fetch());
  }, [])

  return (
    <>
      {loading ? (
        <>
        </>

      ) : (
        <>
          <BannerSub />
          <main className="float-start w-100 total-body home-body mt-0">
            <section className="category float-start w-100 position-relative">
              <div className="cloos pulse">
                <img alt="cool" src="images/cool.png" />
              </div>
              <div className="container">
                <h5 className="sub-heading mb-2 text-center"> category</h5>
                <h2 className="text-center page-haeding"> Broswe by category</h2>
                <div className="row row-cols-1 row-cols-sm-2 row-cols-lg-3 g-5 mt-0">
                  <div className="col" data-aos="flip-right">
                    <a href="collection.html#" className="items-collection d-inline-block w-100 position-relative">
                      <div className="img-hbox">
                        <img alt="sbh" src="images/se1.png" />

                      </div>
                      <h5 className="btn"> Action & Adventure <span>(15)</span> </h5>
                    </a>
                  </div>

                  <div className="col" data-aos="flip-up">
                    <a href="collection.html#" className="items-collection d-inline-block w-100 position-relative">
                      <div className="img-hbox">
                        <img alt="sbh" src="images/tim-hufner-9qBSeAN9vps-unsplash.jpg" />

                      </div>
                      <h5 className="btn"> Fantasy Novels <span>(15)</span> </h5>
                    </a>
                  </div>

                  <div className="col">
                    <a href="collection.html#" className="items-collection d-inline-block w-100 position-relative">
                      <div className="img-hbox">
                        <img alt="sbh" src="images/brett-jordan-CsZQ50xO35I-unsplash.jpg" />

                      </div>
                      <h5 className="btn"> Art of Comics <span>(15)</span> </h5>
                    </a>
                  </div>

                  <div className="col">
                    <a href="collection.html#" className="items-collection d-inline-block w-100 position-relative">
                      <div className="img-hbox">
                        <img alt="sbh" src="images/waldemar-eIOPDU3Fkwk-unsplash.jpg" />

                      </div>
                      <h5 className="btn"> Biographies & History <span>(15)</span> </h5>
                    </a>
                  </div>

                  <div className="col">
                    <a href="collection.html#" className="items-collection d-inline-block w-100 position-relative">
                      <div className="img-hbox">
                        <img alt="sbh" src="images/_742c2c04-e263-11e7-814a-000c05070a4c.jpg" />

                      </div>
                      <h5 className="btn"> Science Fiction <span>(15)</span> </h5>
                    </a>
                  </div>

                  <div className="col">
                    <a href="collection.html#" className="items-collection d-inline-block w-100 position-relative">
                      <div className="img-hbox">
                        <img alt="sbh" src="images/25comic-l.webp" />

                      </div>
                      <h5 className="btn"> Superhero Comics <span>(15)</span> </h5>
                    </a>
                  </div>

                </div>
              </div>

              <div className="eg-bg">
                <img alt="ser" src="images/edge1-d.svg" />
              </div>
            </section>

            <section className="features-collection float-start w-100 position-relative">
              <div className="container">
                <h2 className="text-center page-haeding text-white"> Promote & featured collection</h2>


      
                          <div className="row row-cols-1 row-cols-md-2 row-cols-xl-3 g-lg-5">
                      {productState && productState.slice(0, 9).map((item) => {
                        return (
                          <DetailedItem {...item} key={item._id} />
                        )
                      })}
                    </div>
                <a href="collection.html#" className="btn comon-button mx-auto d-table aos-init aos-animate" data-aos="fade-up">  <span> <i className="fas fa-arrow-right"></i> See More </span> </a>
              </div>
              <div className="pow pulse">
                <img alt="cool" src="images/34fd74b9-object-3.png" />
              </div>

            </section>

            )
            <Brands />
          </main>
        </>
      )}
    </>
  )
}

export default Collection;

