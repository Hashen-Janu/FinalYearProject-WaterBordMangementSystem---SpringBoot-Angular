export class DateHelper{

  static getDateTimeAsString(d: Date): string{
    const date = new Date(d);
    const milliseconds = date.getTime() - (date.getTimezoneOffset() * 60000);
    return new Date(milliseconds).toISOString().split('Z')[0];
  }

  static getDateAsString(date: Date): string{
    return  this.getDateTimeAsString(date).split('T')[0];
  }

  static getTimeAsString(date: Date): string{
    return  this.getDateTimeAsString(date).split('T')[1];
  }

  static deferenceBetween(previousDate: Date, nextDate: Date): number{
    return  nextDate.getTime() - previousDate.getTime();
  }
}
