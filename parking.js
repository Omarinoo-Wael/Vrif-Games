const canvas = document.getElementById('myCanvas');

const ctx = canvas.getContext('2d');

let level=parseInt(new URLSearchParams(window.location.search).get('level')) || 1;

let engine ='frame-based';

const carWidth = 60;

const carHeight = 120;

const carImg = new Image();
carImg.src = "parking-drawings/car.svg";

const coneImg = new Image();
coneImg.src = "parking-drawings/cone.svg";

const barrierImg = new Image();
barrierImg.src = "parking-drawings/barrier.svg";

const parkingSpotImg = new Image();
parkingSpotImg.src = "parking-drawings/parkingspot.svg";

const parkingSpotRevImg = new Image();
parkingSpotRevImg.src = "parking-drawings/parkingspot-rev.svg";

const crash = new Image();
crash.src = "parking-drawings/crash.svg";

const roadImg = new Image();
roadImg.src = "parking-drawings/road.svg";

const barrierVer = new Image();
barrierVer.src = "parking-drawings/barrier-vertical.svg";

const trafficCar = new Image();
trafficCar.src = "parking-drawings/traffic-car.svg";

const star = new Image();
star.src = "parking-drawings/star.svg";

const starno = new Image();
starno.src = "parking-drawings/stargrey.svg";

let start = false;

let carX = (canvas.width - carWidth) / 2;

let carY = canvas.height - carHeight - 10;

const parkingSpotWidth = 100;

const parkingSpotHeight = 150;

const parkingSpotX = (canvas.width - parkingSpotWidth) / 2;

const parkingSpotY = 10;

let notparked = true;

let angle = 0; // in radians

let borderCollision = false;

let lose = false;

let win = false;

let moving = false;
let rotating = false;
let acceleration = 0.1;
let maxAcceleration = 1.5;

let turnSpeedacc = 0;
let maxTurnAcceleration = 0.01;

let x =-carHeight;
let x2 =- carHeight-300;

let startTime = Date.now();
let timeElapsed = 0;
let finalTime = 0;
let timerRunning = true;

let time = Date.now();
let highScoreLvl1 = 10000000000000;
let highScoreLvl2 = 10000000000000;
let highScoreLvl3 = 10000000000000;

let highScoreLvl1F = 10000000000000;
let highScoreLvl2F = 10000000000000;
let highScoreLvl3F = 10000000000000;

let highscore=0;


const keys = {

    ArrowUp: false,

    ArrowDown: false,

    ArrowLeft: false,

    ArrowRight: false

};



function startGame() {
    engine = window.sessionStorage.getItem("value");

    document.addEventListener('keydown', (e) => {

        if (e.key in keys) keys[e.key] = true;
        if (e.key.toLowerCase() === 'r') 
        {
            window.location.reload();
        }
        if (e.key.toLowerCase() === 'f') 
        {
            window.location.replace("parking-levels.html");
        }

    });




    document.addEventListener('keyup', (e) => {

        if (e.key in keys) keys[e.key] = false;

    });


    gameLoop();

}



function gameLoop() {
    

    

    if (timerRunning) {
        timeElapsed = ((Date.now() - startTime) / 1000).toFixed(2);
    }

    if(engine==="frame-based")
    {
        let step = 2;
        let turnSpeed = 0.03;

        if (!lose && !win) {

            if (keys.ArrowUp) {
                carX += Math.sin(angle) * (step + acceleration);

                carY -= Math.cos(angle) * (step + acceleration);
                carImg.src = "parking-drawings/car.svg";

            }

            if (keys.ArrowDown) {

                carX -= Math.sin(angle) * (step + acceleration);

                carY += Math.cos(angle) * (step + acceleration);
                carImg.src = "parking-drawings/car.svg";

            }

            if (keys.ArrowLeft && (keys.ArrowUp || keys.ArrowDown)) {

                angle -= turnSpeed + turnSpeedacc;
                carImg.src = "parking-drawings/car-left.svg";

            }

            if (keys.ArrowRight && (keys.ArrowUp || keys.ArrowDown)) {

                angle += turnSpeed +turnSpeedacc;
                carImg.src = "parking-drawings/car-right.svg";


            }
            moving = keys.ArrowUp || keys.ArrowDown;
            rotating = keys.ArrowLeft || keys.ArrowRight;

            if (rotating && moving) 
            {
                turnSpeedacc = Math.min(turnSpeedacc + 0.0008, maxTurnAcceleration);
            } 
            else
            {
                turnSpeedacc = 0;
            }

            if (!moving) {
                acceleration = 0.1;
            }
            else {
                acceleration = Math.min(acceleration + 0.1,maxAcceleration);
            }
        }
    }
    else if(engine==="time-based")
    {
        let now = Date.now();
        let timepassed=(now-time)/1000
        time=now;

        if(timepassed>0.1)
        {
            timepassed=0.1;
        }

        let step = 150 * timepassed;
        let turnSpeed = 3 * timepassed;

        maxAcceleration = 4;
        maxTurnAcceleration = 0.1;

        if (!lose && !win) {

            if (keys.ArrowUp) {
                carX += Math.sin(angle) * (step + acceleration * 100 * timepassed);

                carY -= Math.cos(angle) * (step + acceleration * 100 * timepassed);
                carImg.src = "parking-drawings/car.svg";

            }

            if (keys.ArrowDown) {

                carX -= Math.sin(angle) * (step + acceleration * 100 * timepassed);

                carY += Math.cos(angle) * (step + acceleration * 100 * timepassed);
                carImg.src = "parking-drawings/car.svg";

            }

            if (keys.ArrowLeft && (keys.ArrowUp || keys.ArrowDown)) {

                angle -= turnSpeed + turnSpeedacc * 50 * timepassed;
                carImg.src = "parking-drawings/car-left.svg";

            }

            if (keys.ArrowRight && (keys.ArrowUp || keys.ArrowDown)) {

                angle += turnSpeed + turnSpeedacc * 50 * timepassed;
                carImg.src = "parking-drawings/car-right.svg";


            }
            moving = keys.ArrowUp || keys.ArrowDown;
            rotating = keys.ArrowLeft || keys.ArrowRight;

            if (rotating && moving) 
            {
                turnSpeedacc = Math.min(turnSpeedacc + 0.0008 * (8 * timepassed), maxTurnAcceleration);
            } 
            else
            {
                turnSpeedacc = 0;
            }

            if (!moving) {
                acceleration = 0.1;
            }
            else {
                acceleration = Math.min(acceleration + (2 * timepassed) ,maxAcceleration);
            }

        }

    }
    borderCheck();


    if (level === 1) {
        drawLevel1();
    }
    else if (level === 2) {
        drawLevel2();
    }
    else if (level === 3) {
        drawLevel3();
    }


    drawTimer();

    requestAnimationFrame(gameLoop);

}


function drawTimer() {
    ctx.fillStyle="black";
    ctx.roundRect(canvas.width - 155,5,150,40,5);
    ctx.fill();
    ctx.fillStyle = "white";
    ctx.font = "20px Arial";
    ctx.textAlign = "right";
    ctx.fillText(`Time: ${timeElapsed}s`,canvas.width - 20, 30);
}


function drawMenu() {
    timerRunning = false;
    let title = '';
    let color ='';
    let message = '';
    if (win){
        title="LEVEL COMPLETE!";
        color="#4CAF50";
        message="You Win";
    }
    else if(lose)
    {
        title="GAME OVER!";
        color = "#FF5252"
        message = "You Lost";
    }
    ctx.fillStyle = "rgba(0, 0, 0, 0.7)";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.fillStyle = "#333";
    ctx.strokeStyle = color;
    ctx.lineWidth = 5;
    const menuW = 400, menuH = 300;
    const menuX = (canvas.width - menuW) / 2;
    const menuY = (canvas.height - menuH) / 2;
    ctx.fillRect(menuX, menuY, menuW, menuH);
    ctx.strokeRect(menuX, menuY, menuW, menuH);

    ctx.fillStyle = color;
    ctx.font = "bold 40px Arial";
    ctx.textAlign = "center";
    ctx.fillText(title, canvas.width / 2, menuY + 60);

    ctx.fillStyle = "white";
    ctx.font = "20px Arial";
    ctx.fillText(message, canvas.width / 2, menuY + 110);
    ctx.fillText(`Final Time: ${timeElapsed}s`, canvas.width / 2, menuY + 150);

    

    if(engine === "frame-based")
    {
        if(level==1 && win)
        {
            
            highScoreLvl1F = window.localStorage.getItem("High-Score-Level-1-F");

            if(highScoreLvl1F)
            {
                if (highScoreLvl1F>timeElapsed)
                {
                    highScoreLvl1F=timeElapsed;
                    window.localStorage.setItem("High-Score-Level-1-F",highScoreLvl1F);
                }
            }
            else
            {
                highScoreLvl1F=timeElapsed;
                window.localStorage.setItem("High-Score-Level-1-F",highScoreLvl1F);
            }

            highscore = highScoreLvl1F;

            if(timeElapsed <=5)
            {
                ctx.drawImage(star,menuX,menuY-75,100,100);
                ctx.drawImage(star,menuX+150,menuY-100,100,100);
                ctx.drawImage(star,menuX+300,menuY-75,100,100);
            }

            else if(timeElapsed <=8)
            {
                ctx.drawImage(star,menuX,menuY-75,100,100);
                ctx.drawImage(star,menuX+150,menuY-100,100,100);
                ctx.drawImage(starno,menuX+300,menuY-75,100,100);
                ctx.fillStyle = "white";
                ctx.font = "bold 16px Arial";
                ctx.textAlign = "center";
                ctx.fillText("5s", menuX + 350, menuY - 15);
            }

            else if(timeElapsed <=13)
            {
                ctx.drawImage(star,menuX,menuY-75,100,100);
                ctx.drawImage(starno,menuX+150,menuY-100,100,100);
                
                ctx.drawImage(starno,menuX+300,menuY-75,100,100);
                ctx.fillStyle = "white";
                ctx.font = "bold 16px Arial";
                ctx.textAlign = "center";
                ctx.fillText("8s", menuX + 200, menuY - 40);
                ctx.fillText("5s", menuX + 350, menuY - 15);
            }
            
            else 
            {
                ctx.drawImage(starno,menuX,menuY-75,100,100);
                ctx.drawImage(starno,menuX+150,menuY-100,100,100);
                ctx.drawImage(starno,menuX+300,menuY-75,100,100);
                ctx.fillStyle = "white";
                ctx.font = "bold 16px Arial";
                ctx.textAlign = "center";
                ctx.fillText("13s", menuX + 50, menuY - 15);
                ctx.fillText("8s", menuX + 200, menuY - 40);
                ctx.fillText("5s", menuX + 350, menuY - 15);
            }
        }

        if(level==2 && win)
        {

            highScoreLvl2F = window.localStorage.getItem("High-Score-Level-2-F");

            if(highScoreLvl2F)
            {
                if (highScoreLvl2F>timeElapsed)
                {
                    highScoreLvl2F=timeElapsed;
                    window.localStorage.setItem("High-Score-Level-2-F",highScoreLvl2F);
                }
            }
            else
            {
                highScoreLvl2F=timeElapsed;
                window.localStorage.setItem("High-Score-Level-2-F",highScoreLvl2F);
            }

            highscore = highScoreLvl2F;
            
            if(timeElapsed <=10)
            {
                ctx.drawImage(star,menuX,menuY-75,100,100);
                ctx.drawImage(star,menuX+150,menuY-100,100,100);
                ctx.drawImage(star,menuX+300,menuY-75,100,100);
            }

            else if(timeElapsed <=15)
            {
                ctx.drawImage(star,menuX,menuY-75,100,100);
                ctx.drawImage(star,menuX+150,menuY-100,100,100);
                ctx.drawImage(starno,menuX+300,menuY-75,100,100);
                ctx.fillStyle = "white";
                ctx.font = "bold 16px Arial";
                ctx.textAlign = "center";
                ctx.fillText("10s", menuX + 350, menuY - 15);
            }

            else if(timeElapsed <=20)
            {
                ctx.drawImage(star,menuX,menuY-75,100,100);
                ctx.drawImage(starno,menuX+150,menuY-100,100,100);
                
                ctx.drawImage(starno,menuX+300,menuY-75,100,100);
                ctx.fillStyle = "white";
                ctx.font = "bold 16px Arial";
                ctx.textAlign = "center";
                ctx.fillText("15s", menuX + 200, menuY - 40);
                ctx.fillText("10s", menuX + 350, menuY - 15);
            }
            
            else 
            {
                ctx.drawImage(starno,menuX,menuY-75,100,100);
                ctx.drawImage(starno,menuX+150,menuY-100,100,100);
                ctx.drawImage(starno,menuX+300,menuY-75,100,100);
                ctx.fillStyle = "white";
                ctx.font = "bold 16px Arial";
                ctx.textAlign = "center";
                ctx.fillText("20s", menuX + 50, menuY - 15);
                ctx.fillText("15s", menuX + 200, menuY - 40);
                ctx.fillText("10s", menuX + 350, menuY - 15);
            }
        }

        if(level==3 && win)
        {
            
            highScoreLvl3F = window.localStorage.getItem("High-Score-Level-3-F");

            if(highScoreLvl3F)
            {
                if (highScoreLvl3F>timeElapsed)
                {
                    highScoreLvl3F=timeElapsed;
                    window.localStorage.setItem("High-Score-Level-3-F",highScoreLvl3F);
                }
            }
            else
            {
                highScoreLvl3F=timeElapsed;
                window.localStorage.setItem("High-Score-Level-3-F",highScoreLvl3F);
            }

            highscore = highScoreLvl3F;

            if(timeElapsed <=5)
            {
                ctx.drawImage(star,menuX,menuY-75,100,100);
                ctx.drawImage(star,menuX+150,menuY-100,100,100);
                ctx.drawImage(star,menuX+300,menuY-75,100,100);
            }

            else if(timeElapsed <=10)
            {
                ctx.drawImage(star,menuX,menuY-75,100,100);
                ctx.drawImage(star,menuX+150,menuY-100,100,100);
                ctx.drawImage(starno,menuX+300,menuY-75,100,100);
                ctx.fillStyle = "white";
                ctx.font = "bold 16px Arial";
                ctx.textAlign = "center";
                ctx.fillText("5s", menuX + 350, menuY - 15);
            }

            else if(timeElapsed <=15)
            {
                ctx.drawImage(star,menuX,menuY-75,100,100);
                ctx.drawImage(starno,menuX+150,menuY-100,100,100);
                
                ctx.drawImage(starno,menuX+300,menuY-75,100,100);
                ctx.fillStyle = "white";
                ctx.font = "bold 16px Arial";
                ctx.textAlign = "center";
                ctx.fillText("10s", menuX + 200, menuY - 40);
                ctx.fillText("5s", menuX + 350, menuY - 15);
            }
            
            else 
            {
                ctx.drawImage(starno,menuX,menuY-75,100,100);
                ctx.drawImage(starno,menuX+150,menuY-100,100,100);
                ctx.drawImage(starno,menuX+300,menuY-75,100,100);
                ctx.fillStyle = "white";
                ctx.font = "bold 16px Arial";
                ctx.textAlign = "center";
                ctx.fillText("15s", menuX + 50, menuY - 15);
                ctx.fillText("10s", menuX + 200, menuY - 40);
                ctx.fillText("5s", menuX + 350, menuY - 15);
            }
        }
    }
    else if(engine === "time-based")
    {
        if(level==1 && win)
        {
            highScoreLvl1 = window.localStorage.getItem("High-Score-Level-1");

            if(highScoreLvl1)
            {
                if (highScoreLvl1>timeElapsed)
                {
                    highScoreLvl1=timeElapsed;
                    window.localStorage.setItem("High-Score-Level-1",highScoreLvl1);
                }
            }
            else
            {
                highScoreLvl1=timeElapsed;
                window.localStorage.setItem("High-Score-Level-1",highScoreLvl1);
            }
            highscore = highScoreLvl1;
            if(timeElapsed <=4)
            {
                ctx.drawImage(star,menuX,menuY-75,100,100);
                ctx.drawImage(star,menuX+150,menuY-100,100,100);
                ctx.drawImage(star,menuX+300,menuY-75,100,100);
            }

            else if(timeElapsed <=7)
            {
                ctx.drawImage(star,menuX,menuY-75,100,100);
                ctx.drawImage(star,menuX+150,menuY-100,100,100);
                ctx.drawImage(starno,menuX+300,menuY-75,100,100);
                ctx.fillStyle = "white";
                ctx.font = "bold 16px Arial";
                ctx.textAlign = "center";
                ctx.fillText("4s", menuX + 350, menuY - 15);
            }

            else if(timeElapsed <=10)
            {
                ctx.drawImage(star,menuX,menuY-75,100,100);
                ctx.drawImage(starno,menuX+150,menuY-100,100,100);
                
                ctx.drawImage(starno,menuX+300,menuY-75,100,100);
                ctx.fillStyle = "white";
                ctx.font = "bold 16px Arial";
                ctx.textAlign = "center";
                ctx.fillText("7s", menuX + 200, menuY - 40);
                ctx.fillText("4s", menuX + 350, menuY - 15);
            }
            
            else 
            {
                ctx.drawImage(starno,menuX,menuY-75,100,100);
                ctx.drawImage(starno,menuX+150,menuY-100,100,100);
                ctx.drawImage(starno,menuX+300,menuY-75,100,100);
                ctx.fillStyle = "white";
                ctx.font = "bold 16px Arial";
                ctx.textAlign = "center";
                ctx.fillText("10s", menuX + 50, menuY - 15);
                ctx.fillText("7s", menuX + 200, menuY - 40);
                ctx.fillText("4s", menuX + 350, menuY - 15);
            }
        }

        if(level==2 && win)
        {

            highScoreLvl2 = window.localStorage.getItem("High-Score-Level-2");

            if(highScoreLvl2)
            {
                if (highScoreLvl2>timeElapsed)
                {
                    highScoreLvl2=timeElapsed;
                    window.localStorage.setItem("High-Score-Level-2",highScoreLvl2);
                }
            }
            else
            {
                highScoreLvl2=timeElapsed;
                window.localStorage.setItem("High-Score-Level-2",highScoreLvl2);
            }
            highscore = highScoreLvl2;
            if(timeElapsed <=8)
            {
                ctx.drawImage(star,menuX,menuY-75,100,100);
                ctx.drawImage(star,menuX+150,menuY-100,100,100);
                ctx.drawImage(star,menuX+300,menuY-75,100,100);
            }

            else if(timeElapsed <=13)
            {
                ctx.drawImage(star,menuX,menuY-75,100,100);
                ctx.drawImage(star,menuX+150,menuY-100,100,100);
                ctx.drawImage(starno,menuX+300,menuY-75,100,100);
                ctx.fillStyle = "white";
                ctx.font = "bold 16px Arial";
                ctx.textAlign = "center";
                ctx.fillText("8s", menuX + 350, menuY - 15);
            }

            else if(timeElapsed <=18)
            {
                ctx.drawImage(star,menuX,menuY-75,100,100);
                ctx.drawImage(starno,menuX+150,menuY-100,100,100);
                
                ctx.drawImage(starno,menuX+300,menuY-75,100,100);
                ctx.fillStyle = "white";
                ctx.font = "bold 16px Arial";
                ctx.textAlign = "center";
                ctx.fillText("13s", menuX + 200, menuY - 40);
                ctx.fillText("9s", menuX + 350, menuY - 15);
            }
            
            else 
            {
                ctx.drawImage(starno,menuX,menuY-75,100,100);
                ctx.drawImage(starno,menuX+150,menuY-100,100,100);
                ctx.drawImage(starno,menuX+300,menuY-75,100,100);
                ctx.fillStyle = "white";
                ctx.font = "bold 16px Arial";
                ctx.textAlign = "center";
                ctx.fillText("18s", menuX + 50, menuY - 15);
                ctx.fillText("14s", menuX + 200, menuY - 40);
                ctx.fillText("9s", menuX + 350, menuY - 15);
            }
        }

        if(level==3 && win)
        {
            
            highScoreLvl3 = window.localStorage.getItem("High-Score-Level-3");

            if(highScoreLvl3)
            {
                if (highScoreLvl3>timeElapsed)
                {
                    highScoreLvl3=timeElapsed;
                    window.localStorage.setItem("High-Score-Level-3",highScoreLvl3);
                }
            }
            else
            {
                highScoreLvl3=timeElapsed;
                window.localStorage.setItem("High-Score-Level-3",highScoreLvl3);
            }

            highscore = highScoreLvl3;
            if(timeElapsed <=4)
            {
                ctx.drawImage(star,menuX,menuY-75,100,100);
                ctx.drawImage(star,menuX+150,menuY-100,100,100);
                ctx.drawImage(star,menuX+300,menuY-75,100,100);
            }

            else if(timeElapsed <=8)
            {
                ctx.drawImage(star,menuX,menuY-75,100,100);
                ctx.drawImage(star,menuX+150,menuY-100,100,100);
                ctx.drawImage(starno,menuX+300,menuY-75,100,100);
                ctx.fillStyle = "white";
                ctx.font = "bold 16px Arial";
                ctx.textAlign = "center";
                ctx.fillText("4s", menuX + 350, menuY - 15);
            }

            else if(timeElapsed <=12)
            {
                ctx.drawImage(star,menuX,menuY-75,100,100);
                ctx.drawImage(starno,menuX+150,menuY-100,100,100);
                
                ctx.drawImage(starno,menuX+300,menuY-75,100,100);
                ctx.fillStyle = "white";
                ctx.font = "bold 16px Arial";
                ctx.textAlign = "center";
                ctx.fillText("8s", menuX + 200, menuY - 40);
                ctx.fillText("4s", menuX + 350, menuY - 15);
            }
            
            else 
            {
                ctx.drawImage(starno,menuX,menuY-75,100,100);
                ctx.drawImage(starno,menuX+150,menuY-100,100,100);
                ctx.drawImage(starno,menuX+300,menuY-75,100,100);
                ctx.fillStyle = "white";
                ctx.font = "bold 16px Arial";
                ctx.textAlign = "center";
                ctx.fillText("12s", menuX + 50, menuY - 15);
                ctx.fillText("8s", menuX + 200, menuY - 40);
                ctx.fillText("4s", menuX + 350, menuY - 15);
            }
        }
    }
    if(win)
    {
        ctx.fillStyle= "#4CAF50";
        ctx.font = "italic 24px inter";
        ctx.fillText(`Highest Score: ${highscore}s`, canvas.width / 2, menuY + 200);
    }
    ctx.fillStyle="white";
    ctx.font = "italic 16px Arial";
    ctx.fillText("Press 'R' to Restart", canvas.width / 2, menuY + 250);
    ctx.font = "italic 16px Arial";
    ctx.fillText("Press 'F' to go back to menu", canvas.width / 2, menuY + 280);
}


function checkParking(parkingSpotX, parkingSpotY, parkingSpotWidth, parkingSpotHeight) {
    const centerX = carX + carWidth / 2;
    const centerY = carY + carHeight / 2;

    const paddingX = 15;
    const paddingY = 15;

    const targetX = parkingSpotX + paddingX;
    const targetY = parkingSpotY + paddingY;
    const targetWidth = parkingSpotWidth - paddingX * 2;
    const targetHeight = parkingSpotHeight - paddingY * 2;

    const isInside =
        centerX > targetX &&
        centerX < targetX + targetWidth &&
        centerY > targetY &&
        centerY < targetY + targetHeight;

    const isStraight = Math.abs(Math.sin(angle)) < 0.2;

    notparked = !(isInside && isStraight);
}



function borderCheck() {

    borderCollision = false; // Reset every frame!

   

    const safeDistance = Math.max(carWidth, carHeight) / 2 - 10; // 10px buffer from edges

    const centerX = carX + carWidth / 2;

    const centerY = carY + carHeight / 2;



    if (centerX < safeDistance || centerX > canvas.width - safeDistance ||

        centerY < safeDistance || centerY > canvas.height - safeDistance) {

       

        // Optional: Keep the snapping logic, but trigger the lose state

        borderCollision = true;

    }

}

function checkObstacleCollision(obstacleX, obstacleY, obstacleWidth, obstacleHeight) {
    const hitboxWidth = carWidth * 0.5;
    const hitboxHeight = carHeight * 0.5;

    const carRect = {
        x: carX + (carWidth - hitboxWidth) / 2,
        y: carY + (carHeight - hitboxHeight) / 2,
        width: hitboxWidth,
        height: hitboxHeight
    };

    const obstacleRect = {
        x: obstacleX,
        y: obstacleY,
        width: obstacleWidth,
        height: obstacleHeight
    };

    if (
        carRect.x < obstacleRect.x + obstacleRect.width &&
        carRect.x + carRect.width > obstacleRect.x &&
        carRect.y < obstacleRect.y + obstacleRect.height &&
        carRect.y + carRect.height > obstacleRect.y
    ) {
        borderCollision = true;
    }
}


function drawLevel1() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    ctx.drawImage(parkingSpotRevImg, parkingSpotX, parkingSpotY, parkingSpotWidth, parkingSpotHeight);

    ctx.save();
    ctx.translate(carX + carWidth/2, carY + carHeight/2);
    ctx.rotate(angle);
    ctx.drawImage(carImg, -carWidth/2, -carHeight/2, carWidth, carHeight);
    ctx.restore();

    const facingForward = Math.cos(angle) > 0.9;

    checkParking(parkingSpotX, parkingSpotY , parkingSpotWidth, parkingSpotHeight);

    ctx.drawImage(barrierImg, 320, 300, 160, 90);
    checkObstacleCollision(320, 300, 160, 90);


    ctx.restore()

    if (!notparked && !borderCollision && !moving && !facingForward) 
    {
        setTimeout(() => {
            win = true;
        }, 500);
    } 
    else if (borderCollision) 
    {

        ctx.drawImage(crash, carX, carY, 100, 100);
        lose = true;
    }

    if (win || lose)
    {
        drawMenu();
    }
}

function drawLevel2() {
    let parkingSpotX = 20;
    let parkingSpotY = canvas.height - parkingSpotHeight - 20;
    let stepsup = 50;
    if (!start) {
        carX = canvas.width - carWidth - 100;
        carY = canvas.height - carHeight - 20;
        start = true;
    }
    let obstacles = [
    { x: canvas.width - 70, y: canvas.height - 80, width: 50, height: 50 },
    { x: canvas.width - 70, y: canvas.height - 160, width: 50, height: 50 },
    { x: canvas.width - 70, y: canvas.height - 240, width: 50, height: 50 },
    { x: canvas.width - 70, y: canvas.height - 320, width: 50, height: 50 },
    { x: canvas.width - 70, y: canvas.height - 400, width: 50, height: 50 },
    { x: canvas.width - 70, y: canvas.height - 480, width: 50, height: 50 },
    { x: canvas.width - 70, y: canvas.height - 560, width: 50, height: 50 },
    { x: canvas.width - 150, y: canvas.height - 560, width: 50, height: 50 },
    { x: canvas.width - 230, y: canvas.height - 560, width: 50, height: 50 },
    { x: canvas.width - 310, y: canvas.height - 560, width: 50, height: 50 },
    { x: canvas.width - 390, y: canvas.height - 560, width: 50, height: 50 },
    { x: canvas.width - 390, y: canvas.height - 480, width: 50, height: 50 },
    { x: canvas.width - 390, y: canvas.height - 400, width: 50, height: 50 },
    { x: canvas.width - 390, y: canvas.height - 320, width: 50, height: 50 },
    { x: canvas.width - 390, y: canvas.height - 240, width: 50, height: 50 },
    { x: canvas.width - 470, y: canvas.height - 560, width: 50, height: 50 },
    { x: canvas.width - 550, y: canvas.height - 560, width: 50, height: 50 },
    { x: canvas.width - 630, y: canvas.height - 560, width: 50, height: 50 },
    { x: canvas.width - 710, y: canvas.height - 560, width: 50, height: 50 },
    { x: canvas.width - 790, y: canvas.height - 560, width: 50, height: 50 },

    
    { x: canvas.width - 230, y: canvas.height - 400, width: 50, height: 50 },
    { x: canvas.width - 230, y: canvas.height - 320, width: 50, height: 50 },
    { x: canvas.width - 230, y: canvas.height - 240, width: 50, height: 50 },
    { x: canvas.width - 230, y: canvas.height - 160, width: 50, height: 50 },
    { x: canvas.width - 230, y: canvas.height - 80, width: 50, height: 50 },
    
    { x: canvas.width - 630, y: canvas.height - 400, width: 50, height: 50 },
    { x: canvas.width - 630, y: canvas.height - 320, width: 50, height: 50 },
    { x: canvas.width - 630, y: canvas.height - 240, width: 50, height: 50 },
    { x: canvas.width - 630, y: canvas.height - 160, width: 50, height: 50 },
    { x: canvas.width - 630, y: canvas.height - 80, width: 50, height: 50 }

    






    ];
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    ctx.drawImage(parkingSpotImg, parkingSpotX, parkingSpotY, parkingSpotWidth, parkingSpotHeight);

    for (let obs of obstacles) {
        ctx.drawImage(coneImg, obs.x, obs.y, obs.width, obs.height);
        checkObstacleCollision(obs.x, obs.y, obs.width, obs.height, carX, carY);
    }


    ctx.save();
    ctx.translate(carX + carWidth/2, carY + carHeight/2);
    ctx.rotate(angle);
    ctx.drawImage(carImg, -carWidth/2, -carHeight/2, carWidth, carHeight);
    ctx.restore();

    const isStraight = Math.abs(Math.sin(angle)) < 0.2;
    checkParking(parkingSpotX, parkingSpotY , parkingSpotWidth, parkingSpotHeight);
    if (!notparked && isStraight && !moving) 
    {
         setTimeout(() => {
            win = true;
        }, 500);
    } else if (borderCollision) 
    {        
        ctx.drawImage(crash, carX, carY, 100, 100);
        lose = true;
    }
    if (win || lose)
    {
        drawMenu();
    }
}

function drawLevel3() {
    let parkingSpotX = canvas.width/2 - 200;
    let parkingSpotY = canvas.height - parkingSpotHeight - 20;
    let step2 = 2;
    
    

    if (!start) {
        carX = canvas.width - carWidth - 100;
        carY = canvas.height - carHeight - 20;
        start = true;
    }
    
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(parkingSpotImg, parkingSpotX, parkingSpotY, parkingSpotWidth, parkingSpotHeight);
    ctx.drawImage(parkingSpotImg, parkingSpotX - parkingSpotWidth, parkingSpotY, parkingSpotWidth, parkingSpotHeight);
    ctx.drawImage(parkingSpotImg, parkingSpotX - parkingSpotWidth * 2, parkingSpotY, parkingSpotWidth, parkingSpotHeight);
    ctx.drawImage(carImg, parkingSpotX - parkingSpotWidth * 2 + 25, parkingSpotY + 20, carWidth, carHeight);
    checkObstacleCollision(parkingSpotX - parkingSpotWidth * 2 + 25, parkingSpotY + 20, carWidth, carHeight);
    ctx.drawImage(carImg, parkingSpotX + 25, parkingSpotY + 20, carWidth, carHeight);
    checkObstacleCollision(parkingSpotX + 25, parkingSpotY + 20, carWidth+25, carHeight);
    ctx.drawImage(roadImg, 0, 50, canvas.width, canvas.height/3);
    ctx.drawImage(barrierVer, canvas.width/2 +100, canvas.height - 120, 60, 100);
    checkObstacleCollision(canvas.width/2 +100, canvas.height - 120, 60 + 25, 100);
    ctx.drawImage(barrierVer, canvas.width/2 +100, canvas.height - 220, 60, 100);
    checkObstacleCollision(canvas.width/2 +100, canvas.height - 220, 60+25, 100);
    ctx.drawImage(barrierVer, canvas.width/2 +100, canvas.height - 320, 60, 100);
    checkObstacleCollision(canvas.width/2 +100, canvas.height - 295, 60+25, 100);
    ctx.drawImage(trafficCar,0+x, 165, carHeight+10, carWidth+10);
    checkObstacleCollision(0+x, 165, carHeight+10, carWidth+10);
    ctx.drawImage(trafficCar,0+x2, 165, carHeight+10, carWidth+10);
    checkObstacleCollision(0+x2, 165, carHeight+10, carWidth+10);
    if (borderCollision)
    {
        x=x;
    }
    else if (!borderCollision)
    {
        x+= step2;
        x2+= step2;
    }
    if (x2>=x-30)
    {

    }
    if (x > canvas.width) {
        x = -carHeight;
    }
    if (x2 > canvas.width) {
        x2 = x-300;
    }


    ctx.save();
    ctx.translate(carX + carWidth/2, carY + carHeight/2);
    ctx.rotate(angle);
    ctx.drawImage(carImg, -carWidth/2, -carHeight/2, carWidth, carHeight);
    ctx.restore();

    checkParking(parkingSpotX - parkingSpotWidth, parkingSpotY, parkingSpotWidth, parkingSpotHeight);

    if (!notparked && !moving) 
    {
         setTimeout(() => {
            win = true;
        }, 500);
    } else if (borderCollision) 
    {
        ctx.drawImage(crash, carX, carY, 100, 100);
        lose = true;
    }
    if (win || lose)
    {
        drawMenu();
    }
}
