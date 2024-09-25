$(function () {
  var speakerDevices = document.getElementById("speaker-devices");
  var ringtoneDevices = document.getElementById("ringtone-devices");
  var outputVolumeBar = document.getElementById("output-volume");
  var inputVolumeBar = document.getElementById("input-volume");
  var volumeIndicators = document.getElementById("volume-indicators");

  log("Requesting Capability Token...");
  $.getJSON("https://manatee-wombat-3214.twil.io/capability-token")
    .done(function (data) {
      log("Got a token.");
      console.log("Token: " + data.token);

      // Setup Twilio.Device
      Twilio.Device.setup(data.token);

      Twilio.Device.ready(function (device) {
        log("Twilio.Device Ready!");
        var callControls = document.getElementById("call-controls");
        if (callControls) {
          callControls.style.display = "block";
        }
      });

      Twilio.Device.error(function (error) {
        log("Twilio.Device Error: " + error.message);
      });

      Twilio.Device.connect(function (conn) {
        log("Successfully established call!");
        var buttonCall = document.getElementById("button-call");
        var buttonHangup = document.getElementById("button-hangup");
        if (buttonCall && buttonHangup && volumeIndicators) {
          buttonCall.style.display = "none";
          buttonHangup.style.display = "inline";
          volumeIndicators.style.display = "block";
          bindVolumeIndicators(conn);
        }
      });

      Twilio.Device.disconnect(function (conn) {
        log("Call ended.");
        var buttonCall = document.getElementById("button-call");
        var buttonHangup = document.getElementById("button-hangup");
        if (buttonCall && buttonHangup && volumeIndicators) {
          buttonCall.style.display = "inline";
          buttonHangup.style.display = "none";
          volumeIndicators.style.display = "none";
        }
      });

      Twilio.Device.incoming(function (conn) {
        log("Incoming connection from " + conn.parameters.From);
        var archEnemyPhoneNumber = "+12099517118";

        if (conn.parameters.From === archEnemyPhoneNumber) {
          conn.reject();
          log("It's your nemesis. Rejected call.");
        } else {
          // accept the incoming connection and start two-way audio
          conn.accept();
        }
      });

      setClientNameUI(data.identity);

      Twilio.Device.audio.on("deviceChange", updateAllDevices);

      // Show audio selection UI if it is supported by the browser.
      if (Twilio.Device.audio.isSelectionSupported) {
        var outputSelection = document.getElementById("output-selection");
        if (outputSelection) {
          outputSelection.style.display = "block";
        }
      }
    })
    .fail(function () {
      log("Could not get a token from server!");
    });

  // Bind button to make call
  var buttonCall = document.getElementById("button-call");
  if (buttonCall) {
    buttonCall.onclick = function () {
      // get the phone number to connect the call to
      var params = {
        To: document.getElementById("phone-number").value,
      };

      console.log("Calling " + params.To + "...");
      Twilio.Device.connect(params);
    };
  }

  // Bind button to hangup call
  var buttonHangup = document.getElementById("button-hangup");
  if (buttonHangup) {
    buttonHangup.onclick = function () {
      log("Hanging up...");
      Twilio.Device.disconnectAll();
    };
  }

  var getDevicesButton = document.getElementById("get-devices");
  if (getDevicesButton) {
    getDevicesButton.onclick = function () {
      navigator.mediaDevices
        .getUserMedia({ audio: true })
        .then(updateAllDevices);
    };
  }

  if (speakerDevices) {
    speakerDevices.addEventListener("change", function () {
      var selectedDevices = [].slice
        .call(speakerDevices.children)
        .filter(function (node) {
          return node.selected;
        })
        .map(function (node) {
          return node.getAttribute("data-id");
        });

      Twilio.Device.audio.speakerDevices.set(selectedDevices);
    });
  }

  if (ringtoneDevices) {
    ringtoneDevices.addEventListener("change", function () {
      var selectedDevices = [].slice
        .call(ringtoneDevices.children)
        .filter(function (node) {
          return node.selected;
        })
        .map(function (node) {
          return node.getAttribute("data-id");
        });

      Twilio.Device.audio.ringtoneDevices.set(selectedDevices);
    });
  }

  function bindVolumeIndicators(connection) {
    connection.volume(function (inputVolume, outputVolume) {
      if (inputVolumeBar && outputVolumeBar) {
        var inputColor = "red";
        if (inputVolume < 0.5) {
          inputColor = "green";
        } else if (inputVolume < 0.75) {
          inputColor = "yellow";
        }

        inputVolumeBar.style.width = Math.floor(inputVolume * 300) + "px";
        inputVolumeBar.style.background = inputColor;

        var outputColor = "red";
        if (outputVolume < 0.5) {
          outputColor = "green";
        } else if (outputVolume < 0.75) {
          outputColor = "yellow";
        }

        outputVolumeBar.style.width = Math.floor(outputVolume * 300) + "px";
        outputVolumeBar.style.background = outputColor;
      }
    });
  }

  function updateAllDevices() {
    updateDevices(speakerDevices, Twilio.Device.audio.speakerDevices.get());
    updateDevices(ringtoneDevices, Twilio.Device.audio.ringtoneDevices.get());
  }
});

// Update the available ringtone and speaker devices
function updateDevices(selectEl, selectedDevices) {
  if (!selectEl) return;

  selectEl.innerHTML = "";
  Twilio.Device.audio.availableOutputDevices.forEach(function (device, id) {
    var isActive = selectedDevices.size === 0 && id === "default";
    selectedDevices.forEach(function (device) {
      if (device.deviceId === id) {
        isActive = true;
      }
    });

    var option = document.createElement("option");
    option.label = device.label;
    option.setAttribute("data-id", id);
    if (isActive) {
      option.setAttribute("selected", "selected");
    }
    selectEl.appendChild(option);
  });
}

// Activity log
function log(message) {
  var logDiv = document.getElementById("log");
  if (logDiv) {
    logDiv.innerHTML += "<p>&gt;&nbsp;" + message + "</p>";
    logDiv.scrollTop = logDiv.scrollHeight;
  }
}

// Set the client name in the UI
function setClientNameUI(clientName) {
  var div = document.getElementById("client-name");
  if (div) {
    div.innerHTML = "Your client name: <strong>" + clientName + "</strong>";
  }
}
