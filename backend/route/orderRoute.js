const express = require("express");
const Order = require("../model/orderModel");
const router = express.Router();
const { isAuthenticated, isAuthorizedRole } = require("../middleware/auth.js");
const {
  newOrder,
  getMyOrders,
  getSingleOrder,
  getAllOrder,
  updateOrder,
  deleteOrder,
} = require("../controllers/orderController");

router.route("/order/new").post(isAuthenticated, newOrder);

router.route("/order/me").post(isAuthenticated, getMyOrders);
router
  .route("/order/:id")
  .get(isAuthenticated, isAuthorizedRole("admin"), getSingleOrder);

router
  .route("/admin/order")
  .get(isAuthenticated, isAuthorizedRole("admin"), getAllOrder);

router
  .route("/admin/order/:id")
  .put(isAuthenticated, isAuthorizedRole("admin"), updateOrder)
  .delete(isAuthenticated, isAuthorizedRole("admin"), deleteOrder);

module.exports = router;
