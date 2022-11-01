import express from 'express'; // use import instead of require
import mongoose from 'mongoose';
import fileUpload from 'express-fileupload';
import methodOverride from 'method-override';
import ejs from 'ejs';
import photoController from './controllers/photoControllers.js';
import pageController from './controllers/pageController.js';

const app = express();

// connect db
mongoose
	.connect(
		'mongodb+srv://tahatsahin:ahNkgDdOZF1eWi1g@cluster0.tdgqbs8.mongodb.net/pcat-db?retryWrites=true&w=majority',
		{
			useNewUrlParser: true,
			useUnifiedTopology: true,
		}
	)
	.then(() => {
		console.log('db connected');
	})
	.catch((err) => {
		console.log(err);
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
// override POST and GET methods
app.use(
	methodOverride('_method', {
		methods: ['POST', 'GET'],
	})
);

// routes
app.get('/', photoController.getAllPhotos);
app.get('/photos/:id', photoController.getPhoto);
app.post('/photos', photoController.createPhoto);
app.put('/photos/:id', photoController.updatePhoto);
app.delete('/photos/:id', photoController.deletePhoto);

app.get('/about', pageController.getAboutPage);
app.get('/add', pageController.getAddPage);
app.get('/photos/edit/:id', pageController.getEditPage);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
	console.log(`start server on port ${PORT}`);
});
