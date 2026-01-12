


// Site Traffic Card Component
const SiteTrafficCard = () => {
  return (
    <div className="card">
      <div className="card-header bg-dark text-white d-flex justify-content-between align-items-center">
        <span>Site Traffic</span>
        <button className="btn btn-sm btn-link text-white">
          <i className="fas fa-ellipsis-v"></i>
        </button>
      </div>
      <div className="card-body">
        <ul className="list-inline mb-3">
          <li className="list-inline-item">
            <i className="fas fa-circle text-primary me-1"></i> New Visitor
          </li>
          <li className="list-inline-item">
            <i className="fas fa-circle text-secondary me-1"></i> Old Visitor
          </li>
        </ul>
        <div className="bg-light rounded d-flex align-items-center justify-content-center" style={{ height: '250px' }}>
          <span className="text-muted">Chart Placeholder</span>
        </div>
      </div>
      <div className="row text-center border-top g-0">
        <div className="col-12 col-lg-4 border-end p-3">
          <h5 className="mb-0">45.87M</h5>
          <small className="text-muted">Overall Visitor <span className="text-success">↑ 2.43%</span></small>
        </div>
        <div className="col-12 col-lg-4 border-end p-3">
          <h5 className="mb-0">15:48</h5>
          <small className="text-muted">Visitor Duration <span className="text-success">↑ 12.65%</span></small>
        </div>
        <div className="col-12 col-lg-4 p-3">
          <h5 className="mb-0">245.65</h5>
          <small className="text-muted">Pages/Visit <span className="text-success">↑ 5.62%</span></small>
        </div>
      </div>
    </div>
  );
};
