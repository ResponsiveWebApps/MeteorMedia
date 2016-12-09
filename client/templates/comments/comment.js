Template.comment.helpers({
	submittedText: function() {
		return moment(this.submitted).format('Do/MMM/YYYY');
	}
});