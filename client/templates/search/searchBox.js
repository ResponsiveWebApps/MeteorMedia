var options = {
  keepHistory: 1000 * 60 * 5,
  localSearch: true
};
var fields = ['title'];//also check search.js in server folder.

PackageSearch = new SearchSource('patterns', fields, options);

Template.searchResult.helpers({
  getPackages: function() {
    return PackageSearch.getData({
      transform: function(matchText, regExp) {
        return matchText.replace(regExp, "<b>$&</b>")
      },
      sort: {subpatternsCount: -1, votes: -1, commentsCount: -1, submitted: -1, _id: -1}
    });
  },

  isLoading: function() {
    return PackageSearch.getStatus().loading;
  }
});

//Template.searchResult.rendered = function() {
//  PackageSearch.search('subpattern');
//};

Template.nav.events({
  "keyup #navbar-srchbox": _.throttle(function(e) {
    var text = $(e.target).val().trim();
    PackageSearch.search(text);

    if (text===""){
         PackageSearch.search("subpattern");
       } else {
          PackageSearch.search(text);
    };
  }, 200)
});
