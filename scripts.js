const video = document.querySelector('.player');
const canvas = document.querySelector('.photo');
const ctx = canvas.getContext('2d');
const strip = document.querySelector('.strip');
const snap = document.querySelector('.snap');


(function getVideo(){
    navigator.mediaDevices.getUserMedia({video: true, audio: false})
        .then(localMediastream => {
            video.src = window.URL.createObjectURL(localMediastream);
            video.play();
        })
        .catch(err =>{
            console.error(`oh no!!!`, err);
            })
})()

function paintToCanvas(){
    const width = video.videoWidth;
    const height = video.videoHeight;
    canvas.width = width;
    canvas.height = height;

    return setInterval(()=> {
        ctx.drawImage(video, 0, 0, width, height);

        //take the pixels out
        let pixels = ctx.getImageData(0, 0, width, height);
        //mess with the pixels
        // pixels = redEffect(pixels);

        pixels = rgbSplit(pixels);
        ctx.globalAlpha = 0.1;

        // pixels = greenScreen(pixels);
        //put them back
        ctx.putImageData(pixels, 0, 0);
     }, 16); 
}


function takePhoto(){
    // played the sound
    snap.currentTime = 0;
    snap.play();
    
    //take data out of the canvas
    const data = canvas.toDataURL('image.jpeg'); //base64 data
    const link = document.createElement('a');
    link.href = data;
    link.setAttribute('download', 'handsome');
    link.innerHTML = `<img src="${data}" alt="handsome">`;
    strip.insertBefore(link, strip.firstChild); 
}

function redEffect(pixels){
    for(let i = 0; i < pixels.data.length; i+=4){
        pixels[i + 0] = pixels.data[i + 0] - 100; //red
        pixels[i + 2] = pixels.data[i + 2] - 50;//green
        pixels[i + 3] = pixels.data[i + 3] * 0.5; //blue
    }
    return pixels;
}

function rgbSplit(pixels){
    for(let i = 0; i < pixels.data.length; i+=4){
        pixels[i - 150] = pixels.data[i + 0]; //red
        pixels[i + 200] = pixels.data[i + 2];//green
        pixels[i - 100] = pixels.data[i + 3]; //blue
    }
    return pixels;  
}

function greeScreen(pixels){
    const levels = {};

  document.querySelectorAll('.rgb input').forEach((input) => {
    levels[input.name] = input.value;
  });

  for (i = 0; i < pixels.data.length; i = i + 4) {
    red = pixels.data[i + 0];
    green = pixels.data[i + 1];
    blue = pixels.data[i + 2];
    alpha = pixels.data[i + 3];

    if (red >= levels.rmin
      && green >= levels.gmin
      && blue >= levels.bmin
      && red <= levels.rmax
      && green <= levels.gmax
      && blue <= levels.bmax) {
      // take it out!
      pixels.data[i + 3] = 0;
    }
  }

  return pixels;
}

video.addEventListener('canplay', paintToCanvas);