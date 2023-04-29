const { response } = require("express");
const {Producto} = require("../models");


//Obtener categorias - paginado - total - populate
const obtenerProductos = async (req, res = response) => {
    //Limitar la obtencion de datos
    const {limite = 5, desde = 0} = req.query

    //Mostrar solo categorias con estado true
    const query = {estado: true}

    //Llamamos las promesas simultaneamente
    const [total, productos] = await Promise.all([
        Producto.countDocuments(query),
        Producto.find(query)
            .skip(Number(desde))
            .limit(Number(limite))
            .populate('usuario', 'nombre')
            .populate('categoria', 'nombre')
    ])
    //Mandamos la respuesta
    res.json({
        total,
        productos
    })
}

//Obtener categoria - populate {}
const obtenerProducto = async (req, res = response) => {
    const {id} = req.params

    const producto = await Producto.findById(id)
        .populate('usuario', 'nombre')
        .populate('categoria', 'nombre')
    res.json({
        producto
    })
}


const crearProducto = async (req, res = response) => {
    const {estado, usuario, ...body} = req.body
   
    //Generar la data a guardar
    const data = {
        ...body,
        nombre: req.body.nombre.toUpperCase(),
        usuario: req.usuario._id
    }

    const producto = new Producto(data)
    await producto.save()

    res.status(201).json(producto)
}

//Actualizar categora
const actualizarProducto = async (req, res = response) => {
    const id = req.params.id
    const {nombre, precio = 0, categoria, descripcion, disponible = true} = req.body

    const pro = await Producto.findOne({nombre: nombre.toUpperCase()})
    if (pro) {
        if (pro._id != id) {
            return res.status(401).json({
                msg:`El producto con el nombre ${pro.nombre} ya existe`
            })
        }
    }

    //Generar la data a guardar
    const data = {
        nombre: nombre.toUpperCase(),
        precio,
        categoria,
        usuario: req.usuario._id,
        descripcion,
        disponible
    }

    const producto = await Producto.findByIdAndUpdate(id, data, {new: true}).populate('usuario', 'nombre').populate('categoria', 'nombre')
    res.json({
        producto
    })
}

//Borrar categoria 
const borrarProducto = async (req, res = response) => {
    const id = req.params.id
    
    const producto = await Producto.findByIdAndUpdate(id, {estado: false}, {new: true}).populate('usuario', 'nombre').populate('categoria', 'nombre')

    res.json({
        producto
    })
}

module.exports = {
    crearProducto,
    obtenerProductos,
    obtenerProducto,
    actualizarProducto,
    borrarProducto
}