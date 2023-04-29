const fs = require('fs');
const path = require('path');
const { response } = require("express");

const cloudinary = require('cloudinary').v2
cloudinary.config(process.env.CLOUDINARY_URL)

const {Usuario, Producto} = require('../models/index')
const { subirArchivo } = require("../helpers/subir-archivo");

const cargarArchivo = async (req, res = response) => {
    try {
        const nombre = await subirArchivo(req.files, undefined, 'img');
        res.json({
            nombre,
        });
    } catch (error) {
        res.status(400).json({
            msg: error
        })
    }
};

const actualizarImagen = async (req, res = response) => {
    const {id, coleccion} = req.params

    let modelo

    switch (coleccion) {
        case 'usuarios':
            modelo = await Usuario.findById(id)
            if (!modelo) {
                return res.status(400).json({
                    msg: `No esxiste el usuario con el id ${id}`
                })
            }
        break;

        case 'productos':
            modelo = await Producto.findById(id)
            if (!modelo) {
                return res.status(400).json({
                    msg: `No esxiste el producto con el id ${id}`
                })
            }
        break;

        default:
            return res.status(500).json({
                msg: 'Se me olvido validar eso'
            })
    }

    //Limpiar imagenes previas
    if (modelo.img) {
        const pathImagen = path.join(__dirname, '../uploads', coleccion, modelo.img)
        if (fs.existsSync(pathImagen)) {
            fs.unlinkSync(pathImagen)
        }
    }

    //Subir el archivo
    const nombre = await subirArchivo(req.files, undefined, coleccion);
    modelo.img = nombre

    await modelo.save()

    res.json(modelo)
}

const actualizarImagenCloudinary = async (req, res = response) => {
    const {id, coleccion} = req.params

    let modelo

    switch (coleccion) {
        case 'usuarios':
            modelo = await Usuario.findById(id)
            if (!modelo) {
                return res.status(400).json({
                    msg: `No esxiste el usuario con el id ${id}`
                })
            }
        break;

        case 'productos':
            modelo = await Producto.findById(id)
            if (!modelo) {
                return res.status(400).json({
                    msg: `No esxiste el producto con el id ${id}`
                })
            }
        break;

        default:
            return res.status(500).json({
                msg: 'Se me olvido validar eso'
            })
    }

    //Limpiar imagenes previas
    if (modelo.img) {
        const nombreAr = modelo.img.split('/')
        const nombre = nombreAr[nombreAr.length-1]
        const [public_id] = nombre.split('.')

        cloudinary.uploader.destroy(public_id)
    }
    const {tempFilePath} = req.files.archivo
    const {secure_url} = await cloudinary.uploader.upload(tempFilePath)

    modelo.img = secure_url

    await modelo.save()

    res.json(modelo)
}

const mostrarImagen = async (req, res = response) => {

    const {id, coleccion} = req.params

    let modelo

    switch (coleccion) {
        case 'usuarios':
            modelo = await Usuario.findById(id)
            if (!modelo) {
                return res.status(400).json({
                    msg: `No esxiste el usuario con el id ${id}`
                })
            }
        break;

        case 'productos':
            modelo = await Producto.findById(id)
            if (!modelo) {
                return res.status(400).json({
                    msg: `No esxiste el producto con el id ${id}`
                })
            }
        break;

        default:
            return res.status(500).json({
                msg: 'Se me olvido validar eso'
            })
    }

    //Limpiar imagenes previas
    if (modelo.img) {
        const pathImagen = path.join(__dirname, '../uploads', coleccion, modelo.img)
        if (fs.existsSync(pathImagen)) {
            return res.sendFile(pathImagen)
        }
    }
    const noImg = path.join(__dirname, '../assets/no-image.jpg')
    res.sendFile(noImg)
}

module.exports = {
    cargarArchivo,
    actualizarImagen,
    mostrarImagen,
    actualizarImagenCloudinary
};
