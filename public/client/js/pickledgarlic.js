class ICalendarGenerator {

	constructor() {
		this.events = [];
	}

	// Generates UUID used in the UID field
	generateUUID() {
		return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
			var r = Math.random() * 16 | 0,
				v = c == 'x' ? r : (r & 0x3 | 0x8);
			return v.toString(16);
		});
	}

	// Adds event to iCal object
	addEvent(summary, location, start, end) {
		this.events.push({
			"summary": summary,
			"location": location,
			"start": moment(start, "MM-DD-YYYY HH:mm").format("YYYYMMDDTHHmmss"),
			"end": moment(end, "MM-DD-YYYY HH:mm").format("YYYYMMDDTHHmmss")
		});
	}

	// Generates contents of iCal file
	generateCal(tzData) {
		this.created = moment().utc().format("YYYYMMDDTHHmmss") + "Z";
		tzData = tzData.split("\n");
		let tzid = tzData[1].replace("TZID:", "");
		let ical = [
			`BEGIN:VCALENDAR`,
			`VERSION:2.0`,
			`PRODID: Team Picked Garlic ICS 414`,
			`CALSCALE:GREGORIAN`
		].concat(tzData);

		this.events.forEach(event => {
			ical = ical.concat([
				`BEGIN:VEVENT`,
				`DTSTAMP:${this.created}`,
				`UID:${this.generateUUID()}`
				`DTSTART;TZID=${tzid}:${event.start}`
				`DTEND;TZID=${tzid}:${event.end}`
				`SUMMARY:${event.summary}`
				`LOCATION:${event.location}`
				`END:VEVENT`
			]);
		});

		return ical.push(`END:VCALENDAR`).join('\n');
	}
}