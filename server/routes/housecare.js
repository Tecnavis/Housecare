var express = require("express");
const Controller = require("../controller/housecare-admin");
const Authentication = require("../middleware/auth")

var router = express.Router();
const multer = require("multer");

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
router.post("/signin", Controller.signin);
router.get("/", Authentication,Controller.list);
router.get("/:id",Authentication, Controller.edit);
router.put("/:id",Authentication, upload.single("image"), Controller.update);
router.delete("/:id",Authentication, Controller.delete);
router.post("/block/:id",Controller.block)


module.exports = router;
