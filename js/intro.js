/**
 * Intro - Ninja cat designed by 
 */
function intro() {

    let splash = document.getElementById("splash");
    let intro = document.getElementById("intro");
    let startButton = document.getElementById("start");

    logoAnim();
    movingCat()

    // Hide splash when start is clicked
    startButton.addEventListener("click", function() {

        // Fade out the splash element
        [logo, splash].forEach(function(elem) {
            intro.style.transition = "opacity 0.8s ease";
            intro.style.opacity = "0";
        });
        
        // Start the game after fade out
        setTimeout(function() {
            splash.style.display = "none"; 
        }, 600); 
    });
};

function logoAnim(){
    const elem = document.getElementById("logo");   
    let pos = 0;
    const speed = 3; // animation speed
    const maxPos = 140;

    function frame() {
        if (pos >= maxPos) {
            clearInterval(id);
        } else {
            pos += speed; 
            elem.style.top = pos + "px"; 
        }
    }

    //animate
    const id = setInterval(frame, 10); 
};

function movingCat(){
    const elem = document.getElementById("cat");   
    let pos = 40;
    const speed = 3; // animation speed
    const maxPos = 330;

    function frame() {
        if (pos >= maxPos) {
            clearInterval(id);
        } else {
            pos += speed; 
            elem.style.left = pos + "px"; 
        }
    }

    //animate
    const id = setInterval(frame, 10); 

};