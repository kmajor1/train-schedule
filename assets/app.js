// Initialize Firebase
var config = {
    apiKey: "AIzaSyDkKRcvX2zVoxzwZHHFpiDPxh5s6JWiGx8",
    authDomain: "train-schedule-d207a.firebaseapp.com",
    databaseURL: "https://train-schedule-d207a.firebaseio.com",
    projectId: "train-schedule-d207a",
    storageBucket: "train-schedule-d207a.appspot.com",
    messagingSenderId: "608051141696"
};
firebase.initializeApp(config);

// load database function into variable 
var database = firebase.database(); 
console.log(database);
//train list ref
var trainListRef = database.ref();
console.log(trainListRef);
// trainListRef.set({
//     trainName: "name",
//     trainTime: 100
// })

// trainListRef.set({
//     trainName: "name2",
//     trainTime: 200 
// });

// trainListRef.set( {
//     trainName: "name3",
//     trainTime: 300,
//     trainRoute: "test"
// });

var trainListRef2 = database.ref();
console.log(trainListRef2);


// push a new child on button click 

    document.getElementById("addData").onclick = function () {
        trainListRef2.push({
            name: "lakeshore west",
            time: 500 
        });
    }
  




    trainListRef2.on('child_added', function (snapshot) {
        var newDiv = document.createElement("div");
        console.log(snapshot.val());
        var data = snapshot.val();
        var newDivText = data.name; 
        console.log("test");
        console.log("text is:" + newDivText);
        newDiv.innerHTML = newDivText; 
        var stuff = document.getElementById("stuff");
        console.log(stuff);
        stuff.appendChild(newDiv);
        // document.getElementById("body").append(newDiv);
        // document.getElementById("body").append(newDiv);
    });


