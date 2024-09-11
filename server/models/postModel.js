const {Schema, model} = require('mongoose')

const postSchema = new Schema({
    title: {type: String, required: true},
    thumbnail: {type: String},
    description: {type: String, required: true},
    bookAuthor: {type: String, required: true},
    creator: {type: Schema.Types.ObjectId, ref: "User"},
    category: {
        type: String,
        enum: [
            'Uncategorized',
            'Journals',
            'Fantasy',
            'Mistery',
            'Fiction',
            'Thriller',
            'Non-Fiction',
            'Horror',
            'Romance'
        ], message: "Value is not supported"
    },

}, {timestamps: true})

module.exports = model("Post", postSchema)