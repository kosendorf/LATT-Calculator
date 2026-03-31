window.onload = function() {
	document.getElementById('form').addEventListener('submit', function(e) {
		e.preventDefault();
		
	 	const zuluReportTime = new Date(document.getElementById('report-time').value);
		const schedBlockHours = document.getElementById('block-hours').value;
		const schedBlockMins = document.getElementById('block-minutes').value;
		//const schedTaxiTime = document.getElementById('taxiTime').value;
	  	const crewSize = document.getElementById('crew-size').value;
		console.log('crewSize:  ' + crewSize);
		console.log('schedBlockTime:  ' + schedBlockHours + ':' + schedBlockMins);
		//console.log('schedTaxiTime:  ' + schedTaxiTime);
		console.log('zuluReportTime:  ' + zuluReportTime);
		
		const latestTimeToLeaveMili = calculateTime(zuluReportTime, crewSize, schedBlockHours, schedBlockMins);
		const latestTimeToLeaveDateTime = formatDateTime(new Date(latestTimeToLeaveMili));
		console.log('latestTimeToLeaveDateTime:  ' + latestTimeToLeaveDateTime);
		
		document.getElementById("latt-value").innerHTML = '<h1>The latest <span style="color: green">zulu</span> time you can depart is on ' + latestTimeToLeaveDateTime + '</h1>';
	});

	//setViewportHeight();
	//window.addEventListener('resize', setViewportHeight);
}

function formatDateTime(date) {
    const padTwoDigits = (num) => num.toString().padStart(2, "0");

    const year = date.getFullYear();
    const month = padTwoDigits(date.getMonth() + 1);
    const day = padTwoDigits(date.getDate());
    const hours = padTwoDigits(date.getHours());
    const minutes = padTwoDigits(date.getMinutes());

    return (
        `${month}-${day}-${year} at ${hours}:${minutes}`
    );
}

/*const setViewportHeight = () => {
	    let vh = window.innerHeight * 0.01;
	    document.documentElement.style.setProperty('--vh', `${vh}px`);
};*/

function calculateTime(zuluReportTime, maxDutyLimit, schedBlockHours, schedBlockMins){
	if(maxDutyLimit == 0){
		maxDutyLimit = findTwoPersonMaxDutyLimit(zuluReportTime);
	}
	
	const zuluReportTimeMili = new Date(zuluReportTime).getTime();
	const dutyTimeMili = maxDutyLimit * 3600000;
	const maxDutyDateTimeMili = zuluReportTimeMili + dutyTimeMili;
	console.log('maxDutyDateTimeMili  ' + maxDutyDateTimeMili);
	
	const blockHoursMili = schedBlockHours * 3600000;
	console.log('blockHoursMili  ' + blockHoursMili);
	const blockMinutesMili = schedBlockMins * 60000;
	console.log('blockMinutesMili  ' + blockMinutesMili);
	/*const taxiTimeMili = schedTaxiTime * 60000;
	console.log('taxiTimeMili  ' + taxiTimeMili);*/
	
	const latestTimeToLeaveMili = maxDutyDateTimeMili - blockHoursMili - blockMinutesMili;
	return latestTimeToLeaveMili;
}

function findTwoPersonMaxDutyLimit(zuluReportTime){
	const date = new Date(zuluReportTime);
	
	const dateHours = date.getHours();
	const dateMins = date.getMinutes();
	console.log('dateHours  ' + dateHours);
	console.log('dateMins  ' + dateMins);
	
	if(dateHours >= 1 && dateHours < 5){
		return 11.5;
	} else if(dateHours >= 5 && dateHours < 16){
		return 15;
	} else if(dateHours >= 16 || dateHours < 1){
		return 13.5;
	} else {
		return null;
	}
}