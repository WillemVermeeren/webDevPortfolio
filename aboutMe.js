//----------------the urls, change to your liking----------------------------
const mainUrl = "http://127.0.0.1:5500/main/main.html?x=1989&y=120"
//---------------------------------------------------------------------------


window.onbeforeunload = function () {
    window.scrollTo(0, 0);      //makes sure the page is on 0 0
}; 



class element{
    constructor({element, appearX, yHeight, yStart, appearAnimationSpeed, idleAnimationStrength, idleAnimationSpeed}){
        this.element = element //the element you want to add
        this.appearX = appearX //the x coord the appearanimation should start
        this.yHeight = yHeight //the height the element should be
        this.yCurrent = yStart //sets the current Y coord
        this.yStart = yStart   //the y coordinate on start

        this.appearAnimationSpeed = appearAnimationSpeed //the 
        this.appearInterval = -1

        this.idleAnimationStrength = idleAnimationStrength //how high and low the idle animation should swing
        this.idleAnimationSpeed = idleAnimationSpeed       //how fast the idle animation should swing

    }
    startIdleAnimation(){   //sets the idle animation
        this.animSinPos = 0

        setInterval(function(){
            this.animSinPos+=this.idleAnimationSpeed

            this.yCurrent = Math.sin(this.animSinPos)*this.idleAnimationStrength+this.yHeight

            this.element.style.bottom = this.yCurrent.toString()+"rem"
        }.bind(this), 40)
    }

    appearAnimation(){  // does the appear animation
        if(this.yStart==this.yCurrent&&this.appearInterval==-1){

            this.entSinPos = 0
            this.appearInterval = setInterval(function(){

                this.entSinPos+=this.appearAnimationSpeed

                this.yCurrent = Math.sin(this.entSinPos)*(this.yHeight-this.yStart)+this.yStart

                this.element.style.bottom = this.yCurrent.toString()+"rem"

                if(this.entSinPos>=Math.PI/2){
                    this.element.style.bottom = this.yHeight.toString()+"rem"

                    this.startIdleAnimation()

                    clearInterval(this.appearInterval)
                    
                }
            }.bind(this), 40)
        }
    }

    checkAppear(){  //checks if the element should appear or not
        if(document.body.parentNode.scrollLeft>=this.appearX){
            this.appearAnimation()
        }
    }
}

var octopus = new element({appearX:1000, element:document.getElementById("octopus"), appearAnimationSpeed:0.1, yStart:-25, yHeight:0, idleAnimationStrength: 2, idleAnimationSpeed: 0.05})
var bird1 = new element({appearX:3500, element:document.getElementById("bird1"), appearAnimationSpeed:0.05, yStart:-5, yHeight:25, idleAnimationStrength: 2, idleAnimationSpeed: 0.05})


window.onload = () => {
    
    const fadeElements = document.getElementsByClassName("fadeOverlay") //gets rectangle that covers the screen for the fade-in/-out animation
    var fadeAmount = 1.5;   //set the starting variable for the opacity (its a litle larger then 1 so it stays dark a litle longer)
    const fadeIn = setInterval(function(){  // fadin animation
        fadeAmount-=0.050
        for(var i=0; i<fadeElements.length;i++){
            fadeElements[i].style.opacity = fadeAmount
        }
        if(fadeAmount<=0){
            clearInterval(fadeIn)
        }
    },40)

    var bgPos = 0
    setInterval(function(){ // does cloud animation
        bgPos+=0.25
        document.body.style.backgroundPosition =  bgPos.toString()+"px, 0px"

    },50)

    var wavePos = 0
    const wave = document.getElementById("sea") // does sea animation
    setInterval(function(){
        wavePos-=0.75
        wave.style.backgroundPosition =  wavePos.toString()+"px, 0px"


    },50)


    var boatPos = 0
    var boatY = 0
    const boat = document.getElementById("boat")    //does boat animation
    setInterval(function(){
        boatPos+=0.05
        boatY = Math.sin(boatPos)


        boat.style.transform = "rotate("+(-boatY*2).toString()+"deg)"
        boat.style.bottom = (boatY-1).toString()+"rem"
    },50)



    setTimeout(function(){ //set timeout so you can't imidiatly press escape when entering to prevent screen flickering

        state = "idle" //this variable is to prevent the escape key being pressed multiple times and causing screen flickering
        document.addEventListener("keyup", (key) => {
            
            if(key.key=="Escape"&&state=="idle"){      // triggers when the user wants to exit
                state="exiting"
                const fadeElements = document.getElementsByClassName("fadeOverlay")
                var fadeAmount = 0; //set opacity variable to 0
                const fadeIn = setInterval(function(){  // fadeout animation
                    fadeAmount+=0.050   
                    for(var i=0; i<fadeElements.length;i++){
                        fadeElements[i].style.opacity = fadeAmount
                    }
                    if(fadeAmount>=1.5){
                        clearInterval(fadeIn)
                        window.location.replace(mainUrl)
                    }
                },40)
            }
        })

    },1500)

    
    

}


function update(){
    //console.log(document.body.parentNode.scrollTop)    // I just leave this here for when I get that bug again when the page loads under the water
    
    octopus.checkAppear()
    bird1.checkAppear()

}


// -----------------scrolling actions thingy's---------


document.addEventListener("wheel", (evt) => {
    update()
    window.scrollBy(-evt.deltaY/2, 0) //wheel scrolling and updating
});

document.addEventListener("keydown", (evt) =>{
    update()
    if(evt.key=="ArrowRight"){
        window.scrollBy({
            left:100,       // arrow scrolling and updating
            behavior:"smooth"
        })

    }else if(evt.key=="ArrowLeft"){
        window.scrollBy({
            left:-100,
            behavior:"smooth"
        })

    }
    console.log(evt)
})

