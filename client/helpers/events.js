Template.main.rendered = function(){
	setTimeout(function(){
		masonize(function(){

		})
	},500)
}
Template.createPattern.events({
	'click .save':function(evt,tmpl) {
		var pattern = {
			url: tmpl.find('.url').value,
			title: tmpl.find('.title').value,
			description: tmpl.find('.description').value,
			height: getRandomInt(150,350),
		}
		Meteor.call('pattern', pattern, function(error, id) {
			if (error){
			// display the error to the user
			throwError(error.reason);
			//if same pattern already created.

			}else{
				$(".create-pattern-box").addClass("hidden");
				Router.go('patternPage', {_id: id});
			}

		});

	},
	'click .cancel':function(){
		$(".create-pattern-box").addClass("hidden");
	},
	'click .close':function(){
		$(".create-pattern-box").addClass("hidden");
	}
})
//create subpattern
Template.addSubpattern.events({
	'click .create':function(evt,tmpl){
		var pattern = {
			url: tmpl.find('.url').value,
			title: tmpl.find('.title').value,
			description: tmpl.find('.description').value,
			height: getRandomInt(150,350),
		}
		Meteor.call('pattern', pattern, function(error, id) {
			if (error){
			// display the error to the user
			throwError(error.reason);
			//if same pattern already created.
			if (error.error === 302){
				//SubPatterns.insert({subpatternA:tmpl.data._id,subpatternB:error.details});
				//Router.go('patternPage', {_id: error.details});
			}
			} else {
				SubPatterns.insert({subpatternA:tmpl.data._id,subpatternB:id});
				SubPatterns.insert({subpatternA:id,subpatternB:tmpl.data._id, origin: true});
				//updating subpatternsCount needs to be on server side.
				Meteor.call('upSubpatternCount', tmpl.data._id);
				//doesnt need to sbp count Meteor.call('upSubpatternCount', id);
				Router.go('patternPage', {_id: id});
			}
			});
	},
})

function getRandomInt(min, max){
	return Math.floor(Math.random() * (max - min + 1)) - min;
}
function masonize(callback){
	var container = $('#mainContent');
	container.masonry({
		itemSelector:'.item',
		gutter:20
	})
	if(callback){callback()};
}

UI.registerHelper('shareOnFacebookLink', function() {
  return 'https://www.facebook.com/sharer/sharer.php?&u=' + window.location.href;
});

UI.registerHelper('shareOnTwitterLink', function() {
  return 'https://twitter.com/intent/tweet?url=' + window.location.href + '&text=' + this.title;
});

UI.registerHelper('shareOnGooglePlusLink', function() {
  return 'https://plus.google.com/share?url=' + window.location.href;
});
