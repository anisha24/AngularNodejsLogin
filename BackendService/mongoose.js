var mongoose = require('mongoose');

mongoose.connect(
	'mongodb+srv://anblersh:anblersh@cluster0.msnlj.mongodb.net/login?retryWrites=true&w=majority',
	{ useNewUrlParser: true, useUnifiedTopology: true }
);

mongoose.set('useFindAndModify', false);
module.exports = mongoose;