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
  const SPEED = 5 / 1000; // 2.5 block per second
  var snakeBox = $('#snakeBox');

  if(snakeBox.length == 0) {
    return;
  }

  var instructions = snakeBox.find('.snakeInstructions');

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

  init();

  function update(t) {
    //console.log("UPDATE", snake.cmd);
    var dx = 0, dy = 0;
    if(snake.lastUpdate == 0) snake.lastUpdate = t;
    var moveDist = (t - snake.lastUpdate) * SPEED;
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
        let i = snake.body.length - 1;
        while(i > 0) {
          var prevBlock = snake.body[i - 1];
          var currBlock = snake.body[i];
          currBlock.x = prevBlock.x;
          currBlock.y = prevBlock.y;
          currBlock.px = prevBlock.x;
          currBlock.px = prevBlock.x;
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
        let i = snake.body.length - 1;
        while(i > 0) {
          let prevBlock = snake.body[i - 1];
          let currBlock = snake.body[i];
          if(prevBlock.x > currBlock.x) currBlock.px += dist;
          if(prevBlock.x < currBlock.x) currBlock.px -= dist;
          if(prevBlock.y > currBlock.y) currBlock.py += dist;
          if(prevBlock.y < currBlock.y) currBlock.py -= dist;
          i--;
        }

        dist = 0;
      }

      // Collision check
      let hx = Math.ceil(head.px);
      let hy = Math.ceil(head.py);

      if(hx < 0 || hx > gridWidth() || hy < 0 || hy > gridHeight()) {
        // Lost too;
        console.log("lost to wall", hx, hy, gridWidth(), gridHeight());
      }
      for(let i = 1; i < snake.body.length; i++) {
        let block = snake.body[i];
        //console.log(hx, hy, block.x, block.y);
        if(hx == block.x && hy == block.y) {
          // LOST!!!
          console.log("lost here");
        }
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
    if(state == STATES.RUNNING) {
      handler = window.requestAnimationFrame(update);
    }
  }

  function nextChunk() {
    return "northychen@gmail.com";
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
      if(key == 'Escape') {
        pause();
      }else if(key.startsWith('Arrow')) {
        if(key.endsWith('Up'))    snake.cmd.push(DIR.UP);
        if(key.endsWith('Down'))  snake.cmd.push(DIR.DOWN);
        if(key.endsWith('Left'))  snake.cmd.push(DIR.LEFT);
        if(key.endsWith('Right')) snake.cmd.push(DIR.RIGHT);
      }

    }else if(state == STATES.PAUSED) {
      if(key == 'Enter') {
        resume();
      }

    }else if(state == STATES.LOST) {

    }else if(state == STATES.WON) {

    }
  }

  function init() {
    setInstructions("IT'S A KEYBOARD GAME.<br/>PRESS enter TO START CONNECTING.");
    instructions.show();
    snake = [];
    state = STATES.LOADED;
    $(window).keydown(keydown);
  }

  function start() {
    instructions.hide();
    state = STATES.RUNNING;
    handler = window.requestAnimationFrame(update);
    snake = {
      dir: DIR.RIGHT,
      lastUpdate: 0,
      cmd: [],
      body: []
    }
    snakeGrow();
  }

  function gridWidth() {
    return Math.floor(snakeBox.width() / BLOCK_SIZE);
  }

  function gridHeight() {
    return Math.floor(snakeBox.height() / BLOCK_SIZE);
  }

  function pause() {
    state = STATES.PAUSED;
    setInstructions("PAUSED -- PRESS enter TO RESUME.");
    instructions.show();
  }

  function resume() {
    instructions.hide();
    snake.lastUpdate = 0;
    state = STATES.RUNNING;
    handler = window.requestAnimationFrame(update);
  }

  function snakeGrow() {
    var x = Math.floor(gridWidth() / 2);
    var y = Math.floor(gridHeight() / 2);

    if(snake.body.length > 0) {
      var lastBlock = snake.body[snake.body.length - 1];
      x = lastBLock.x;
      y = lastBlock.y;
    }

    var chunk = nextChunk();
    for(let c of chunk) {
      var dom = $('<div class="snakeBody"></div>');
      dom.text(c);
      var block = {
        x: x,
        y: y,
        px: x,
        py: y,
        dom: dom
      }
      snakeBox.append(dom);
      snake.body.push(block);
    }
  }

  function setInstructions(text) {
    instructions.find('span').html(text);
  }

});
