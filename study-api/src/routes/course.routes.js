const express = require("express");
const router = express.Router();

const authMiddleware = require("../middlewares/auth.middleware");

const {
  getCourses,
  createCourse,
  updateCourse,
  deleteCourse,
} = require("../controllers/course.controller");

router.get("/", authMiddleware, getCourses);
router.post("/", authMiddleware, createCourse);
router.put("/:id", authMiddleware, updateCourse);
router.delete("/:id", authMiddleware, deleteCourse);

module.exports = router;