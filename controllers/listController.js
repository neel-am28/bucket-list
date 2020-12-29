const List = require('../models/List')

// display the home screen
exports.getHomeScreen = (req, res) => {
    res.render('list')
}

// fetch all items from the db
exports.getData = (req, res) => {
    let item = new List()
    item.getAllItems().then((items) => {
        res.json(items)
    }).catch((err) => {
        res.json(err)
    })
}
// add an item to the list
exports.addListItem = (req, res) => {
    let item = new List(req.body)
    item.addListItem().then((response) => {
        res.json(response)
    }).catch((err) => {
        req.flash('error', err)
        res.redirect(301, '/')
    })
}

// delete an item from the list
exports.deleteItem = (req, res) => {
    let item = new List(req.body.id)
    item.deleteListItem().then(() => {
        res.send('success')
    }).catch(() => {
        console.log('error');
    })
}

// update an existing item in the list
exports.updateItem = (req, res) => {
    let updatedItem = new List(req.body)
    updatedItem.updateListItem().then((doc) => {
        res.json(doc)
    }).catch((err) => {
        console.log(err);
    })
}