let previousT = 0, currentT;
let previousPositionX = 0, positionX;
let previousVelocityX = 0, velocityX;
let accelerationX;
let accelerationx;
let isActive = false;
//var button = document.getElementById('switch');
const textInput = document.getElementById('textfield');
let textValue = "";
//var slider1 = document.getElementById('slider1');
//var slider2 = document.getElementById('slider2');
//var slider3 = document.getElementById('slider3');
//var slider4 = document.getElementById('slider4');
let dozeCount = 0;

function activateEmission(event) {
    if (isActive) {
        isActive = false;
    } else {
        isActive = true;
    }
    //console.log(event.timeStamp);
}

function emitText(event){
    //textValue = textInput.value;
    //dozeCount += (textValue.match(/doze/g)||[]).length; 
    socket.emit('letterCount', textInput.value.length);
    socket.emit('textInput', textInput.value);
    textInput.value = '';
    
    
    
}
//______________________________________________________________________________________________

function calculatePosition(event) {
    accelerationX = event.acceleration.x;
    let deltaT = (event.interval / 1000);
    
    velocityX = (previousVelocityX + (accelerationX * deltaT));
    positionX = previousPositionX + (velocityX * deltaT);

    previousVelocityX = velocityX;
    //return positionX;
}

function main() {
    window.addEventListener('devicemotion', (event) => {
        if (isActive) {
            if (event.acceleration.x != 0){
            calculatePosition(event);
            } else {
            velocityX = 0;
            }
            socket.emit('accelerationData', positionX*100);
            //button.style.backgroundColor = "#ffffff";
        } //else { button.style.backgroundColor = "";}
        console.log('started sending data');
    });
    
}

function main2() {
    
    textInput.addEventListener('change', emitText);
    

    
}

main2();


