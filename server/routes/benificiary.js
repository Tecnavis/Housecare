const express = require("express");
const Controller = require("../controller/benificiary");
const auth = require("../middleware/auth");

const router = express.Router();

router.post("/", auth, Controller.create);
router.get("/", auth, Controller.list);
router.get("/:id", auth, Controller.edit);
router.put("/:id", auth, Controller.update);
router.delete("/:id", auth, Controller.delete);

router.patch("/block/:id", auth, Controller.block);
router.put("/balance/:id", auth, Controller.updatebenificiaryBalance);
router.post("/update-balances", auth, Controller.updateBalances);
router.post("/import", auth, Controller.importBenificiariesFromExcel);

router.post("/debited", auth, Controller.createDebitedRecord);

module.exports = router;
