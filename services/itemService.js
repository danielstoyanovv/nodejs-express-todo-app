import config from "../db/mongo/config.js";

class ItemService {
    async getItems() {
        return config.ItemModel.find();
    }

    setTask($task) {
        this.task = $task;
        return this;
    }

    createItem() {
        const item = new config.ItemModel({ task: this.task });
        //console.log(item.validateSync();
        item.save()
            .then(function (result) {
            }).catch(function (err) {
                console.log(err);
            })
        return item;
    }

    async deleteItem(id) {
        await config.ItemModel.deleteOne({_id: id})
            .then(function (result) {
                return result;
            }).catch(function (err) {
                console.log(err);
            })
    }
}

export default ItemService;