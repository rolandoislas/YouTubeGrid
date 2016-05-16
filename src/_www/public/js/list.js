var loadVideo;

!function() {
var token = "";
var query = "";

function getVideoData() {
	var url = "/ajax/list/" + token;
	if (query !== "")
		url = "/ajax/search/" + query + "/" + token;
	$.ajax({
		type: "GET",
		dataType:"json",
		url: url,
		success: function(data) {
			token = data.nextPageToken;
			appendVideos(data);
			setMainVideoThumb(data);
			$("#list-load-more").html("Load More");
		}  
	});
}

function setMainVideoThumb(data) {
	var thumb = $("#video-thumb-overlay");
	var fc = $("#feature-container");
	if (typeof(thumb) === "undefined" || typeof(thumb.data("id")) !== "undefined")
		return;
	thumb
		.attr("title", data.items[0].snippet.title)
		.data("id", data.items[0].id.videoId);
	var loadMax = function() {
		if (this.width >= 1280)
			thumb.css("background-image", "url(" + data.items[0].snippet.thumbnails.high.url.replace("hq", "maxres") + ")");
		else
			loadHigh();
	};
	var loadHigh = function() {
		thumb.css("background-image", "url(" + data.items[0].snippet.thumbnails.high.url + ")")
			.css("background-position-y", "-100px");
	};
	$("<img>")
		.on("load", loadMax)
		.on("error", loadHigh)
		.attr("src", data.items[0].snippet.thumbnails.high.url.replace("hq", "maxres"));
}

function appendVideos(data) {
	data.items.forEach(function(item) {
		var video = $("<a>", {
			"class": "video-chunk"
		})
		.css("background", "url(" + item.snippet.thumbnails.medium.url + ")")
		.attr("href", "/watch/" + item.id.videoId)
		.attr("title", item.snippet.title)
		.data("id", item.id.videoId);
		$("#list-chunk-container").append(video);
	});
}

loadVideo = function(id) {
	var fc = $("#feature-container");
	var iframe = $("<iframe>")
		.attr("width", fc.width())
		.attr("height", fc.height())
		.attr("src", "//www.youtube.com/embed/" + id + "?rel=0&autoplay=1")
		.attr("allowfullscreen", "true");
	fc.html(iframe);
}

function changeUrl(title, id) {
	history.pushState({}, title + " - Rolando Islas", "/watch/" + id);
	document.title = title + " - Rolando Islas";
}

function loadMore() {
	var button = $(this);
	if (button.html() !== "Load More")
		return;
	button.html("Loading");
	getVideoData();
}

function search(e) {
	if (e.type === "keydown" && e.keyCode != 13)
		return;
	$("#list-chunk-container").html("");
	query = $("#search-field").val();
	token = "";
	getVideoData();
}

function addEvents() {
	$(document).on("click", "#video-thumb-overlay", function() {
		loadVideo($(this).data("id"));
	});
	$(document).on("click", ".video-chunk", function(e) {
		e.preventDefault();
		loadVideo($(this).data("id"));
		changeUrl($(this).attr("title"), $(this).data("id"));
	});
	$(document).on("mouseenter click", "#list-load-more", loadMore);
	$(document).on("click", "#search-submit", search);
	$(document).on("keydown", "#search-field", search);
}

$(document).ready(function() {
	addEvents();
	getVideoData();
});

}();