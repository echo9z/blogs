import * as Moment from 'moment';

export default class momentUtil {
  private moment;
  constructor() {
    this.moment = Moment();
  }

  formatDate(format?: string): string {
    return this.moment.format(format);
  }
}
