const SearchApi = require('./api');

module.exports = class SearchService {
  constructor(model, config = {}) {
    this.model = model;
    this.config = {
      searchFields: [],
      sortOptions: {},
      filterRules: {},
      ...config
    };
  }

  async search(params) {
    const searchFeatures = new SearchApi(this.model, params, {
      searchFields: this.config.searchFields,
      defaultSort: this.config.sortOptions.default || { createdAt: -1 }
    });

    // Apply custom filter rules
    if (this.config.filterRules.beforeSearch) {
      await this.config.filterRules.beforeSearch(searchFeatures, params);
    }

    let query = searchFeatures.search().filter().sort();

    // Apply population rules
    if (this.config.populate) {
      query = query.populate(this.config.populate);
    }

    const results = await query.paginate().execute();

    // Apply post-processing
    if (this.config.filterRules.afterSearch) {
      await this.config.filterRules.afterSearch(results, params);
    }

    return results;
  }
}

/*
// Usage of Dynamic Search Service
const productSearchService = new DynamicSearchService(Product, {
  searchFields: ['name', 'description', 'tags'],
  populate: 'category reviews',
  filterRules: {
    beforeSearch: async (searchFeatures, params) => {
      // Apply business logic before search
      if (params.featured) {
        searchFeatures.query = searchFeatures.query.find({ featured: true });
      }
    },
    afterSearch: async (results, params) => {
      // Apply business logic after search
      results.data = results.data.map(item => ({
        ...item.toObject(),
        discountedPrice: item.price * 0.9 // Apply 10% discount
      }));
    }
  }
});
*/