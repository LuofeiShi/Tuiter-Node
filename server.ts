import express, {Request, Response} from 'express';
import UserController from "./controllers/UserController";
import TuitController from "./controllers/TuitController";
import TuitDao from "./daos/TuitDao";
import UserDao from "./daos/UserDao";
import mongoose from "mongoose";

// connect to the database
const DB_USERNAME = process.env.DB_USERNAME;
const DB_PASSWORD = process.env.DB_PASSWORD;
const connectionString = 'mongodb+srv://${DB_USERNAME}:${DB_PASSWORD}@cluster0.retsy.mongodb.net/Tuiter?retryWrites=true&w=majority';
mongoose.connect(connectionString);

// create RESTful web service API
const app = express();
app.use(express.json());

app.get('/', (req: Request, res: Response) =>
    res.send('Welcome to Luofei\'s project!'));

app.get('/add/:a/:b', (req: Request, res: Response) =>
    res.send(req.params.a + req.params.b));

// init the tuit controller and user controller by calling constructor
const tuiDao = new TuitDao();
const tuitController = new TuitController(app, tuiDao);

const userDao = new UserDao();
const userController = new UserController(app, userDao);

const PORT = 4000;
app.listen(process.env.PORT || PORT);