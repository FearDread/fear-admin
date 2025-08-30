const logger = require("../logger");
const SearchApi = require('./api');

// Helper function to get/set model
let currentModel = null;

exports.getModel = () => {
    return currentModel;
};

exports.setModel = (Model) => {
    currentModel = Model;
    return currentModel;
};

exports.basicSearch = async (params, Model = currentModel) => {
    const queryParams = params || {
        keyword: "laptop",
        page: 1,
        limit: 10
    };

    const Search = new SearchApi(Model, queryParams, {
        searchFields: ['name', 'description', 'brand']
    });

    const results = await Search
        .search()
        .sort()
        .paginate()
        .execute();

    console.log('Basic Search Results:', results);
    return results;
};

exports.textSearch = async (searchText, Model = currentModel) => {
    const queryParams = { searchText } || { searchText: "marvel comic book" };

    const Search = new SearchApi(Model, queryParams);

    const results = await Search
        .textSearch(queryParams.searchText, {
            $language: 'english',
            $caseSensitive: false
        })
        .sort({ score: { $meta: 'textScore' } })
        .paginate()
        .execute();

    console.log('Full-text Search Results:', results);
    return results;
};

exports.standardSearch = async (query, Model = currentModel ) => {
        const Search = new SearchApi(Model, query, {
            searchFields: ['title', 'description', 'brand'],
            defaultSort: { createdAt: -1 }
        });

        const results = await Search.search()
            .filter()
            .sort()
            .selectFields()
            .populate('category brand')
            .paginate()
            .execute();

        return results;

    
};

exports.productSearch = async (query, Product) => {
    const {
        keyword,
        category,
        brand,
        minPrice,
        maxPrice,
        rating,
        sortBy = 'popularity',
        page = 1,
        limit = 24
    } = query;

    // Build query object
    const queryObj = { page, limit };
    if (keyword) queryObj.keyword = keyword;
    if (category) queryObj.category = category;
    if (brand) queryObj.brand = { in: brand }; // Support multiple brands
    if (minPrice || maxPrice) {
        queryObj.price = {};
        if (minPrice) queryObj.price.gte = minPrice;
        if (maxPrice) queryObj.price.lte = maxPrice;
    }
    if (rating) queryObj.rating = { gte: rating };

    const sortOptions = {
        popularity: { popularity: -1 },
        newest: { createdAt: -1 },
        'price-low': { price: 1 },
        'price-high': { price: -1 },
        rating: { rating: -1 }
    };

    const Search = new SearchApi(Product, queryObj, {
        searchFields: ['name', 'description', 'tags'],
        defaultSort: sortOptions[sortBy] || sortOptions.popularity
    });

    const results = await Search
        .search(['name', 'description', 'brand', 'tags'])
        .filter()
        .sort()
        .selectFields('-__v,-updatedAt')
        .populate('reviews')
        .paginate(limit, 50) // Max 50 items per page
        .execute();

    return results;
};

exports.orderSearch = async (searchParams, Order) => {
    const {
        customerEmail,
        status,
        minAmount,
        maxAmount,
        dateFrom,
        dateTo,
        paymentMethod
    } = searchParams;

    const queryObj = {};
    if (status) queryObj.status = status;
    if (paymentMethod) queryObj.paymentMethod = paymentMethod;

    if (minAmount || maxAmount) {
        queryObj.totalAmount = {};
        if (minAmount) queryObj.totalAmount.gte = parseFloat(minAmount);
        if (maxAmount) queryObj.totalAmount.lte = parseFloat(maxAmount);
    }

    if (dateFrom || dateTo) {
        queryObj.orderDate = {};
        if (dateFrom) queryObj.orderDate.gte = new Date(dateFrom);
        if (dateTo) queryObj.orderDate.lte = new Date(dateTo);
    }

    const Search = new SearchApi(Order, queryObj);

    let query = Search
        .filter()
        .sort({ orderDate: -1 })
        .populate({
            path: 'customer',
            select: 'firstName lastName email'
        })
        .populate({
            path: 'items.product',
            select: 'name price'
        });

    // Add customer email search if provided
    if (customerEmail) {
        // This requires a more complex approach since we're searching in populated fields
        query = query.populate({
            path: 'customer',
            match: { email: { $regex: customerEmail, $options: 'i' } },
            select: 'firstName lastName email'
        });
    }

    return await query.paginate().execute();
};

exports.userSearch = async (adminQuery, User) => {
    const {
        keyword,
        role,
        status,
        dateFrom,
        dateTo,
        sortBy = 'createdAt',
        order = 'desc'
    } = adminQuery;

    const queryObj = {};
    if (keyword) queryObj.keyword = keyword;
    if (role) queryObj.role = role;
    if (status) queryObj.status = status;

    // Date range filtering
    if (dateFrom || dateTo) {
        queryObj.createdAt = {};
        if (dateFrom) queryObj.createdAt.gte = new Date(dateFrom);
        if (dateTo) queryObj.createdAt.lte = new Date(dateTo);
    }

    const sortOrder = order === 'desc' ? -1 : 1;
    const sortOptions = { [sortBy]: sortOrder };

    const Search = new SearchApi(User, queryObj, {
        searchFields: ['firstName', 'lastName', 'email', 'username'],
        excludeFields: ['password', 'resetToken']
    });

    const results = await Search
        .search()
        .filter()
        .sort(sortOptions)
        .selectFields('-password,-resetToken,-__v')
        .paginate(25)
        .execute();

    return results;
};

// Also provide module.exports for compatibility
module.exports = exports;