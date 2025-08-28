

export const RatingFilter = ({ selectedRating, onRatingChange }) => {
  const ratings = [5, 4, 3, 2];

  const renderStars = (rating) => {
    return Array.from({ length: 5 }, (_, index) => (
      <i 
        key={index}
        className={index < rating ? "fas fa-star" : "far fa-star"}
      />
    ));
  };

  return (
    <div className="accordion-item mt-4">
      <h2 className="accordion-header">
        <button 
          className="accordion-button" 
          type="button" 
          data-bs-toggle="collapse" 
          data-bs-target="#panelsStayOpen-collapsefour"
        >
          Customer Ratings
        </button>
      </h2>
      <div id="panelsStayOpen-collapsefour" className="accordion-collapse collapse show">
        <div className="accordion-body">
          {ratings.map((rating) => (
            <div key={rating} className="form-check">
              <input 
                className="form-check-input" 
                type="checkbox" 
                id={`rating-${rating}`}
                checked={selectedRating === rating}
                onChange={() => onRatingChange(selectedRating === rating ? null : rating)}
              />
              <label className="form-check-label rt-icon" htmlFor={`rating-${rating}`}>
                {renderStars(rating)}
              </label>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default RatingFilter;