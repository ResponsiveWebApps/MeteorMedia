Template.patternEdit.helpers({
	pattern: function() {
	return Patterns.findOne(this._id);
	},
	ownPost: function() {
		return this.userId == Meteor.userId();
	}
});
Template.patternEdit.events({
	'submit form': function(e) {
		e.preventDefault();
		var currentPatternId = this._id;
		var patternProperties = {
		url: $(e.target).find('[name=url]').val(),
		title: $(e.target).find('[name=title]').val(),
		description: $(e.target).find('[name=description]').val()
		}
		Patterns.update(currentPatternId, {$set: patternProperties}, function(error) {
			if (error) {
				// display the error to the user
				alert(error.reason);
			} else {
				Router.go('patternPage', {_id: currentPatternId});
			}
			});
		},
		'click .delete': function(e) {
			e.preventDefault();
			if (confirm("Delete this pattern?")) {
				var currentPatternId = this._id;
				Patterns.remove(currentPatternId);

				//removing subpatterns not wokring yet.	
				//var sbpRemove = SubPatterns.find({subpatternB: currentPatternId})
				//for (var i = 0; i < sbpRemove.length; i++)
				//	sAlert.error('sbpRemove[i]', configOverwrite);
				//	var subCountRemove = SubPatterns.findOne(sbpRemove[i], {fields: {subpatternA: 1} });
				//	subCountRemoveID = subCountRemove.subpatternA;
				//	Patterns.update(subCountRemoveID, {$inc: {subpatternsCount: -1}});
  					//SubPatterns.remove(sbpRemove[i]);
  				
  				
				
				Router.go('/');
			}
		}
});