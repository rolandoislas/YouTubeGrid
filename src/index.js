var Http = require("./web/Http");
var YouTube = require("./web/api/YouTube");

var port = process.env.PORT;
var  webServer = new Http(port);
// Home
webServer.addGet("/", function(req, res) {
	res.render("pages/index", {
		title: "",
		description: "Rolando Islas' site of gaming videos and streams."
	});
});
// Live status
webServer.addGet("/ajax/liveStatus", function(req, res) {
	new YouTube().isLive(function(err, live, id) {
		if (err)
			return res.status(500).render("pages/error");
		res.json({live: live, id: id});
	});
});
// List
webServer.addGet("/ajax/list/:token?", function(req, res) {
	if (typeof(req.params.token) === "undefined")
		req.params.token = "";
	new YouTube().getVideos(req.params.token, function(err, list) {
		if (err)
			return res.status(500).render("pages/error");
		res.json(list);
	});
});
// Search
webServer.addGet("/ajax/search/:query/:token?", function(req, res) {
	var token = typeof(req.params.token) === "undefined" ? "" : req.params.token;
	new YouTube().search(req.params.query, token, function(err, list) {
		if (err)
			return res.status(500).render("pages/error");
		res.json(list);
	});
});
// Watch page
webServer.addGet("/watch/:id", function(req, res, next) {
	new YouTube().getVideo(req.params.id, function(err, json) {
		if (err)
			return res.render("pages/error");
		if (json.items.length < 1)
			return next();
		res.render("pages/watch", {
			title: json.items[0].snippet.title,
			description: json.items[0].snippet.description,
			id: json.items[0].id
		});
	});
});
// Podcast redirect
webServer.addGet("/podcast*", function(req, res, next) {
	res.redirect(301, req.originalUrl.replace("/podcast", "https://podcast.rolandoislas.com"));
});
webServer.run();

process.on("uncaughtException", function(err) {
    console.log("#########");
    console.log(err.stack);
});
