// access the DOM Element and store them in variables
var btn = document.querySelector('.btnDiv button');
var data = document.querySelector(".textEntered");
var len = document.querySelector(".len");
var text = document.querySelector('.inputText').value;
var flag;
var div = document.querySelector(".toast");
var clearHistoryBtn = document.querySelector(".clearHistory");
// set default background, foreground colors
var fgcColor = document.querySelector('#colorChooserFG').defaultValue = "#000000";
var bgColor = document.querySelector('#colorChooserBG').defaultValue = "#ffffff";
var downloadLink = document.querySelector('.download');
// call displayHistory function will the page is loaded
document.addEventListener("DOMContentLoaded",displayHistory);
btn.addEventListener("click",generate);
var textField = document.querySelector('.inputText');
// function to generate qr code
// this will collect text, background color, foreground color
function generate() {
    var text = document.querySelector('.inputText').value;
    var datalen = text.length;
    var image = document.querySelector('.image');
    var fgcColor = document.querySelector('#colorChooserFG').value.slice(1,7);
    var bgColor = document.querySelector('#colorChooserBG').value.slice(1,7);
    var option = document.querySelector('#menu').selectedIndex;
    var val = document.querySelectorAll("#menu option")[option].value;
    var size = `${val}x${val}`;
    data.innerHTML=text;
    len.innerHTML =`Length : ${datalen}`;
    var sizeImg = `${val}px`;
    var url = `https://api.qrserver.com/v1/create-qr-code/?size=${size}&data=${text}&color=${fgcColor}&bgcolor=${bgColor}`;
    downloadLink.download = url;
    image.src = url;
    image.style.width = sizeImg;
    image.style.height = sizeImg;
    // at the time of generation validation will be called
    validation(text,url);
    textField.value="";
}
// function to validate user input in textField
function validation(text,url) {
if(textField.value!="") {
    toast(1);    
    createCard(text,url);
    saveLocalStorage(text,url);
    // display delete history button if condition is met
    clearHistoryBtn.style.display ="block";
}
else{
    toast(0);
}
}
// function to display Notification/toast
function toast(flag) {
// if qr code is successfully generated then show green Notification
if(flag==1) {
    div.className = "show";
    div.textContent = "Successfully Generated";
    // timeout function display for 2000ms and remove the show class 
    setTimeout(
        function() {
    div.className = div.className.replace("show" , "toast"); 
        },2000
    );
}
// if qr code is not successfully generated or textfield is empty then show red Notification
else {
    div.className = "error";
    div.textContent = "TextField Cannot be empty";
    // timeout function display for 2000ms and remove the error class 
    setTimeout(
        function() {
    div.className = div.className.replace("error" , "toast"); 
        },2000
    );
}
}
// function to create card with text and qr code image
function createCard(text,url) {
    var leftBox = document.querySelector('.leftBox');
    var rightBox = document.querySelector('.rightBox');
    var leftParent = document.createElement('div');
    var righParent = document.createElement('div');
    var pText = document.createElement('p');
    var histImg = document.createElement('img');
    pText.setAttribute('class','pText');
    leftParent.setAttribute('class','leftParent');
    righParent.setAttribute('class','rightParent');
    pText.textContent = text;
    histImg.src = url;
    leftBox.appendChild(leftParent);
    leftParent.appendChild(pText);
    rightBox.appendChild(righParent);
    righParent.appendChild(histImg);
}
// function to store data in localStorage
function saveLocalStorage(text,url) {
    let qText,qUrl;
    // if nothing stored in localStorage then create empty Array for text and urls
    if(localStorage.getItem('texts')===null && localStorage.getItem('urls')===null) {
        qText = [];
        qUrl = [];
    }
    else {
        qText = JSON.parse(localStorage.getItem('texts'));
        qUrl = JSON.parse(localStorage.getItem('urls'));
    }
    // adding current text to Array
    qText.push(text);
    qUrl.push(url);
    // converting object to string
    localStorage.setItem('texts',JSON.stringify(qText));
    localStorage.setItem('urls',JSON.stringify(qUrl));
}
// function to get data from localStorage
function displayHistory() {
    let qText;
    let qUrl;
    // if nothing stored in localStorage then create empty Array for text and urls
    if(localStorage.getItem('texts')===null && localStorage.getItem('urls')===null) {
        qText = [];
        qUrl = [];
    }
    // store texts and img urls in localStorage
    else {
        qText = JSON.parse(localStorage.getItem('texts'));
        qUrl = JSON.parse(localStorage.getItem('urls'));
        clearHistoryBtn.style.display ="block";
    }
    // for creating text
    // loop through each Element in qtext Array and run function on them
    qText.forEach(function(text) {
    var leftBox = document.querySelector('.leftBox');
    var leftParent = document.createElement('div');
    var pText = document.createElement('p');
    pText.setAttribute('class','pText');
    leftParent.setAttribute('class','leftParent');
    pText.textContent = text;
    leftBox.appendChild(leftParent);
    leftParent.appendChild(pText);
    });
    // for creating img
    // loop through each Element in qUrl Array and run function on them
    qUrl.forEach(function(url) {
    var rightBox = document.querySelector('.rightBox');
    var righParent = document.createElement('div');
    var histImg = document.createElement('img');
    righParent.setAttribute('class','rightParent');
    histImg.src = url;
    rightBox.appendChild(righParent);
    righParent.appendChild(histImg);
    });
}
// for clearing localStorage
// this will clear browser memory and reload the page to see changes in history
function clearHistory() {
    localStorage.clear();
    window.open("http://127.0.0.1:5500/QR%20Code/qrcode.github.io/index.html","_self");
}