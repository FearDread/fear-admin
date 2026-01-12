

// Weekly Sales Card Component
const WeeklySalesCard = () => {
  const salesData = [
    { label: 'Direct', amount: '$5856', percentage: '+55%', color: 'primary' },
    { label: 'Affiliate', amount: '$2602', percentage: '+25%', color: 'info' },
    { label: 'E-mail', amount: '$1802', percentage: '+15%', color: 'warning' },
    { label: 'Other', amount: '$1105', percentage: '+5%', color: 'secondary' }
  ];

  return (
    <div className="card">
      <div className="card-header bg-dark text-white d-flex justify-content-between align-items-center">
        <span>Weekly Sales</span>
        <button className="btn btn-sm btn-link text-white">
          <i className="fas fa-ellipsis-v"></i>
        </button>
      </div>
      <div className="card-body">
        <div className="bg-light rounded d-flex align-items-center justify-content-center" style={{ height: '200px' }}>
          <span className="text-muted">Chart Placeholder</span>
        </div>
      </div>
      <div className="table-responsive">
        <table className="table mb-0">
          <tbody>
            {salesData.map((item, idx) => (
              <tr key={idx}>
                <td>
                  <i className={`fas fa-circle text-${item.color} me-2`}></i>
                  {item.label}
                </td>
                <td>{item.amount}</td>
                <td>{item.percentage}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
