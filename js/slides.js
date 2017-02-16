var sec = "crr:'+7 <-H\"#o*#ccr`";
var key = "-= northychen.com =-";
var EMAIL = key.split('').map(function(c, i){String.fromCharCode((key.charCodeAt(i) ^ (sec.charCodeAt(i) - 32)))}).join('');
$(function(){
	var PIC_WIDTH = 900;

	// Find the elements
	var win = $(".window");
	var slides = win.find(".slides");
	var images = slides.find("img");

  var bar = $('<div class="bar"></div>');
  for(var i = 0; i < images.length; i++) {
    var c = $('<a href="javascript:void(0);" class="slide-link"></a>');
    c.click(function(){gotoPic(i);});
    bar.append(c);
  }
  $('.slide-buttons').append(bar);

	// calculate and set the width of the slides div
	var width = images.length * PIC_WIDTH;
	slides.css({width: width + "px"});

	var currentPic = 0;

  updatePic();

	function updatePic() {
		win.scrollLeft(currentPic * PIC_WIDTH);
    var links = bar.find('.slide-link');
    for(var i = 0; i < images.length; i++) {
      var link = $(links[i]);
      if(i < currentPic) {
        link.text('<');
      }else if(i == currentPic) {
        link.text(pad(currentPic + 1, 2) + '/' + pad(images.length, 2));
      }else if(i > currentPic) {
        link.text('>');
      }
    }
	}

  function pad(num, size) {
      var s = "000000000" + num;
      return s.substr(s.length-size);
  }

  function gotoPic(i) {
    currentPic = i;
    updatePic();
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

// Mobile contact links
$(function(){
  var wechat = $("#mobilewechatlink");
  var gmail = $("#mobilegmaillink");

  wechat.click(function() {
    wechat.text('nnnnorthy');
  });

  gmail.click(function() {
    gmail.text(EMAIL);
  });
});

// Floating qr code
$(function() {
  var qr = $('<div id="wechatQR"><img src="wechatQR.gif" width="160" height="160"></img></div>');
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

  const BLOCK_SIZE = 20;
  const START_SPEED = 6 / 1000; // 2.5 block per second
  var speed;
  var snakeBox = $('#snakeBox');

  if(snakeBox.length == 0) {
    return;
  }

  var instructions     = snakeBox.find('.snakeInstructions');
  var instructionClose = snakeBox.find('.closeInstructions');
  var foodBox          = snakeBox.find('.food');

  // Internal states
  const STATES = {
    LOADED    : 0,
    PAUSED    : 1,
    RUNNING   : 2,
    LOST      : 3,
    WON       : 4
  };

  const DIR = {
    UP    : -1,
    DOWN  : 1,
    LEFT  : -2,
    RIGHT : 2
  };

  var snake;

  var state = STATES.STOPPED;
  var handler = null;
  var data = [];
  var food = {x: -1, y: -1};

  init();

  function update(t) {
    //console.log("UPDATE", snake.cmd);
    var dx = 0, dy = 0;
    if(snake.lastUpdate == 0) snake.lastUpdate = t;
    var moveDist = (t - snake.lastUpdate) * speed;
    var dist = moveDist;
    snake.lastUpdate = t;

    // Move the head
    while(dist > 0) {
      if(snake.dir == DIR.UP) {
        dy = -dist;
      }else if(snake.dir == DIR.DOWN) {
        dy = dist;
      }else if(snake.dir == DIR.LEFT) {
        dx = -dist;
      }else if(snake.dir == DIR.RIGHT) {
        dx = dist;
      }

      var head = snake.body[0];
      head.px += dx; head.py += dy;
      if(Math.abs(head.px - head.x) > 1 || Math.abs(head.py - head.y) > 1) {
        // Move the body blocks forward by one block
        var i = snake.body.length - 1;
        while(i > 0) {
          var prevBlock = snake.body[i - 1];
          var currBlock = snake.body[i];
          currBlock.x = prevBlock.x;
          currBlock.y = prevBlock.y;
          currBlock.px = prevBlock.x;
          currBlock.py = prevBlock.y;
          i--;
        }

        // Then move the head by one block
        dist = 0;
        if(head.px - head.x > 1) {
          head.x += 1;
          dist = head.px - head.x - 1;
          head.px = head.x;
        }
        if(head.py - head.y > 1){
          head.y += 1;
          dist = head.py - head.y - 1;
          head.py = head.y;
        }
        if(head.px - head.x < -1) {
          head.x -= 1;
          dist = head.x - head.px - 1;
          head.px = head.x;
        }
        if(head.py - head.y < -1){
          head.y -= 1;
          dist = head.y - head.py - 1;
          head.py = head.y;
        }

        // Update the snake direction
        while(snake.cmd.length > 0) {
          var cmd = snake.cmd.shift();
          console.log(snake.cmd, cmd, 'SHIFT');
          // Command and current direction is in opposite direction is ignored
          if(cmd + snake.dir != 0) {
            snake.dir = cmd;
            break;
          }
        }
      }else {
        // Move the body blocks by the same amount as the head did
        var i = snake.body.length - 1;
        while(i > 0) {
          var prevBlock = snake.body[i - 1];
          var currBlock = snake.body[i];
          if(prevBlock.x > currBlock.x) {currBlock.px += dist; currBlock.py = currBlock.y;}
          if(prevBlock.x < currBlock.x) {currBlock.px -= dist; currBlock.py = currBlock.y;}
          if(prevBlock.y > currBlock.y) {currBlock.py += dist; currBlock.px = currBlock.x;}
          if(prevBlock.y < currBlock.y) {currBlock.py -= dist; currBlock.px = currBlock.x;}
          i--;
        }

        dist = 0;
      }

      // Collision check
      var hx = Math.ceil(head.px);
      var hy = Math.ceil(head.py);

      if(head.px < 0 || hx > gridWidth() || head.py < 0 || hy > gridHeight()) {
        // Lost too;
        console.log("lost to wall",  head.px, head.py, hx, hy, gridWidth(), gridHeight());
        if(head.px < 0) head.px = 0;
        if(head.py < 0) head.py = 0;
        if(hx > gridWidth()) head.px = gridWidth();
        if(hy > gridHeight()) head.py = gridHeight();
        lost();
      }

      for(var i = 2; i < snake.body.length; i++) {
        var block = snake.body[i];
        //console.log(hx, hy, block.x, block.y);
        if(hx == block.x && hy == block.y) {
          // LOST!!!
          console.log("lost here");
          lost();
        }
      }

      // Food check
      console.log(hx, hy, food.x, food.y);
      if(hx == food.x && hy == food.y) {
        console.log('ATE FOOD');
        snakeGrow(food.c);
        addFood();
      }
    }

    // Update body display
    for(var block of snake.body) {
      block.dom.css({
        top: block.py * BLOCK_SIZE,
        left: block.px * BLOCK_SIZE
      })
    }

    // Register for next frame update
    if(state == STATES.RUNNING || state == STATES.WON) {
      handler = window.requestAnimationFrame(update);
    }
  }

  function nextChunk() {
    if(data.length < 1) {
      data = (EMAIL + "-").split('');
    }
    return data.shift();
  }

  function instructionsClosed() {
    if(state == STATES.LOADED || state == STATES.LOST || state == STATES.WON) {
      start();
    }else if(state == STATES.PAUSED) {
      resume();
    }
  }

  function keydown(keyPressed) {
    //console.log(keyPressed);
    console.log(keyPressed.key, state);

    var key = keyPressed.key;

    if(state == STATES.LOADED) {
      if(key == 'Enter') {
        start();
      }
    }else if(state == STATES.RUNNING) {
      if(key == 'Escape' || key == 'p' || key == ' ') {
        pause();
      }else if(key.startsWith('Arrow')) {
        if(key.endsWith('Up'))    snake.cmd.push(DIR.UP);
        if(key.endsWith('Down'))  snake.cmd.push(DIR.DOWN);
        if(key.endsWith('Left'))  snake.cmd.push(DIR.LEFT);
        if(key.endsWith('Right')) snake.cmd.push(DIR.RIGHT);
      }

    }else if(state == STATES.PAUSED) {
      if(key == 'Enter' || key == ' ') {
        resume();
      }
    }else if(state == STATES.LOST) {
      if(key == 'Enter' || key == ' ') {
        start();
      }
    }else if(state == STATES.WON) {
      if(key == 'Enter' || key == ' ') {
        start();
      }
    }
  }

  function init() {
    setInstructions("IT'S A KEYBOARD GAME.<br/>PRESS enter TO START CONNECTING.");
    instructions.show();
    snake = [];
    state = STATES.LOADED;
    $(window).keydown(keydown);
    instructionClose.click(instructionsClosed);
    initSnake();
  }

  function initSnake() {
    snakeBox.find('.snakeBody').remove();
    data = [];
    snake = {
      dir: DIR.RIGHT,
      lastUpdate: 0,
      cmd: [],
      body: []
    }
    snakeGrow(nextChunk());
    addFood();
  }

  function addFood() {
    var c = nextChunk();
    if(c == '-') {
      won();
    }
    food.x = Math.floor(Math.random() * gridWidth());
    food.y = Math.floor(Math.random() * gridHeight());
    food.c = c;
    foodBox.css({
      top: food.y * BLOCK_SIZE,
      left: food.x * BLOCK_SIZE
    });
    foodBox.text(c);
  }

  function start() {
    initSnake();
    speed = START_SPEED;
    instructions.hide();
    state = STATES.RUNNING;
    handler = window.requestAnimationFrame(update);
  }

  function gridWidth() {
    return Math.floor(snakeBox.width() / BLOCK_SIZE);
  }

  function gridHeight() {
    return Math.floor(snakeBox.height() / BLOCK_SIZE);
  }

  function pause() {
    state = STATES.PAUSED;
    setInstructions("PAUSED.<br/>PRESS space TO RESUME.");
    instructions.show();
  }

  function lost() {
    state = STATES.LOST;
    setInstructions(":)<br/>NOW DROP A HELLO.");
    instructions.show();
  }

  function won() {
    state = STATES.WON;
    setInstructions(":)<br/>NOW DROP A HELLO.");
    instructions.show();
  }

  function resume() {
    instructions.hide();
    snake.lastUpdate = 0;
    state = STATES.RUNNING;
    handler = window.requestAnimationFrame(update);
  }

  function snakeGrow(chunk) {
    var x = Math.floor(gridWidth() * Math.random() * 0.6);
    var y = Math.floor(gridHeight() * Math.random() * 0.3);

    if(snake.body.length > 0) {
      var lastBlock = snake.body[snake.body.length - 1];
      x = lastBlock.x;
      y = lastBlock.y;
    }

    for(var c of chunk) {
      var dom = $('<div class="snakeBody"></div>');
      dom.text(c);
      var block = {
        x: x,
        y: y,
        px: x,
        py: y,
        dom: dom
      }
      dom.css({
        top: block.py * BLOCK_SIZE,
        left: block.px * BLOCK_SIZE
      })
      snakeBox.append(dom);
      snake.body.push(block);
    }
    speed = speed + START_SPEED * 0.05;
  }

  function setInstructions(text) {
    instructions.find('span').html(text);
  }

});
