
// Your web app's Firebase configuration
var firebaseConfig = {
  apiKey: "AIzaSyBH5-ZGqsTfU-TI7mCGGVV1UjZKaZ0g9aM",
  authDomain: "portfolio-website-tp.firebaseapp.com",
  databaseURL: "https://portfolio-website-tp.firebaseio.com",
  projectId: "portfolio-website-tp",
  storageBucket: "portfolio-website-tp.appspot.com",
  messagingSenderId: "878652500631",
  appId: "1:878652500631:web:8ac74a3e90033132fb57d2"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);

//Tracks "cards" inside container
var msgs=0;

var body = document.body;
var container;

//Holds data for values in each "card"
var msgsData = [];

createFunctions();
createContainer();

//The buttons and expiration field above container
function createFunctions()
{
  createClearAllBtn();
  createAddBtn();
  createExpirationField();
  createSendBtn();
}

function createClearAllBtn()
{
  var content = '<button type="button" id="btn_clear_all">Clear All</button>&nbsp;&nbsp;&nbsp;&nbsp;';
  body.innerHTML += content;
}

function createAddBtn()
{
  var content = '<button type="button" id="btn_add">+</button>&nbsp;&nbsp;&nbsp;&nbsp;';
  body.innerHTML += content;
}

function createExpirationField()
{
  var content = 'Expiration: <input id="expiration_field" type="date" name="expiration">&nbsp;&nbsp;&nbsp;&nbsp;';
  body.innerHTML += content;
}

function createSendBtn()
{
  var content = '<button type="button" id="btn_send">Send</button><br><br>';
  body.innerHTML += content;
}

function createContainer(){
  var content =
      '<div id="container">'+

      '</div>';

  body.innerHTML += content;
  container = document.getElementById("container");

  addCard();
}

function addCard(){

  //If there are 1 or more "cards" that exist, store their field values
  if (msgs>0)  saveAllMessages();
  msgs++;
  var content =
      '<div id="'+msgs+'">'+
            'Heading: <input class="heading" type="text" name="heading"><br><br>'+
            'Subheading: <input class="sub-heading" type="text" name="sub-heading"><br><br>'+
            '<button class="btn" type="button" id="btn_del_msg'+msgs+'">Delete</button>'+
      '</div>';
  container.innerHTML += content;

  //Did it this way since !PATHETIC! HTML/JavaScript by nature has many state changes,
  //but not enough "state storage", so previous btn listeners become non-existant on
  //state changes such as any additions to the html
  setAllBtnListeners();

  //If there are 1 or more "cards" that exist, retrieve their field values. Again doing
  //so due to the state change constraints of HTML/JS
  if (msgs>1) {retrieveSavedMsgs();}

}

function saveAllMessages()
{
  for (var i = 1; i < msgs+1; i++)
  {
    var message = document.getElementById(i.toString());
    var heading = message.getElementsByClassName("heading")[0].value;
    var sub_heading = message.getElementsByClassName("sub-heading")[0].value;

    msgsData[i] = [heading, sub_heading];

    console.log(msgsData[i])
  }
}

function retrieveSavedMsgs()
{
  for (var i = 1; i < msgs+1; i++)
  {
    var headingVal = msgsData[i][0];
    var sub_headingVal = msgsData[i][1];
    var message = document.getElementById(i.toString());
    message.getElementsByClassName("heading")[0].value = headingVal;
    message.getElementsByClassName("sub-heading")[0].value = sub_headingVal;
  }
}

function setAllBtnListeners(){
  console.log("setting all btn listeners");
  setClearAllBtnListener();
  setAllDelBtnListener();
  setAddBtnListener();
  setSendBtnListener();
}

//Deletes all "cards" in container
function setClearAllBtnListener()
{
  var clearAllBtn = document.getElementById("btn_clear_all");
  clearAllBtn.onclick = function() {
    for (var i=1; i<msgs+1; i++)
    {
      document.getElementById(i.toString()).remove()
    }
    msgs = 0;
    msgsData = []
  };

}

//Deletes each individual "card" inside container
function setAllDelBtnListener() {
  for (var i = 1; i < msgs+1; i++)
  {
    var delBtn = document.getElementById("btn_del_msg"+i.toString());
    setCardDelBtnListener(i);
  }
}

function setCardDelBtnListener(cardNum) {
  var delBtn = document.getElementById("btn_del_msg"+cardNum.toString());
  delBtn.onclick = function() {
    var msgItem = delBtn.id.substr(11, delBtn.id.toString().length-1);
    document.getElementById(msgItem).remove();
    msgs--;
    console.log(msgs);
  };
}

//Creates a new "card"
function setAddBtnListener()
{
  var addBtn = document.getElementById("btn_add");
  addBtn.onclick = function() {
    addCard();
  };
}

//Sends messages to Firebase Realtime Database
function setSendBtnListener()
{
  var sendBtn = document.getElementById("btn_send");
  sendBtn.onclick = function() {
    console.log("SEND");
    var updates = {};
    updates['/latest/posted'] = getCurrentTime();
    updates['/latest/expires'] = getExpirationTimestamp();
    updates['/latest/messages'] = msgsData;

    return firebase.database().ref().update(updates);
  };
}

function getCurrentTime()
{
  return Math.round(new Date().getTime()/1000);
}

function getExpirationTimestamp()
{
  var expiration_field_val = document.getElementById('expiration_field').value;
  var unixTimestamp = new Date(expiration_field_val).getTime() / 1000;
  return unixTimestamp;
}
