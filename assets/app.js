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
    console.log(trainName + " " + trainDest + " " + trainFirstTime + " " + trainFreq + " " + unixStartTime);
    trainListRef.push({
        name: trainName,
        destination: trainDest,
        frequency: trainFreq,
        startTime: trainFirstTime,
        startTimeStamp: unixStartTime
    })
}

// functions for calculating the next train time and minutes until arrival 
var nextArrival = function (trainFirstTime, freq) {
    // get time until 
    freq = freq * 60 * 1000;
    var currentT = moment();
    var diff = currentT.diff(parseInt(trainFirstTime));
    console.log('the diff is:');
    console.log(diff);
    var tRemainder = diff % freq;
    console.log('the remainder is');
    console.log(tRemainder);
    var tmsToTrain = (freq - tRemainder);
    var tMtoTrain = moment.duration(tmsToTrain).humanize(true);
    console.log('time to next train is:' + tMtoTrain);
    var tNext = moment().add(tmsToTrain, 'ms');
    tNext = tNext.format("HH:MM");
    var tTimes = [tNext, tMtoTrain];
    console.log('the return value of this function is:');
    console.log(tNext);
    console.log(tMtoTrain);
    console.log(tTimes);
    return tTimes;

}

// onclick event handler for "add train" button 

document.getElementById("submitNewTrain").onsubmit = function (event) {
    // store user input 
    var trainNameInput = document.getElementById("inputTrainName").value;
    var trainDestInput = document.getElementById("inputTrainDestination").value;
    var trainStartInput = document.getElementById("inputFirstTrainTime").value;
    var trainFreqInput = document.getElementById("inputTrainFrequency").value;
    var hours = trainStartInput.substring(0, 2);
    var minutes = trainStartInput.substring(3, 5);
    // convert to moment time 
    var trainStart = moment().hour(hours).minutes(minutes).seconds(0).format();
    // store in unix timestamp 
    var trainStartUnix = moment().hour(hours).minutes(minutes).seconds(0).format('x');

    // call function to push to db 
    addTrain(trainNameInput, trainDestInput, trainStart, trainFreqInput, trainStartUnix);
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
    tTimes = nextArrival(snapshot.val().startTimeStamp, snapshot.val().frequency);
    trainList = trainList.concat(tTimes);
    console.log('train list array'); 
    console.log(trainList);
    for (var i = 0; i < (trainList.length); i++) {
        var scheduleTableNewCell = scheduleTableNewRow.insertCell();
        scheduleTableNewCell.innerHTML = trainList[i];
    }



    // call next time function 
    // call next arrival function 
});

var t = (moment().diff(moment(1541448900748)));
var t2 = t % (10 * 60 * 1000);
