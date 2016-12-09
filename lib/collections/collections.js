Patterns = new Meteor.Collection('patterns');
Comments = new Meteor.Collection('comments');
SubPatterns = new Meteor.Collection('subpatterns');
UserConnections = new Mongo.Collection('userConnections');

//Patterns methods.

var PatternsSchemas = {};

PatternsSchemas.Patterns = new SimpleSchema({
		url: {
	    type: String
	  },
	  title: {
	    type: String
	  },
		description: {
	    type: String,
			optional: true
	  },
	  submitted: {
	    type: Date
	  },
	  userId: {
	    type: String,
	    regEx: SimpleSchema.RegEx.Id,
	    autoValue: function () {
	      if (this.isInsert) {
	        return Meteor.userId();
	      }
	    },

	    autoform: {
	      options: function () {
	        _.map(Meteor.users.find().fetch(), function (user) {
	          return {
	            label: user.emails[0].address,
	            value: user._id
	          };
	        });
	      }
	    }
	  },
		creator: {
		  type: String
		  },
		upvoters: {
			type: [String],
			optional: true
			},
		votes: {
			type: Number,
			optional: true
			},
		subpatternsCount: {
			type: Number,
			optional: true
			},
		commentsCount: {
			type: Number,
			optional: true
			}
	});

Patterns.attachSchema(PatternsSchemas.Patterns)

Patterns.allow({

	update: function(userId) {
		// only allow update if you are logged in
		return !! userId;
		},
	remove: function(ownsDocument) {
		// only allow remove if creator
		return !! ownsDocument;
		},

});

Patterns.deny({
	update: function(userId, pattern, fieldNames, subpatternsCount) {
		// may only edit the following fields:
		return (_.without(fieldNames, 'url', 'title', 'description', 'subpatternsCount').length > 0);
	}
});

Meteor.methods({
  pattern: function(patternAttributes) {
		var user = Meteor.user(),
		patternWithSameLink = Patterns.findOne({url: patternAttributes.url});
		// ensure the user is logged in
		if (!user)
			throw new Meteor.Error(401, "login to create new pattern.");
		// ensure the post has a title
		if (!patternAttributes.title)
			throw new Meteor.Error(422, 'please fill in a title.');
		// check that there are no previous posts with the same link
		//if (patternAttributes.url && patternWithSameLink) {
		//	throw new Meteor.Error(302,
		//	'pattern already created.<br /><a href ="/ptrn/'+patternWithSameLink._id+'"">view pattern</>',
		//	patternWithSameLink._id);
		//}
		// pick out the whitelisted keys
		var pattern = _.extend(_.pick(patternAttributes, 'url', 'title', 'description'), {
			userId: user._id,
			creator: user.username,
			submitted: new Date().getTime(),
			commentsCount: 0,
			subpatternsCount: 0,
			upvoters: [],
			votes: 0
		});
		var postId = Patterns.insert(pattern);
		return postId;
	},

	upvote: function(postId) {
		var user = Meteor.user();
		// ensure the user is logged in
		if (!user)
			throw new Meteor.Error(401, "login to star");
		Patterns.update({
			_id: postId,
			upvoters: {$ne: user.username}
		}, {
			$addToSet: {upvoters: user.username},
			$inc: {votes: 1}
		});
	},

	downvote: function(postId) {
		var user = Meteor.user();
		// ensure the user is logged in
		if (!user)
			throw new Meteor.Error(401, "login to de-star");
			Patterns.update({
		   _id: postId
		  },{
		    $pull: { upvoters: user.username},
				$inc: {votes: -1}
			});
	},

	upSubpatternCount: function(postId) {
	  var user = Meteor.user();
	  // ensure the user is logged in
	  if (!user)
	 	 throw new Meteor.Error(401, "login to star");
	  Patterns.update({
	 	 _id: postId
	  }, {
	 	 	 $inc: {subpatternsCount: 1}
	  });
  },

});

//SubPatterns methods.

//schema stops subpatterns being inserted in events.js needs a method later.
//var SubPatternsSchemas = {};

//SubPatternsSchemas.Patterns = new SimpleSchema({
	//	subpatternA: {
	  //  type: String
	  //},
	//  subpatternB: {
	  //  type: String
	  //},
		//origin: {
	    //type: Boolean,
			//optional: true
	  //}
	//});

//SubPatterns.attachSchema(SubPatternsSchemas.SubPatterns)

SubPatterns.allow({
	insert: function(userId, doc) {
	// only allow posting if you are logged in
		return !! userId;
	}
});

//Comments methods.

var CommentsSchemas = {};

CommentsSchemas.Comments = new SimpleSchema({
		postId: {
	    type: String
	  },
	  body: {
	    type: String
	  },
	  userId: {
	    type: String,
	    regEx: SimpleSchema.RegEx.Id,
	    autoValue: function () {
	      if (this.isInsert) {
	        return Meteor.userId();
	      }
	    },

	    autoform: {
	      options: function () {
	        _.map(Meteor.users.find().fetch(), function (user) {
	          return {
	            label: user.emails[0].address,
	            value: user._id
	          };
	        });
	      }
	    }
	  },
		author: {
		  type: String
		  },
		submitted: {
			type: Date,
			autoValue: function () {
				return new Date()
			}
			}
	});

Comments.attachSchema(CommentsSchemas.Comments)

Meteor.methods({
	comment: function(commentAttributes) {
		var user = Meteor.user();
		var post = Patterns.findOne(commentAttributes.postId);
		// ensure the user is logged in
		if (!user)
		throw new Meteor.Error(401, "login to comment");
		if (!commentAttributes.body)
		throw new Meteor.Error(422, 'please write some content');
		if (!commentAttributes.postId)
		throw new Meteor.Error(422, 'comment on a post');
		comment = _.extend(_.pick(commentAttributes, 'postId', 'body'), {
			userId: user._id,
			author: user.username,
			submitted: new Date().getTime()
		});
		Patterns.update(comment.postId, {$inc: {commentsCount: 1}});
		return Comments.insert(comment);
	}
});

//UserConnections methods.

Meteor.methods({
	connection: function(connectionAttributes) {
		var user = Meteor.user();
		// ensure the user is logged in
		if (!user)
		throw new Meteor.Error(401, "login to connect");

		connection = _.extend(_.pick(connectionAttributes, 'connectionFrom', 'connectionTo'));
		return UserConnections.insert(connection);
	}
});

UserConnections.allow({
	insert: function(userId, doc) {
	// only allow posting if you are logged in
		return !! userId;
	},
	remove: function(userId, doc) {
	// only allow posting if you are logged in
		return !! userId;
	}
});
