Template.userProfile.helpers({
	connections: function() {
		return UserConnections.find({connectionFrom: this.user.username});
	},
	ownProfile: function() {
		return this.user._id == Meteor.userId();
	},
	alreadyConnected: function() {
		return UserConnections.findOne({connectionFrom: Meteor.user().username,
																	connectionTo:this.user.username
																	});
	},
	joinedAt: function() {
		return moment(this.user.createdAt).format('Do/MMM/YYYY');
	},
	patternCount: function() {
    return Patterns.find({creator: this.user.username}).count();
  },
	connectionCount: function() {
    return UserConnections.find({connectionFrom: this.user.username}).count();
  },
	hasMorePosts: function(){
	this.patterns.rewind();
	return Router.current().limit() == this.patterns.fetch().length;
	},
	patternStarsCount: function(){
		var total = 0;

		Patterns.find({creator: this.user.username}).map(function(doc) {
  		total += doc.votes;
		});

		return total;
	}
});

//create connection
Template.userProfile.events({
	'click .connect':function(e){
        var userConnectFrom= Meteor.user().username;
        var userConnectTo = this.user;
			  //UserConnections.insert({connectionFrom:userId,connectionTo:tmpl.data._id});
        var connection = {
      		connectionFrom: userConnectFrom,
      		connectionTo: userConnectTo.username
    	  };

      Meteor.call('connection', connection, function(error, connectionId) {
    		if (error)
    		throwError(error.reason);
    	});

	},
	'click .disconnect':function(e){
        var userConnectFrom= Meteor.user().username;
        var userConnectTo = this.user;
				var disconnection = UserConnections.findOne({
																			connectionFrom: Meteor.user().username,
																			connectionTo:this.user.username
																			});
				UserConnections.remove(disconnection._id);

	}
})
