class ICalendarGenerator {

    constructor(title, date, timeStart, timeEnd, location, priority) {
      this.title = title;
      this.timeStart = moment(`${date} ${timeStart}`, 'MM-DD-YYYY HHmm').utc().format("YYYYMMDDTHHmmss") + 'Z';
      this.timeEnd = moment(`${date} ${timeEnd}`, 'MM-DD-YYYY HHmm').utc().format("YYYYMMDDTHHmmss") + 'Z';
      this.location = location;
      this.created = moment().utc().format("YYYYMMDDTHHmmss") + 'Z';
      this.uid = this.generateUUID();
	  this.priority = priority;
    }
  
    generateUUID() {
      return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
        var r = Math.random() * 16 | 0,
          v = c == 'x' ? r : (r & 0x3 | 0x8);
        return v.toString(16);
      });
    }
  
    generateCal() {
      return [
        `BEGIN:VCALENDAR`,
        `VERSION:2.0`,
        `PRODID: Team Picked Garlic ICS 414`,
        `NAME:${this.title}`,
        `CALSCALE:GREGORIAN`,
        `BEGIN:VEVENT`,
        `DTSTART:${this.timeStart}`,
        `DTEND:${this.timeEnd}`,
        `DTSTAMP:${this.created}`,
        `UID:${this.uid}`,
        `DESCRIPTION:${this.title}`,
        `SUMMARY:${this.title}`,
        `LOCATION:${this.location}`,
		`PRIORITY:${this.priority}`,
        `END:VEVENT`,
        `END:VCALENDAR`
      ].join('\n');
    }
}