const prisma = require("../config/db");

const getCourses = async (req, res) => {
  try {
    const courses = await prisma.course.findMany({
      where: {
        student_id: req.user.id,
      },
      orderBy: {
        created_at: "desc",
      },
    });

    res.json(courses);
  } catch (error) {
    res.status(500).json({ message: "Error interno" });
  }
};

const createCourse = async (req, res) => {
  try {
    const { name } = req.body;

    const course = await prisma.course.create({
      data: {
        name,
        student_id: req.user.id,
      },
    });

    res.status(201).json(course);
  } catch (error) {
    res.status(500).json({ message: "Error interno" });
  }
};

const updateCourse = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, is_active } = req.body;

    const course = await prisma.course.findFirst({
      where: {
        id: Number(id),
        student_id: req.user.id,
      },
    });

    if (!course) {
      return res.status(404).json({
        message: "Curso no encontrado",
      });
    }

    const updated = await prisma.course.update({
      where: {
        id: Number(id),
      },
      data: {
        name,
        is_active,
      },
    });

    res.json(updated);
  } catch (error) {
    res.status(500).json({
      message: "Error interno",
    });
  }
};

const deleteCourse = async (req, res) => {
  try {
    const { id } = req.params;

    const course = await prisma.course.findFirst({
      where: {
        id: Number(id),
        student_id: req.user.id,
      },
    });

    if (!course) {
      return res.status(404).json({
        message: "Curso no encontrado",
      });
    }

    await prisma.course.delete({
      where: {
        id: Number(id),
      },
    });

    res.json({
      message: "Curso eliminado",
    });
  } catch (error) {
    res.status(500).json({
      message: "Error interno",
    });
  }
};

module.exports = {
  getCourses,
  createCourse,
  updateCourse,
  deleteCourse,
};