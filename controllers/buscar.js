const { response } = require("express");
const {ObjectId} = require('mongoose').Types

const { Usuario, Categoria, Producto } = require('../models')

const coleccionesPermitidas = [
    'usuarios',
    'categorias',
    'productos',
    'roles'
]

const buscarUsuario = async(termino='', res = response) => {
    const esMongoID = ObjectId.isValid(termino);
    if (esMongoID) {
        const usuario = await Usuario.findById(termino)
        return res.json({
            results: usuario? [usuario] : []
        })
    }
    //Expresion regular: para filtrar sin importar mayusculas y minusculas (insensible = 'i')
    const regex = new RegExp(termino, 'i')
    const usuarios = await Usuario.find({
        $or: [{nombre: regex}, {correo: regex}],
        $and: [{estado: true}]
    })
    res.json({
        results: usuarios
    })
}

const buscarCategoria = async(termino='', res = response) => {
    const esMongoID = ObjectId.isValid(termino);
    if (esMongoID) {
        const categoria = await Categoria.findById(termino)
        return res.json({
            results: categoria? [categoria] : []
        })
    }
    //Expresion regular: para filtrar sin importar mayusculas y minusculas (insensible = 'i')
    const regex = new RegExp(termino, 'i')
    const categoria = await Categoria.find({nombre: regex, estado: true})
    res.json({
        results: categoria
    })
}

const buscarProducto = async(termino='', res = response) => {
    const esMongoID = ObjectId.isValid(termino);
    if (esMongoID) {
        const producto = await Producto.findById(termino).populate('categoria', 'nombre')
        return res.json({
            results: producto? [producto] : []
        })
    }
    //Expresion regular: para filtrar sin importar mayusculas y minusculas (insensible = 'i')
    const regex = new RegExp(termino, 'i')
    const producto = await Producto.find({nombre: regex, estado: true}).populate('categoria', 'nombre')
    res.json({
        results: producto
    })
}

const buscar = (req, res = response) => {
    const { coleccion, termino } = req.params
    if (!coleccionesPermitidas.includes(coleccion)) {
        return res.status(401).json({
            msg: `Las colecciones permitidas son: ${coleccionesPermitidas}`
        })
    }

    switch (coleccion) {
        case 'usuarios':
            buscarUsuario(termino, res)
        break;
        case 'categorias':
            buscarCategoria(termino, res)
        break;
        case 'productos':
            buscarProducto(termino, res)
        break;

        default: 
            res.status(500).json({
                msg: 'Se me olvido hacer esta busqueda'
            })
    }
}

module.exports = {
    buscar
}