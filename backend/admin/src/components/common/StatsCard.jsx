


// Stats Card Component
const StatsCard = ({ value, label, icon, change, progress }) => {
  return (
    <div className="col-12 col-lg-6 col-xl-3">
      <div className="card bg-primary text-white border-0">
        <div className="card-body">
          <h5 className="mb-0">
            {value} 
            <span className="float-end">
              <i className={icon}></i>
            </span>
          </h5>
          <div className="progress my-3" style={{ height: '3px' }}>
            <div className="progress-bar bg-white" style={{ width: `${progress}%` }}></div>
          </div>
          <p className="mb-0 small">
            {label} 
            <span className="float-end">
              {change} <i className="fas fa-arrow-up"></i>
            </span>
          </p>
        </div>
      </div>
    </div>
  );
};
