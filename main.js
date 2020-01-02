const score = document.querySelector('.score'),
  start = document.querySelector('.start'),
  gameArea = document.querySelector('.gameArea'),
  car = document.createElement('div'),
  road = document.querySelector('.road');

car.classList.add('car');


start.addEventListener('click', startGame);
document.addEventListener('keydown', startRun);
document.addEventListener('keyup', stopRun);

const keys = {
  ArrowUp: false,
  ArrowDown: false,
  ArrowRight: false,
  ArrowLeft: false
};

const setting = {
  start: false,
  score: 0,
  speed: 5,
  steer: 3,
  accel: 3,
  brake: 4,
  traffic: 3,
  tempscore: 1000
};

function getQuantityElements(heightElement) {
  return document.documentElement.clientHeight / heightElement + 1;
}

function startGame() {

  start.classList.add('hide');
  gameArea.innerHTML = '';
  road.innerHTML = '';
  car.style.left = '125px';
  car.style.top = 'auto';
  for (let i = 0; i < getQuantityElements(100); i++) {
    const line = document.createElement('div');
    line.classList.add('line');
    line.y = i * 100;
    gameArea.appendChild(line);
  }
  for (let i = 0; i < getQuantityElements(100); i++) {
    const border = document.createElement('div');
    border.classList.add('border');
    border.y = i * 100;
    road.appendChild(border);
  }

  for (let i = 0; i < getQuantityElements(100 * setting.traffic); i++ ) {
    const enemy = document.createElement('div');
    enemy.classList.add('enemy');
    enemy.y = -100 * setting.traffic * (i + 1);
    enemy.style.left = Math.floor(Math.random() * (gameArea.offsetWidth - 50)) + 'px';
    enemy.style.top = enemy.y + 'px';
    styleEnemy(enemy);
    gameArea.appendChild(enemy);
  }

  setting.score = 0;
  setting.speed = 5;
  setting.tempscore = 1000;
  setting.start = true;
  gameArea.appendChild(car);
  setting.x = car.offsetLeft;
  setting.y = car.offsetTop;
  requestAnimationFrame(playGame);
}

function playGame() {
  if (setting.start) {
    setting.score++;
    score.innerHTML = "SCORE<br>" + Math.round(setting.score / 100);

   if (setting.score > setting.tempscore) {
      setting.speed++;
      setting.tempscore += 1000;
    }
    
    moveRoad();
    moveEnemy();
    if (keys.ArrowLeft && setting.x > 0) {
      setting.x -= setting.steer;
      car.classList.add('leftTurn');
    }
    if (keys.ArrowRight && setting.x < (gameArea.offsetWidth - car.offsetWidth)) {
      setting.x += setting.steer;
      car.classList.add('rightTurn');
    }

    if (keys.ArrowUp && setting.y > 0) {
      setting.y -= setting.accel;
    }

    if (keys.ArrowDown && setting.y < (gameArea.offsetHeight - car.offsetHeight)) {
      setting.y += setting.brake;
    }

    car.style.left = setting.x + 'px';
    car.style.top = setting.y + 'px';

    requestAnimationFrame(playGame);
  }
}

function startRun(event) {
  if (event.key == 'ArrowLeft' ||
  event.key == 'ArrowRight' ||
  event.key == 'ArrowUp' ||
     event.key == 'ArrowDown') {
    event.preventDefault();
    keys[event.key] = true;
  }
}

function stopRun() {
  event.preventDefault();
  keys[event.key] = false;
  car.classList.remove('rightTurn');
  car.classList.remove('leftTurn');
}

function moveRoad() {
  let lines = document.querySelectorAll('.line');
  lines.forEach(function(item) {
    item.y += setting.speed;
    item.style.top = item.y + 'px';
    if (item.y >= document.documentElement.clientHeight) {
      item.y = -100;
    }
  });
  let borders = document.querySelectorAll('.border');
  borders.forEach(function(bord) {
    bord.y += setting.speed;
    bord.style.top = bord.y + 'px';
    if (bord.y >= document.documentElement.clientHeight) {
      bord.y = -100;
    }
  });
}

function styleEnemy(currentEnemy) {

  let enemyStyle = Math.floor(Math.random() * 10);

  switch (enemyStyle) {
    default: 
      currentEnemy.style.background = 'transparent url("./image/enemy.png") center / cover no-repeat';
      break;
    case 6:
    case 7:
      currentEnemy.style.background = 'transparent url("./image/enemy2.png") center / cover no-repeat';
      break;
    case 8:
    case 9:
      currentEnemy.style.background = 'transparent url("./image/enemy3.png") center / cover no-repeat';
      break;
  }
}

function moveEnemy() {
  let enemy = document.querySelectorAll('.enemy');
  enemy.forEach(function(item) {
    let carRect = car.getBoundingClientRect();
    let enemyRect = item.getBoundingClientRect();

    if ((carRect.top + 10) <= (enemyRect.bottom - 5) &&
    (carRect.right - 10) >= enemyRect.left &&
    (carRect.left + 10) <= enemyRect.right &&
    (carRect.bottom - 10) >= (enemyRect.top + 5)) {
      setting.start = false;
      start.classList.remove('hide');
      start.style.top = score.offsetHeight;
    }

    item.y += setting.speed / 2;
    item.style.top = item.y + 'px';
    if (item.y >= document.documentElement.clientHeight) {
      item.y = (-100 * setting.traffic) - 100;
      item.style.left = Math.floor(Math.random() * (gameArea.offsetWidth - 50)) + 'px';
      styleEnemy(item);
    }

  }) ;

}