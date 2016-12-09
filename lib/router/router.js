Router.configure({
  layoutTemplate: 'layout',
  loadingTemplate: 'loading',
  //waitOn: function() { return Meteor.subscribe('patterns'); }
});

// data function returns a false value
Router.plugin("dataNotFound",{
    notFoundTemplate: "dataNotFound"
})

PatternsListController = RouteController.extend({
  template: 'main',
  increment: 15,
  postsLimit: function() {
    return parseInt(this.params.postsLimit) || this.increment;
  },
  findOptions: function() {
    return {sort: this.sort, limit: this.postsLimit()};
  },
  subscriptions: function() {
    this.postsSub = Meteor.subscribe('patterns', this.findOptions());
  },
  patterns: function() {
    return Patterns.find({}, this.findOptions());
  },
  data: function() {
    var self = this;
    return {
      patterns: self.patterns(),
      ready: self.postsSub.ready,
      nextPath: function() {
        if (self.patterns().count() === self.postsLimit())
          return self.nextPath();
      }
    };
  }
});

NewPatternsListController = PatternsListController.extend({
  template: 'main',
  sort: {submitted: -1, _id: -1},
  nextPath: function() {
   return Router.routes.newPatterns.path({postsLimit: this.postsLimit() + this.increment})
  }
});

TopPatternsListController = PatternsListController.extend({
  template: 'mainTop',
  sort: {votes: -1, subpatternsCount: -1, commentsCount: -1, submitted: -1, _id: -1},
  nextPath: function() {
    return Router.routes.topPatterns.path({postsLimit: this.postsLimit() + this.increment})
  }
});

SubPatternsListController = PatternsListController.extend({
  template: 'mainSBP',
  sort: {subpatternsCount: -1, votes: -1, commentsCount: -1, submitted: -1, _id: -1},
  nextPath: function() {
   return Router.routes.newPatterns.path({postsLimit: this.postsLimit() + this.increment})
  }
});

CommentsPatternsListController = PatternsListController.extend({
  template: 'mainCMNT',
  sort: {commentsCount: -1, subpatternsCount: -1, votes: -1, submitted: -1, _id: -1},
  nextPath: function() {
    return Router.routes.cmntsPatterns.path({postsLimit: this.postsLimit() + this.increment})
  }
});

Router.route('main', {
  path: '/',
  controller: NewPatternsListController
},
function() {
  document.location.reload(true);
}
);

Router.route('newPatterns', {
  path: '/new/:postsLimit?',
  controller: NewPatternsListController
},
function() {
  document.location.reload(true);
}
);

Router.route('topPatterns', {
  path: '/top/:postsLimit?',
  controller: TopPatternsListController
},
function() {
  document.location.reload(true);
}
);

Router.route('subPatterns', {
  path: '/sbp/:postsLimit?',
  controller: SubPatternsListController
},
function() {
  document.location.reload(true);
}
);

Router.route('cmntsPatterns', {
  path: '/cmnts/:postsLimit?',
  controller: CommentsPatternsListController
},
function() {
  document.location.reload(true);
}
);

Router.route('/ptrn/:_id', {
  name: 'patternPage',
  waitOn: function() {
    return [
      Meteor.subscribe('singlePattern', this.params._id),
      Meteor.subscribe('patterns'),
      Meteor.subscribe('comments', this.params._id),
      Meteor.subscribe('subpatterns', this.params._id)
    ];
  },
  data: function() { return Patterns.findOne(this.params._id); }
});


Router.route('/ptrn/:_id/edit', {
  name: 'patternEdit',
  waitOn: function() {
    return Meteor.subscribe('singlePattern', this.params._id);
  },
  data: function() { return Patterns.findOne(this.params._id); }
});

//search

Router.route('/srch/', {
  name: 'searchPage'
});

//Profiles


ProfileController=RouteController.extend({
    template:"userProfile",
    waitOn:function(){
      Meteor.subscribe("userProfile",this.params.username),
      Meteor.subscribe('patterns', {sort: {submitted:-1}}),
      Meteor.subscribe("userConnections");
    },
    data:function(){
        var username=Router.current().params.username;
        return {
        user:  Meteor.users.findOne({
            username:username
        }),
        patterns: Patterns.find({ creator: username }, {sort: {submitted:-1}})
      };

    }
});

Router.route("/prfl/:username",{
    name:"userProfile",
    controller:"ProfileController"
});

//Info pages

Router.route('/terms', { name: 'termsAndConditions' });

//Need to clear errors.
Router.onBeforeAction(function() { clearErrors(); this.next(); } );
