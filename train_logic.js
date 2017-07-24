
$(document).ready(function(){
  // Initialize Firebase
  var config = {
    apiKey: "AIzaSyBw7BfekX8sR4kAQQOE3ZwrIr0ZcCz29lI",
    authDomain: "wk-7-trains.firebaseapp.com",
    databaseURL: "https://wk-7-trains.firebaseio.com",
    projectId: "wk-7-trains",
    storageBucket: "wk-7-trains.appspot.com",
    messagingSenderId: "1054883540282"
  };
  
  firebase.initializeApp(config);

  //Get a reference to the database service
    var database = firebase.database();

    var formComplete = true;
 
  // grab data from form
  $("#submitBtn").on('click', function(){

    // prevent form from submitting
    event.preventDefault();

    var train = $("#train-name").val().trim();
    if(train === "") {
      alert("Plase enter the train name");
      
    }
    
    console.log("train name: ",train)

    var destination = $("#destination").val().trim();
    if(destination === "") {
      alert("Please enter the destination");
      
    }
    
    console.log("destination: ",destination)

    var firstTrain = $("#first-train").val().trim();
    if(firstTrain === "") {
      alert("Plase enter what time the first train arrives");
      
    }
    else {
      formComplete = true;
    }
    console.log("first-train: ",firstTrain)
    

    var frequency = $("#frequency").val().trim();
    if(frequency === "") {
      alert("Please enter the frequency");
      
    }
    
    if(train !== "" && destination !== "" && firstTrain !== "" && frequency !== "") {

    // Change what is saved in firebase
      
    var newTrain = {
      train: train,
      destination: destination,
      firstTrain: firstTrain,
      frequency: frequency
    };
    // Uploads train data to the database
    database.ref().push(newTrain);

    // Alert
    
      alert("Train successfully added");
    

    //Clear the text boxes
    $("#train-name").val("");
    $("#destination").val("");
    $("#first-train").val("");
    $("#frequency").val("");
  
}
  }); 
    // Firebase is always watching for changes to the data.
    // When changes occurs it will print them to console and html
    database.ref().on("child_added", function(childSnapshot, prevChildKey) {

      // Print the initial data to the console.
      console.log(childSnapshot.val());
      
      var convertedDate = moment(childSnapshot.val().firstTrain, 'hh:mm').subtract(1, 'years');
      var myTrain = childSnapshot.val().train;
      var myDestination = childSnapshot.val().destination;
      var myFirstTrain = childSnapshot.val().firstTrain;
      var tfrequency = childSnapshot.val().frequency;
      


      // pushed back 1 year to make sure it comes before current time
      //var convertedDate = moment(childSnapshot.val().firstTrain, 'hh:mm').subtract(1, 'years');
      var trainTime = moment(convertedDate).format('HH:mm');
      var currentTime = moment();
      // pushed back 1 year to make sure it comes before current time
      var firstTimeConverted = moment(trainTime,'hh:mm').subtract(1, 'years');
      var diffTime = moment().diff(moment(firstTimeConverted), "minutes");
      var tRemainder = diffTime % tfrequency;
      //solved
      var tMinutesTillTrain = tfrequency - tRemainder;
      //solved
      var nextTrain = moment().add(tMinutesTillTrain, 'minutes').format('HH:mm')
           
      // Change the HTML
      $("#tName").append("<div>" + myTrain);
      $("#tDestination").append("<div>" + myDestination);
      $("#tFrequency").append("<div>" + tfrequency + " min");
      $("#tNext").append("<div>" + nextTrain);
      $("#tHowLong").append("<div>" + tMinutesTillTrain + " min");
      

     
      // If any errors are experienced, log them to console.
    }, function(errorObject) {
      console.log("The read failed: " + errorObject.code);
          
    });
});
