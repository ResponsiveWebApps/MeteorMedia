Template.layout.helpers({
  hasMorePosts: function(){
	this.patterns.rewind();
	return Router.current().limit() == this.patterns.fetch().length;
	}
});