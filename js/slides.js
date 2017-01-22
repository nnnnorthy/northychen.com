$(function(){
	var PIC_WIDTH = 900;

	// Find the elements
	var win = $(".window");
	var slides = win.find(".slides");
	var images = slides.find("img");

	// calculate and set the width of the slides div
	var width = images.length * PIC_WIDTH;
	slides.css({width: width + "px"});

	var currentPic = 0;

	function updatePic() {
		win.scrollLeft(currentPic * PIC_WIDTH);
	}

	// Bind the click events of the prev and next button
	$(".prev").click(function(){
		currentPic = currentPic - 1;
		if(currentPic < 0) currentPic = images.length - 1;
		updatePic();
	});

	$(".next").click(function(){
		currentPic = currentPic + 1;
		if(currentPic >= images.length) currentPic = 0;
		updatePic();
	});
	
});