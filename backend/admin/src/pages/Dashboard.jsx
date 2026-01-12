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
    <div className="bg-dark text-white min-vh-100">
      <Sidebar isOpen={sidebarOpen} />
      
      <div style={{ marginLeft: sidebarOpen ? '250px' : '0', transition: 'margin-left 0.3s' }}>
        <Header onToggleSidebar={() => setSidebarOpen(!sidebarOpen)} />
        
        <div className="container-fluid p-4">
          {/* Stats Cards */}
          <div className="row g-3 mt-2">
            {statsData.map((stat, idx) => (
              <StatsCard key={idx} {...stat} />
            ))}
          </div>

          {/* Charts Row */}
          <div className="row g-3 mt-3">
            <div className="col-12 col-lg-8">
              <SiteTrafficCard />
            </div>
            <div className="col-12 col-lg-4">
              <WeeklySalesCard />
            </div>
          </div>

          {/* Recent Orders */}
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
  );
};

export default Dashboard;