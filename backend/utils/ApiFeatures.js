class ApiFeatures {
  constructor(query, queryStr) {
    //query is mongofunc

    this.query = query;
    //querystr is all queries after api

    this.queryStr = queryStr;
  }

  search() {
    //keyword is query str
    const keyword = this.queryStr.keyword
      ? {
          name: {
            $regex: this.queryStr.keyword,
            //for capitilize and smallercase
            $options: "i",
          },
        }
      : {};
    //pass keyword in query
    this.query = this.query.find({ ...keyword });
    return this;
  }

  filter() {
    const queryCopy = { ...this.queryStr };
    //   Removing some fields for category
    const removeFields = ["keyword", "page", "limit"];

    removeFields.forEach((key) => delete queryCopy[key]);

    // Filter For Price and Rating

    let queryStr = JSON.stringify(queryCopy);
    queryStr = queryStr.replace(/\b(gt|gte|lt|lte)\b/g, (key) => `$${key}`);
    console.log(queryStr);
    this.query = this.query.find(JSON.parse(queryStr));

    return this;
  }

  pagination(resultPerPage) {
    //resultperpage from function
    const currentPage = Number(this.queryStr.page) || 1;
    //skipping

    const skip = resultPerPage * (currentPage - 1);
    //limit is mongoose funtion
    this.query = this.query.limit(resultPerPage).skip(skip);

    return this;
  }
}

module.exports = ApiFeatures;
