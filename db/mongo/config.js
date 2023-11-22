import mongoose from 'mongoose';

const db = mongoose.connect('mongodb://127.0.0.1:27017/todos');

const itemSchema = new mongoose.Schema({
    task: {
       type: String,
    },
    email: {
        type: String
    },
    phone: {
        type: String
    }

});
const ItemModel = mongoose.model('Item', itemSchema);

export default {
    db: db,
    ItemModel: ItemModel
};