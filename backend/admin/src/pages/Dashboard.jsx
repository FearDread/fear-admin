import React, { useState } from 'react';


const RecentOrdersTable = () => {
  const orders = [
    { product: 'Iphone 5', id: '#9405822', amount: '$1250.00', date: '03 Aug 2017', progress: 90 },
    { product: 'Earphone GL', id: '#9405820', amount: '$1500.00', date: '03 Aug 2017', progress: 60 },
    { product: 'HD Hand Camera', id: '#9405830', amount: '$1400.00', date: '03 Aug 2017', progress: 70 },
    { product: 'Clasic Shoes', id: '#9405825', amount: '$1200.00', date: '03 Aug 2017', progress: 100 },
    { product: 'Hand Watch', id: '#9405840', amount: '$1800.00', date: '03 Aug 2017', progress: 40 },
    { product: 'Clasic Shoes', id: '#9405825', amount: '$1200.00', date: '03 Aug 2017', progress: 100 }
  ];

  return (
    <div className="card">
      <div className="card-header bg-dark text-white d-flex justify-content-between align-items-center">
        <span>Recent Order Tables</span>
        <button className="btn btn-sm btn-link text-white">
          <i className="fas fa-ellipsis-v"></i>
        </button>
      </div>
      <div className="table-responsive">
        <table className="table table-hover mb-0">
          <thead className="bg-secondary text-white">
            <tr>
              <th>Product</th>
              <th>Photo</th>
              <th>Product ID</th>
              <th>Amount</th>
              <th>Date</th>
              <th>Shipping</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order, idx) => (
              <tr key={idx}>
                <td>{order.product}</td>
                <td>
                  <img src="https://via.placeholder.com/50x50" alt={order.product} style={{ width: '50px', height: '50px' }} />
                </td>
                <td>{order.id}</td>
                <td>{order.amount}</td>
                <td>{order.date}</td>
                <td>
                  <div className="progress" style={{ height: '3px' }}>
                    <div className="progress-bar" style={{ width: `${order.progress}%` }}></div>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};


const Dashboard = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const statsData = [
    { value: '9526', label: 'Total Orders', icon: 'fas fa-shopping-cart', change: '+4.2%', progress: 55 },
    { value: '8323', label: 'Total Revenue', icon: 'fas fa-dollar-sign', change: '+1.2%', progress: 55 },
    { value: '6200', label: 'Visitors', icon: 'fas fa-eye', change: '+5.2%', progress: 55 },
    { value: '5630', label: 'Messages', icon: 'fas fa-leaf', change: '+2.2%', progress: 55 }
  ];

  return (
    <>
      <div className="container-fluid">
        <div className="card mt-3 media-object">
          <div className="card-content">
            <div className="row row-group m-0">
              <div className="col-12 col-lg-6 col-xl-3 border-light">
                <div className="card-body">
                  <h5 className="text-white mb-0">9526 <span className="float-right"><i className="fa fa-shopping-cart"></i></span></h5>
                  <div className="progress my-3" style={{ 'height': '3px' }}>
                    <div className="progress-bar" style={{ 'width': '55%' }}></div>
                  </div>
                  <p className="mb-0 text-white small-font">Total Orders <span className="float-right">+4.2% <i className="zmdi zmdi-long-arrow-up"></i></span></p>
                </div>
              </div>
              <div className="col-12 col-lg-6 col-xl-3 border-light">
                <div className="card-body">
                  <h5 className="text-white mb-0">8323 <span className="float-right"><i className="fa fa-usd"></i></span></h5>
                  <div className="progress my-3" style={{ 'height': '3px' }}>
                    <div className="progress-bar" style={{ 'width': '55%' }}></div>
                  </div>
                  <p className="mb-0 text-white small-font">Total Revenue <span className="float-right">+1.2% <i className="zmdi zmdi-long-arrow-up"></i></span></p>
                </div>
              </div>
              <div className="col-12 col-lg-6 col-xl-3 border-light">
                <div className="card-body">
                  <h5 className="text-white mb-0">6200 <span className="float-right"><i className="fa fa-eye"></i></span></h5>
                  <div className="progress my-3" style={{ 'height': '3px' }}>
                    <div className="progress-bar" style={{ 'width': '55%' }}></div>
                  </div>
                  <p className="mb-0 text-white small-font">Visitors <span className="float-right">+5.2% <i className="zmdi zmdi-long-arrow-up"></i></span></p>
                </div>
              </div>
              <div className="col-12 col-lg-6 col-xl-3 border-light">
                <div className="card-body">
                  <h5 className="text-white mb-0">5630 <span className="float-right"><i className="fa fa-envira"></i></span></h5>
                  <div className="progress my-3" style={{ 'height': '3px' }}>
                    <div className="progress-bar" style={{ 'width': '55%' }}></div>
                  </div>
                  <p className="mb-0 text-white small-font">Messages <span className="float-right">+2.2% <i className="zmdi zmdi-long-arrow-up"></i></span></p>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="row">
          <div className="col-12 col-lg-8 col-xl-8">
            <div className="card media-object">
              <div className="card-header">Site Traffic
                <div className="card-action">
                  <div className="dropdown">
                    <a href="javascript:void();" className="dropdown-toggle dropdown-toggle-nocaret" data-toggle="dropdown">
                      <i className="icon-options"></i>
                    </a>
                    <div className="dropdown-menu dropdown-menu-right">
                      <a className="dropdown-item" href="javascript:void();">Action</a>
                      <a className="dropdown-item" href="javascript:void();">Another action</a>
                      <a className="dropdown-item" href="javascript:void();">Something else here</a>
                      <div className="dropdown-divider"></div>
                      <a className="dropdown-item" href="javascript:void();">Separated link</a>
                    </div>
                  </div>
                </div>
              </div>
              <div className="card-body">
                <ul className="list-inline">
                  <li className="list-inline-item"><i className="fa fa-circle mr-2 text-white"></i>New Visitor</li>
                  <li className="list-inline-item"><i className="fa fa-circle mr-2 text-light"></i>Old Visitor</li>
                </ul>
                <div className="chart-container-1">
                  <canvas id="chart1"></canvas>
                </div>
              </div>
              <div className="row m-0 row-group text-center border-top border-light-3">
                <div className="col-12 col-lg-4">
                  <div className="p-3">
                    <h5 className="mb-0">45.87M</h5>
                    <small className="mb-0">Overall Visitor <span> <i className="fa fa-arrow-up"></i> 2.43%</span></small>
                  </div>
                </div>
                <div className="col-12 col-lg-4">
                  <div className="p-3">
                    <h5 className="mb-0">15:48</h5>
                    <small className="mb-0">Visitor Duration <span> <i className="fa fa-arrow-up"></i> 12.65%</span></small>
                  </div>
                </div>
                <div className="col-12 col-lg-4">
                  <div className="p-3">
                    <h5 className="mb-0">245.65</h5>
                    <small className="mb-0">Pages/Visit <span> <i className="fa fa-arrow-up"></i> 5.62%</span></small>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="col-12 col-lg-4 col-xl-4">
            <div className="card">
              <div className="card-header">Weekly sales
                <div className="card-action">
                  <div className="dropdown">
                    <a href="javascript:void();" className="dropdown-toggle dropdown-toggle-nocaret" data-toggle="dropdown">
                      <i className="icon-options"></i>
                    </a>
                    <div className="dropdown-menu dropdown-menu-right">
                      <a className="dropdown-item" href="javascript:void();">Action</a>
                      <a className="dropdown-item" href="javascript:void();">Another action</a>
                      <a className="dropdown-item" href="javascript:void();">Something else here</a>
                      <div className="dropdown-divider"></div>
                      <a className="dropdown-item" href="javascript:void();">Separated link</a>
                    </div>
                  </div>
                </div>
              </div>
              <div className="card-body">
                <div className="chart-container-2">
                  <canvas id="chart2"></canvas>
                </div>
              </div>
              <div className="table-responsive">
                <table className="table align-items-center">
                  <tbody>
                    <tr>
                      <td><i className="fa fa-circle text-white mr-2"></i> Direct</td>
                      <td>$5856</td>
                      <td>+55%</td>
                    </tr>
                    <tr>
                      <td><i className="fa fa-circle text-light-1 mr-2"></i>Affiliate</td>
                      <td>$2602</td>
                      <td>+25%</td>
                    </tr>
                    <tr>
                      <td><i className="fa fa-circle text-light-2 mr-2"></i>E-mail</td>
                      <td>$1802</td>
                      <td>+15%</td>
                    </tr>
                    <tr>
                      <td><i className="fa fa-circle text-light-3 mr-2"></i>Other</td>
                      <td>$1105</td>
                      <td>+5%</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
        <div className="row">
          <div className="col-12 col-lg-12">
            <div className="card">
              <div className="card-header">Recent Order Tables
                <div className="card-action">
                  <div className="dropdown">
                    <a href="javascript:void();" className="dropdown-toggle dropdown-toggle-nocaret" data-toggle="dropdown">
                      <i className="icon-options"></i>
                    </a>
                    <div className="dropdown-menu dropdown-menu-right">
                      <a className="dropdown-item" href="javascript:void();">Action</a>
                      <a className="dropdown-item" href="javascript:void();">Another action</a>
                      <a className="dropdown-item" href="javascript:void();">Something else here</a>
                      <div className="dropdown-divider"></div>
                      <a className="dropdown-item" href="javascript:void();">Separated link</a>
                    </div>
                  </div>
                </div>
              </div>
              <div className="table-responsive">
                <table className="table align-items-center table-flush table-borderless">
                  <thead>
                    <tr>
                      <th>Product</th>
                      <th>Photo</th>
                      <th>Product ID</th>
                      <th>Amount</th>
                      <th>Date</th>
                      <th>Shipping</th>
                    </tr>
                  </thead>
                  <tbody><tr>
                    <td>Iphone 5</td>
                    <td><img src="https://via.placeholder.com/110x110" className="product-img" alt="product img" /></td>
                    <td>#9405822</td>
                    <td>$ 1250.00</td>
                    <td>03 Aug 2017</td>
                    <td><div className="progress shadow" style={{ 'height': '3px' }}>
                      <div className="progress-bar" role="progressbar" style={{ 'width': '90%' }}></div>
                    </div></td>
                  </tr>
                    <tr>
                      <td>Earphone GL</td>
                      <td><img src="https://via.placeholder.com/110x110" className="product-img" alt="product img" /></td>
                      <td>#9405820</td>
                      <td>$ 1500.00</td>
                      <td>03 Aug 2017</td>
                      <td><div className="progress shadow" style={{ 'height': '3px' }}>
                        <div className="progress-bar" role="progressbar" style={{ 'width': '60%' }}></div>
                      </div></td>
                    </tr>
                    <tr>
                      <td>HD Hand Camera</td>
                      <td><img src="https://via.placeholder.com/110x110" className="product-img" alt="product img" /></td>
                      <td>#9405830</td>
                      <td>$ 1400.00</td>
                      <td>03 Aug 2017</td>
                      <td><div className="progress shadow" style={{ 'height': '3px' }}>
                        <div className="progress-bar" role="progressbar" style={{ 'width': '70%' }}></div>
                      </div></td>
                    </tr>
                    <tr>
                      <td>Clasic Shoes</td>
                      <td><img src="https://via.placeholder.com/110x110" className="product-img" alt="product img" /></td>
                      <td>#9405825</td>
                      <td>$ 1200.00</td>
                      <td>03 Aug 2017</td>
                      <td><div className="progress shadow" style={{ 'height': '3px' }}>
                        <div className="progress-bar" role="progressbar" style={{ 'width': '100%' }}></div>
                      </div></td>
                    </tr>
                    <tr>
                      <td>Hand Watch</td>
                      <td><img src="https://via.placeholder.com/110x110" className="product-img" alt="product img" /></td>
                      <td>#9405840</td>
                      <td>$ 1800.00</td>
                      <td>03 Aug 2017</td>
                      <td><div className="progress shadow" style={{ 'height': '3px' }}>
                        <div className="progress-bar" role="progressbar" style={{ 'width': '40%' }}></div>
                      </div></td>
                    </tr>
                    <tr>
                      <td>Clasic Shoes</td>
                      <td><img src="https://via.placeholder.com/110x110" className="product-img" alt="product img" /></td>
                      <td>#9405825</td>
                      <td>$ 1200.00</td>
                      <td>03 Aug 2017</td>
                      <td><div className="progress shadow" style={{ 'height': '3px' }}>
                        <div className="progress-bar" role="progressbar" style={{ 'width': '100%' }}></div>
                      </div></td>
                    </tr>
                  </tbody></table>
              </div>
            </div>
          </div>
        </div>
        <div className="overlay toggle-menu"></div>
      </div>
    </>
  )
}

export default Dashboard;
/*
<div className="bg-dark text-white min-vh-100">
<Sidebar isOpen={sidebarOpen} />
 
<div style={{ marginLeft: sidebarOpen ? '250px' : '0', transition: 'margin-left 0.3s' }}>
<Header onToggleSidebar={() => setSidebarOpen(!sidebarOpen)} />
 
<div className="contai
          <div className="row g-3 mt-2">
    {statsData.map((stat, idx) => (
      <StatsCard key={idx} {...stat} />
    ))}
  </div>

  <div className="row g-3 mt-3">
    <div className="col-12 col-lg-8">
      <SiteTrafficCard />
    </div>
    <div className="col-12 col-lg-4">
      <WeeklySalesCard />
    </div>
  </div>

  <div className="row g-3 mt-3">
    <div className="col-12">
      <RecentOrdersTable />
    </div>
  </div>
</div>

<Footer />
</div>

<style>{`
body {
  background-color: #1a1a2e;
  color: #ffffff;
}
.card {
  background-color: #16213e;
  border: 1px solid #0f3460;
  color: #ffffff;
}
.table {
  color: #ffffff;
}
.table tbody tr:hover {
  background-color: #0f3460;
}
.bg-dark {
  background-color: #0f3460 !important;
}
.btn-link:hover {
  opacity: 0.8;
}
a:hover {
  background-color: rgba(255, 255, 255, 0.1);
}
`}</style>
</div>
*/