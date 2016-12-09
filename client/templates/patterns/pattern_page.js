Template.patternPage.helpers({
	comments: function() {
		return Comments.find({postId: this._id});
	},
	subpatterns: function() {
		return SubPatterns.find({subpatternA: this._id});
	},
	submittedText: function() {
		return moment(this.submitted).format('Do/MMM/YYYY');
	},
	ownPost: function() {
		return this.userId == Meteor.userId();
	},
	upvotedClass: function() {
		var userId = Meteor.user().username;
		if (userId && !_.include(this.upvoters, userId)) {
			return 'small-star-nofill upvotable';
		} else {
			return 'small-star-fill downvotable';
		}
	}
});

Template.patternPage.events({
	'click .upvotable': function(e) {
		e.preventDefault();
		Meteor.call('upvote', this._id);
	},
	'click .downvotable': function(e) {
		e.preventDefault();
		Meteor.call('downvote', this._id);
	},
	'mouseenter .upvote': function(e) {
		$(".whoStars-box").removeClass("hidden");
	},
	'mouseleave .pattern-page-box': function(e) {
		$(".whoStars-box").addClass("hidden");
	}
});
