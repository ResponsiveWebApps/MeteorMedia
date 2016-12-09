Template.pattern.helpers({
	submittedText: function() {
		return  moment(this.submitted).format('Do/MMM/YYYY');
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

Template.pattern.events({
	'click .upvotable': function(e) {
		e.preventDefault();
		Meteor.call('upvote', this._id);
	},
	'click .downvotable': function(e) {
		e.preventDefault();
		Meteor.call('downvote', this._id);
	},
	'click .iframeBlocker': function(e) {
		Router.go('patternPage', {_id: this._id});
	},
	'click .pattern-closeMenu':function(){
		document.getElementById("Sidebarnav").style.width = "0";
		$(".create-pattern-box").addClass("hidden");
	},
});
