window.onload = function() {
	document.getElementById('form').addEventListener('submit', function(e) {
		e.preventDefault();
		
	 	const reportTime = new Date(document.getElementById('report-time').value);
		const zuluReportTime = reportTime.toJSON();
		const schedBlockHours = document.getElementById('blockHours').value;
		const schedBlockMins = document.getElementById('blockMinutes').value;
	  	const crewSize = document.getElementById('crew-size').value;
		console.log('reportTime:  ' + reportTime);
		console.log('crewSize:  ' + crewSize);
		console.log('schedBlockTime:  ' + schedBlockHours + ':' + schedBlockMins);
		console.log('zuluReportTime:  ' + zuluReportTime);
		
		const latestTimeToLeaveMili = calculateTime(zuluReportTime, crewSize, schedBlockHours, schedBlockMins);
		const latestTimeToLeaveDateTime = new Date(latestTimeToLeaveMili).toLocaleString('en-US');
		console.log('latestTimeToLeaveDateTime:  ' + latestTimeToLeaveDateTime);
		
		document.getElementById("latt-value").innerHTML = '<h1>The latest <span style="color: green">local</span> time you can depart is ' + latestTimeToLeaveDateTime + '</h1>';
	});

	setViewportHeight();
	window.addEventListener('resize', setViewportHeight);
}

const setViewportHeight = () => {
	    let vh = window.innerHeight * 0.01;
	    document.documentElement.style.setProperty('--vh', `${vh}px`);
};

function calculateTime(zuluReportTime, maxDutyLimit, schedBlockHours, schedBlockMins){
	if(maxDutyLimit == 0){
		maxDutyLimit = findTwoPersonMaxDutyLimit(zuluReportTime);
	}
	
	const zuluReportTimeMili = new Date(zuluReportTime).getTime();
	const dutyTimeMili = maxDutyLimit * 3600000;
	const maxDutyDateTimeMili = zuluReportTimeMili + dutyTimeMili;
	const latestZuluDateTimeMili = new Date(maxDutyDateTimeMili).getTime();
	console.log('latestZuluDateTimeMili  ' + latestZuluDateTimeMili);
	
	const blockHoursMili = schedBlockHours * 3600000;
	console.log('blockHoursMili  ' + blockHoursMili);
	const blockMinutesMili = schedBlockMins * 60000;
	console.log('blockMinutesMili  ' + blockMinutesMili);
	
	const latestTimeToLeave = latestZuluDateTimeMili - blockHoursMili - blockMinutesMili;
	return latestTimeToLeave;
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