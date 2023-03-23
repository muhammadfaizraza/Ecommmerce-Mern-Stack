const express = require("express");
const {
  getAllProduct,
  createProduct,
  updateProduct,
  deleteProduct,
  productDetail,
} = require("../controllers/productContoller.js");
const { isAuthenticated, isAuthorizedRole } = require("../middleware/auth.js");

const router = express.Router();

router.route("/products").get(getAllProduct);

router
  .route("/products/new")
  .post(isAuthenticated, isAuthorizedRole("admin"), createProduct);

router
  .route("/product/:id")
  .put(isAuthenticated, isAuthorizedRole("admin"), updateProduct)
  .delete(isAuthenticated, isAuthorizedRole("admin"), deleteProduct)
  .get(productDetail);

module.exports = router;
