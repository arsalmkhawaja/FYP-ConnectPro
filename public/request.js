// Create a new XMLHttpRequest object
var xhr = new XMLHttpRequest();

// Define the endpoint URL where your PHP script resides
var url = "your_php_script.php";

// Set up the request
xhr.open("POST", url, true);
xhr.setRequestHeader("Content-type", "application/x-www-form-urlencoded");

// Define the XML content to be sent
var xmlContent =
  '<?xml version="1.0" encoding="UTF-8"?>\n' +
  "<Response>\n" +
  '    <Dial callerId="+12029526015">' +
  encodeURIComponent(yourPhoneNumberVariable) +
  "</Dial>\n" +
  "</Response>";

// Send the request
xhr.send(xmlContent);

// Define a callback function to handle the response from the server
xhr.onreadystatechange = function () {
  if (xhr.readyState === XMLHttpRequest.DONE) {
    if (xhr.status === 200) {
      // Request was successful, do something with the response if needed
      console.log(xhr.responseText);
    } else {
      // Handle errors
      console.error("Error:", xhr.status);
    }
  }
};
