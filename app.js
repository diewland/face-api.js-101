// load weights first
Promise.all([
  faceapi.nets.tinyFaceDetector.loadFromUri('./weights'),
  faceapi.nets.faceLandmark68Net.loadFromUri('./weights'),
  //faceapi.nets.faceRecognitionNet.loadFromUri('./weights'),
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
  let img = new Image();
  img.onload = async _ => {

    // set canvas dimension
    let reduce_size = 8; // resize image
    let w = img.width / reduce_size;
    let h = img.height / reduce_size;
    const displaySize = { width: w, height: h }
    faceapi.matchDimensions(canvas, displaySize) // canvas.width = w; canvas.height = h

    // draw image on canvas
    ctx.drawImage(img, 0, 0, w, h);

    // detect face from canvas
    let detections = await faceapi.detectSingleFace(canvas, new faceapi.TinyFaceDetectorOptions())
                                  .withFaceLandmarks()
                                  .withFaceExpressions()
    // detections = faceapi.resizeResults(detections, displaySize)

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
    img.src = URL.createObjectURL(file);
  });
}
