
export class UtilsService {

  constructor() { }

  static convert24to12(time){
    let hr = ((time % 1200) / 100).toString().split(".")[0];
    let min = time.toString().length > 3 ? time.toString().substring(2, 4) : time.toString().substring(1, 3)
    hr = hr === '0' ? '12' : hr;
    return `${hr}:${min}${time < 1200 ? 'AM' : 'PM'}`;
  }

  static daysToString(days){
    let str = ""
    for(let day of days) {
      if(str.length > 0){
        str = str + ", "
      }
      str = str + (day.toLocaleUpperCase()).substring(0, 3)
    }
    return str;
  }

  static makeDate(time, day){
    let date = new Date(Date.now())
    let dayNum = this.getDayNum(day)
    let todayNum = date.getDay()
    date.setDate(date.getDate() + (dayNum - todayNum))
    let hour12 = this.convert24to12Num(time)
    date.setHours(hour12[0], hour12[1], 0)
    return date
  }

  static convert24to12Num(time){
    let hr = time.toString().substring(0, 2);
    let min = time.toString().substring(2, 4)
    return [hr, min]
  }

  static getDayNum(day) {
    switch(day) {
      case "monday":
        return 1;
      case "tuesday":
        return 2;
      case "wednesday":
        return 3;
      case "thursday":
        return 4;
      case "friday":
        return 5;
      case "saturday":
        return 6;
      default:
        return 0;
    }
  }
}
