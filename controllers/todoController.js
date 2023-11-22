import bodyParser  from 'body-parser';
import ItemService from "../services/itemService.js";
import { check, validationResult } from 'express-validator';

var urlencodedParser = bodyParser.urlencoded({ extended: false });

export default function (app) {
    app.get('/todo', async function (req, res) {
         (await (new ItemService()).getItems().then(r => {
             try {
                 if (req.session.errors != null) {
                     const errors = req.session.errors;
                     req.session.errors = null;
                     return res.render('todo', {todos: r, errors: errors});
                 }
                 return res.render('todo', {todos: r});
             } catch (err) {
                 console.log(err);
             }
         }));
    });

    app.post('/todo', [urlencodedParser,
        check('item', 'Item length is between 5 and 20 characters')
            .isLength({ min: 5,  max: 20 }),
        check('email', 'Email is not valid').isEmail(),
        check('phone', 'Phone length is between 10 and 20 digits').isLength({ min: 10,  max: 20 })
            .isNumeric().withMessage('Phone should be only digits')
    ],  function (req, res) {
        try {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                const errorsMessages = [];
                for(let [key, value] of Object.entries(errors.errors)) {
                    errorsMessages.push(value.msg);
                }
                req.session.errors = errorsMessages;
                return res.redirect('/todo');
            }
            const itemValue = req.body.item;
            const email = req.body.email;
            const phone = req.body.phone;
            (new ItemService())
                .setTask(itemValue)
                .setEmail(email)
                .setPhone(phone)
                .createItem();
            return res.redirect('/todo');
        } catch (err) {
            console.log(err);
        }
    });

    app.delete('/todo/:item', function (req, res) {
        try {
            (new ItemService()).deleteItem(req.params.item).then(r => {
                return res.json(['deleted']);
            });
        } catch (err) {
            console.log(err);
        }
    });
}