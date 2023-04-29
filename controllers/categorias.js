const { response } = require("express");
const {Categoria} = require("../models");


//Obtener categorias - paginado - total - populate
const obtenerCategorias = async (req, res = response) => {
    //Limitar la obtencion de datos
    const {limite = 5, desde = 0} = req.query

    //Mostrar solo categorias con estado true
    const query = {estado: true}

    //Llamamos las promesas simultaneamente
    const [total, categorias] = await Promise.all([
        Categoria.countDocuments(query),
        Categoria.find(query)
            .skip(Number(desde))
            .limit(Number(limite))
            .populate('usuario', 'nombre')
    ])
    //Mandamos la respuesta
    res.json({
        total,
        categorias
    })
}

//Obtener categoria - populate {}
const obtenerCategoria = async (req, res = response) => {
    const {id} = req.params

    const categoria = await Categoria.findById(id)
        .populate('usuario', 'nombre')
    res.json({
        categoria
    })
}


const crearCategoria = async (req, res = response) => {
    const nombre = req.body.nombre.toUpperCase()

    //Generar la data a guardar
    const data = {
        nombre,
        usuario: req.usuario._id
    }

    const categoria = new Categoria(data)
    await categoria.save()

    res.status(201).json(categoria)
}

//Actualizar categora
const actualizarCategoria = async (req, res = response) => {
    const id = req.params.id
    const nombre = req.body.nombre.toUpperCase()

    //Generar la data a guardar
    const data = {
        nombre,
        usuario: req.usuario._id
    }

    const categoria = await Categoria.findByIdAndUpdate(id, data, {new: true}).populate('usuario', 'nombre')
    res.json({
        categoria
    })
}

//Borrar categoria 
const borrarCategoria = async (req, res = response) => {
    const id = req.params.id
    
    const categoria = await Categoria.findByIdAndUpdate(id, {estado: false}, {new: true}).populate('usuario', 'nombre')

    res.json({
        categoria
    })
}

module.exports = {
    crearCategoria,
    obtenerCategorias,
    obtenerCategoria,
    actualizarCategoria,
    borrarCategoria
}