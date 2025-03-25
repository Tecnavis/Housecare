


var express = require("express");
const Controller = require("../controller/charity");
const Controller1 = require("../controller/benficiary");
var router = express.Router();
const multer = require("multer");

const storage = multer.memoryStorage();
const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // Limit file size to 5MB
  fileFilter: (req, file, cb) => {
    if (
      file.mimetype === "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" ||
      file.mimetype === "application/vnd.ms-excel"
    ) {
      cb(null, true);
    } else {
      cb(new Error("Only .xlsx and .xls files are allowed"), false);
    }
  },
});


router.post("/import", upload.single("file"),Controller.importCharityFromExcel);

router.post('/importbeneficiaries', upload.single('file'), Controller1.importBenificiariesFromExcel);
router.post('/importbenificiaybasedoncharity', upload.single('file'), Controller1.importFromExcel);
module.exports = router;

