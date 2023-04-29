const { Router } = require('express');
const { check } = require('express-validator');

const { validarJWT, validarCampos, tieneRole } = require('../middlewares');
const { existeCategoriaId, existeProductoId, existeProducto } = require('../helpers/db-validators');
const { obtenerProductos, obtenerProducto, crearProducto, actualizarProducto, borrarProducto } = require('../controllers/productos');

const router = Router();

//Obtener todas las productos - publico
router.get('/', obtenerProductos)

//Obtener una categoria - publico
router.get('/:id', [
    check('id', 'No es un ID valido').isMongoId(),
    check('id').custom(existeProductoId),
    validarCampos
], obtenerProducto)

//Crear los productos - privado - cualquier persona con un token valido
router.post('/', [
    validarJWT,
    check('nombre', 'El nombre es obligatorio').not().isEmpty(),
    check('nombre').custom(existeProducto),
    check('categoria', 'La categoria es obligatoria').not().isEmpty(),
    check('categoria', 'No es un ID de categoria valido').isMongoId(),
    check('categoria').custom(existeCategoriaId),
    check('descripcion', 'La descripcion es obligatoria').not().isEmpty(),
    validarCampos
], crearProducto)

//Actualizar el producto - privado - cualquiera con token valido 
router.put('/:id', [
    validarJWT,
    check('id', 'No es un ID valido').isMongoId(),
    check('id').custom(existeProductoId),
    check('nombre', 'El nombre es obligatorio').not().isEmpty(),
    check('categoria', 'La categoria es obligatoria').not().isEmpty(),
    check('categoria', 'No es un ID de categoria valido').isMongoId(),
    check('categoria').custom(existeCategoriaId),
    check('descripcion', 'La descripcion es obligatoria').not().isEmpty(),
    validarCampos
], actualizarProducto)

//Borrar un producto - Admin
router.delete('/:id', [
    validarJWT,
    tieneRole('ADMIN_ROLE'),
    check('id', 'No es un ID valido').isMongoId(),
    check('id').custom(existeProductoId),
    validarCampos
], borrarProducto)

module.exports = router