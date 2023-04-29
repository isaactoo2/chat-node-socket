const { Categoria, Role, Usuario, Producto } = require('../models')

const esRoleValido = async(rol = '') => {
    const existeRol = await Role.findOne({rol})
    if (!existeRol) {
        throw new Error(`El rol ${rol} no está registrado en la BD`)
    }
}

const emailExiste = async(correo = '') => {
    const existeEmail = await Usuario.findOne({correo})
    if (existeEmail) {
        throw new Error(`El correo ${correo} ya está registrado`)
    }
}

const existeUsuarioPorId = async(id) => {
    const existeUsuario = await Usuario.findById(id)
    if (!existeUsuario) {
        throw new Error(`El id ${id} no existe`)
    }
}

const existeCategoriaId = async(id) => {
    const existeCategoria = await Categoria.findById(id)
    if (!existeCategoria) {
        throw new Error(`El id ${id} de categoria no existe`)
    }
    if (!existeCategoria.estado) {
        throw new Error(`La categoria está eliminada`)
    }
}

const existeProductoId = async(id) => {
    const existeProducto = await Producto.findById(id)
    if (!existeProducto) {
        throw new Error(`El id ${id} de producto no existe`)
    }
    if (!existeProducto.estado) {
        throw new Error(`El producto está eliminado`)
    }
}

const existeCategoria = async(nombre = '') => {
    const existeCategoria = await Categoria.findOne({nombre: nombre.toUpperCase()})
    if (existeCategoria) {
        throw new Error(`La categoria ${nombre.toUpperCase()} ya está registrada`)
    }
}

const existeProducto = async(nombre = '') => {
    const existeProdcuto = await Producto.findOne({nombre: nombre.toUpperCase()})
    if (existeProdcuto) {
        throw new Error(`El producto ${nombre.toUpperCase()} ya está registrado`)
    }
}

/**
 * Validar colecciones permitidas
 */

const coleccionesPermitidas = (coleccion = '', colecciones = []) => {
    const incluida = colecciones.includes(coleccion)
    if (!incluida) {
        throw new Error(`La coleccion ${coleccion} no es permitida, ${colecciones}`)
    }

    return true
}


module.exports = {
    esRoleValido,
    emailExiste,
    existeUsuarioPorId,
    existeCategoriaId,
    existeCategoria,
    existeProductoId,
    existeProducto,
    coleccionesPermitidas
}