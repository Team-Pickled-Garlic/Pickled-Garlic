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
  removeEvent(summary) {
    var index=0;
    this.events.forEach(event => {
      if (`${event.summary}` == summary) {
        this.events.splice(index, 1);
      }
      index++;
    });
    //this.events.splice(index, 1);
  }

	// Adds event to iCal object
	addEvent(summary, description, location, start, end, classification, priority, resources,recurring,recurring_exception) {
		this.events.push({
			"summary": summary,
      "description": description,
			"location": location,
			"start": moment(start, "MM-DD-YYYY HH:mm").format("YYYYMMDDTHHmmss"),
			"end": moment(end, "MM-DD-YYYY HH:mm").format("YYYYMMDDTHHmmss"),
			"classification": classification,
			"priority": priority,
			"resources": resources.trim().replace(/(, )/g, ","),
      "recurring": recurring,
      "recurring_exception":recurring_exception
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
    
    //`EXRULE:FREQ=${event.recurring};COUNT=8;BYMONTH=6,7`,
    //"RRULE:FREQ=WEEKLY;UNTIL=20110701T170000Z", 
    
    //`EXRULE:FREQ=${event.recurring_exception};COUNT=8;BYMONTH=${event.recurring_exception}` : ``,    
		this.events.forEach(event => {
      let exrule_by = '';
      if (event.recurring == "WEEKLY") {
        exrule_by = 'BYWEEK';
      }
      else if (event.recurring == "MONTHLY") {
        exrule_by = 'BYMONTH';
      }
      else if (event.recurring == "YEARLY") {
        exrule_by = 'BYYEAR';
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
				event.resources.length > 0 ? `RESOURCES:${event.resources}` : ``,
        event.recurring.length > 0 ? `RRULE:FREQ=${event.recurring}` : ``,
        //event.recurring_exception.length > 0 ? `EXRULE:FREQ=${event.recurring};${exrule_by}=${event.recurring_exception}` : ``,
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