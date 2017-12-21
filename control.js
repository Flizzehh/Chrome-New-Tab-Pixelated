var redModifier = 0, greenModifier = 0, blueModifier = 0;
/**
 * Calculates the base colour of the grid background for the current moment
 * 
 * For visualisation: https://www.desmos.com/calculator/hcrnyymork
 * 
 * @param {Integer} timeSum A single value between 0 and 86400 denoting the current second of the day
 * @param {Date} td An instance of the Date class
 * 
 * @returns {String} The current base colour of the grid background (#RRGGBB)
 */
function calcColours(timeSum,td) {
	var dayOffset = (((td.getTime() / 1000 / 60 / 60 / 24) * 3000) % 86400) / 86400;
	var normalizedTimeSum = ((timeSum) / 86400) + dayOffset;

	var rVal = 255 * (0.25 * Math.sin(redModifier * 2 * Math.PI * normalizedTimeSum) + 0.5);
	var gVal = 255 * (0.25 * Math.sin(greenModifier * 4 * Math.PI * normalizedTimeSum) + 0.5);
	var bVal = 255 * (0.25 * Math.sin(blueModifier * 6 * Math.PI * normalizedTimeSum) + 0.5);

	rVal = Math.round(Math.max(Math.min(rVal, 255), 16));
	gVal = Math.round(Math.max(Math.min(gVal, 255), 16));
	bVal = Math.round(Math.max(Math.min(bVal, 255), 16));

	var timeColour = rVal.toString(16) + "" + gVal.toString(16) + "" + bVal.toString(16);

	return timeColour;
}

/**
 * Draws the grid background, slightly offsetting the colour of each cell to make a gradient
 * 
 * @param {Integer} timeSum A single value between 0 and 86400 denoting the current second of the day
 * @param {Date} td An instance of the Date class
 */
function gridGradient(timeSum,td) {
	var c = document.getElementById("canvas");
	c.width = screen.width;
	c.height = screen.height;

	var size = 100;
	var ctx = c.getContext("2d");
	for (y = 0; y < screen.height / size; y++) {
		for (x = 0; x < screen.width / size; x++) {
			var newColour = calcColours(timeSum + (x * size * 5) + (y * size * 5),td);
			ctx.fillStyle = "#" + newColour.toString();
			ctx.fillRect(x * size, y * size, size, size);
		}
	}
}

var monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
/**
 * Creates a text representation of the current time and date
 * 
 * @param {Integer} timeSum A single value between 0 and 86400 denoting the current second of the day
 * @param {Date} td An instance of the Date class
 */
function timeInfo(timeSum,td) {
	var hours = td.getHours();
	var hoursString = Math.floor(1 + (12 - (1 - hours)) % 12).toString();
	if (hoursString.length < 2) {
		hoursString = "0" + hoursString;
	}

	var minutes = td.getMinutes();
	var minutesString = minutes.toString();
	if (minutesString.length < 2) {
		minutesString = "0" + minutesString;
	}

	var seconds = td.getSeconds();
	var secondsString = seconds.toString()
	if (secondsString.length < 2) {
		secondsString = "0" + secondsString;
	}

	document.getElementById("time").innerHTML = hoursString + " " + minutesString + " " + secondsString;
	document.getElementById("date").innerHTML = td.getDate() + " " + monthNames[td.getMonth()] + " " + td.getFullYear();
}

/**
 * Calculates a single value between 0 and 86400 denoting the current second of the day
 * 
 * @param {Integer} hours The current hour of the day
 * @param {Integer} minutes The current minute of the day
 * @param {Integer} seconds The current second of the day
 * 
 * @returns {Integer} A single value between 0 and 86400 denoting the current second of the day
 */
function calculateTimeSum(hours, minutes, seconds) {
	newTimeSum = (seconds + (minutes * 60) + (hours * 3600)) % 86400;
	return newTimeSum;
}

/**
 * Saves the settings locally
 */
function saveSettings() {
	chrome.storage.sync.set({ redValue: redModifier });
	chrome.storage.sync.set({ greenValue: greenModifier });
	chrome.storage.sync.set({ blueValue: blueModifier });
	chrome.storage.sync.set({ darkText: darkText });
}

/**
 * Loads the settings stored locally
 */
function loadSettings() {
	chrome.storage.sync.get('redValue', function(data) {
		redModifier = data.redValue;
		applySettings();
	});
	chrome.storage.sync.get('greenValue', function(data) {
		greenModifier = data.greenValue;
		applySettings();
	});
	chrome.storage.sync.get('blueValue', function(data) {
		blueModifier = data.blueValue;
		applySettings();
	});
	chrome.storage.sync.get('darkText', function(data) {
		darkText = !data.darkText;
		switchTextColour();
		applySettings();
	});
}

/**
 * Applies any changes to the page but doesn't save them
 */
function applySettings() {
	document.getElementById("redSlider").value = redModifier;
	document.getElementById("redSliderValue").innerHTML = redModifier;

	document.getElementById("greenSlider").value = greenModifier;
	document.getElementById("greenSliderValue").innerHTML = greenModifier;

	document.getElementById("blueSlider").value = blueModifier;
	document.getElementById("blueSliderValue").innerHTML = blueModifier;
}

/**
 * Update the status of the save button based on whether there are changes to save
 * 
 * @param {Boolean} saveState Represents whether there are changes to save
 */
function updateSaveState(saveState) {
	if (saveState) {
		document.getElementById("saveSettingsButton").style.background = "#2ECC71";
		document.getElementById("saveSettingsButton").innerHTML = "Saved";
	} else {
		document.getElementById("saveSettingsButton").style.background = "#E74C3C";
		document.getElementById("saveSettingsButton").innerHTML = "Save Changes";
	}
}

/**
 * Connects the UI elements to their corresponding interaction function
 * Loads the stored settings
 */
function initializeUI() {
	loadSettings();

	document.getElementById("redSlider").onchange = function() {
		redModifier = document.getElementById("redSlider").value;
		applySettings();
		updateSaveState(false);
	}
	document.getElementById("greenSlider").onchange = function() {
		greenModifier = document.getElementById("greenSlider").value;
		applySettings();
		updateSaveState(false);
	}
	document.getElementById("blueSlider").onchange = function() {
		blueModifier = document.getElementById("blueSlider").value;
		applySettings();
		updateSaveState(false);
	}

	document.getElementById("redReset").onclick = function() {
		redModifier = 1;
		applySettings();
		updateSaveState(false);
	}
	document.getElementById("greenReset").onclick = function() {
		greenModifier = 1;
		applySettings();
		updateSaveState(false);
	}
	document.getElementById("blueReset").onclick = function() {
		blueModifier = 1;
		applySettings();
		updateSaveState(false);
	}

	document.getElementById("textColourToggle").onclick = function() {
		switchTextColour();
		updateSaveState(false);
	}

	document.getElementById("testColourSpectrumToggle").onclick = function() {
		testColourSpectrum = !testColourSpectrum;
		if (!testColourSpectrum) {
			document.getElementById("testColourSpectrumToggle").innerHTML = "View Colour Spectrum"
		}
	}

	document.getElementById("saveSettingsButton").onclick = function() {
		saveSettings();
		loadSettings();
		updateSaveState(true);
	}
}

var testColourSpectrum = false;
/**
 * Calls all of the functions to update the screen every second
 */
function checkTime() {
	var timeSum = 0;
	window.setInterval(function () {
		var td = new Date();
		var hours = td.getHours();
		var minutes = td.getMinutes();
		var seconds = td.getSeconds();

		newTimeSum = calculateTimeSum(hours, minutes, seconds);

		if (testColourSpectrum) {
			newTimeSum = timeSum + 500;
			newTimeSum %= 86400;
			document.getElementById("testColourSpectrumToggle").innerHTML = "STOP (" + Math.round((newTimeSum / 86400) * 100) + "%)";
		}

		if (newTimeSum != timeSum) {
			timeSum = newTimeSum;
			timeInfo(timeSum,td);
			gridGradient(timeSum,td);
		}
	}, 50); // Loops every 50 milliseconds
}

window.onload = function start() {
	initializeUI();
    checkTime();
}

var darkText = false;
/**
 * Switches the colour of the time and date text between light and dark colours
 */
function switchTextColour() {
	darkText = !darkText;
	if (darkText) {
		document.getElementById("time").style.color = "#4F5151";
		document.getElementById("date").style.color = "#4F5151";

		document.getElementById("textColourToggle").style.background = "#ECF0F1";
		document.getElementById("textColourToggle").style.color = "#4F5151";
		document.getElementById("textColourToggle").innerHTML = "Light Text";
	} else {
		document.getElementById("time").style.color = "#ECF0F1";
		document.getElementById("date").style.color = "#ECF0F1";

		document.getElementById("textColourToggle").style.background = "#4F5151";
		document.getElementById("textColourToggle").style.color = "#ECF0F1";
		document.getElementById("textColourToggle").innerHTML = "Dark Text";
	}
}