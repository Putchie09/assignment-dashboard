const prisma = require("../config/db");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const register = async (req, res) => {
  try {
    const { username, email, password } = req.body;

    const exists = await prisma.student.findFirst({
      where: {
        OR: [{ email }, { username }],
      },
    });

    if (exists) {
      return res.status(400).json({
        message: "Usuario o correo ya existe",
      });
    }

    const password_hash = await bcrypt.hash(password, 10);

    const user = await prisma.student.create({
      data: {
        username,
        email,
        password_hash,
      },
      select: {
        id: true,
        username: true,
        email: true,
        created_at: true,
      },
    });

    res.status(201).json({
      message: "Usuario creado",
      user,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Error interno",
      error: error.message,
    });
  }
};

const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await prisma.student.findUnique({
      where: { email },
    });

    if (!user) {
      return res.status(401).json({
        message: "Credenciales inválidas",
      });
    }

    const validPassword = await bcrypt.compare(password, user.password_hash);

    if (!validPassword) {
      return res.status(401).json({
        message: "Credenciales inválidas",
      });
    }

    const token = jwt.sign(
      {
        id: user.id,
        email: user.email,
      },
      process.env.JWT_SECRET,
      { expiresIn: "7d" },
    );

    res.json({
      message: "Login exitoso",
      token,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Error interno",
    });
  }
};


module.exports = { register, login };
