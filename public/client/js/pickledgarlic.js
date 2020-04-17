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
	addEvent(summary, location, start, end, classification, priority, resources, rsvp, organizer, attendees) {
		attendees = attendees.split("\n").filter(line => {
			return line.length > 0;
		});
		this.events.push({
			"summary": summary,
			"location": location,
			"start": moment(start, "MM-DD-YYYY HH:mm").format("YYYYMMDDTHHmmss"),
			"end": moment(end, "MM-DD-YYYY HH:mm").format("YYYYMMDDTHHmmss"),
			"classification": classification,
			"priority": priority,
			"resources": resources.trim().replace(/(, )/g, ","),
			"rsvp": rsvp,
			"organizer": organizer,
			"attendees": attendees
		});
	}

	// Returns number of events
	eventCount() {
		return this.events.length;
	}

	// Removes newlines from string
	removeNewlines(str) {
		return str.replace(/[\r\n]+/gm, "");
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
				`DTSTAMP:${this.created}`.trim(),
				`UID:${this.generateUUID()}`,
				this.removeNewlines(`DTSTART;TZID=${tzid}:${event.start}`),
				this.removeNewlines(`DTEND;TZID=${tzid}:${event.end}`),
				`CLASS:${event.classification}`,
				`SUMMARY:${event.summary}`.trim(),
				`PRIORITY:${event.priority}`,
				`LOCATION:${event.location}`.trim(),
				event.rsvp ? `ORGANIZER:${event.organizer}` : ``
			]);
			if (event.rsvp) {
				event.attendees.forEach(attendee => {
					ical = ical.concat([
						`ATTENDEE;RSVP=TRUE:mailto:${attendee}`
					]);
				});
			}
			ical = ical.concat([
				event.resources.length > 0 ? `RESOURCES:${event.resources}` : ``,
				`END:VEVENT`
			]);
		});
		ical.push(`END:VCALENDAR`);
		// Removes empty lines
		ical = ical.filter(line => {
			return line.length > 0;
		});
		return ical.join('\n');
	}
}