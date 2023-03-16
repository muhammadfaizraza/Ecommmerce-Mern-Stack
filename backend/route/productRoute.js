const express = require("express");
const {
  getAllProduct,
  createProduct,
  updateProduct,
  deleteProduct,
  productDetail,
} = require("../controllers/productContoller.js");

const router = express.Router();

router.route("/products").get(getAllProduct);

router.route("/products/new").post(createProduct);

router
  .route("/product/:id")
  .put(updateProduct)
  .delete(deleteProduct)
  .get(productDetail);

module.exports = router;
