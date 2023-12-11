import bodyParser  from 'body-parser';
import { check, validationResult } from 'express-validator';
import config from "../db/mongo/config.js";

var urlencodedParser = bodyParser.urlencoded({ extended: false });

export default function (app) {
const ITEM_MODEL = config.ItemModel

    app.get('/todos', async function (req, res) {
        ITEM_MODEL
            .find()
            .sort({ _id: -1 })
            .select({ task: 1, id: 1 })
            .then(function (result) {
            if (req.session.errors != null) {
                const errors = req.session.errors;
                req.session.errors = null;
                return res.render('todos/index', {
                    todos: result,
                    errors: errors
                });
            }
            return res.render('todos/index', {
                todos: result
            });
        }).catch(function (err) {
            console.log(err)
        })
    });

    app.post('/todos', [urlencodedParser,
        check('task', 'Task length is between 5 and 20 characters')
            .isLength({ min: 5,  max: 20 }),
        check('email', 'Email is not valid').isEmail(),
        check('phone', 'Phone length is between 10 and 20 digits').isLength({ min: 10,  max: 20 })
            .isNumeric().withMessage('Phone should be only digits')
    ],  function (req, res) {

        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            req.session.errors = errors.array()
            return res.redirect('/todos');
        }
        const task = req.body.task;
        const email = req.body.email;
        const phone = req.body.phone;
        new ITEM_MODEL({ task: task, email: email, phone: phone })
            .save()
            .then(function (result) {
                return res.redirect('/todos')
            }).catch(function (err) {
                console.log(err)
                req.session.errors = [{msg: "Something happened, or email is duplicated"}]
                return res.redirect('/todos')
            })
    });

    app.get("/todos/:id", async function (req, res) {
        const id = req.params.id
        const item = await ITEM_MODEL
            .findById(id)
            .exec()
        if (req.session.errors) {
            const errors = req.session.errors;
            req.session.errors = [];
            return res.render('todos/update', {
                errors: errors,
                item: item
            });
        }

        return res.render('todos/update', {
            item: item
        });
    })

    app.post('/todos/:id', [urlencodedParser,
        check('task', 'Task length is between 5 and 20 characters')
            .isLength({ min: 5,  max: 20 }),
        check('email', 'Email is not valid').isEmail(),
        check('phone', 'Phone length is between 10 and 20 digits').isLength({ min: 10,  max: 20 })
            .isNumeric().withMessage('Phone should be only digits')
    ],  function (req, res) {
        const id = req.params.id
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            req.session.errors = errors.array()
            return res.redirect('/todos/' + id)
        }
        const task = req.body.task;
        const email = req.body.email;
        const phone = req.body.phone;

        ITEM_MODEL.findByIdAndUpdate(id, {
            task: task,
            email: email,
            phone: phone
        })
        .then(function (result) {
            return res.redirect('/todos/' + id)
        }).catch(function (err) {
            console.log(err)
        })
    })

    app.delete('/todos/:id', async function (req, res) {
        try {
            const id = req.params.id
            await config.ItemModel.deleteOne({_id: id})
            return res.json(['deleted']);
        } catch (err) {
            console.log(err);
        }
    });
}