import mongoose from 'mongoose';

const db = mongoose.connect('mongodb://127.0.0.1:27017/todos');

const itemSchema = new mongoose.Schema({
    task: {
        type: String,
        required: true,
        maxlength: 20,
        trim: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        maxlength: 30
    },
    phone: {
        type: String,
        required: true,
        maxlength: 20,
    }

});
const ItemModel = mongoose.model('Item', itemSchema);

export default {
    db: db,
    ItemModel: ItemModel
};