import {User} from './user';
import {Gender} from './gender';
import {Nametitle} from './nametitle';
import {Consumertype} from './consumertype';
import {DataPage} from '../shared/data-page';
import {Connection} from './connection';

export class Consumer {
  id: number;
  code: string;
  consumertype: Consumertype;
  nametitle: Nametitle;
  firstname: string;
  lastname: string;
  nic: string;
  gender: Gender;
  contact1: string;
  contact2: string;
  fax: string;
  email: string;
  address: string;
  description: string;
  creator: User;
  tocreation: string;
  doregisterd: string;
  landdeedphoto: string;
  grcphoto: string;
  landdeedno: string;
  companyname: string;
  designation: string;
  consumerConnectionList: Connection;

}

export class ConsumerDataPage extends DataPage{
    content: Consumer[];
}
