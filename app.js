import express from 'express';
import todoController from './controllers/todoController.js';
import session from 'express-session';
import AdminJS from 'adminjs'
import AdminJSExpress from '@adminjs/express'
import { Database, Resource } from '@adminjs/mongoose'
import config from "./db/mongo/config.js"

const PORT = 3000

const ITEM_MODEL = config.ItemModel

const DEFAULT_ADMIN = {
    email: 'admin@example.com',
    password: 'password',
}

const authenticate = async (email, password) => {
    if (email === DEFAULT_ADMIN.email && password === DEFAULT_ADMIN.password) {
        return Promise.resolve(DEFAULT_ADMIN)
    }
    return null
}

const start = async () => {
    AdminJS.registerAdapter({ Database, Resource });
    const app = express();

        const admin = new AdminJS({
            resources: [{
                resource: ITEM_MODEL,
                options: {
                    id: 'list'
                },
            }],
        });
        const adminRouter = AdminJSExpress.buildAuthenticatedRouter(
            admin,
            {
                authenticate,
                cookieName: 'adminjs',
                cookiePassword: 'sessionsecret',
            },
            null,
            {
                store: null,
                resave: true,
                saveUninitialized: true,
                secret: 'sessionsecret',
                cookie: {
                    httpOnly: process.env.NODE_ENV === 'production',
                    secure: process.env.NODE_ENV === 'production',
                },
                name: 'adminjs',
            }
        )

        app.use(admin.options.rootPath, adminRouter);

        app.listen(PORT, () => {
            console.log(`AdminJS started on http://localhost:${PORT}${admin.options.rootPath}`)
        });

        app.use(session({secret: '123456', resave: true, saveUninitialized: true}))

        app.set('view engine', 'ejs');

        todoController(app);

        app.use(express.static('./public'));
}

start();