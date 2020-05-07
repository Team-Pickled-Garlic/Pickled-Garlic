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
	removeEvent(summary, start) {
		let index = 0;
		this.events.forEach(event => {
			if (`${event.summary}` == summary && event.start == moment(start, "MM-DD-YYYY HH:mm").format("YYYYMMDDTHHmmss")) {
				this.events.splice(index, 1);
			}
			index++;
		});
	}

	// Adds event to iCal object
	addEvent(summary, description, location, start, end, classification, priority, resources, 
		rsvp, organizer, sentby, attendees, recurring, recurring_exception) {

		attendees = attendees.split("\n").filter(line => {
			return line.length > 0;
		});
		this.events.push({
			"summary": summary,
			"description": description,
			"location": location,
			"start": moment(start, "MM-DD-YYYY HH:mm").format("YYYYMMDDTHHmmss"),
			"end": moment(end, "MM-DD-YYYY HH:mm").format("YYYYMMDDTHHmmss"),
			"classification": classification,
			"priority": priority,
			"resources": resources.trim().replace(/(, )/g, ","),
			"rsvp": rsvp,
			"organizer": organizer,
			"sentby": sentby,
			"attendees": attendees,
      		"recurring": recurring,
			"recurring_exception": recurring_exception
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
			let organizerSentby = "";
			if (event.sentby.trim().length == 0 && event.organizer.trim().length > 0) {
				organizerSentby = `ORGANIZER:mailto:${event.organizer}`;
			} else if (event.sentby.trim().length > 0 && event.organizer.trim().length > 0) {
				organizerSentby = `ORGANIZER;SENT-BY="mailto:${event.sentby}":mailto:${event.organizer}`;
			} else {
				organizerSentby = ``;
			}

			ical = ical.concat([
				`BEGIN:VEVENT`,
				`DTSTAMP:${this.created}`.trim(),
				`UID:${this.generateUUID()}`,
				this.removeNewlines(`DTSTART;TZID=${tzid}:${event.start}`),
				this.removeNewlines(`DTEND;TZID=${tzid}:${event.end}`),
				`CLASS:${event.classification}`,
				`SUMMARY:${event.summary}`.trim(),
				event.description.length > 0 ? `DESCRIPTION:${event.description}`.trim() : ``,
				`PRIORITY:${event.priority}`,
				`LOCATION:${event.location}`.trim(),
				organizerSentby
			]);
			if (event.rsvp) {
				event.attendees.forEach(attendee => {
					ical = ical.concat([`ATTENDEE;RSVP=TRUE:mailto:${attendee}`]);
				});
			}
			ical = ical.concat([
				event.resources.length > 0 ? `RESOURCES:${event.resources}` : ``,
				event.recurring.length > 0 ? `RRULE:FREQ=${event.recurring}` : ``,
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