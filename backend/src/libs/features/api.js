
module.exports = api = ( query, queryString ) => {
    const _this = {};

    _this.query = query;
    _this.queryString = queryString;

    return {
        filter: () => {
            const queryObj = { ..._this.queryString };
            const excludedFields = ['sort', 'fields', 'page', 'limit'];
        
            excludedFields.forEach((el) => delete queryObj[el]);
        
            let queryString = JSON.stringify(queryObj);
            queryString = queryString.replace(
              /\b(gt|gte|lt|lte\b)/g,
              (match) => `$${match}`
            );
        
            _this.query = _this.query.find(JSON.parse(queryString));

            return _this;
        },

        sort: (defaultSort) => {
            if ( _this.queryString.sort ) {
                const sortBy = _this.queryString.sort.split(',').join(' ');
                _this.query = _this.query.sort(sortBy);
              } else {
                _this.query = _this.query.sort(defaultSort);
              }
          
              return _this;
        },

        paginate: ( _page = 1, _limit = 10 ) => {
            const page = _this.queryString.page * 1 || _page;
            const limit = _this.queryString.limit * 1 || _limit;
            const skip = (page - 1) * limit;
        
            _this.query = _this.query.skip(skip).limit(limit);
        
            return _this;
        }

    }
}