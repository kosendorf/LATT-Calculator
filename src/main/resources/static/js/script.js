window.onload = function() {
	document.getElementById('form').addEventListener('submit', function(e) {
		e.preventDefault();
		
	 	const reportTime = new Date(document.getElementById('report-time').value);
		const zuluReportTime = reportTime.toJSON();
		const schedBlockTime = document.getElementById('sched-block-time').value;
	  	const crewSize = document.getElementById('crew-size').value;
		console.log('reportTime:  ' + reportTime);
		console.log('crewSize:  ' + crewSize);
		console.log('schedBlockTime:  ' + schedBlockTime);
		console.log('zuluReportTime:  ' + zuluReportTime);
		
		const latestTimeToLeaveMili = calculateTime(zuluReportTime, crewSize, schedBlockTime);
		const latestTimeToLeaveDateTime = new Date(latestTimeToLeaveMili).toLocaleString('en-US');
		console.log('latestTimeToLeaveDateTime:  ' + latestTimeToLeaveDateTime);
		
		document.getElementById("latt-value").innerHTML = '<h1>The latest <span style="color: green">local</span> time you can depart is ' + latestTimeToLeaveDateTime + '</h1>';
	});
}

function calculateTime(zuluReportTime, maxDutyLimit, schedBlockTime){
	if(maxDutyLimit == 0){
		maxDutyLimit = findTwoPersonMaxDutyLimit(zuluReportTime);
	}
	
	const zuluReportTimeMili = new Date(zuluReportTime).getTime();
	const dutyTimeMili = maxDutyLimit * 3600000;
	const maxDutyDateTimeMili = zuluReportTimeMili + dutyTimeMili;
	const latestZuluDateTimeMili = new Date(maxDutyDateTimeMili).getTime();
	console.log('latestZuluDateTimeMili  ' + latestZuluDateTimeMili);
	
	console.log('schedBlockTime  ' + schedBlockTime);
	const blockHours = schedBlockTime.substring(0,2);
	const blockHoursMili = blockHours * 3600000;
	console.log('blockHours  ' + blockHours);
	console.log('blockHoursMili  ' + blockHoursMili);
	const blockMinutes = schedBlockTime.substring(3,schedBlockTime.length);
	const blockMinutesMili = blockMinutes * 60000;
	console.log('blockMinutes  ' + blockMinutes);
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