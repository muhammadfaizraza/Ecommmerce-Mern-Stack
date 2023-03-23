const Product = require("../model/productModel.js");
const ErrorHandler = require("../utils/Errorhandler.js");
const catchAsynncErrors = require("../middleware/catchAsyncErrors.js");
const ApiFeature = require("../utils/ApiFeatures.js");

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
  const resultPerPage = 1;

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
exports.updateProduct = catchAsynncErrors(async (req, res) => {
  var product = await Product.findById(req.params.id);
  if (!product) {
    return next(new ErrorHandler("Product not found ", 404));
  }
  product = await Product.findByIdAndUpdate(req.params.id, req.body, {
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
