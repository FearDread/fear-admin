const logger = require("../logger");

/**
 * Advanced search, filter, and pagination features for Mongoose models
 * Provides chainable methods for building complex database queries
 */
class SearchFeatures {
  /**
   * Initialize SearchFeatures with model and query parameters
   * @param {mongoose.Model} Model - Mongoose model to query
   * @param {Object} queryObj - Query parameters from request
   * @param {Object} [options={}] - Additional configuration options
   */
  constructor(Model, queryObj, options = {}) {
    if (!Model) {
      throw new Error('Model parameter is required');
    }
    
    this.Model = Model;
    this.query = Model.find();
    this.queryObj = queryObj || {};
    this.options = {
      defaultSort: { createdAt: -1 }, // Default sorting
      searchFields: [], // Specific fields to search in
      excludeFields: ["keyword", "page", "limit", "sort", "fields"], // Fields to exclude from filtering
      caseSensitive: false, // Case sensitivity for search
      fuzzySearch: true, // Enable fuzzy matching
      ...options
    };
    
    this.originalQuery = { ...this.queryObj };
    this.isExecuted = false;
  }

  /**
   * Perform text search across specified fields or all string fields
   * @param {string[]} [searchFields] - Specific fields to search in
   * @returns {SearchFeatures} Chainable instance
   */
  search(searchFields = null) {
    try {
      const fieldsToSearch = searchFields || this.options.searchFields;
      const searchTerms = {};
      const keyword = this.queryObj.keyword;
      
      if (!keyword) {
        return this;
      }

      // If specific search fields are provided
      if (fieldsToSearch.length > 0) {
        const searchConditions = fieldsToSearch.map(field => ({
          [field]: {
            $regex: keyword,
            $options: this.options.caseSensitive ? "" : "i"
          }
        }));
        
        this.query = this.query.find({
          $or: searchConditions
        });
      } else {
        // Search in all provided query fields (excluding system fields)
        Object.keys(this.queryObj).forEach(prop => {
          if (this.queryObj.hasOwnProperty(prop) && 
              !this.options.excludeFields.includes(prop)) {
            searchTerms[prop] = {
              $regex: this.queryObj[prop],
              $options: this.options.caseSensitive ? "" : "i"
            };
          }
        });

        if (Object.keys(searchTerms).length > 0) {
          logger.info('Search terms applied:', searchTerms);
          this.query = this.query.find(searchTerms);
        }
      }

      return this;
    } catch (error) {
      logger.error('Search operation failed:', error);
      throw new Error(`Search failed: ${error.message}`);
    }
  }

  /**
   * Apply filters for exact matches and range queries
   * @param {string[]} [additionalExcludeFields] - Additional fields to exclude
   * @returns {SearchFeatures} Chainable instance
   */
  filter(additionalExcludeFields = []) {
    try {
      const queryCopy = { ...this.queryObj };
      const excludeFields = [...this.options.excludeFields, ...additionalExcludeFields];
      
      // Remove excluded fields
      excludeFields.forEach(field => delete queryCopy[field]);
      
      if (Object.keys(queryCopy).length === 0) {
        return this;
      }

      // Handle range operators (gt, gte, lt, lte, ne, in, nin)
      let queryString = JSON.stringify(queryCopy);
      queryString = queryString.replace(
        /\b(gt|gte|lt|lte|ne|in|nin|regex)\b/g, 
        match => `$${match}`
      );

      const filterQuery = JSON.parse(queryString);
      
      // Handle array fields (in/nin operations)
      Object.keys(filterQuery).forEach(key => {
        const value = filterQuery[key];
        if (typeof value === 'object' && value !== null) {
          // Handle comma-separated values for $in operator
          Object.keys(value).forEach(operator => {
            if ((operator === '$in' || operator === '$nin') && 
                typeof value[operator] === 'string') {
              value[operator] = value[operator].split(',').map(item => item.trim());
            }
          });
        }
      });

      logger.info('Filter query applied:', filterQuery);
      this.query = this.query.find(filterQuery);
      
      return this;
    } catch (error) {
      logger.error('Filter operation failed:', error);
      throw new Error(`Filter failed: ${error.message}`);
    }
  }

  /**
   * Apply sorting to the query
   * @param {string|Object} [customSort] - Custom sort criteria
   * @returns {SearchFeatures} Chainable instance
   */
  sort(customSort = null) {
    try {
      let sortCriteria = customSort || this.queryObj.sort || this.options.defaultSort;
      
      // Convert string sort to object
      if (typeof sortCriteria === 'string') {
        const sortObj = {};
        sortCriteria.split(',').forEach(field => {
          const trimmedField = field.trim();
          if (trimmedField.startsWith('-')) {
            sortObj[trimmedField.substring(1)] = -1;
          } else {
            sortObj[trimmedField] = 1;
          }
        });
        sortCriteria = sortObj;
      }

      this.query = this.query.sort(sortCriteria);
      logger.info('Sort applied:', sortCriteria);
      
      return this;
    } catch (error) {
      logger.error('Sort operation failed:', error);
      throw new Error(`Sort failed: ${error.message}`);
    }
  }

  /**
   * Select specific fields to return
   * @param {string|string[]} [fields] - Fields to select
   * @returns {SearchFeatures} Chainable instance
   */
  selectFields(fields = null) {
    try {
      const fieldsToSelect = fields || this.queryObj.fields;
      
      if (fieldsToSelect) {
        const selectFields = Array.isArray(fieldsToSelect) 
          ? fieldsToSelect.join(' ')
          : fieldsToSelect.split(',').join(' ');
        
        this.query = this.query.select(selectFields);
        logger.info('Fields selected:', selectFields);
      }
      
      return this;
    } catch (error) {
      logger.error('Field selection failed:', error);
      throw new Error(`Field selection failed: ${error.message}`);
    }
  }

  /**
   * Apply pagination with configurable limits
   * @param {number} [resultPerPage=10] - Number of results per page
   * @param {number} [maxLimit=100] - Maximum allowed limit
   * @returns {SearchFeatures} Chainable instance
   */
  paginate(resultPerPage = 10, maxLimit = 100) {
    try {
      const page = Math.max(1, Number(this.queryObj.page) || 1);
      const limit = Math.min(
        maxLimit, 
        Math.max(1, Number(this.queryObj.limit) || resultPerPage)
      );
      
      const skip = limit * (page - 1);

      this.query = this.query.limit(limit).skip(skip);
      
      // Store pagination info for later use
      this.paginationInfo = {
        page,
        limit,
        skip
      };
      
      logger.info('Pagination applied:', { page, limit, skip });
      
      return this;
    } catch (error) {
      logger.error('Pagination failed:', error);
      throw new Error(`Pagination failed: ${error.message}`);
    }
  }

  /**
   * Populate referenced fields
   * @param {string|Object|Array} [populateOptions] - Population configuration
   * @returns {SearchFeatures} Chainable instance
   */
  populate(populateOptions = null) {
    try {
      if (populateOptions) {
        this.query = this.query.populate(populateOptions);
        logger.info('Population applied:', populateOptions);
      } else if (this.queryObj.populate) {
        // Handle populate from query string
        const populateFields = this.queryObj.populate.split(',').map(field => field.trim());
        populateFields.forEach(field => {
          this.query = this.query.populate(field);
        });
        logger.info('Population applied from query:', populateFields);
      }
      
      return this;
    } catch (error) {
      logger.error('Population failed:', error);
      throw new Error(`Population failed: ${error.message}`);
    }
  }

  /**
   * Execute the query and return results with metadata
   * @returns {Promise<Object>} Results with pagination metadata
   */
  async execute() {
    try {
      if (this.isExecuted) {
        logger.warn('Query has already been executed');
      }
      
      // Get total count for pagination metadata
      const totalDocuments = await this.Model.countDocuments(this.query.getQuery());
      
      // Execute the main query
      const results = await this.query.exec();
      
      // Prepare pagination metadata
      const paginationMeta = this.paginationInfo ? {
        currentPage: this.paginationInfo.page,
        totalPages: Math.ceil(totalDocuments / this.paginationInfo.limit),
        totalDocuments,
        documentsPerPage: this.paginationInfo.limit,
        hasNextPage: this.paginationInfo.page < Math.ceil(totalDocuments / this.paginationInfo.limit),
        hasPrevPage: this.paginationInfo.page > 1
      } : null;

      this.isExecuted = true;
      
      return {
        data: results,
        meta: {
          total: totalDocuments,
          count: results.length,
          pagination: paginationMeta,
          query: this.originalQuery
        }
      };
    } catch (error) {
      logger.error('Query execution failed:', error);
      throw new Error(`Query execution failed: ${error.message}`);
    }
  }

  /**
   * Get the current query object (for debugging)
   * @returns {mongoose.Query} Current Mongoose query
   */
  getQuery() {
    return this.query;
  }

  /**
   * Get the current query filter (for debugging)
   * @returns {Object} Current query filter
   */
  getFilter() {
    return this.query.getQuery();
  }

  /**
   * Reset the query to its initial state
   * @returns {SearchFeatures} Chainable instance
   */
  reset() {
    this.query = this.Model.find();
    this.isExecuted = false;
    this.paginationInfo = null;
    logger.info('Query reset to initial state');
    return this;
  }

  /**
   * Clone the current SearchFeatures instance
   * @returns {SearchFeatures} New SearchFeatures instance
   */
  clone() {
    const cloned = new SearchFeatures(this.Model, this.queryObj, this.options);
    cloned.query = this.query.clone();
    return cloned;
  }

  /**
   * Apply full-text search using MongoDB text indexes
   * @param {string} searchText - Text to search for
   * @param {Object} [options] - Text search options
   * @returns {SearchFeatures} Chainable instance
   */
  textSearch(searchText, options = {}) {
    try {
      if (!searchText) {
        return this;
      }

      const textSearchOptions = {
        $search: searchText,
        ...options
      };

      this.query = this.query.find({ $text: textSearchOptions });
      logger.info('Text search applied:', textSearchOptions);
      
      return this;
    } catch (error) {
      logger.error('Text search failed:', error);
      throw new Error(`Text search failed: ${error.message}`);
    }
  }
}

module.exports = SearchFeatures;