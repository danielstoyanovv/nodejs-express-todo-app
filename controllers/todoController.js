import bodyParser  from 'body-parser';
import ItemService from "../services/itemService.js";
import { check, validationResult } from 'express-validator';

var urlencodedParser = bodyParser.urlencoded({ extended: false });

export default function (app) {
    app.get('/todo', async function (req, res) {
         (await (new ItemService()).getItems().then(r => {
             try {
                 if (req.session.errors != null) {
                    console.log(req.session.errors);
                     //let errors = Object.entries(req.session.errors);
const errors = req.session.errors;
                    // console.log(Object.entries(req.session.errors));
                    // console.log(Object.keys(req.session.errors));

                     req.session.errors = null;
              //       console.log(errors);
                     return res.render('todo', {todos: r, errors: errors});


                 }
                 return res.render('todo', {todos: r});
             } catch (err) {
                 console.log(err);
             }

         }));

    });

    app.post('/todo', [urlencodedParser,
        check('item', 'Item length should be 10 characters')
            .isLength({ max: 10 }).isAlphanumeric().withMessage('Please do not use any digits')
    ],  function (req, res) {
        const errors = validationResult(req);

        if (!errors.isEmpty()) {
            const errorsMessages = [];
            for(let [key, value] of Object.entries(errors.errors))
            {
                //console.log(value.msg);
                errorsMessages.push(value.msg);
            }

            req.session.errors = errorsMessages;

            return res.redirect('/todo');
        }
        const itemValue = Object.values(req.body)[0];
        const item = (new ItemService()).setTask(itemValue).createItem();
        return res.redirect('/todo');
    });

    app.delete('/todo/:item', function (req, res) {
        (new ItemService()).deleteItem(req.params.item);
        return res.json(['deleted']);
    });
}