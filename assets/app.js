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

// global train time variable 
var trainTimeStamp;

// load database object 
var database = firebase.database();
// load train schedule ref on train db 
var trainListRef = database.ref();
// function for pushing data to train list reference 
var addTrain = function (trainName, trainDest, trainFirstTime, trainFreq, unixStartTime) {
    console.log("values passed were: ");
    console.log(trainName + " " + trainDest + " "+ trainFirstTime + " " + trainFreq + " " + unixStartTime); 
    trainListRef.push({
        name: trainName,
        destination: trainDest,
        frequency: trainFreq,
        startTime: trainFirstTime,
        startTimeStamp: unixStartTime
    })
}

// functions for calculating the next train time and minutes until arrival 
var nextArrival = function () {

}

// onclick event handler for "add train" button 

document.getElementById("submitNewTrain").onsubmit = function (event) {
    // store user input 
    var trainNameInput = document.getElementById("inputTrainName").value; 
    var trainDestInput = document.getElementById("inputTrainDestination").value; 
    var trainStartInput = document.getElementById("inputFirstTrainTime").value; 
    var trainFreqInput = document.getElementById("inputTrainFrequency").value;
    var hours = trainStartInput.substring(0,2);
    var minutes  = trainStartInput.substring(3,5);
    // convert to moment time 
    var trainStart = moment().hour(hours).minutes(minutes).seconds('00').format(); 
    // store in unix timestamp 
    var trainStartUnix = moment().hour(hours).minutes(minutes).seconds('00').format('x');
    
    // call function to push to db 
    addTrain(trainNameInput, trainDestInput, trainStart, trainFreqInput, trainStartUnix);
}

// child_added handler
trainListRef.on('child_added', function (snapshot) {
    console.log(snapshot.val());
    // grab table object 
    var scheduleTable = document.getElementById("trainList");
    var scheduleTableNewRow = scheduleTable.insertRow();
    var nextTrainInterval = 
    
    // array of objects? 
    var trainList = [snapshot.val().name, snapshot.val().destination, snapshot.val().frequency];
    for (var i = 0; i < (trainList.length); i++) {
        var scheduleTableNewCell = scheduleTableNewRow.insertCell();
        scheduleTableNewCell.innerHTML = trainList[i];
    }

    

    // call next time function 
    // call next arrival function 
});


