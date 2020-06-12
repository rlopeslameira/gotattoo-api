import { 
  parseISO, 
  setSeconds, 
  setMinutes, 
  setHours, 
  setMilliseconds, 
  subHours
} from 'date-fns';

class Util {
  formatDate(date) {
    const parseDate = setMilliseconds(setSeconds(setMinutes(setHours(parseISO(date), 0), 0), 0), 0);
    return parseDate;
  }
}

export default new Util();