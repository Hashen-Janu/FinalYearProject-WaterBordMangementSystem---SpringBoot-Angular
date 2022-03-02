import {User} from './user';
import {Connection} from './connection';
import {DataPage} from '../shared/data-page';
import {Reconnectionrequeststatus} from './reconnectionrequeststatus';

export class Reconnectionrequest {
  id: number;
  code: string;
  connection: Connection;
  date: string;
  reconnectionrequeststatus: Reconnectionrequeststatus;
  description: string;
  creator: User;
  tocreation: string;
}

export class ReconnectionrequestDataPage extends DataPage{
    content: Reconnectionrequest[];
}
