import React, { useEffect, useLayoutEffect } from "react";
import { Outlet } from "react-router-dom";

import Header from "../components/header/Header";
import Footer from "../components/footer/Footer";
import Sidebar from "../components/sidebar/Sidebar";

import routes from "../router/Routes";
//import logo from "assets/img/FEAR/logo.png";

const AdminLayout = ({children}) => {

  const handleSidebar = () => {

  }

  const handleToTop = () => {

  }

  useEffect(() => {

  }, []);


  return (
    <>
      
      <div id="wrapper">
        <Sidebar        
        routes={routes} 
        />
      
      <Header onToggleSidebar={handleSidebar}/>
      <div className="clearfix"></div>
      <div className="content-wrapper">
        {(children) ? children : <Outlet />}
      </div>
      <button onClick={handleToTop} className="back-to-top"><i className="fa fa-angle-double-up"></i> </button>
      <Footer />
      </div>
    </>
  )
}

export default AdminLayout;
  /*
  const dispatch = useDispatch();
  const [activeColor, setActiveColor] = React.useState("blue");
  const [sidebarMini, setSidebarMini] = React.useState(false);
  const [opacity, setOpacity] = React.useState(0);
  const [sidebarOpened, setSidebarOpened] = React.useState(true);
  const mainPanelRef = React.useRef(null);
  const notificationAlertRef = React.useRef(null);
  const location = useLocation();
  const { user, isLoggedIn } = useSelector((state) => state.auth);
  const history = useHistory();

    useEffect(() => { 
     if (!isLoggedIn) {
        history.push("/auth/login");
     }
  
    }, [history, isLoggedIn]);

  useEffect(() => {
    document.body.classList.remove("sidebar-mini");
    document.documentElement.scrollTop = 0;
    document.scrollingElement.scrollTop = 0;

    if (mainPanelRef.current) {
      mainPanelRef.current.scrollTop = 0;
    }
  }, [location]);

  const handleMiniClick = () => {
    let notifyMessage = "Sidebar mini ";
    if (document.body.classList.contains("sidebar-mini")) {
      setSidebarMini(false);
      notifyMessage += "deactivated...";
    } else {
      setSidebarMini(true);
      notifyMessage += "activated...";
    }
    let options = {};
    options = {
      place: "tr",
      message: notifyMessage,
      type: "primary",
      icon: "tim-icons icon-bell-55",
      autoDismiss: 7
    };
    notificationAlertRef.current.notificationAlert(options);
    document.body.classList.toggle("sidebar-mini");
  };
  const toggleSidebar = () => {
    setSidebarOpened(!sidebarOpened);
    document.documentElement.classList.toggle("nav-open");
  };
  const closeSidebar = () => {
    setSidebarOpened(false);
    document.documentElement.classList.remove("nav-open");
  };
  return (
    <div className="wrapper">
      <div className="rna-container">
        <NotificationAlert ref={notificationAlertRef} />
      </div>
      <div className="navbar-minimize-fixed" style={{ opacity: opacity }}>
        <button
          className="minimize-sidebar btn btn-link btn-just-icon"
          onClick={handleMiniClick}
        >
          <i className="tim-icons icon-align-center visible-on-sidebar-regular text-muted" />
          <i className="tim-icons icon-bullet-list-67 visible-on-sidebar-mini text-muted" />
        </button>
      </div>
      <Sidebar
        {...props}
        routes={routes}
        activeColor={activeColor}
        logo={{
          outterLink: "http://fear.master.com/",
          text: "F.E.A.R Admin",
          imgSrc: logo
        }}
        closeSidebar={closeSidebar}
      />
      <div className="main-panel" ref={mainPanelRef} data={activeColor}>
        <AdminNavbar
          {...props}
          handleMiniClick={handleMiniClick}
          brandText={Router.getActiveRoute(routes)}
          sidebarOpened={sidebarOpened}
          toggleSidebar={toggleSidebar}
        />
        <Switch>
          {Router.getRoutes(routes)}
          <Route path="/admin/product/edit/:id" render={() => <ProductEdit />} />
          <Redirect from="*" to="/admin/dashboard" />
        </Switch>
        <Footer />
      </div>
    </div>
  );
};

export default Admin;
/*

  // Stripe options configuration
  const stripeOptions = useMemo(() => ({
    // Stripe Elements appearance customization
    appearance: {
      theme: 'stripe',
      variables: {
        colorPrimary: '#0570de',
        colorBackground: '#ffffff',
        colorText: '#30313d',
        colorDanger: '#df1b41',
        fontFamily: 'Ideal Sans, system-ui, sans-serif',
        spacingUnit: '4px',
        borderRadius: '4px',
      },
    },
  }), []);

  return (
    <Elements stripe={stripePromise} options={stripeOptions}>
      <b className="screen-overlay"></b>
      <div className="wrapper">
        <Header />
      </div>
      <div className="page-wrapper">
        <div className="page-content">
          {(!loading && products.length > 0) && (
            <>
              <Outlet {...products} />
            </>
          )}
          <BestSelling />
        </div>
      </div>
      <Footer categories={(!loading) ? categories : []} products={products}/>

      {selectedProduct && (
        <ProductQuickView 
          product={selectedProduct}
          isOpen={showQuickView}
          onClose={() => {
            setShowQuickView(false);
            setSelectedProduct(null);
          }}
        />
      )}
    </Elements>
  );
  */
