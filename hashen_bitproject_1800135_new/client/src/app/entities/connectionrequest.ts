import {User} from './user';
import {Consumer} from './consumer';
import {Discount} from './discount';
import {Placetype} from './placetype';
import {DataPage} from '../shared/data-page';
import {Ownershiptype} from './ownershiptype';
import {Connectiontype} from './connectiontype';
import {Gramaniladharidiv} from './gramaniladharidiv';
import {Connectionrequestitem} from './connectionrequestitem';
import {Connectionrequeststatus} from './connectionrequeststatus';

export class Connectionrequest {
  id: number;
  code: string;
  consumer: Consumer;
  mobile: string;
  land: string;
  pobox: string;
  street: string;
  gramaniladharidiv: Gramaniladharidiv;
  postaladdress: string;
  connectionrequestitemList: Connectionrequestitem[];
  appicationfee: number;
  connectionfee: number;
  laborcost: number;
  vat: number;
  placetype: Placetype;
  ownershiptype: Ownershiptype;
  connectiontype: Connectiontype;
  connectionrequeststatus: Connectionrequeststatus;
  discountList: Discount[];
  payslip: string;
  description: string;
  creator: User;
  tocreation: string;
}

export class ConnectionrequestDataPage extends DataPage{
    content: Connectionrequest[];
}
