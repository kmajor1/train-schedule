// set Firebase config 
var isLoaded = false; 
// timer to turn off loader 
setTimeout(() => {
    isLoaded = true; 
    loader('off');
}, 2500);
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
// loader function 
function loader (state) {
    
    if (state == 'off' && isLoaded) {
        // get loader div 
        var dataDiv = document.getElementById('dataDiv');
        dataDiv.className = "col-lg-9"; 
        // hide loader 
        var loaderDiv = document.getElementById('loaderDiv');
        loaderDiv.className = "d-none";
        // submit div get 
        var submitDiv = document.getElementById('submitDiv');
        submitDiv.className = "col-lg-3 mb-3";
        isLoaded = true; 
    }
    else if (state == 'on' && !isLoaded) {
        var dataDiv = document.getElementById('dataDiv');
        dataDiv.className = "d-none"; 
        // hide loader 
        var loaderDiv = document.getElementById('loaderDiv');
        loaderDiv.className = "loader";
        // submit div get 
        var submitDiv = document.getElementById('submitDiv');
        submitDiv.className = "d-none";
        isLoaded = false; 
        
    }
    else {
        return 
    }

}
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
    var diffTime = moment().diff(moment(trainFirstTime), "minutes");
    var tRemainder = diffTime % tFrequency;
    var tMinutesTillTrain = tFrequency - tRemainder;
    // check if first train entered is in future or not 
    var isFirstTrainInPast = moment(trainFirstTime).isBefore(moment());
    var nextTrain; 
    
    if (isFirstTrainInPast) {
        nextTrain = moment().add(tMinutesTillTrain, 'minutes');
        nextTrain = nextTrain.format("HH:mm");
        
    }
    else {
        nextTrain = moment(trainFirstTime).format("HH:mm");
        tMinutesTillTrain = moment(trainFirstTime).diff(moment(), 'minutes');
    }
    // convert minutes till next train to a duration, then humanize it 
    tMinutesTillTrainHuman = moment.duration(tMinutesTillTrain, 'minutes').humanize(true);
    var tTimes = [nextTrain, tMinutesTillTrainHuman];
    return tTimes;

}

// onclick event handler for "add train" button 

document.getElementById("submitNewTrain").onsubmit = function (event) {
    // isloaded make false 
    isLoaded = false; 
    loader('on');
    // store user input 
    var trainNameInput = document.getElementById("inputTrainName").value;
    var trainDestInput = document.getElementById("inputTrainDestination").value;
    var trainStartInput = document.getElementById("inputFirstTrainTime").value;
    var trainFreqInput = document.getElementById("inputTrainFrequency").value;
    var hours = trainStartInput.substring(0,2);
    var minutes = trainStartInput.substring(3,5);
    // convert to moment time 
    var trainStart = moment().hours(hours).minutes(minutes).seconds(0).format(); 
    // call function to push to db 
    addTrain(trainNameInput, trainDestInput, trainStart, trainFreqInput);
}

// child_added handler
trainListRef.on('child_added', function (snapshot) {
    alert('child_added_fired');
    loader('on');
    //log the data snapshot
    // console.log(snapshot.val());
    // grab table object 
    var scheduleTable = document.getElementById("trainList");
    var scheduleTableNewRow = scheduleTable.insertRow();


    // array of objects? 
    var trainList = [snapshot.val().name, snapshot.val().destination, snapshot.val().frequency];
    var tTimes;
    tTimes = nextArrival(snapshot.val().startTime, snapshot.val().frequency);
    trainList = trainList.concat(tTimes);
    // console.log('train list array'); 
    // console.log(trainList);
    for (var i = 0; i < (trainList.length); i++) {
        var scheduleTableNewCell = scheduleTableNewRow.insertCell();
        scheduleTableNewCell.innerHTML = trainList[i];
    }
    
    


    


});



