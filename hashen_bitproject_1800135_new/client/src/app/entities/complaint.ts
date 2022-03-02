import {User} from './user';
import {Connection} from './connection';
import {DataPage} from '../shared/data-page';
import {Complainttype} from './complainttype';
import {Complaintstatus} from './complaintstatus';

export class Complaint {
  id: number;
  code: string;
  connection: Connection;
  complainttype: Complainttype;
  contact: string;
  complaintstatus: Complaintstatus;
  title: string;
  complainername: string;
  location: string;
  description: string;
  creator: User;
  tocreation: string;
}

export class ComplaintDataPage extends DataPage{
    content: Complaint[];
}
