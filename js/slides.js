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

// Floating qr code
$(function() {
  var qr = $('<div id="wechatQR"><img src="wechatQR.gif" width="160" height="160"></img><span>x</span></div>');
  var close = qr.find('span');
  var x = 100, y = 100;
  var dx = 1.0, dy = 3 / 5;
  var handler;
  $('body').append(qr);


  $("#wechatlink").click(function() {
    update();
    qr.show();
    if(handler) clearInterval(handler);
    handler = setInterval(update, 10);
  });

  qr.click(function(){
    clearInterval(handler);
    qr.hide();
  });

  function update() {
    w = $(window).width() - 200;
    h = $(window).height() - 230;
    if(x + dx > w || x + dx < 0) dx = -dx;
    if(y + dy > h || y + dy < 0) dy = -dy;
    x += dx;
    y += dy;
    qr.css({
      left: x + 'px',
      top: y + 'px'
    });
  }

});

// Snake game
$(function() {
  var box = $('<div class="wall"></div>');
  var snakeBox = $('<div id="snakeBox"></div>');
  var instructions = $('<div class="snakeInstructions"><span></span></div>');
  var closeInstruction = $('<div class="closeInstructions">x</div>');
  var link = $('#gmaillink');

  instructions.append(closeInstruction);
  box.append(instructions);
  snakeBox.append(box);
  $('body').append(snakeBox);
  $('body').keydown(keydown);;

  // Internal states
  const STATES = {
    STOPPPED  : 0,
    LOADED    : 1,
    RUNNING   : 2,
    PAUSED    : 3,
    LOST      : 4,
    WON       : 5
  };

  var snake = [];
  var state = STATES.STOPPED;
  var handler = null;

  function update() {

  }

  function keydown(key) {
    console.log(key);
    console.log(key.which);
    if(state == STATES.RUNNING) {

    }
  }

  function load() {
    setInstructions("I'TS A KEYBOARD GAME.<br/>PRESS enter TO START CONNECTING.");
    snakeBox.show();
    instructions.show();
    snake = [];
    state = STATES.LOADED;
  }

  function close() {
    snakeBox.hide();
    state = STATES.STOPPED;
  }

  function start() {
    instructions.hide();
    state = STATES.RUNNING;
  }

  function setInstructions(text) {
    instructions.find('span').html(text);
  }

  // Link and window behaviors
  $(document).on('click', function (e) {
    if ($(e.target).closest(link).length === 0 && $(e.target).closest(box).length === 0) {
      close();
    }
  });

  link.click(function() {
    load();
  });

  closeInstruction.click(function(){
    start();
  });
});
