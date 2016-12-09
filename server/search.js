SearchSource.defineSource('patterns', function(searchText, options) {
  var options = {sort: {subpatternsCount: -1, votes: -1, commentsCount: -1, submitted: -1, _id: -1}, limit: 100};

  if(searchText) {
    var regExp = buildRegExp(searchText);
    var selector = {$or: [
      {title: regExp}
    ]};

    return Patterns.find(selector, options).fetch();
  } else {
    return Patterns.find({}, options).fetch();
  }
});

function buildRegExp(searchText) {
  // this is a dumb implementation
  var parts = searchText.trim().split(/[ \-\:]+/);
  return new RegExp("(" + parts.join('|') + ")", "ig");
}
