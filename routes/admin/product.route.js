const express = require('express');
const router = express.Router();

const multer = require('multer');
const upload = multer({ dest: './public/uploads/' });

const controller = require('../../controllers/admin/product.controller');
const validate = require('../../validates/admin/product.validate');



router.get('/', controller.index);

router.patch('/change-status/:status/:id', controller.changeStatus);
router.patch('/change-multi', controller.changeMuti);

router.delete('/delete/:id', controller.deleteItem);


router.get('/create', controller.create);
router.post(
    '/create',
    upload.single('thumbnail'),
    validate.createPost,
    controller.createPost);

router.get('/edit/:id', controller.edit);
router.patch('/edit/:id',
    upload.single('thumbnail'),
    controller.editPatch);

router.get('/detail/:id', controller.detail);


module.exports = router;