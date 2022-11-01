import Photo from './../models/Photo.js';

const getAboutPage = (req, res) => {
	res.render('about');
};

const getAddPage = (req, res) => {
	res.render('add');
};

const getEditPage = async (req, res) => {
	const photo = await Photo.findById(req.params.id); // db read is async
	res.render('edit', {
		photo,
	});
};

export default { getAboutPage, getAddPage, getEditPage };
