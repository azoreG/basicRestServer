const { response } = require("express");

const usuariosGet = (req, res = response) => {
  const query = req.query;
  res.json({
    msg: "get api - controlador",
    query,
  });
};

const usuariosPost = (req, res = response) => {
  const { nombre, edad } = req.body;
  res.json({
    ok: true,
    msg: "post api - controlador",
    nombre,
    edad,
  });
};

const usuariosPut = (req, res = response) => {
  const id = req.params.id;

  res.json({
    msg: "put api - controlador",
    id,
  });
};

const usuariosDelete = (req, res = response) => {
  const id = req.params.id;
  res.json({
    msg: "delete api - controlador",
    id,
  });
};

module.exports = {
  usuariosGet,
  usuariosPost,
  usuariosPut,
  usuariosDelete,
};
