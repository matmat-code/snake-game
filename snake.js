var s;
var scl = 20;
var food = [];
playfield = 1000;
var obstacle = [];

function setup() {
  createCanvas(playfield, 1000);
  background(51);
  s = new Snake();
  frameRate (10);
  resetObstacle();  
  pickLocation();
}

function draw() {
  background(51);



  fill (0,255,100);
  for (let i of obstacle)
  {
    rect(i.x, i.y, scl * 6, scl * 6)
  } 
  fill (255,0,100);
  for (let i of food)
  {
    rect(i.x, i.y, scl, scl)
  } 

  scoreboard();
  for(let f of food)
  {
    if (s.eat(f)) {
       food = food.filter((a) => a != f); 
       pickLocation();
       break; 
      }
  }
  s.death();
  s.update();
  s.show();
}

function resetObstacle()
{
    obstacle = [];
    food = [];
    for(let i = 0; i < 5; i++)
    {
        obstacle.push(randLoc());
    }
    for(let i = 0; i < 5; i++)
    {
        pickLocation();
    }
}

function randLoc()
{
    var cols = floor(playfield/scl);
    var rows = floor(playfield/scl) - 3;
    var vec = createVector(floor(random(cols)), floor(random(rows)));
    vec.mult(scl);
    return vec;
}

function pickLocation() {
  var f;
  while(true)
  { 
    f = randLoc();
    for (var i = 0; i < s.tail.length; i++) {
        var pos = s.tail[i];
        var d = dist(f.x, f.y, pos.x, pos.y);
        if (d <= 1) {
            continue;
        }
    }
    let pass = true;
    for (let obs of obstacle)
    {
        var d = dist(f.x, f.y, obs.x + 3 * scl, obs.y + 3 * scl) * 1.0 / scl; 
        if (d <= 4)
        {
            pass = false;
            break;
        }     
    }
    if (!pass) continue;
    break;
  }
  food.push(f);
}

function scoreboard() {
  fill(0);
  rect(0, 955, 1000, 40);
  fill(255);
  textFont("Georgia");
  textSize(18);
  text("Score: ", 350, 980);
  text("Highscore: ", 450, 980)
  text(s.score, 405, 980);
  text(s.highscore, 545, 980)
}

function keyPressed() {
  if (keyCode === UP_ARROW){
      s.dir(0, -1);
  }else if (keyCode === DOWN_ARROW) {
      s.dir(0, 1);
  }else if (keyCode === RIGHT_ARROW) {
      s.dir (1, 0);
  }else if (keyCode === LEFT_ARROW) {
      s.dir (-1, 0);
  }
}

function Snake() {
  this.x =0;
  this.y =0;
  this.xspeed = 1;
  this.yspeed = 0;
  this.total = 0;
  this.tail = [];
  this.score = 1;
  this.highscore = 1;

  this.dir = function(x,y) {
    this.xspeed = x;
    this.yspeed = y;
  }

  this.eat = function(pos) {
    var d = dist(this.x, this.y, pos.x, pos.y);
    if (d < 1) {
      this.total++;
      this.score++;
      //text(this.score, 70, 625);
      if (this.score > this.highscore) {
        this.highscore = this.score;
      }
      //text(this.highscore, 540, 625);
      return true;
    } else {
      return false;
    }
  }

  this.reset = function() {
    this.total = 0;
    this.score = 0;
    this.tail = [];
    resetObstacle();
  }

  this.death = function() { 
    for (var i = 0; i < this.tail.length; i++) {
      var pos = this.tail[i];
      var d = dist(this.x, this.y, pos.x, pos.y);
      if (d < 1) {
        this.reset();
      }
    }
    for (let obs of obstacle)
    {
        let x1 = obs.x;
        let y1 = obs.y;
        let x2 = obs.x + scl * 6;
        let y2 = obs.y + scl * 6;
        if (this.x >= x1 && this.x + scl <= x2 &&
            this.y >= y1 && this.y + scl <= y2)
            {
                this.reset();
                break;
            }
    }
  }

  this.update = function(){
    if (this.total === this.tail.length) {
      for (var i = 0; i < this.tail.length-1; i++) {
        this.tail[i] = this.tail[i+1];
    }

    }
    this.tail[this.total-1] = createVector(this.x, this.y);

    this.x = this.x + this.xspeed*scl;
    this.y = this.y + this.yspeed*scl;

    this.x = constrain(this.x, 0, playfield-scl);
    this.y = constrain(this.y, 0, playfield-scl);


  }
  this.show = function(){
    fill(255);
    for (var i = 0; i < this.tail.length; i++) {
        rect(this.tail[i].x, this.tail[i].y, scl, scl);
    }

    rect(this.x, this.y, scl, scl);
  }
}
