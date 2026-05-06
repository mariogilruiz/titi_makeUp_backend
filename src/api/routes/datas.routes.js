const express = require("express");
const { getPages, getPageBySlug } = require("../controllers/datas.controllers");

const router = express.Router();

router.get("/", getPages);
router.get("/:slug", getPageBySlug);

module.exports = router;
