var YouTube = function(region) {
	this.https = require("https");
	this.API_URL = "https://www.googleapis.com/youtube/v3/";
	this.API_KEY = "&key=" + process.env.API_KEY;
};

function get(that, url, callback) {
	that.https.get(url, function(res) {
		var data = "";
		res.on("data", function(chunk) {
			data += chunk;
		});
		res.on("end", function() {
			if (res.statusCode != 200)
				return callback(new Error("Failed to get API url."));
			return callback(null, data);
		});
	});
}

function getJson(that, url, callback) {
	get(that, url, function(err, data) {
		if(err)
			return callback(err);
		return callback(null, JSON.parse(data));
	});
}

YouTube.prototype.getVideos = function(token, callback) {
	if (typeof(token) === "undefined")
		token = "";
	token = encodeURIComponent(token);
	var url = this.API_URL + "search?part=snippet&channelId=UCDcW8nr3bmZiu3z6UtHqQAQ"
		+ "&maxResults=24&order=date&pageToken=$token&safeSearch=none&type=video"
		.replace("$token", token) + this.API_KEY;
	getJson(this, url, function(err, data) {
		if(err)
			return callback(err);
		return callback(null, data);
	});
};

YouTube.prototype.getVideo = function(id, callback) {
	id = encodeURIComponent(id);
	var url = this.API_URL + "videos?part=snippet&id=$id&maxResults=1"
		.replace("$id", id) + this.API_KEY;
	getJson(this, url, function(err, data) {
		if(err)
			return callback(err);
		return callback(null, data);
	});
};

YouTube.prototype.search = function(query, token, callback) {
	query = encodeURIComponent(query);
	token = encodeURIComponent(token);
	var url = this.API_URL + "search?part=snippet&channelId=UCDcW8nr3bmZiu3z6UtHqQAQ"
		+ "&maxResults=24&order=date&pageToken=$token&q=$query&safeSearch=none&type=video"
		.replace("$query", query).replace("$token", token) + this.API_KEY;
	getJson(this, url, function(err, data) {
		if(err)
			return callback(err);
		return callback(null, data);
	});
};

YouTube.prototype.isLive = function(callback) {
	var url = this.API_URL + "search?part=snippet&channelId=UCDcW8nr3bmZiu3z6UtHqQAQ"
		+ "&eventType=live&maxResults=1&safeSearch=none&type=video" + this.API_KEY;
	getJson(this, url, function(err, data) {
		if (err)
			return callback(err);
		var live = data.items.length > 0;
		return callback(null, live, live ? data.items[0].id.videoId : null);
	});
};

module.exports = YouTube;