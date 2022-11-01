import Photo from './../models/Photo.js';
import fs from 'fs';
import path from 'path';

const __dirname = path.resolve();

const getAllPhotos = async (req, res) => {
	const photos = await Photo.find({}).sort('-dateCreated'); // db read is async
	res.render('index', {
		photos,
	}); // serve index.ejs in views folder
};

const getPhoto = async (req, res) => {
	// reading id from query with req.params.id
	const photo = await Photo.findById(req.params.id); // db read is async
	res.render('photo', {
		photo,
	});
};

const createPhoto = async (req, res) => {
	// check if the directory exists, if not, create
	const uploadDir = 'public/uploads';
	if (!fs.existsSync(uploadDir)) {
		fs.mkdirSync(uploadDir);
	}

	// get image info
	let uploadedImage = req.files.image;
	// create the path for images
	let uploadPath = __dirname + '/public/uploads/' + uploadedImage.name;

	uploadedImage.mv(uploadPath, async () => {
		await Photo.create({
			...req.body,
			image: '/uploads/' + uploadedImage.name,
		});
		res.redirect('/');
	});
};

const updatePhoto = async (req, res) => {
	const photo = await Photo.findById(req.params.id);
	photo.title = req.body.title;
	photo.description = req.body.description;
	photo.save();
	res.redirect(`/photos/${req.params.id}`);
};

const deletePhoto = async (req, res) => {
	const photo = await Photo.findById(req.params.id);
	let deletedImage = __dirname + '/public' + photo.image;
	fs.unlinkSync(deletedImage);
	await photo.deleteOne();
	res.redirect('/');
};

export default {
	getAllPhotos,
	getPhoto,
	createPhoto,
	updatePhoto,
	deletePhoto,
};
