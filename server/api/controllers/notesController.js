var Models = require('../models/lander-models');
var Note = Models.noteModel;
var User = Models.userModel;
var Like = Models.likeModel;
var View = Models.viewModel;


exports.createNote = function(req,res){
	console.log(req.body);
	var note = Note.build({
		title:req.body.title,
		// author:req.body.author,
		desc:req.body.desc || 'no description',
		content:req.body.content || 'no content',
		subject:req.body.subject || 'no subject',
	});
	note.save().then(function(note){
		User.find({where:{name:req.body.author} }).then(function(author){
			note.setAuthor(author).then(function(){
				author.addNotes([note]).then(function(){
					res.json(note)
				});
			});
		});
	});
};

exports.showNotesByQuery = function(req,res){

	query = {};
	if (req.param('author')){
		query.authorName = req.param('author');
	}
	if (req.param('title')){
		query.title = req.param('title');
	}
	if (req.param('community')){
		query.community = req.param('community');
	}
	if(req.param('subject')){
		query.subject = req.param('subject');
	}

	Note.findAll({where:query}).then(function(notes){
		res.json(notes);
	});
};

exports.showNotesByAuthor = function(req,res){
	// console.log(req.params);
	Note.findAll({where:{AuthorName:req.params.author} },{include: [Like,{model:User,as:'Author'}]})
	.then(function(notes){
		// console.log('note found');
		// console.log(note.title);
		res.json(notes);
		// console.log(userVar);
	});
};

exports.showNotesBySubject = function(req,res){
	console.log('Showing notes by subject');
	Note.findAll({where:{subject:req.params.subject},include: [Like,{model:User,as:'Author'}]})
	.then(function(notes){
		res.json(notes);
	});
};

exports.showNotesByCommunity = function(req,res){
	console.log('showing notes by community');
	Note.findAll({where:{community:req.params.community}},{include: [Like,{model:User,as:'Author'}]})
	.then(function(results){
		res.json(results);
	});
};

var getNoteLikes = function(note,callback){
	console.log('getting note likes');
	note.getLikes().then(function(likes){
		callback(likes);
		// return likes;
	});
};

exports.indexNotes = function(req,res){
	Note.findAll({include: [Like,{model:User,as:'Author'},View]}).then(function(notes){
		res.json(notes);
	});
		// if(notes.length > 0){
		// 	var x=0;
		// 	var notesArray = [];

		// 	for( x; x < notes.length;x++){
		// 		var y=x;
		// 		notesArray[y] = {
		// 			note:notes[y],
		// 			likes:[]
		// 		};
		// 		//callback because likes are defered
		// 		getNoteLikes(notes[y],function(likes){
		// 			if (likes.length > 0){
		// 				console.log('found likes');
		// 				notesArray[y].likes = likes;
		// 			}
		// 			if(y == (notes.length-1)){
		// 				res.json(notesArray);
		// 			}
		// 		});
		// 	}
		// }
		// else{
		// 	result = {
		// 		result:'no notes'
		// 	};
			// res.json(result);
		// }
	// });
};

// exports.createLike = function(req,res){
// 	console.log('creating like');
// 	var like = Like.build({});
// 	like.save().then(function(like){
// 		User.find({where:{name:req.body.userName} }).then(function(user){
// 			Note.find({where:{id:req.body.noteId} }).then(function(note){
// 				like.setUser(user);
// 				like.setNote(note);
// 				res.json(like);
// 			});
// 		});
// 		// like.setUser()
// 	});
// };
exports.indexLikes = function(req,res){
	Like.findAll().then(function(likes){
		res.json(likes);
	});
};

exports.deleteLikes = function(req,res){
	Like.destroy({truncate:true}).then(function(){
		res.send(200);
	});
};

exports.likeNote = function(req,res){
	console.log('adding view to note');
	User.find({where:{name:req.body.userName} }).then(function(user){
		Note.find({where:{id:req.body.noteId} }).then(function(note){
			var like = Like.build({UserName:user.name,NoteId:note.id});
			// view.save().then(function(){
				Like.findAll({where:{UserName:user.name,NoteId:note.id}}).then(function(likes){
					if (likes.length > 0){
						res.send(500,'user already liked this');
					}
					else{
						console.log('we good first');
						like.save().then(function(){
							console.log('we good');
							res.json(like);
						});
					}
				});
			// });
		});
	});
};

exports.indexViews = function(req,res){
	View.findAll().then(function(views){
		res.json(views);
	});
};

exports.deleteViews = function(req,res){
	View.destroy({truncate:true}).then(function(){
		res.send(200);
	});
};

exports.viewNote = function(req,res){
	console.log('adding view to note');
	User.find({where:{name:req.body.userName} }).then(function(user){
		Note.find({where:{id:req.body.noteId} }).then(function(note){
			var view = View.build({UserName:user.name,NoteId:note.id});
			// view.save().then(function(){
				View.findAll({where:{UserName:user.name,NoteId:note.id}}).then(function(views){
					if (views.length > 0){
						res.send(500,'user already viewed this');
					}
					else{
						console.log('we good first');
						view.save().then(function(){
							console.log('we good');
							res.json(view);
						});
					}
				});
			// });
		});
	});
};
// exports.getNoteLikes = getNoteLikes;