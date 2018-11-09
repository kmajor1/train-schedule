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
// function for pushing data to train list reference 
var addTrain = function (trainName, trainDest, trainFirstTime, trainFreq) {
    console.log("values passed were: ");
    trainListRef.push({
        name: trainName,
        destination: trainDest,
        frequency: trainFreq,
        startTime: trainFirstTime
    })
}

// functions for calculating the next train time and minutes until arrival 
var nextArrival = function (trainFirstTime, tFrequency) {
    // get time until 
    // freq = freq * 60 * 1000;
    var currentT = moment();
    var firstTimeConverted = moment(trainFirstTime, "hh:mm").subtract(1, "years");
    var diffTime = moment().diff(moment(firstTimeConverted), "minutes");
    var tRemainder = diffTime % tFrequency;
    var tMinutesTillTrain = tFrequency - tRemainder;
    var nextTrain = moment().add(tMinutesTillTrain, 'minutes');
    nextTrain = nextTrain.format("HH:mm");
    tMinutesTillTrainHuman = moment.duration(tMinutesTillTrain, 'minutes').humanize(true);
    var tTimes = [nextTrain, tMinutesTillTrainHuman];
    return tTimes;

}

// onclick event handler for "add train" button 

document.getElementById("submitNewTrain").onsubmit = function (event) {
    // store user input 
    var trainNameInput = document.getElementById("inputTrainName").value;
    var trainDestInput = document.getElementById("inputTrainDestination").value;
    var trainStartInput = document.getElementById("inputFirstTrainTime").value;
    var trainFreqInput = document.getElementById("inputTrainFrequency").value;
    // var hours = trainStartInput.substring(0, 2);
    // var minutes = trainStartInput.substring(3, 5);
    // convert to moment time 
    var trainStart = moment(trainStartInput, "hh:mm").subtract(1, 'years').format();   
    // call function to push to db 
    addTrain(trainNameInput, trainDestInput, trainStart, trainFreqInput);
}

// child_added handler
trainListRef.on('child_added', function (snapshot) {
    console.log(snapshot.val());
    // grab table object 
    var scheduleTable = document.getElementById("trainList");
    var scheduleTableNewRow = scheduleTable.insertRow();


    // array of objects? 
    var trainList = [snapshot.val().name, snapshot.val().destination, snapshot.val().frequency];
    var tTimes;
    tTimes = nextArrival(snapshot.val().startTime, snapshot.val().frequency);
    trainList = trainList.concat(tTimes);
    console.log('train list array'); 
    console.log(trainList);
    for (var i = 0; i < (trainList.length); i++) {
        var scheduleTableNewCell = scheduleTableNewRow.insertCell();
        scheduleTableNewCell.innerHTML = trainList[i];
    }

});

