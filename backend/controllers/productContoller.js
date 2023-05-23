const Product = require("../model/productModel.js");
const ErrorHandler = require("../utils/Errorhandler.js");
const catchAsynncErrors = require("../middleware/catchAsyncErrors.js");
const ApiFeature = require("../utils/ApiFeatures.js");
const catchAsyncErrors = require("../middleware/catchAsyncErrors.js");

exports.createProduct = catchAsynncErrors(async (req, res) => {
  req.body.user = req.user.id;
  const product = await Product.create(req.body);
  res.status(201).json({
    success: true,
    product,
  });
});
//...get all product
exports.getAllProduct = catchAsynncErrors(async (req, res) => {
  const resultPerPage = 8;

  const productCount = await Product.count();
  const apifeature = new ApiFeature(Product.find(), req.query)
    .search()
    .filter()
    .pagination(resultPerPage);

  const product = await apifeature.query;
  res.status(200).json({
    success: true,
    product,
    productCount,
  });
});
exports.updateProduct = catchAsynncErrors(async (req, res, next) => {
  var product = await Product.findById(req.params.id);
  if (!product) {
    return next(new ErrorHandler("Product not found ", 404));
  }
  product = await Product.findByIdAndUpdate(product, req.body, {
    new: true,
    runValidators: true,
    useFindAndModify: false,
  });

  res.status(200).json({
    success: true,
    product,
  });
});
exports.deleteProduct = catchAsynncErrors(async (req, res) => {
  var product = await Product.findById(req.params.id);
  if (!product) {
    return next(new ErrorHandler("Product not found ", 404));
  }
  await Product.findByIdAndRemove(product);

  res.status(200).json({
    success: true,
    message: "product Deleted Succesfully",
  });
});
exports.productDetail = catchAsynncErrors(async (req, res, next) => {
  const product = await Product.findById(req.params.id);

  if (!product) {
    return next(new ErrorHandler("Product not found ", 404));
  }

  res.status(200).json({
    success: true,
    product,
  });
});

//Create Product Review

exports.createProductReview = catchAsyncErrors(async (req, res, next) => {
  try {
    const { rating, productId, comment } = req.body;

    const Review = {
      user: req.user._id,
      name: req.user.name,
      rating: Number(rating),
      comment,
    };
    console.log(Review);
    const product = await Product.findById(productId);
    console.log(Review.rating);
    const isReviewed = product.reviews.find(
      (rev) => rev.user.toString() === req.user._id
    );
    if (isReviewed) {
      product.reviews.forEach((rev) => {
        if (rev.user.toString() === req.user._id) {
          (rev.ratings = rating), (rev.comment = comment);
        }
      });
    } else {
      product.reviews.push(Review);
      product.numOfReviews = product.reviews.length;
      product.ratings = Review.rating = avg / product.reviews.length;
    }
    let avg = 0;

    product.reviews.forEach((rev) => {
      avg += rev.ratings;
    });

    product.ratings = avg / product.reviews.length;
    await product.save({ validateBeforeSave: false });
    res.status(200).json({
      success: true,
    });
  } catch (err) {}
  console.log(err);
});
exports.getProductReviews = catchAsyncErrors(async (req, res, next) => {
  const product = await Product.findById(req.query.id);

  if (!product) {
    return next(new ErrorHandler("Product not found", 404));
  }

  res.status(200).json({
    success: true,
    reviews: product.reviews,
  });
}); //Delete Review
exports.deleteReview = catchAsyncErrors(async (req, res, next) => {
  const product = await Product.findById(req.query.productId);

  if (!product) {
    return next(new ErrorHandler("Product not found", 404));
  }

  const reviews = product.reviews.filter(
    (rev) => rev._id.toString() !== req.query.id.toString()
  );

  let avg = 0;

  reviews.forEach((rev) => {
    avg += rev.rating;
  });

  let ratings = 0;

  if (reviews.length === 0) {
    ratings = 0;
  } else {
    ratings = avg / reviews.length;
  }

  const numOfReviews = reviews.length;

  await Product.findByIdAndUpdate(
    req.query.productId,
    {
      reviews,
      ratings,
      numOfReviews,
    },
    {
      new: true,
      runValidators: true,
      useFindAndModify: false,
    }
  );

  res.status(200).json({
    success: true,
  });
});
