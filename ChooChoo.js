/* ------------------------------------------ Globals ----------------------------------------------*/

let canvas = document.getElementById("canvas");
let ctx = canvas.getContext("2d");
ctx.translate(2,2);
let level=0;
let game;
let layout;
let images = new imageSource;
let refreshRateInterval;
let timer;
let randomPush;
let lockLvl2 = true;

/* ------------------------------------------ Objects ----------------------------------------------*/

function newLayout(){
    this.grid = new Array (801);
    this.rotateR = 30;
    this.curveR = 20;
    this.railwayW = 10;
    this.jointPoint = function(x,y,switchDir,angle){
        this.x = x;
        this.y = y;
        this.switchDir = switchDir;
        this.dir = "straight";
        this.angle = angle;
        this.inRange = function(clickX,clickY){
            if (clickX < this.x+layout.curveR && clickX > this.x-layout.curveR && clickY < this.y+layout.curveR && clickY > this.y-layout.curveR){
                if (this.dir == "straight"){
                    this.dir = this.switchDir;
                } else {
                    this.dir = "straight";
                }
                return true;
            } else {
                return false;
            }
        }
    }
    this.rotateRight = new rotateRight;
    this.rotateLeft = new rotateLeft;
    switch (level){
        case 1:
            this.fill = fillLayout1;
            this.baseBackground = drawBackgroundLvl1Base;
            this.surfaceBackground = drawBackgroundLvl1Surface;
            this.jointArray = [new this.jointPoint(450,200,"left",90),new this.jointPoint(450,300,"right",90),new this.jointPoint(550,375,"right",0),new this.jointPoint(300,450,"right",90)];
            break;
        case 2:
            this.fill = fillLayout2;
            this.baseBackground = drawBackgroundLvl2Base;
            this.surfaceBackground = drawBackgroundLvl2Surface;
            this.jointArray = [new this.jointPoint(425,150,"left",180),new this.jointPoint(590,150,"right",180),new this.jointPoint(325,375,"right",180),new this.jointPoint(550,375,"left",270)];
            break;
    }
}

function newGame(){
    this.permission="toRun";
    switch (level){
        case 1:
            this.speed=25;
            this.timeRemained=120;
            this.goal=1000;
            break;
        case 2:
            this.speed=20;
            this.timeRemained=180;
            this.goal=2000;
    }

    this.totalValue = function(){
        return this.diamond + this.gold + this.oil + this.wine + this.wood;
    }
    this.diamond=100;
    this.gold=100;
    this.oil=100;
    this.wine=100;
    this.wood=100;
    this.wagonOrderArray = new Array();
    this.printValue = function(){
        document.getElementById("totalValue").innerHTML = this.totalValue();
        document.getElementById("diamond").innerHTML = this.diamond;
        document.getElementById("gold").innerHTML = this.gold;
        document.getElementById("oil").innerHTML = this.oil;
        document.getElementById("wine").innerHTML = this.wine;
        document.getElementById("wood").innerHTML = this.wood;
    }
    this.checkValue = function(){
        if (this.diamond<0){
            finish("diamond");
        } else if (this.gold<0){
            finish("gold");
        } else if (this.oil<0){
            finish("oil");
        } else if (this.wine<0){
            finish("wine");
        } else if (this.wood<0){
            finish("wood");
        }
    }
}

function wagon(t){
    switch (level){
        case 1:
            this.y=75;
            break;
        case 2:
            this.y=500;
            break;
    }
    this.x=100;
    this.angle=0;
    this.type=t;
    this.rotation="straight";
}

/* ------------------------------------------ Main ----------------------------------------------*/

function loading(){
    let l = new Image();
    l.src = "Icons/loading.png";
    l.onload = function(){
        ctx.drawImage(l,0,0,800,600);
        setTimeout (mainMenu,3000);
    }
}

function mainMenu(){
    ctx.clearRect(-2,-2,804,604);
    document.getElementById("dataTable").style="color:black";
    document.getElementById("time").style= "color:black";
    document.getElementById("speed").style= "color:black";
    for (let i=0;i<5;i++){
        document.getElementsByClassName("item")[i].style="color:black";
    }
    document.getElementById("speed").innerHTML="1x";

    game = new newGame;
    layout = new newLayout;

    //draw main menu
    ctx.save();
    ctx.fillStyle="white";
    ctx.font="30px Georgia";
    ctx.fillText("Main Menu",330,50);
    ctx.beginPath();
    ctx.moveTo(400,100);
    ctx.lineTo(400,575);
    ctx.strokeStyle="gray";
    ctx.lineWidth=10;
    ctx.stroke();
    ctx.fillStyle="greenYellow";
    ctx.lineWidth=2;
    ctx.strokeStyle="white";
    ctx.fillRect(125,100,150,100);
    ctx.strokeRect(123,98,154,104);
    ctx.font="20px Georgia";
    if (lockLvl2){
        ctx.fillStyle="dimGray";
        ctx.fillRect(525,100,150,100);
        ctx.drawImage(images.lock,575,150,50,40);
        ctx.fillText("Win beginner to unlock !",490,250);
        ctx.fillStyle="black";
        ctx.fillText("Pro",585,130);
    } else {
        ctx.fillStyle="darkGreen";
        ctx.fillRect(525,100,150,100);
        ctx.fillStyle="black";
        ctx.fillText("Pro",585,155);
        ctx.font="18px Georgia";
        ctx.fillStyle="white";
        ctx.fillText("Introducing...",550,250);
        ctx.drawImage(images.bomb,300,0,300,200,565,270,80,60);
        ctx.fillText("Will crush your storage !",500,360);
        ctx.fillText("3 min",578,450);
        ctx.fillText("Fast",585,490);
        ctx.fillText("1x / 2x / 4x",555,530);
        ctx.fillText("Goal = $2000k",540,570);
    }
    ctx.strokeRect(523,98,154,104);
    ctx.fillStyle="black";
    ctx.fillText("Beginner",158,155);
    ctx.drawImage(images.diamondTrain,0,0,660,220,150,220,65,30);
    ctx.drawImage(images.goldTrain,0,0,660,220,150,260,65,30);
    ctx.drawImage(images.oilTrain,0,0,660,220,150,300,65,30);
    ctx.drawImage(images.wineTrain,0,0,660,220,150,340,65,30);
    ctx.drawImage(images.woodTrain,0,0,660,220,150,380,65,30);
    ctx.font="14px Georgia";
    ctx.fillStyle="aqua";
    ctx.fillText("$80k",220,240);
    ctx.fillStyle="gold";
    ctx.fillText("$60k",220,280);
    ctx.fillStyle="gray";
    ctx.fillText("$40k",220,320);
    ctx.fillStyle="crimson";
    ctx.fillText("$20k",220,360);
    ctx.fillStyle="peru";
    ctx.fillText("$10k",220,400);
    ctx.font="18px Georgia";
    ctx.fillStyle="white";
    ctx.fillText("2 min",178,450);
    ctx.fillText("Slow",180,490);
    ctx.fillText("1x / 2x",170,530);
    ctx.fillText("Goal = $1000k",140,570);
    ctx.restore();
    //till here

    if (level!=0) {
        game.permission="clickJoint";
        layout.fill();
        refreshRateInterval = setInterval(mainInterval,game.speed);
        timer = setInterval(countDown,1000);
        newWagonAppear();
        document.getElementById("time").innerHTML= game.timeRemained/60+" : 00";
        document.getElementById("goalValue").innerHTML= "$ "+game.goal+" k";
        document.getElementById("time").style= "color:white";
        document.getElementById("speed").style= "color:white";
        document.getElementById("dataTable").style="color:white";
        document.getElementById("diamond").style="color:aqua";
        document.getElementById("gold").style="color:gold";
        document.getElementById("oil").style="color:gray";
        document.getElementById("wine").style="color:crimson";
        document.getElementById("wood").style="color:peru";
    }
}

function clickCanvas(event){
    let xc = event.offsetX;
    let yc = event.offsetY;
    switch (game.permission){
        case "toRun":
            if (xc>100 && xc<300 && yc>100 && yc<200) {
                level=1;
            } else if (xc>500 && xc<700 && yc>100 && yc<200 && !lockLvl2) {
                level=2;
            }
            mainMenu();
            break;
        case "toMenu":
            level=0;
            mainMenu();
            break;
        case "clickJoint":
            for (let i=0; i<layout.jointArray.length; i++){
                let joint = layout.jointArray[i];
                if(joint.inRange(xc,yc)){
                    switch (joint.dir){
                        case "straight":
                            switch (joint.angle){
                                case 0:
                                    layout.grid[joint.x-layout.rotateR][joint.y] = moveForward;
                                    break;
                                case 90:
                                    layout.grid[joint.x][joint.y-layout.rotateR] = moveForward;
                                    break;
                                case 180:
                                    layout.grid[joint.x+layout.rotateR][joint.y] = moveForward;
                                    break;
                                case 270:
                                    layout.grid[joint.x][joint.y+layout.rotateR] = moveForward;
                                    break;
                            }
                            break;
                        case "right":
                            rotateRight(joint.x,joint.y,joint.angle);
                            break;
                        case "left":
                            rotateLeft(joint.x,joint.y,joint.angle);
                            break;
                    }
                }
            }
            break;
    }
}

function pause(event){
    if (level!=0){
        if (event.keyCode==32){
            alert("Resume?");
        }
    }
}

function mainInterval(){
    layout.baseBackground();
    for (let i=0; i<layout.jointArray.length; i++){
        let joint = layout.jointArray[i];
        drawJoint(joint);
    }
    for (let i=0; i<game.wagonOrderArray.length; i++){
        let wagon = game.wagonOrderArray [i];
        drawOneWagon(wagon);
        layout.grid[wagon.x][wagon.y](wagon);
    }
    layout.surfaceBackground();

    game.printValue();
    game.checkValue();
}

function countDown(){
    game.timeRemained-=1;
    ctx.save();
    ctx.font="150px impact";
    ctx.lineWidth = 3;
    switch (game.timeRemained){
        case 0:
            finish("time");
            break;
        case 10:
            document.getElementById("time").style="color:red";
            break;
        case 60:
            game.speed-=6;
            clearInterval (refreshRateInterval);
            if (level==1){
                document.getElementById("time").style="color:yellow";    
                document.getElementById("speed").innerHTML="2x";
                document.getElementById("speed").style="color:yellow";
                ctx.fillStyle="yellow";
                ctx.fillText("2X",300,350);
                ctx.strokeText("2X",300,350);
            } else if (level==2){
                document.getElementById("time").style="color:orange";
                document.getElementById("speed").innerHTML="4x";
                document.getElementById("speed").style="color:orange";
                ctx.fillStyle="orange";
                ctx.fillText("4X",300,350);
                ctx.strokeText("4X",300,350);
            }
            setTimeout (function(){
                refreshRateInterval = setInterval(mainInterval,game.speed);
            },1000);
            break;
        case 120:
            if (level==2){
                game.speed-=6;
                clearInterval (refreshRateInterval);
                document.getElementById("time").style="color:yellow";    
                document.getElementById("speed").innerHTML="2x";
                document.getElementById("speed").style="color:yellow";
                ctx.fillStyle="yellow";
                ctx.fillText("2X",300,350);
                ctx.strokeText("2X",300,350);
                setTimeout (function(){
                    refreshRateInterval = setInterval(mainInterval,game.speed);
                },1000);
            }
    }
    ctx.restore();
    let min = Math.floor(game.timeRemained/60);
    let sec = game.timeRemained-(min*60);
    let zero="";
    if (sec<10){zero="0";}
    document.getElementById("time").innerHTML= min+" : "+zero+sec;
}

function newWagonAppear(){
    let type = function(){
        if (level==1){
            let random = Math.random();
            if (random<0.20){return "diamond";}
            else if (random<0.40){return "gold";}
            else if (random<0.60){return "oil";}
            else if (random<0.80){return "wine";}
            else {return "wood";}
        } else if (level==2){
            let random = Math.random();
            if (random<0.10){return "diamond";}
            else if (random<0.20){return "gold";}
            else if (random<0.30){return "oil";}
            else if (random<0.40){return "wine";}
            else if (random<0.50){return "wood";}
            else if (random<0.60){console.log("bomb"); return "diamondBomb";}
            else if (random<0.70){console.log("bomb"); return "goldBomb";}
            else if (random<0.80){console.log("bomb"); return "oilBomb";}
            else if (random<0.90){console.log("bomb"); return "wineBomb";}
            else {console.log("bomb"); return "woodBomb";}
        }

    }();
    let randomTime = (Math.random()*1000*game.speed/3)+(60*game.speed);
    randomPush = setTimeout(function(){
        game.wagonOrderArray.push(new wagon(type));
        newWagonAppear();
    },randomTime);
}

function finish(how){
    clearInterval(refreshRateInterval);
    clearInterval(timer);
    clearTimeout(randomPush);
    game.permission="toMenu";

    //draw results
    ctx.save();
    ctx.font="20px courier";
    ctx.fillStyle="black";
    ctx.fillRect(50,200,700,150);
    if (how == "time"){
        if (game.totalValue()>game.goal) {
            ctx.fillStyle="green";
            ctx.strokeStyle="green";
            if (level==1){
                lockLvl2 = false;
                ctx.fillText("😎 WELL DONE 😎",315,240);
                ctx.fillText("Pro level is now unlocked",250,290);
            } else if (level ==2){
                ctx.fillText("🎉!!! CONGRATS !!!🎊",260,240);
                ctx.fillText("You've completed the game",240,290);
            }
            ctx.fillText("Your storage value : $ "+game.totalValue()+"k",230,320);
        } else {
            ctx.fillStyle="red";
            ctx.strokeStyle="red";
            ctx.fillText("😠 NOPE! 😢",340,240);
            ctx.fillText("Insufficient total value",250,290);
            ctx.fillText("Your storage value : $ "+game.totalValue()+"k",230,320);
        }
    } else {
        ctx.fillStyle="red";
        ctx.strokeStyle="red";
        ctx.fillText("☹ LOSER ☹",340,260);
        ctx.fillText("You've missed too many "+how+" trains",190,300);
    }
    ctx.lineWidth=8;
    ctx.strokeRect(50,200,700,150);
    ctx.restore();
}

function resetButton(){
    if(level!=0){
        if(confirm("Are you sure you want to discard your game process?")){
            clearInterval(refreshRateInterval);
            clearInterval(timer);
            clearTimeout(randomPush);
            level=0;
            mainMenu();
        }
    } else {
        mainMenu();
    }
}

function fillLayout1(){
    for (let j=1; j<801; j++) {
        layout.grid[j]= new Array (601);
    }

    for (let j=100; j<450; j++){            // A
        layout.grid [j][75]= moveForward;
    }
    for (let j=451; j<600; j++){            // C
        layout.grid [j][200]= moveForward;
    }
    for (let j=451; j<650; j++){            // D
        layout.grid [j][375]= moveForward;
    }
    for (let j=301; j<400; j++){            // H
        layout.grid [j][525]= moveForward;
    }
    for (let j=449; j>300; j--){            // F
        layout.grid [j][300]= moveForward;
    }
    for (let j=299; j>200; j--){            // I
        layout.grid [j][450]= moveForward;
    }
    for (let j=76; j<375; j++){             // B
        layout.grid [450][j]= moveForward;
    }
    for (let j=301; j<525; j++){            // G
        layout.grid [300][j]= moveForward;
    }
    for (let j=376; j<450; j++){            // E
        layout.grid [550][j]= moveForward;
    }
    rotateRight(450,75,0);      // AB
    rotateLeft(450,375,90);     // BD
    rotateLeft(300,300,180);    // FG
    rotateLeft(300,525,90);     // GH
    layout.grid [600][200] = wagonReachedWood;          // Wood
    layout.grid [650][375] = wagonReachedWine;          // Wine
    layout.grid [550][450] = wagonReachedGold;          // Gold
    layout.grid [200][450] = wagonReachedOil;           // Oil
    layout.grid [400][525] = wagonReachedDiamond;       // Diamond
}

function fillLayout2(){
    for (let j=1; j<801; j++) {
        layout.grid[j]= new Array (601);
    }

    for (let j=100; j<550; j++){            // A
        layout.grid [j][500]= moveForward;
    }
    for (let j=549; j>125; j--){            // C
        layout.grid [j][375]= moveForward;
    }
    for (let j=551; j<650; j++){            // D
        layout.grid [j][300]= moveForward;
    }
    for (let j=649; j>225; j--){            // F
        layout.grid [j][150]= moveForward;
    }
    for (let j=499; j>300; j--){             // B
        layout.grid [550][j]= moveForward;
    }
    for (let j=299; j>150; j--){            // E
        layout.grid [650][j]= moveForward;
    }
    for (let j=374; j>300; j--){            // G
        layout.grid [125][j]= moveForward;
    }
    for (let j=374; j>300; j--){            // H
        layout.grid [325][j]= moveForward;
    }
    for (let j=149; j>75; j--){            // K
        layout.grid [590][j]= moveForward;
    }
    for (let j=151; j<225; j++){            // J
        layout.grid [425][j]= moveForward;
    }
    for (let j=151; j<225; j++){            // I
        layout.grid [225][j]= moveForward;
    }
    rotateLeft(550,500,0);      // AB
    rotateRight(550,300,270);   // BD
    rotateLeft(650,300,0);      // DE
    rotateLeft(650,150,270);    // EF
    rotateLeft(225,150,180);    // FI
    rotateRight(125,375,180);   // CG
    layout.grid [225][225] = wagonReachedWood;          // Wood
    layout.grid [590][75] = wagonReachedWine;           // Wine
    layout.grid [325][300] = wagonReachedGold;          // Gold
    layout.grid [125][300] = wagonReachedOil;           // Oil
    layout.grid [425][225] = wagonReachedDiamond;       // Diamond
}

function moveForward(w){
    switch (w.angle) {
        case 0:
            w.x+=1;
            break;
        case 90:
            w.y+=1;
            break;
        case 180:
            w.x-=1;
            break;
        case 270:
            w.y-=1;
            break;
    }
}

function rotateRight(xP,yP,angleP){
    switch(angleP){
        case 0 :
            layout.grid[xP-layout.rotateR][yP] = layout.rotateRight.endPoint;
            layout.grid[xP-layout.rotateR][yP+layout.rotateR] = layout.rotateRight.axisPoint;
            break;
        case 90 :
            layout.grid[xP][yP-layout.rotateR] = layout.rotateRight.endPoint;
            layout.grid[xP-layout.rotateR][yP-layout.rotateR] = layout.rotateRight.axisPoint;
            break;
        case 180 :
            layout.grid[xP+layout.rotateR][yP] = layout.rotateRight.endPoint;
            layout.grid[xP+layout.rotateR][yP-layout.rotateR] = layout.rotateRight.axisPoint;
            break;
        case 270 :
            layout.grid[xP][yP+layout.rotateR] = layout.rotateRight.endPoint;
            layout.grid[xP+layout.rotateR][yP+layout.rotateR] = layout.rotateRight.axisPoint;
            break;
    }

    this.endPoint = function(w){
        switch(w.angle){
            case 0:
                w.y += layout.rotateR;
                break;
            case 90:
                w.x -= layout.rotateR;
                break;
            case 180:
                w.y -= layout.rotateR;
                break;
            case 270:
                w.x += layout.rotateR;
                break;
        }
        w.rotation = "right";
        w.angle+=3;
    };
    this.axisPoint = function(w){
        w.angle += 3;
        if (w.angle == 360){w.angle=0;}
        if (w.angle == 0 || w.angle == 90 || w.angle == 180 || w.angle == 270){
            switch (w.angle) {
                case 0:
                    w.y -= layout.rotateR;
                    break;
                case 90:
                    w.x += layout.rotateR;
                    break;
                case 180:
                    w.y += layout.rotateR;
                    break;
                case 270:
                    w.x -= layout.rotateR;
                    break;
            }
            w.rotation = "straight";
        }
    };
}

function rotateLeft(xP,yP,angleP){
    switch(angleP){
        case 0 :
            layout.grid[xP-layout.rotateR][yP] = layout.rotateLeft.endPoint;
            layout.grid[xP-layout.rotateR][yP-layout.rotateR] = layout.rotateLeft.axisPoint;
            break;
        case 90 :
            layout.grid[xP][yP-layout.rotateR] = layout.rotateLeft.endPoint;
            layout.grid[xP+layout.rotateR][yP-layout.rotateR] = layout.rotateLeft.axisPoint;
            break;
        case 180 :
            layout.grid[xP+layout.rotateR][yP] = layout.rotateLeft.endPoint;
            layout.grid[xP+layout.rotateR][yP+layout.rotateR] = layout.rotateLeft.axisPoint;
            break;
        case 270 :
            layout.grid[xP][yP+layout.rotateR] = layout.rotateLeft.endPoint;
            layout.grid[xP-layout.rotateR][yP+layout.rotateR] = layout.rotateLeft.axisPoint;
            break;
    }

    this.endPoint = function(w){
        switch(w.angle){
            case 0:
                w.y -= layout.rotateR;
                break;
            case 90:
                w.x += layout.rotateR;
                break;
            case 180:
                w.y += layout.rotateR;
                break;
            case 270:
                w.x -= layout.rotateR;
                break;
        }
        w.rotation = "left";
        w.angle-=3;
    };
    this.axisPoint = function(w){
        w.angle-=3;
        if (w.angle == -90){w.angle=270;}
        if (w.angle == 0 || w.angle == 90 || w.angle == 180 || w.angle == 270){
            switch (w.angle) {
                case 0:
                    w.y += layout.rotateR;
                    break;
                case 90:
                    w.x -= layout.rotateR;
                    break;
                case 180:
                    w.y -= layout.rotateR;
                    break;
                case 270:
                    w.x += layout.rotateR;
                    break;
            }
            w.rotation = "straight";
        }
    };
}

function wagonReachedDiamond(w){
    if (w.type == "diamond") {
        game.diamond+=80;
    } else if (w.type == "diamondBomb"){
        game.diamond=0;
    } else {
        wrongWagon(w);
    }
    let i = game.wagonOrderArray.indexOf(w);
    game.wagonOrderArray.splice(i,1);
}

function wagonReachedGold(w){
    if (w.type == "gold") {
        game.gold+=60;
    } else if (w.type == "goldBomb"){
        game.gold=0;
    } else {
        wrongWagon(w);
    }
    let i = game.wagonOrderArray.indexOf(w);
    game.wagonOrderArray.splice(i,1);
}

function wagonReachedOil(w){
    if (w.type == "oil") {
        game.oil+=40;
    } else if (w.type == "oilBomb"){
        game.oil=0;
    } else {
        wrongWagon(w);
    }
    let i = game.wagonOrderArray.indexOf(w);
    game.wagonOrderArray.splice(i,1);
}

function wagonReachedWine(w){
    if (w.type == "wine") {
        game.wine+=20;
    } else if (w.type == "wineBomb"){
        game.wine=0;
    } else {
        wrongWagon(w);
    }
    let i = game.wagonOrderArray.indexOf(w);
    game.wagonOrderArray.splice(i,1);
}

function wagonReachedWood(w){
    if (w.type == "wood") {
        game.wood+=10;
    } else if (w.type == "woodBomb"){
        game.wood=0;
    } else {
        wrongWagon(w);
    }
    let i = game.wagonOrderArray.indexOf(w);
    game.wagonOrderArray.splice(i,1);
}

function wrongWagon(w){
    let type = w.type;
    switch (type){
        case "diamond":
            game.diamond-=80;
            break;
        case "gold":
            game.gold-=60;
            break;
        case "oil":
            game.oil-=40;
            break;
        case "wine":
            game.wine-=20;
            break;
        case "wood":
            game.wood-=10;
            break;
    }
}

/* ------------------------------------------ Drawings ----------------------------------------------*/

function imageSource(){
    this.diamondTrain = new Image();
    this.diamondTrain.src = "Icons/diamondTrain.png";
    this.goldTrain = new Image();
    this.goldTrain.src = "Icons/goldTrain.png";
    this.oilTrain = new Image();
    this.oilTrain.src = "Icons/oilTrain.png";
    this.wineTrain = new Image();
    this.wineTrain.src = "Icons/wineTrain.png";
    this.woodTrain = new Image();
    this.woodTrain.src = "Icons/woodTrain.png";
    this.tunnel = new Image();
    this.tunnel.src = "Icons/tunnel.png";
    this.diamond = new Image();
    this.diamond.src = "Icons/diamondStorage.png";
    this.gold = new Image();
    this.gold.src = "Icons/goldStorage.png";
    this.oil = new Image();
    this.oil.src = "Icons/oilStorage.png";
    this.wine = new Image();
    this.wine.src = "Icons/wineStorage.png";
    this.wood = new Image();
    this.wood.src = "Icons/woodStorage.png";
    this.bomb = new Image();
    this.bomb.src = "Icons/bomb.png";

    this.lock = new Image();
    this.lock.src = "Icons/lock.png";
}

function drawOneWagon(w){
    let t;
    let b;
    ctx.save();
    ctx.translate(w.x,w.y);
    switch (w.type) {
        case "diamond" :
            t = images.diamondTrain;
            break;
        case "gold" :
            t = images.goldTrain;
            break;
        case "oil" :
            t = images.oilTrain;
            break;
        case "wine" :
            t = images.wineTrain;
            break;
        case "wood" :
            t = images.woodTrain;
            break;
        case "diamondBomb" :
            t = images.diamondTrain;
            b = true;
            break;
        case "goldBomb" :
            t = images.goldTrain;
            b = true;
            break;
        case "oilBomb" :
            t = images.oilTrain;
            b = true;
            break;
        case "wineBomb" :
            t = images.wineTrain;
            b = true;
            break;
        case "woodBomb" :
            t = images.woodTrain;
            b = true;
            break;
    }
    let imageY;
    if (w.angle>=250 || w.angle<=70){
        imageY = 0;
    } else {
        imageY = 200;
    }

    ctx.rotate(w.angle*Math.PI/180);
    switch (w.rotation){
        case "straight":
            ctx.drawImage(t,0,imageY,658,280,-33,-20,60,40);
            if (b){
                ctx.drawImage(images.bomb,0,imageY,658,280,-33,-20,60,40);
            }
            break;
        case "right":
            ctx.drawImage(t,0,imageY,658,280,-33,-20-layout.rotateR,60,40);
            if (b){
                ctx.drawImage(images.bomb,0,imageY,658,280,-33,-20-layout.rotateR,60,40);
            }
            break;
        case "left":
            ctx.drawImage(t,0,imageY,658,280,-33,-20+layout.rotateR,60,40);
            if (b){
                ctx.drawImage(images.bomb,0,imageY,658,280,-33,-20+layout.rotateR,60,40);
            }
            break;
    }
    ctx.restore();
}

function drawJoint(j){
    let rw = layout.railwayW;           //railway Width
    let curveR = layout.curveR;         //joint & curve radius
    ctx.save();
    ctx.lineWidth = 3;
    ctx.translate(j.x,j.y);
    ctx.beginPath();
    ctx.arc(0,0,curveR,0,2*Math.PI);
    if (j.notJoint){
        if (level==1){
            ctx.fillStyle="burlyWood";
        } else if (level==2){
            ctx.fillStyle="darkgray";
        }
        
        ctx.fill();
    } else {
        ctx.fillStyle="olive";
        ctx.fill();
        ctx.stroke();
    }
    ctx.rotate(j.angle*Math.PI/180);
    switch(j.dir){
        case "straight":
            ctx.beginPath();
            ctx.moveTo(-curveR,-rw/2);
            ctx.lineTo(curveR,-rw/2);
            ctx.moveTo(-curveR,rw/2);
            ctx.lineTo(curveR,rw/2);
            ctx.stroke();
            break;
        case "right":
            ctx.beginPath();
            ctx.arc(-curveR,curveR,curveR-rw/2,3*Math.PI/2,0);
            ctx.stroke();
            ctx.beginPath();
            ctx.arc(-curveR,curveR,curveR+rw/2,3*Math.PI/2,0);
            ctx.stroke();
            break;
        case "left":
            ctx.beginPath();
            ctx.arc(-curveR,-curveR,curveR-rw/2,0,Math.PI/2);
            ctx.stroke();
            ctx.beginPath();
            ctx.arc(-curveR,-curveR,curveR+rw/2,0,Math.PI/2);
            ctx.stroke();
            break;
    }
    ctx.restore();
}

function drawBackgroundLvl1Base() {
    //background
    ctx.fillStyle="burlyWood";
    ctx.fillRect(0,0,800,600);

    //railways
    let rw = layout.railwayW;        //Width
    ctx.save();
    ctx.lineWidth=3;
    ctx.strokeRect(100,75-rw/2,350,rw);     //A
    ctx.strokeRect(450-rw/2,75,rw,300);     //B
    ctx.strokeRect(450,200-rw/2,150,rw);    //C
    ctx.strokeRect(450,375-rw/2,200,rw);    //D
    ctx.strokeRect(550-rw/2,375,rw,75);     //E
    ctx.strokeRect(450,300-rw/2,-150,rw);   //F
    ctx.strokeRect(300-rw/2,300,rw,225);    //G
    ctx.strokeRect(300,525-rw/2,100,rw);    //H
    ctx.strokeRect(300,450-rw/2,-100,rw);   //I

    drawJoint({x:450,y:75,dir:"right",angle:0,notJoint:true});       //AB
    drawJoint({x:450,y:375,dir:"left",angle:90,notJoint:true});      //BD
    drawJoint({x:300,y:300,dir:"left",angle:180,notJoint:true});     //FG
    drawJoint({x:300,y:525,dir:"left",angle:90,notJoint:true});      //GH

    ctx.restore();
}

function drawBackgroundLvl2Base() {
    //background
    ctx.fillStyle="darkgray";
    ctx.fillRect(0,0,800,600);

    //railways
    let rw = layout.railwayW;        //Width
    ctx.save();
    ctx.lineWidth=3;
    ctx.strokeRect(100,500-rw/2,450,rw);     //A
    ctx.strokeRect(550-rw/2,500,rw,-200);    //B
    ctx.strokeRect(550,375-rw/2,-425,rw);    //C
    ctx.strokeRect(550,300-rw/2,100,rw);     //D
    ctx.strokeRect(650-rw/2,300,rw,-150);    //E
    ctx.strokeRect(650,150-rw/2,-425,rw);    //F
    ctx.strokeRect(125-rw/2,375,rw,-75);     //G
    ctx.strokeRect(325-rw/2,375,rw,-75);     //H
    ctx.strokeRect(225-rw/2,150,rw,75);      //I
    ctx.strokeRect(425-rw/2,150,rw,75);      //J
    ctx.strokeRect(590-rw/2,150,rw,-75);     //K

    drawJoint({x:550,y:500,dir:"left",angle:0,notJoint:true});       //AB
    drawJoint({x:550,y:300,dir:"right",angle:270,notJoint:true});    //BD
    drawJoint({x:650,y:300,dir:"left",angle:0,notJoint:true});       //DE
    drawJoint({x:650,y:150,dir:"left",angle:270,notJoint:true});     //EF
    drawJoint({x:225,y:150,dir:"left",angle:180,notJoint:true});     //FI
    drawJoint({x:125,y:375,dir:"right",angle:180,notJoint:true});    //CG

    ctx.restore();
}

function drawBackgroundLvl1Surface(){
    //tunnel
    ctx.drawImage(images.tunnel,-45,38,105,60);
    ctx.drawImage(images.tunnel,30,38,105,60);

    //houses
    drawHouse(600,200,"sienna");
    drawHouse(650,375,"crimson");
    drawHouse(200,450,"dimGray");
    drawHouse(400,525,"aqua");
    drawHouse(550,450,"gold");
}

function drawBackgroundLvl2Surface(){
    //tunnel
    ctx.drawImage(images.tunnel,-45,465,105,60);
    ctx.drawImage(images.tunnel,30,465,105,60);

    //houses
    drawHouse(225,225,"sienna");
    drawHouse(590,75,"crimson");
    drawHouse(125,300,"dimGray");
    drawHouse(425,225,"aqua");
    drawHouse(325,300,"gold");
}

function drawTunnelEnterance(x,y) {
    ctx.save();
    ctx.translate(x,y);
    ctx.fillStyle="saddleBrown";
    ctx.fillRect(-50,-25,100,50);
    ctx.strokeRect(-50,-25,100,50);
    ctx.restore();
}

function drawHouse(x,y,colour){
    ctx.save();
    ctx.translate(x-5,y-10);
    ctx.fillStyle = colour;
    ctx.beginPath();
    ctx.moveTo(-25,-25);    //A
    ctx.lineTo(35,-25);     //B
    ctx.lineTo(35,-5);      //C
    ctx.lineTo(25,40);      //D
    ctx.lineTo(-35,40);     //E
    ctx.lineTo(-35,20);     //F
    ctx.lineTo(-25,-25);    //A
    ctx.fill();
    ctx.moveTo(-35,20);     //F
    ctx.lineTo(25,20);      //G
    ctx.lineTo(35,-25);     //B
    ctx.moveTo(25,20);      //G
    ctx.lineTo(25,40);      //D
    ctx.stroke();

    let i;
    switch (colour){
        case "sienna":
        i = images.wood;
        break;
        case "crimson":
        i = images.wine;
        break;
        case "dimGray":
        i = images.oil;
        break;
        case "aqua":
        i = images.diamond;
        break;
        case "gold":
        i = images.gold;
        break;
    }
    ctx.drawImage(i,-22,-22,45,40);
    ctx.restore();
}