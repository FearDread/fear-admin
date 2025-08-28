

export const PriceFilter = ({ minPrice, maxPrice, onPriceChange }) => {
  const handleMinChange = (e) => {
    onPriceChange(e.target.value, maxPrice);
  };

  const handleMaxChange = (e) => {
    onPriceChange(minPrice, e.target.value);
  };

  return (
    <div className="accordion-item">
      <h2 className="accordion-header">
        <button 
          className="accordion-button" 
          type="button" 
          data-bs-toggle="collapse" 
          data-bs-target="#panelsStayOpen-collapseTwo"
        >
          Price
        </button>
      </h2>
      <div id="panelsStayOpen-collapseTwo" className="accordion-collapse collapse show">
        <div className="accordion-body">
          <div className="row row-cols-1 row-cols-lg-2">
            <div className="col">
              <div className="form-group po">
                <input 
                  type="number" 
                  className="form-control" 
                  placeholder="Min" 
                  value={minPrice || ''}
                  onChange={handleMinChange}
                />
              </div>
            </div>
            <div className="col">
              <div className="form-group po">
                <input 
                  type="number" 
                  className="form-control" 
                  placeholder="Max" 
                  value={maxPrice || ''}
                  onChange={handleMaxChange}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PriceFilter;