const Role = require("../models/role");
const Usuario = require("../models/usuario");

const esRoleValido = async (rol = "") => {
  const existeRol = await Role.findOne({ rol });
  if (!existeRol) {
    throw new Error(`El rol ${rol} no esta registrado en la base de datos`);
  }
};

const existeEmailFn = async (correo = "") => {
  //Verificar si el correo existe
  const usuario = await Usuario.findOne({ correo });

  if (usuario) {
    throw new Error(`El usuario con el correo  ${correo} ya existe`);
  }
};

const existeUsuarioPorId = async (id) => {
  //Verificar si el correo existe
  const usuario = await Usuario.findById(id);

  if (!usuario) {
    throw new Error(`El id no existe`);
  }
};

module.exports = {
  esRoleValido,
  existeEmailFn,
  existeUsuarioPorId,
};
