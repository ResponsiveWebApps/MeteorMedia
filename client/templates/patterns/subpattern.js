Template.subpattern.helpers({
	subpattern: function () {
    return Patterns.findOne({_id: this.subpatternB});
      }
});
