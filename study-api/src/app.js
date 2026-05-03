const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const morgan = require("morgan");

const authRoutes = require("./routes/auth.routes");

const app = express();

// Middlewares globales
app.use(cors());
app.use(helmet());
app.use(morgan("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Rutas

app.use("/api/auth", authRoutes);


// Ruta de prueba
app.get("/", (req, res) => {
  res.json({
    message: "API funcionando correctamente",
  });
});

module.exports = app;
