var express = require("express");
var router = express.Router();
const multer = require("multer");

// ✅ Correct folder name usually is "controllers"
// If your folder is really named "controller", keep it as you had.
const CharityController = require("../controller/charity");
const BeneficiaryController = require("../controller/benficiary");

// ✅ Multer memory storage
const storage = multer.memoryStorage();

const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
  fileFilter: (req, file, cb) => {
    const allowedTypes = [
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      "application/vnd.ms-excel",
    ];

    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error("Only .xlsx and .xls files are allowed"), false);
    }
  },
});

// ✅ Safety wrapper: prevents server crash if controller function is missing
const safeHandler = (fn, name) => {
  if (typeof fn !== "function") {
    console.error(`❌ Route handler missing or invalid: ${name}`);
    return (req, res) => {
      return res.status(500).json({
        success: false,
        message: `Server route misconfigured: ${name} is not a function`,
      });
    };
  }
  return fn;
};

// ✅ Routes
router.post(
  "/import",
  upload.single("file"),
  safeHandler(CharityController.importCharityFromExcel, "importCharityFromExcel")
);

router.post(
  "/importbeneficiaries",
  upload.single("file"),
  safeHandler(
    BeneficiaryController.importBenificiariesFromExcel,
    "importBenificiariesFromExcel"
  )
);

router.post(
  "/importbenificiaybasedoncharity",
  upload.single("file"),
  safeHandler(BeneficiaryController.importFromExcel, "importFromExcel")
);

module.exports = router;
