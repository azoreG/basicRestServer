const { response, json } = require("express");
const Usuario = require("../models/usuario");
const bcryptjs = require("bcryptjs");
const { generarJWT } = require("../helpers/generar-jwt");
const { googleVerify } = require("../helpers/google-verify");

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

    //Generar el JWT

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

const googleSignIn = async (req, res = response) => {
  const { id_token } = req.body;

  try {
    const { nombre, img, correo } = await googleVerify(id_token);

    let usuario = await Usuario.findOne({ correo });

    if (!usuario) {
      //Tengo que crearlo
      const data = {
        nombre,
        correo,
        password: "google",
        img,
        google: true,
        rol: "USER_ROLE",
      };

      usuario = new Usuario(data);
      await usuario.save();
    }

    //Si el usuario en DB
    if (!usuario.estado) {
      return res.status(401).json({
        msg: "Hable con el administrador, usuario bloqueado",
      });
    }

    //Generar JWT

    const token = await generarJWT(usuario.id);

    res.json({
      usuario,
      token,
    });
  } catch (error) {
    console.log(error);
    res.status(400).json({
      ok: false,
      msg: "El token no se pudo verificar",
    });
  }

  /* res.json({
    msg: "Todo bien!",
    id_token,
  }); */
};

module.exports = {
  login,
  googleSignIn,
};
