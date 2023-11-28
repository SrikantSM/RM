function getCurrentDay(iDay) {
	const now = new Date(Date.now());
	var currentDay = new Date(Date.UTC(now.getFullYear(), now.getMonth() - 1, iDay));
	return currentDay.toJSON();
}

function getISOcurrentDate(iDay) {
	const now = new Date(Date.now());
	var currentDay = new Date(Date.UTC(now.getFullYear(), now.getMonth() - 1, iDay));
	var currentISODate = currentDay.toISOString().split("T")[0];
	return currentISODate;
}

function getCurrentMonth(iDay) {
	const now = new Date(Date.now());
	var currentDay = new Date(Date.UTC(now.getFullYear(), now.getMonth() - 1, iDay));
	var month = currentDay.toLocaleString("en-us", {
		month: "short"
	});
	return month;
}

module.exports = {
	getCurrentDay,
	getISOcurrentDate,
	getCurrentMonth
};