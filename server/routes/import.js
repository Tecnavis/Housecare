const express = require("express");
const router = express.Router();
const multer = require("multer");

// ✅ Controllers (make sure filename matches exactly)
const CharityController = require("../controller/charity");
const BeneficiaryController = require("../controller/benficiary");

// ✅ Multer config
const storage = multer.memoryStorage();

const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
  fileFilter: (req, file, cb) => {
    const allowedTypes = [
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      "application/vnd.ms-excel",
    ];

    if (allowedTypes.includes(file.mimetype)) cb(null, true);
    else cb(new Error("Only .xlsx and .xls files are allowed"), false);
  },
});

// ✅ SAFE WRAPPER to avoid crash if any controller is missing
const safeHandler = (handler, name) => {
  if (typeof handler !== "function") {
    console.error(`❌ Missing handler: ${name}`);
    return (req, res) => {
      return res.status(500).json({
        success: false,
        message: `Route misconfigured: ${name} is not a function`,
      });
    };
  }
  return handler;
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
