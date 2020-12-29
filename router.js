const express = require('express')
const router = express.Router()
const listController = require('./controllers/listController')

router.get('/', listController.getHomeScreen);
router.get('/displayItems', listController.getData);
router.post('/create', listController.addListItem);
router.post('/delete-item', listController.deleteItem);
router.post('/update-item', listController.updateItem);
module.exports = router