// load weights first
Promise.all([
  faceapi.nets.tinyFaceDetector.loadFromUri('./weights'),
  faceapi.nets.faceLandmark68Net.loadFromUri('./weights'),
  faceapi.nets.faceRecognitionNet.loadFromUri('./weights'),
  faceapi.nets.faceExpressionNet.loadFromUri('./weights')
]).then(ready);

function ready() {
  // show ready content
  $('.section-loading').addClass('d-none');
  $('.section-ready').removeClass('d-none');

  // prepare canvas
  let canvas = $('#preview')[0];
  let ctx = canvas.getContext('2d');

  // load image source event
  let img_tmp = new Image();
  img_tmp.onload = async evt => {
    // draw image on canvas
    let img = evt.path[0];
    canvas.width = img.width;
    canvas.height = img.height;
    ctx.drawImage(img, 0, 0);

    // detect face from canvas
    let detections = await faceapi.detectSingleFace(canvas, new faceapi.TinyFaceDetectorOptions()).withFaceLandmarks().withFaceExpressions()
    //detections = faceapi.resizeResults(detections, { width: canvas.width, height: canvas.height })

    // paint detected result
    if (detections) {
      faceapi.draw.drawDetections(canvas, detections)
      faceapi.draw.drawFaceLandmarks(canvas, detections)
      faceapi.draw.drawFaceExpressions(canvas, detections)
    }
    else {
      alert('Cannot detect face');
    }
  };

  // browse file event
  $('#upload-img').change(evt => {
    let [ file ] = evt.target.files
    if (!file) return;
    img_tmp.src = URL.createObjectURL(file);
  });
}
