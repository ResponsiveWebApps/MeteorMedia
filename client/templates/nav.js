Template.nav.events({
	'click .addInterest':function(){
		//$(".create-pattern-box").css('visibility', 'visible');
		$(".create-pattern-box").removeClass("hidden");
		document.getElementById("Sidebarnav").style.width = "0";
	},
	'click .srch-button, click .sidebarnav-menu-viewProfile, click .sidebarnav-menu-home, click .closebtn, click .closeMenubtn, click .navbar-brand':function(){
		document.getElementById("Sidebarnav").style.width = "0";
		$(".create-pattern-box").addClass("hidden");
	},
	'click .srch-button-nav-xs' :function(){
		document.getElementById("Sidebarnav").style.width = "0";
		$(".create-pattern-box").addClass("hidden");
		Router.go('http://www.subpattern.com/srch');
	},
	'click .openMenuBtn' :function(){
		document.getElementById("Sidebarnav").style.width = "420px";
	},
	'keyup #navbar-srchbox' :function(){
		Router.go('http://www.subpattern.com/srch');
	},
	'click  .srch-button' : function(){
		$("#navbar-srchbox").toggleClass("hidden");
	},
	'mouseenter  .srch-button' : function(){
		$("#navbar-srchbox").removeClass("hidden");
	}

	//,
	//'click .nav-sbp-btn':function(){
//		Router.go('http://www.subpattern.com/sbp');
//	}
})
