window.onload = function() {
	if ('serviceWorker' in navigator) {
        navigator.serviceWorker.register('./service-worker.js')
            .catch(err => console.warn('Service worker registration failed:', err));
    }
	
	document.getElementById('form').addEventListener('submit', function(e) {
		e.preventDefault();
		
	 	const zuluReportTime = new Date(document.getElementById('report-time').value);
		const schedBlockHours = document.getElementById('block-hours').value;
		const schedBlockMins = document.getElementById('block-minutes').value;
	  	const maxDutyLimit = document.getElementById('crew-size').value;
		//console.log('maxDutyLimit:  ' + maxDutyLimit);
		//console.log('schedBlockTime:  ' + schedBlockHours + ':' + schedBlockMins);
		//console.log('zuluReportTime:  ' + zuluReportTime);
		
		const lattMili = calculateTime(zuluReportTime, maxDutyLimit, schedBlockHours, schedBlockMins);
		const lattDateTime = formatDateTime(new Date(lattMili));
		//console.log('lattDateTime:  ' + lattDateTime);
		
		document.getElementById("latt-value").innerHTML = '<h3>The latest <span style="color: green">zulu</span> time you can depart is on ' + lattDateTime + '</h3>';
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
        `${month}-${day}-${year} at ${hours}:${minutes}z`
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
	const maxDutyLimitMili = maxDutyLimit * 3600000;
	const maxDutyDateTimeMili = zuluReportTimeMili + maxDutyLimitMili;
	//console.log('maxDutyDateTimeMili  ' + maxDutyDateTimeMili);
	
	const blockHoursMili = schedBlockHours * 3600000;
	//console.log('blockHoursMili  ' + blockHoursMili);
	const blockMinutesMili = schedBlockMins * 60000;
	//console.log('blockMinutesMili  ' + blockMinutesMili);
	//Value is 40 minutes. This includes 10 min for taxi in and 30 min for release time.
	const basicTaxiAndDutyOffMili = 2400000;
	
	const lattMili = maxDutyDateTimeMili - blockHoursMili - blockMinutesMili - basicTaxiAndDutyOffMili;
	return lattMili;
}

function findTwoPersonMaxDutyLimit(zuluReportTime){
	const date = new Date(zuluReportTime);
	const hour = date.getHours();
	//const min = date.getMinutes();
	//console.log('hour  ' + hour);
	//console.log('min  ' + min);
	
	if(hour >= 1 && hour < 5){
		return 11.5;
	} else if(hour >= 5 && hour < 16){
		return 15;
	} else if(hour >= 16 || hour < 1){
		return 13.5;
	} else {
		return null;
	}
}