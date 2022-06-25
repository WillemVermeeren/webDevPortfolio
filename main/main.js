// TODO
// -clean code

//----------------the urls, change to your liking----------------------------
const projectsUrl = "http://127.0.0.1:5500/projects/projects.html"
const aboutMeUrl = "http://127.0.0.1:5500/aboutMe/aboutMe.html"
//---------------------------------------------------------------------------

//------------misc stuff for startup------------------





const fps = 30 // frames/s (effects: movements speed)
const floorHeigth = 512 // the height from the bottom of the image to the mainfloor 
const marioHeadClearance = 16 //when mario jumps he gets a little smaller and to get good Y collision when he jumps we have to account to that so he doesn't bounch from air but the obstacle above

var movDis = 15 //distance the players moves every frame
var gravity = 5 //how the downwards acceleration
var jumpForce = 60 //how trons mario jumps

var joinX = 0
var joinY = 0
var startingCoords;

function getUrlParams(){
    const queryString = window.location.search;

    const urlParams = new URLSearchParams(queryString);
    joinX = parseInt(urlParams.get('x'))
    joinY = parseInt(urlParams.get('y'))

    if(isNaN(joinX)){
        joinX=c.width/2
    }
    if(isNaN(joinY)){
        joinY=0

    }
    startingCoords = {"x":joinX, "y":joinY}
}

function fadeIn(){ //the fade in animation of the page
    const fadeElements = document.getElementsByClassName("fade")

    var fadeAmount = -0.5; //set the opacity variable to -0.5 so it stays dark a litle longer
    const fadeIn = setInterval(function(){
        fadeAmount+=0.050   // increases the opacity every cycle
        for(var i=0; i<fadeElements.length;i++){
            fadeElements[i].style.opacity = fadeAmount //set the opacity
        }
        if(fadeAmount>=1){
            clearInterval(fadeIn)   //ends the loop when fully visible
            
        }
    },40)
}

function fadeOut(url){  // the fade out animation of the page
    const fadeElements = document.getElementsByClassName("fade")    

    var fadeAmount = 1; //set the opacity variable to 1
    const fadeIn = setInterval(function(){
        fadeAmount-=0.050   //decreases the opacity variable
        for(var i=0; i<fadeElements.length;i++){
            fadeElements[i].style.opacity = fadeAmount //set the opacity
        }
        if(fadeAmount<=-0.5){   // ends the loop when to opacity variable is negative 0.5 so it stays dark a little longer
            clearInterval(fadeIn)
            window.location.replace(url)
        }
    },40)
}

window.onload = () =>{ //starts when page loaded
    

    fadeIn()

    c = document.querySelectorAll("#mario")[0]; 
    ctx = c.getContext('2d');    //sets up mario

    c.height = window.innerHeight;
    c.width = window.innerWidth;   //resizes the cancas to prevent squished images by doing it with css

    main()
}


//----------------classes------------------------
function newImage({src}){  // let's you create an image with src in 1 line (look 44:22)
    const image = new Image();
    image.src = src;
    return image;

}

class player{
    

    constructor({position, size, offset, minHeight, coords}){
        this.position = position;   // position of mario on the canvas
        
        this.size = size            // the width and height of mario
        this.coords = coords    //the coords of mario relative to the left bottom corner of the map on the mainFloor
        this.state = "idle"         // the sprite state, can be "idle", "runningL", "runningR" and so on
        this.offset = offset        // the offset so the Y=0 coord is centerd on 168 pixels from the bottom
        this.minHeight = minHeight
        
        this.onPipe = {"state": false, "url":"-"}
        this.momentum = 0;  // the Y momentum of mario this is 0 when starting

        this.sprites = {    //creates the sprites
            "left":[
                newImage({src:"assets/mario/left/walk1.png"}),
                newImage({src:"assets/mario/left/walk2.png"}),
                newImage({src:"assets/mario/left/walk3.png"}),
                newImage({src:"assets/mario/left/walk2.png"}),
            ],
            "right":[
                newImage({src:"assets/mario/right/walk1.png"}),
                newImage({src:"assets/mario/right/walk2.png"}),
                newImage({src:"assets/mario/right/walk3.png"}),
                newImage({src:"assets/mario/right/walk2.png"}),

            ],
            "idle":newImage({src:"assets/mario/idle.png"}),
            "jump":{
                "left":newImage({src:"assets/mario/jump/left.png"}),
                "right":newImage({src:"assets/mario/jump/right.png"}),
            }
            
        }
        
        this.spriteNr = 0   //the current sprite in a running animation
    }

    draw() {   // calculates and draws the sprites and there states
        switch (this.state) {
            case "runningR":
                    this.spriteNr+=0.5
                    if(this.spriteNr>=3) this.spriteNr=0
                    ctx.drawImage(this.sprites.right[Math.floor(this.spriteNr)], this.position.x, -this.position.y+this.offset.y, this.size, this. size); //cycles between runnunr right frames
                break;

            case "runningL":
                    this.spriteNr+=0.5
                    if(this.spriteNr>=3) this.spriteNr=0
                    ctx.drawImage(this.sprites.left[Math.floor(this.spriteNr)], this.position.x, -this.position.y+this.offset.y, this.size, this. size);//cycles between runnunr left frames
                break;

            case "idle":
                ctx.drawImage(this.sprites.idle, this.position.x, -this.position.y+this.offset.y, this.size, this. size);    //idle frame
                break;

            case "jumpL":
                
                ctx.drawImage(this.sprites.jump.left, this.position.x, -this.position.y+this.offset.y, this.size, this. size);   //displays the right jumping frame
                break;
            case "jumpR":
                ctx.drawImage(this.sprites.jump.right, this.position.x, -this.position.y+this.offset.y, this.size, this. size);


                break;

            default:
                break;
        }
        
    }

    colY1(){ //checks if mario is on ground
        var colY = 0
        for(var i=0;i<bg.collision.length;i++){ // goes trough all the obstacles with collision
            if((this.coords.x<bg.collision[i].x2)&&(this.coords.x + this.size > bg.collision[i].x1)){   // checks if it's in the between the 2 x coords

                if(this.coords.y>=bg.collision[i].y1&&bg.collision[i].y1>colY){
                    
                    colY = bg.collision[i].y1
                }

                if((this.coords.y==bg.collision[i].y1)&&(bg.collision[i].type=="pipe")&&(this.coords.x+this.size-40<bg.collision[i].x2)&&(this.coords.x+40> bg.collision[i].x1)){

                    mario.onPipe.state=true
                    mario.onPipe.url=bg.collision[i].adress

                }else{

                    mario.onPipe.state=false
                }
            }
                
        }
        
        return colY
        
    }

    colY2(){ //checks if mario is going to headbang something
        var colY = 1000000
        for(var i=0;i<bg.collision.length;i++){ // goes trough all the obstacles with collision
            if((this.coords.x<bg.collision[i].x2)&&(this.coords.x + this.size > bg.collision[i].x1)){   // checks if it's in the between the 2 x coords

                if(this.coords.y+this.size<=bg.collision[i].y1&&bg.collision[i].y2<colY){
                    colY = bg.collision[i].y2

                }
            }
                
        }
        return colY
        
    }

    applyG(GF){ //if not onground then applys gravity till it is onground
        var colHeight1 = this.colY1()
        var colHeight2 = this.colY2()
        var yMovement = 0
        if(colHeight1==this.coords.y){ // if mario is gonna headbang somthing it sets momentum to 0
            
            
        }else{
            var yDiff = this.coords.y - colHeight1
            if(this.state=="runningL"){
                this.state = "jumpL"
            }else{
                this.state = "jumpR"
            }
            
            
            this.momentum-=GF

            if((colHeight2-this.coords.y-this.size+marioHeadClearance)<this.momentum&&this.momentum>0){ // makes sure you cant jump thru obstacles by settin momentum 0 if your gonna hit it

                this.momentum = (colHeight2-this.coords.y-this.size+marioHeadClearance)
            }

            
            if(this.momentum<-yDiff){   // makes sure you don't fall to far and through thin obstacles by getting the distance of the nearest obstacle under Mario
                this.momentum=0
                yMovement = -yDiff  

            }else{
                yMovement = this.momentum
            }

            if(((-this.position.y+this.offset.y-100)<0 && this.momentum>0)||((-this.position.y+this.offset.y+this.size+150)>c.height&&this.momentum<0)){
                bg.position.y+=yMovement
                this.coords.y+=yMovement
            }else{
                
                this.position.y+=yMovement
                this.coords.y+=yMovement
            }

            if(this.minHeight>bg.position.y){
                this.position.y+=bg.position.y-this.minHeight
                bg.position.y-=bg.position.y-this.minHeight
            }
 
        }
    }

    jump(jumpF){    // lets mario jump

        this.momentum = jumpF
        this.coords.y+=1
        this.position.y+=1
    }

    disGo(dir){ //checks if mario is able to go there
        var closestDis = 1000

        for(var i=0;i<bg.collision.length;i++){ // goes trough all the obstacles with collision
            if((this.coords.y<bg.collision[i].y1)&&(this.coords.y+this.size>bg.collision[i].y2)){
                if((closestDis>(this.coords.x-bg.collision[i].x2))&&(0<=(this.coords.x-bg.collision[i].x2))&&(dir=="left")){  //checks if shorter distance
                    closestDis=(this.coords.x-bg.collision[i].x2)   // makes new shortest distance

                }else if((closestDis>(bg.collision[i].x1-this.coords.x-this.size))&&(0<=(bg.collision[i].x1-this.coords.x-this.size))&&(dir=="right")){ //same thing but if you're going right
                    closestDis=(bg.collision[i].x1-this.coords.x-this.size)

                }
            }
        }
        if((closestDis>this.coords.x)&&(dir=="left")){
            
            closestDis=this.coords.x

        }else if((closestDis>(bg.bgImage.width*bg.scale-this.coords.x-this.size))&&(dir=="right")){
            closestDis=(bg.bgImage.width*bg.scale-this.coords.x-this.size)
        }

        
        return closestDis
    }

}

class backGround{   // background data
    constructor({position, backGround, scale, offset, pipeImg}){
        this.position = position //sets the position
        this.scale = scale  //sets the scale of the baground this doesn't get changed normally
        this.offset = offset //sets the offset the image is drawn (this is to accomidate to smaller / larger screens)

        //creates background image
        this.bgImage = newImage({src: backGround})
        this.pipeImg = newImage({src: pipeImg})
        this.enterImage = newImage({src: "assets/pressToEnter.png"})        

        this.collision = [  //the collision boxes of elements with one being left up and 2 right bottom
            {
                "x1": 1088,  
                "x2": 1216,  
                "y1":184  ,
                "y2":0,
                "type": "pipe", 
                "adress": projectsUrl
            },
            {
                "x1": 1999,  
                "x2": 2112,  
                "y1":120  ,
                "y2":0,
                "type": "pipe", 
                "adress": aboutMeUrl
            },
            
            {
                "x1": 2113,  
                "x2": 2369,  
                "y1":64  ,
                "y2":0,
                "type": "brick", 
            },
            {
                "x1": 1280,  
                "x2": 1536,  
                "y1":474  ,
                "y2":410,
                "type": "brick", 
            },
            {
                "x1": 1697,  
                "x2": 1825,  
                "y1":282  ,
                "y2":218,
                "type": "brick", 
            },


            {   
                "x1":1632,
                "x2": 1887,  
                "y1": 705, 
                "y2":641,
                "type": "brick", 
            },
            {
                "x1": 1476,  
                "x2": 1540,  
                "y1": 916,
                "y2": 852,
                "type": "brick", 
            },
            {
                "x1": 1262,  
                "x2": 1326,  
                "y1":1098  ,
                "y2":1034,
                "type": "brick", 
            },
            {
                "x1": 1023,  
                "x2": 1087,  
                "y1":1263  ,
                "y2":1199,
                "type": "brick", 
            },
            {
                "x1": 948,  
                "x2": 1012,  
                "y1":1439  ,
                "y2":1375,
                "type": "brick", 
            },
            {
                "x1": 862,  
                "x2": 926,  
                "y1":1627  ,
                "y2":1563,
                "type": "brick", 
            },
            {
                "x1": 1029,  
                "x2": 1093,  
                "y1":1828  ,
                "y2":1764,
                "type": "brick", 
            },
            {
                "x1": 1231,  
                "x2": 1295,  
                "y1":2007  ,
                "y2":1943,
                "type": "brick", 
            },
            {
                "x1": 1515,  
                "x2": 1579,  
                "y1":2108  ,
                "y2":2044,
                "type": "brick", 
            },
            {
                "x1": 1712,  
                "x2": 1776,  
                "y1":2244  ,
                "y2":2180,
                "type": "brick", 
            },
        ]
    }

    drawBack(){
        ctx.drawImage(this.bgImage, this.position.x, this.position.y+this.offset.y-this.bgImage.height, this.bgImage.width*this.scale, this.bgImage.height*this.scale);
    }
    drawPipes(){

        ctx.drawImage(this.pipeImg, this.position.x, this.position.y+this.offset.y-this.bgImage.height, this.pipeImg.width*this.scale, this.pipeImg.height*this.scale);
    }
    drawInstructions(){
        if(mario.onPipe.state){
            ctx.drawImage(this.enterImage, (c.width-this.enterImage.width*this.scale)/2, 50, this.enterImage.width, this.enterImage.height)
        }
    }
    

}



//----------------------main function-------------------------

function main(){

    getUrlParams() // gets the x and y coordinates on joining
    
    var Offset = {"y":0}


    mario = new player({position:{"x":c.width/2, "y":0}, size:100, offset: Offset, minHeight: -100, coords:startingCoords})  //create the player
    bg = new backGround({position:{"x":-joinX+c.width/2, "y":floorHeigth+mario.size+joinY}, backGround:"assets/world/main.png", pipeImg:"assets/world/pipes.png", scale:1, offset: Offset}) //create the background


    

    function draw(){
        resizeC() //makes sure everything fits the screen
        ctx.fillStyle = '#5c94fc';  
        ctx.fillRect(0, 0, c.width, c.height);  //draws background and lightblue square so there aren't any whitespots on the canvas if the programm fails
        mario.applyG(gravity)   //calculates next y position with gravity

        bg.drawBack() //draws the elements on the screen
        mario.draw()
        bg.drawPipes()
        bg.drawInstructions()
    }



    function resizeC(){


        c.height = window.innerHeight; //resizes canvas because with css if deformes the image
        c.width = window.innerWidth;
        Offset.y = c.height-168

        
        if(bg.position.x+bg.bgImage.width<c.width){
            mario.position.x+=(c.width-(bg.position.x+bg.bgImage.width))
            bg.position.x+=(c.width-(bg.position.x+bg.bgImage.width)) //moves background and mario so there aren't any blanc spots when resizing


        }else if(mario.position.x>c.width){
            bg.position.x-=(mario.position.x-c.width+mario.size)    //moves background and mario so they are visible in the canvas
            mario.position.x-=(mario.position.x-c.width+mario.size)
        }
    }


    var keys = {}


    window.addEventListener('keydown', (i) => keys[i.key]=true)
    window.addEventListener('keyup', (i) => keys[i.key]=false)  //updates keys pressed



    
    // ---------------main loop-------------
    var mainloop = setInterval(function(){ //  updates the game in 1000/fps miliseconds

        if(keys["ArrowUp"]==true&&(mario.colY1()==mario.coords.y)){  //jumps

            mario.jump(jumpForce) 
            
        }

        if(keys["ArrowDown"]==true&&mario.onPipe.state==true){
            clearInterval(mainloop)
            var pipeY = mario.position.y
            var pipeInteval = setInterval(function(){
                mario.position.y-=5
                draw()
                if(pipeY==mario.position.y+mario.size){
                    clearInterval(pipeInteval)
                    fadeOut(mario.onPipe.url)
                    
                }
            },1000/fps)
            
        }

        if(keys["ArrowLeft"]==true){  //move left
            mario.state = "runningL"    // sets state for sprite animations
            distance = mario.disGo("left")

            if(distance<movDis){    //makes it so you can go right besides the obstacles and not inside
                moveableDis = distance
            }else{
                moveableDis = movDis
            }
            if(distance>0){ // added this in the if statement instead of in the if statements condition to prevent mario from turning at lightspeed

            

                if(mario.position.x>400){ //checks if the mario sprite is suposed to move of he is more than 400 away from the left screen border

                    mario.position.x-=moveableDis    
                    mario.coords.x-=moveableDis

                }else if(bg.position.x+moveableDis<0){   //if uitside the mario move square it moves the background

                    bg.position.x+=moveableDis
                    mario.coords.x-=moveableDis
                }else{
                    mario.position.x-=moveableDis       // it finally moves mario when teh camera can't anymore
                    mario.coords.x-=moveableDis

                }
            }

        }else if((keys["ArrowRight"]==true)){ //move right
            mario.state = "runningR"
            distance = mario.disGo("right")
            if(distance<movDis){    //makes it so you can go right besides the obstacles and not inside
                moveableDis = distance
            }else{
                moveableDis = movDis
            }

            if(distance>0){ // added this in the if statement instead of in the if statements condition to prevent mario from turning at lightspeed
            
            

                if(mario.position.x<c.width-400-mario.size){ //checks if the mario sprite is suposed to move of he is more than 400 away from the right screen border (calculates in the 100 pixel)
                    mario.position.x+=moveableDis
                    mario.coords.x+=moveableDis
                }else if(bg.bgImage.width+bg.position.x-moveableDis>c.width){  // checks if the backgroun can move without revealing any blanc spaces
                    mario.coords.x+=moveableDis
                    bg.position.x-=moveableDis   //if uitside the mario move square it moves the background
                }else{
                    mario.position.x+=moveableDis    // it finally moves mario when teh camera can't anymore
                    mario.coords.x+=moveableDis
                }
            }
            
        }else{
            mario.state = "idle"
        }
        draw()


        
    }, 1000/fps)
}
