import express from 'express'; // use import instead of require
import mongoose from 'mongoose';
import fileUpload from 'express-fileupload';
import methodOverride from 'method-override';
import ejs from 'ejs';
import path from 'path';
import fs from 'fs';
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
// body parser can be used alternatively (body-barser.json() + body-parser.urlencoded)
app.use(express.json());
// image upload middleware
app.use(fileUpload());
// need to override POST to make PUT req
app.use(methodOverride('_method'));

// routes
app.get('/', async (req, res) => {
	const photos = await Photo.find({}).sort('-dateCreated'); // db read is async
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
app.get('/photos/edit/:id', async (req, res) => {
	const photo = await Photo.findById(req.params.id); // db read is async
	res.render('edit', {
		photo,
	});
});
app.put('/photos/:id', async (req, res) => {
	const photo = await Photo.findById(req.params.id);
	photo.title = req.body.title;
	photo.description = req.body.description;
	photo.save();
	res.redirect(`/photos/${req.params.id}`);
});
// photos is the enpoint that is set in the add.ejs file. this part is async...
app.post('/photos', async (req, res) => {
	// check if the directory exists, if not, create
	const uploadDir = 'public/uploads';
	if (!fs.existsSync(uploadDir)) {
		fs.mkdirSync(uploadDir);
	}

	// get image info
	let uploadedImage = req.files.image;
	// create the path for images
	const __dirname = path.resolve();
	let uploadPath = __dirname + '/public/uploads/' + uploadedImage.name;

	uploadedImage.mv(uploadPath, async () => {
		await Photo.create({
			...req.body,
			image: '/uploads/' + uploadedImage.name,
		});
		res.redirect('/');
	});
});

const PORT = 8080;
app.listen(PORT, () => {
	console.log(`start server on port ${PORT}`);
});
