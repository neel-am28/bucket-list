const sanitizeHTML = require('sanitize-html')
const mongodb = require('mongodb')

const listCollection = require('../db').db().collection('list')

// create constructor function
let List = function (data) {
    this.data = data
    this.errors = ''
}

// fetch all list items form db
List.prototype.getAllItems = function () {
    return new Promise(function (resolve, reject) {
        listCollection.find({}).toArray(function (err, items) {
            if (err) {
                return reject(err)
            }
            return resolve(items)
        })
    })
}

// add an item to the list
List.prototype.addListItem = function () {
    return new Promise(async (resolve, reject) => {
        if (this.data.item == "") {
            this.errors = "Please provide a list item"
        }
        // validate user input
        let safeText = sanitizeHTML(this.data.item.trim(), { allowedTags: [], allowedAttributes: {} })
        this.data = {
            item: safeText
        }
        if (!this.errors) {
            let item = await listCollection.insertOne(this.data)
            resolve(item.ops[0])
        } else {
            reject(this.errors)
        }
    })
}

// delete an item from the list
List.prototype.deleteListItem = function () {
    return new Promise(async (resolve, reject) => {
        let deletedItem = await listCollection.deleteOne({ _id: new mongodb.ObjectID(this.data) })
        if (deletedItem) {
            resolve("Item successfully deleted")
        } else {
            reject("Error deleting item")
        }
    })
}

// update an existing item in the list
List.prototype.updateListItem = function () {
    return new Promise((resolve, reject) => {
        listCollection.findOneAndUpdate({ _id: new mongodb.ObjectId(this.data.id) }, { $set: { item: this.data.item } }, { returnOriginal: false }, function (err, doc) {
            if (err) reject(err);
            resolve(doc)
        })
    })
}

module.exports = List