const { Router } = require('express');
const { check } = require('express-validator');

const { validarJWT, validarCampos, tieneRole } = require('../middlewares');
const { crearCategoria, obtenerCategorias, obtenerCategoria, actualizarCategoria, borrarCategoria } = require('../controllers/categorias');
const { existeCategoria, existeCategoriaId } = require('../helpers/db-validators');

const router = Router();

//Obtener todas las categorias - publico
router.get('/', obtenerCategorias)

//Obtener una categoria - publico
router.get('/:id', [
    check('id', 'No es un ID valido').isMongoId(),
    check('id').custom(existeCategoriaId),
    validarCampos
], obtenerCategoria)

//Crear las categorias - privado - cualquier persona con un token valido
router.post('/', [
    validarJWT,
    check('nombre', 'El nombre es obligatorio').not().isEmpty(),
    check('nombre').custom(existeCategoria),
    validarCampos
], crearCategoria)

//Actualizar la categorias - privado - cualquiera con token valido 
router.put('/:id', [
    validarJWT,
    check('id', 'No es un ID valido').isMongoId(),
    check('id').custom(existeCategoriaId),
    check('nombre', 'El nombre es obligatorio').not().isEmpty(),
    check('nombre').custom(existeCategoria),
    validarCampos
], actualizarCategoria)

//Borrar una categoria - Admin
router.delete('/:id', [
    validarJWT,
    tieneRole('ADMIN_ROLE'),
    check('id', 'No es un ID valido').isMongoId(),
    check('id').custom(existeCategoriaId),
    validarCampos
], borrarCategoria)

module.exports = router