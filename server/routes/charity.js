var express = require("express");
const Controller = require("../controller/charity");
var router = express.Router();
const multer = require("multer");
const Authentication = require("../middleware/auth")

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "public/upload");
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + "-" + file.originalname);
  },
});
var upload = multer({ storage: storage });

router.post("/",Authentication, upload.single("image"), Controller.create);
router.get("/",Authentication,Controller.list);
router.get("/:id",Authentication, Controller.edit);
router.get("/details/:charity",Authentication, Controller.details);
router.put("/:id",Authentication, upload.single("image"), Controller.update);
router.delete("/:id",Authentication, Controller.delete);
router.post("/signin", Controller.signin);
router.get("/detailses/:id",Authentication, Controller.detailses);
router.post("/update-password", Controller.updatePassword);
module.exports = router;
