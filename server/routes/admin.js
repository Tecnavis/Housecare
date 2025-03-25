var express = require("express");
const SuperAdmin = require("../model/housecareadmin");
const AdminController = require("../controller/admin");
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

//super admin
router.get("/admin", async (req, res) => {
  const superAdmins = {
    admin: "Narjishaaa",
    email: "narjisha@gmail.com",
    password: "123",
    role: "company_admin",
  };
  try {
    const sadmin = new SuperAdmin(superAdmins);
    const saveAdmin = await sadmin.save();
    res.json({ success: true, sadmin: saveAdmin });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ error: "An error occurred while creating super admin" });
  }
});

router.post("/", AdminController.signinadmin);
router.get("/", AdminController.lists);
router.get("/:id",AdminController.edit)
router.post('/request-otp',AdminController.requestOtp);

router.post('/reset-password',AdminController.resetPassword);

router.put("/:id", upload.single('image'), AdminController.updateAdmin);
module.exports = router;

