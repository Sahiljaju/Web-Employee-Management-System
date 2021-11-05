// const video = document.getElementById('video')

// Promise.all([
//   faceapi.nets.tinyFaceDetector.loadFromUri('/models'),
//   faceapi.nets.faceLandmark68Net.loadFromUri('/models'),
//   faceapi.nets.faceRecognitionNet.loadFromUri('/models'),
//   faceapi.nets.ssdMobilenetv1.loadFromUri('/models')
// ]).then(startVideo)

// function startVideo() {
//   navigator.getUserMedia(
//     { video: {} },
//     stream => video.srcObject = stream,
//     err => console.error(err)
//   )
// }

// video.addEventListener('play', () => {
//   const canvas = faceapi.createCanvasFromMedia(video)
//   document.body.append(canvas)
//   const displaySize = { width: video.width, height: video.height }
//   faceapi.matchDimensions(canvas, displaySize)
//   setInterval(async () => {
//     const detections = await faceapi.detectAllFaces(video, new faceapi.TinyFaceDetectorOptions()).withFaceLandmarks()
//     const resizedDetections = faceapi.resizeResults(detections, displaySize)  
//     canvas.getContext('2d').clearRect(0, 0, canvas.width, canvas.height)
//     faceapi.draw.drawDetections(canvas, resizedDetections)
//     faceapi.draw.drawFaceLandmarks(canvas, resizedDetections)
    
//   }, 100)
// })

///hdhhdhdh
function addnew(employeeDetail) {
  var i;
  var x = document.getElementsByClassName("NewEmployee");
  for (i = 0; i < x.length; i++) {
    x[i].style.display = "none";
  }
  document.getElementById(employeeDetail).style.display = "block";
};

function leave(leave) {
  var i;
  var x = document.getElementsByClassName("ManageLeave");
  for (i = 0; i < x.length; i++) {
    x[i].style.display = "none";
  }
  document.getElementById(leave).style.display = "block";
};



//addSalary
// AddSalary = document.getElementById("addSalary")
// AddSalary.addEventListener("submit", (e) => {
//   e.preventDefault();
//   let data ={
//     SalaryType:document.getElementsByName("SalaryType").value,
//     Employee:document.getElementsByName("SelectEmployee").value,
//     Payment:document.getElementsByName("PaymentType").value,
//     Amount:document.getElementsByName("SalaryAmount").value,
//     Taxrate:document.getElementsByName("SalaryTaxRate").value,
//     Date:document.getElementsByName("SalaryDate").value,
//     Month:document.getElementsByName("SalaryMonth").value,
//     Year:document.getElementsByName("SalaryYear").value,
//     Note:document.getElementsByName("Note").value,
//   };

// axios
//   .post("http://localhost:3000/addSalary", data)
//   .then((res) => console.log(res));


// });