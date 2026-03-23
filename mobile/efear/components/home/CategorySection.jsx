import React from 'react';
import OwlCarousel from 'react-owl-carousel';

export const CategorySection = () => {

    const carouselOptions = {
    loop: true,
    margin: 10,
    responsiveClass: true,
    nav: false,
    dots: false,
    responsive: {
      0: {
        items: 1
      },
      576: {
        items: 2
      },
      768: {
        items: 3
      },
      1366: {
        items: 4
      },
      1400: {
        items: 5
      }
    }
  };
  
  return (
    <section className="py-4">
      <div className="container">
        <div className="d-flex align-items-center">
          <h5 className="text-uppercase mb-0">Browse Catergory</h5>
          <a href="/shop-categories" className="btn btn-light ms-auto rounded-0">View All<i className='bx bx-chevron-right'></i></a>
        </div>
        <hr/>
        <div className="product-grid">
          <OwlCarousel 
            className='browse-category owl-carousel owl-theme'
             {...carouselOptions}
          >
            <div className="item">
              <div className="card rounded-0 product-card border">
                <div className="card-body">
                  <img src="assets/images/comics/promo/06.png" className="img-fluid" alt="..." />
                </div>
                <div className="card-footer text-center">
                  <h6 className="mb-1 text-uppercase">Comics</h6>
                  <p className="mb-0 font-12 text-uppercase">10 Products</p>
                </div>
              </div>
            </div>
            <div className="item">
              <div className="card rounded-0 product-card border">
                <div className="card-body">
                  <img src="assets/images/ebooks/02.jpg" className="img-fluid" alt="..." />
                </div>
                <div className="card-footer text-center">
                  <h6 className="mb-1 text-uppercase">E-Books</h6>
                  <p className="mb-0 font-12 text-uppercase">8 Products</p>
                </div>
              </div>
            </div>
            <div className="item">
              <div className="card rounded-0 product-card border">
                <div className="card-body">
                  <img src="assets/images/comics/promo/05.png" className="img-fluid" alt="..." />
                </div>
                <div className="card-footer text-center">
                  <h6 className="mb-1 text-uppercase">Manga</h6>
                  <p className="mb-0 font-12 text-uppercase">14 Products</p>
                </div>
              </div>
            </div>
            <div className="item">
              <div className="card rounded-0 product-card border">
                <div className="card-body">
                  <img src="assets/images/comics/promo/04.png" className="img-fluid" alt="..." />
                </div>
                <div className="card-footer text-center">
                  <h6 className="mb-1 text-uppercase">Graphic Novels</h6>
                  <p className="mb-0 font-12 text-uppercase">6 Products</p>
                </div>
              </div>
            </div>
            <div className="item">
              <div className="card rounded-0 product-card border">
                <div className="card-body">
                  <img src="assets/images/comics/promo/03.png" className="img-fluid" alt="..." />
                </div>
                <div className="card-footer text-center">
                  <h6 className="mb-1 text-uppercase">Star Trek</h6>
                  <p className="mb-0 font-12 text-uppercase">6 Products</p>
                </div>
              </div>
            </div>
            <div className="item">
              <div className="card rounded-0 product-card border">
                <div className="card-body">
                  <img src="assets/images/categories/06.png" className="img-fluid" alt="..." />
                </div>
                <div className="card-footer text-center">
                  <h6 className="mb-1 text-uppercase">Manga</h6>
                  <p className="mb-0 font-12 text-uppercase">5 Products</p>
                </div>
              </div>
            </div>
            <div className="item">
              <div className="card rounded-0 product-card border">
                <div className="card-body">
                  <img src="assets/images/categories/07.png" className="img-fluid" alt="..." />
                </div>
                <div className="card-footer text-center">
                  <h6 className="mb-1 text-uppercase">Basketball Cards</h6>
                  <p className="mb-0 font-12 text-uppercase">20 Products</p>
                </div>
              </div>
            </div>
            <div className="item">
              <div className="card rounded-0 product-card border">
                <div className="card-body">
                  <img src="assets/images/categories/08.png" className="img-fluid" alt="..." />
                </div>
                <div className="card-footer text-center">
                  <h6 className="mb-1 text-uppercase">Collectibles</h6>
                  <p className="mb-0 font-12 text-uppercase">16 Products</p>
                </div>
              </div>
            </div>
            <div className="item">
              <div className="card rounded-0 product-card border">
                <div className="card-body">
                  <img src="assets/images/categories/09.png" className="img-fluid" alt="..." />
                </div>
                <div className="card-footer text-center">
                  <h6 className="mb-1 text-uppercase">Sports</h6>
                  <p className="mb-0 font-12 text-uppercase">28 Products</p>
                </div>
              </div>
            </div>
            <div className="item">
              <div className="card rounded-0 product-card border">
                <div className="card-body">
                  <img src="assets/images/categories/10.png" className="img-fluid" alt="..." />
                </div>
                <div className="card-footer text-center">
                  <h6 className="mb-1 text-uppercase">Marvel</h6>
                  <p className="mb-0 font-12 text-uppercase">15 Products</p>
                </div>
              </div>
            </div>
            <div className="item">
              <div className="card rounded-0 product-card border">
                <div className="card-body">
                  <img src="assets/images/categories/11.png" className="img-fluid" alt="..." />
                </div>
                <div className="card-footer text-center">
                  <h6 className="mb-1 text-uppercase">DC</h6>
                  <p className="mb-0 font-12 text-uppercase">24 Products</p>
                </div>
              </div>
            </div>
            <div className="item">
              <div className="card rounded-0 product-card border">
                <div className="card-body">
                  <img src="assets/images/categories/12.png" className="img-fluid" alt="..." />
                </div>
                <div className="card-footer text-center">
                  <h6 className="mb-1 text-uppercase">Toys</h6>
                  <p className="mb-0 font-12 text-uppercase">18 Products</p>
                </div>
              </div>
            </div>
          
          </OwlCarousel>

        </div>
      </div>
    </section>
  );
}

export default CategorySection;
;
