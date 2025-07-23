

module.exports = class SearchFeatures {

  constructor(Model, queryObj) {
    this.Model = Model;
    this.query = Model.find();
    this.queryObj = queryObj;
  }

  search() {
    let keywords = {}

    for ( prop in this.queryObj )
      if (this.queryObj.hasOwnProperty(prop)) 
        keywords[prop] = {
          $regex: this.queryObj[prop],
          $options: "i" 
        }

    console.log('full query = ', keywords);
    this.query = this.query.find( {...keywords} )
      .sort({ created: "desc" })
      .populate();

    return this;
  }

  filter() {
    const queryCopy = { ...this.queryObj }

    // fields to remove for category
    const removeFields = ["keyword", "page", "limit"];

    // console.log(queryCopy);
    removeFields.forEach(key => delete queryCopy[key]);
    // console.log(queryCopy);

    // price filter
    let queryString = JSON.stringify(queryCopy);
    queryString = queryString.replace(/\b(gt|gte|lt|lte)\b/g, key => `$${key}`);

    // console.log(JSON.parse(queryString));

    this.query = this.query.find(JSON.parse(queryString));
    return this;
  }

  paginate(resultPerPage) {
    const page = Number(this.queryObj.page) || 1;

    const skip = resultPerPage * (page - 1);

    this.query = this.query.limit(resultPerPage).skip(skip);
    return this;
  }
};
