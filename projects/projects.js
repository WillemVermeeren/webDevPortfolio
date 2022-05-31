function fadeIn(){
    const fadeElements = document.getElementsByClassName("fadeOverlay")
    var fadeAmount = 1.5;
    const fadeIn = setInterval(function(){
        fadeAmount-=0.050
        for(var i=0; i<fadeElements.length;i++){
            fadeElements[i].style.opacity = fadeAmount
        }
        if(fadeAmount<=0){
            clearInterval(fadeIn)
            
        }
    },40)
}

function fadeOut(url){
    const fadeElements = document.getElementsByClassName("fadeOverlay")
    var fadeAmount = 0.5;
    const fadeIn = setInterval(function(){
        fadeAmount+=0.050
        for(var i=0; i<fadeElements.length;i++){
            fadeElements[i].style.opacity = fadeAmount
        }
        if(fadeAmount>=2){
            clearInterval(fadeIn)
            window.location.replace(url)
        }
    },40)
}

window.onload = () => {
    fadeIn()
    var bgPos = 0
    setInterval(function(){
        bgPos+=0.5
        document.body.style.backgroundPosition =  bgPos.toString()+"px, 0px" //moves background

    },50)
    setTimeout(function(){
        let escapeState = 0

        document.addEventListener("keyup", (key) => {

            if(key.key=="Escape"&&escapeState==0){
                escapeState = 1
                
                fadeOut("http://127.0.0.1:5500/main/main.html?x=1099&y=184")

            }
        })
    },1500)
    marioAnimation() 
    

    
}



function marioAnimation(){
    
    var mario = document.getElementById("mario")
    var marioPos = 100  //doe sentering animations
    enteringAnimation = setInterval(function(){

        marioPos-=0.2
        mario.style.bottom = marioPos.toString()+"%"
        if(marioPos<10){
            mario.style.bottom = "10%"  //sets the y position of the ballon 10% from the bottom
            clearInterval(enteringAnimation)

            var balloonNr = 0
            var balloonY = 10
            setInterval(function(){
                balloonNr+=0.025
                balloonY = Math.sin(-balloonNr)+10
                mario.style.bottom = balloonY.toString()+"%"
            },25)

        }
    },10)
}