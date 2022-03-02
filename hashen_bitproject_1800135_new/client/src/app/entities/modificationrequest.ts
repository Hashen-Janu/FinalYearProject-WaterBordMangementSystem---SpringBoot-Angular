import {User} from './user';
import {Connection} from './connection';
import {DataPage} from '../shared/data-page';
import {Modificationrequeststatus} from './modificationrequeststatus';

export class Modificationrequest {
  id: number;
  code: string;
  connection: Connection;
  date: string;
  modificationrequeststatus: Modificationrequeststatus;
  description: string;
  creator: User;
  tocreation: string;
}

export class ModificationrequestDataPage extends DataPage{
    content: Modificationrequest[];
}
