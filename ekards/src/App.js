import { CommonProvider } from './contexts/common/commonContext';
import { CartProvider } from './contexts/cart/cartContext';
import Header from './components/common/Header';
import RouterRoutes from './routes/RouterRoutes';
import Footer from './components/common/Footer';
import BackTop from './components/common/BackTop';
import { FiltersProvider } from './contexts/filters/filtersContext';
import { BrowserRouter } from "react-router-dom";


const App = () => {
  return (
    <>
    <BrowserRouter>

          {/*<Header />
            <RouterRoutes />
            <Footer />
            <BackTop />
          */}
          <RouterRoutes />
    </BrowserRouter>
    </>
  );
};

export default App;
