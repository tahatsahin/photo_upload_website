import express from 'express'; // use import instead of require
import mongoose from 'mongoose';
import ejs from 'ejs';
import path from 'path';
import Photo from './models/Photo.js';

const app = express();

// connect db
mongoose.connect('mongodb://127.0.0.1:27017/pcat-test-db', {
	useNewUrlParser: true,
	useUnifiedTopology: true,
});

// template engine
app.set('view engine', 'ejs'); // use ejs as template engine

// middlewares
app.use(express.static('public'));
// to be able to receive data, use urlencoded and json methods of express in the middleware
// urlencoded is a method to recognize the incoming Request Object as strings or arrays
app.use(express.urlencoded({ extended: true }));
// json is a method to recognize the incoming Request Object as a JSON object
app.use(express.json());
// body parser can be used alternatively (body-barser.json() + body-parser.urlencoded)

// routes
app.get('/', async (req, res) => {
	const photos = await Photo.find({}); // db read is async
	res.render('index', {
		photos,
	}); // serve index.ejs in views folder
});
app.get('/photos/:id', async (req, res) => {
	// reading id from query
	const photo = await Photo.findById(req.params.id); // db read is async
	res.render('photo', {
		photo,
	});
});
app.get('/about', (req, res) => {
	res.render('about');
});
app.get('/add', (req, res) => {
	res.render('add');
});
// photos is the enpoint that is set in the add.ejs file. this part is async...
app.post('/photos', async (req, res) => {
	await Photo.create(req.body);
	res.redirect('/');
});

const PORT = 8080;
app.listen(PORT, () => {
	console.log(`start server on port ${PORT}`);
});
