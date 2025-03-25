var express = require("express");
const Controller = require("../controller/category");
var router = express.Router();
const Authentication = require("../middleware/auth")


router.post("/", Controller.create);
router.get("/",Controller.list);
router.get("/:id", Controller.edit);
router.put("/:id", Controller.update);
router.delete("/:id", Controller.delete);


module.exports = router;
