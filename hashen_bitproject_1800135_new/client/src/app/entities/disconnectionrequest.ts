import {User} from './user';
import {Connection} from './connection';
import {DataPage} from '../shared/data-page';
import {Disconnectiontype} from './disconnectiontype';
import {Disconnectionrequeststatus} from './disconnectionrequeststatus';

export class Disconnectionrequest {
  id: number;
  code: string;
  connection: Connection;
  date: string;
  disconnectiontype: Disconnectiontype;
  disconnectionrequeststatus: Disconnectionrequeststatus;
  description: string;
  creator: User;
  tocreation: string;
}

export class DisconnectionrequestDataPage extends DataPage{
    content: Disconnectionrequest[];
}
