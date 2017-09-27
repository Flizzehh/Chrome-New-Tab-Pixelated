var monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

function calcColours(timeSum) {
	//var rVal = ((255 / 4) * Math.sin(Math.PI * (timeSum / (86400 * 12)) * 255) + (255 / 2)) * (1 / Math.sinh(Math.PI * (timeSum / 86400) + 1));
	var rVal = 1 * (((255 / 8) * Math.sin(2 * Math.PI * (timeSum / (86400 * 12)) * 255) + (255 / 4)) * (1 / Math.sinh(Math.PI * (timeSum / 86400) + 1)));
	//var gVal = ((255 / 4) * Math.sin(Math.PI * ((86400 - timeSum) / (86400 * 12)) * 255) + (255 / 2)) * (1 / Math.sinh(Math.PI * ((86400 - timeSum) / 86400) + 1));
	var gVal = 1 * (((255 / 8) * Math.sin(2 * Math.PI * ((86400 - timeSum) / (86400 * 12)) * 255) + (255 / 4)) * (1 / Math.sinh(Math.PI * ((86400 - timeSum) / 86400) + 1)));
	//var bVal = -1 * ((Math.pow((timeSum - (86400 / 2)) / (86400 / 20), 2)) + 40 * Math.sin(timeSum / 864) + 40) + 100;
	var bVal = 0.5 * ((Math.pow((timeSum - (86400 / 2)) / (86400 / 20), 2)) + 80 * Math.sin(timeSum / (864*2)) + 40) + 150;

	rVal += 16 + 54;
	gVal += 16 + 54;
	bVal += 0;

	rVal = Math.round(Math.max(Math.min(rVal, 255), 16));
	gVal = Math.round(Math.max(Math.min(gVal, 255), 16));
	bVal = Math.round(Math.max(Math.min(bVal, 255), 16));

	var timeColour = rVal.toString(16) + "" + gVal.toString(16) + "" + bVal.toString(16);
	return timeColour;
}

function gridGradient(timeSum) {
	var c = document.getElementById("canvas");
	c.width = screen.width;
	c.height = screen.height;

	var size = 200;
	var ctx = c.getContext("2d");
	for (y = 0; y < screen.height / size; y++) {
		for (x = 0; x < screen.width / size; x++) {
			var newColour = calcColours(timeSum + (x * size * 2) + (y * size * 2));
			ctx.fillStyle = "#" + newColour.toString();
			ctx.fillRect(x * size, y * size, size, size);
		}
	}
}

function timeInfo(timeSum) {
	var td = new Date();

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

function calculateTimeSum(hours, minutes, seconds) {
	newTimeSum = (seconds + (minutes * 60) + (hours * 3600)) % 86400;
	return newTimeSum;
}

function checkTime() {
	var timeSum = 0;
	window.setInterval(function () {
		var td = new Date();
		var hours = td.getHours();
		var minutes = td.getMinutes();
		var seconds = td.getSeconds();

		newTimeSum = calculateTimeSum(hours, minutes, seconds);

		//newTimeSum = timeSum + 250;
		//newTimeSum %= 86400;

		if (newTimeSum != timeSum) {
			timeSum = newTimeSum;
			timeInfo(timeSum);
			gridGradient(timeSum);
		}
	}, 50);
}

window.onload = function start() {
    checkTime();
}

var darkText = false;
function switchTextColour() {
	darkText = !darkText;
	if (darkText) {
		document.getElementById("time").style.color = "#4F5151";
		document.getElementById("date").style.color = "#4F5151";
	} else {
		document.getElementById("time").style.color = "#ecf0f1";
		document.getElementById("date").style.color = "#ecf0f1";
	}
}