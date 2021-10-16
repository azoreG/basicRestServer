const { response } = require("express");
const Usuario = require("../models/usuario");
const bcryptjs = require("bcryptjs");
const { generarJWT } = require("../helpers/generar-jwt");

const login = async (req, res = response) => {
  const { correo, password } = req.body;

  try {
    //Verificar si el emal existe
    const usuario = await Usuario.findOne({ correo });

    if (!usuario)
      return res.status(400).json({
        msg: "Usuario / Password no son correctos - correo",
      });

    //Si el usuario esta activo

    if (!usuario.estado) {
      return res.status(400).json({
        msg: "Usuario / Password no son correctos - estado false",
      });
    }

    //verificar la contraseña

    const validPassword = bcryptjs.compareSync(password, usuario.password);

    if (!validPassword) {
      return res.status(401).json({
        msg: "Usuario / Password no son correctos - password",
      });
    }

    //General el JWT

    const token = await generarJWT(usuario.id);

    res.json({
      usuario,
      token,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      msg: "Error",
    });
  }
};

module.exports = {
  login,
};
