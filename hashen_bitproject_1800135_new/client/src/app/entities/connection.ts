import {User} from './user';
import {Consumer} from './consumer';
import {Placetype} from './placetype';
import {DataPage} from '../shared/data-page';
import {Ownershiptype} from './ownershiptype';
import {Connectionstatus} from './connectionstatus';
import {Gramaniladharidiv} from './gramaniladharidiv';

export class Connection {
  id: number;
  code: string;
  consumer: Consumer;
  mobile: string;
  land: string;
  pobox: string;
  street: string;
  gramaniladharidiv: Gramaniladharidiv;
  meterno: string;
  meterseelno: string;
  metercircular: string;
  metersize: string;
  watersupplysize: string;
  initmeterreading: string;
  supplieddate: string;
  placetype: Placetype;
  ownershiptype: Ownershiptype;
  connectionstatus: Connectionstatus;
  description: string;
  creator: User;
  tocreation: string;
}

export class ConnectionDataPage extends DataPage{
    content: Connection[];
}
