var today = new Date();
var date = today.getDate() + '/' + (today.getMonth() + 1) + '/' + today.getFullYear();
document.getElementById("datenow").innerHTML = date;