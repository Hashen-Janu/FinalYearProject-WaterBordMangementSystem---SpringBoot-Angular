import {DataPage} from '../shared/data-page';

export class Notification {
  id: string;
  dosend: string;
  dodelivered: string;
  doread: string;
  message: string;
}

export class NotificationDataPage extends DataPage{
  content: Notification[];
}
