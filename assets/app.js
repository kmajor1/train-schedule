// set Firebase config 
var config = {
    apiKey: "AIzaSyDkKRcvX2zVoxzwZHHFpiDPxh5s6JWiGx8",
    authDomain: "train-schedule-d207a.firebaseapp.com",
    databaseURL: "https://train-schedule-d207a.firebaseio.com",
    projectId: "train-schedule-d207a",
    storageBucket: "train-schedule-d207a.appspot.com",
    messagingSenderId: "608051141696"
};
// initialize firebase app 
firebase.initializeApp(config);

// load database object 
var database = firebase.database();
// load train schedule ref on train db 
var trainListRef = database.ref();
// object reference for pushing data to train list reference 
var addTrain = function (trainName, trainDest, trainFirstTime, trainFreq) {
    trainListRef.push({
        name: trainName,
        destination: trainDest,
        startTime: trainFirstTime,
        frequency: trainFreq
    })
}

// onclick event handler for "add train" button 

document.getElementById("submitNewTrain").onsubmit = function (event) {
    // store user input 
    var trainNameInput = document.getElementById("inputTrainName").value; 
    var trainDestInput = document.getElementById("inputTrainDestination").value; 
    var trainStartInput = document.getElementById("inputFirstTrainTime").value; 
    var trainFreqInput = document.getElementById("inputTrainFrequency").value;
    // call function to push to db 
    addTrain(trainNameInput, trainDestInput, trainStartInput, trainFreqInput);
}





// child_added handler
trainListRef.on('child_added', function (snapshot) {
    console.log(snapshot.val());
});


