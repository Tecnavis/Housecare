var express = require("express");
const Controller = require("../controller/benficiary");
var router = express.Router();
// const multer = require("multer");
const Authentication = require("../middleware/auth")

// const storage = multer.diskStorage({
//   destination: function (req, file, cb) {
//     cb(null, "public/upload");
//   },
//   filename: function (req, file, cb) {
//     cb(null, Date.now() + "-" + file.originalname);
//   },
// });
// var upload = multer({ storage: storage });

router.post("/",Authentication, Controller.create);
router.get("/",Authentication,Controller.list);
router.get("/:id",Authentication, Controller.edit);
router.put("/:id",Authentication, Controller.update);
router.delete("/:id",Authentication, Controller.delete);
router.put("/benificiary/:id",Controller. updateBeneficiaryBalance);

router.post('/debited', Controller.createDebitedRecord);

router.put('/beneficiaries/:id', Controller.updateBeneficiary);
router.post('/update-balances',Controller.updateBalances);

module.exports = router;
