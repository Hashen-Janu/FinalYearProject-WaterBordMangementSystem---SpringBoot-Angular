import {User} from './user';
import {DataPage} from '../shared/data-page';
import {Connectionitem} from './connectionitem';

export class Connectiontype {
  id: number;
  code: string;
  name: string;
  fee: number;
  secdeposit: number;
  nonrefdeposit: number;
  value: number;
  connectionitemList: Connectionitem[];
  creator: User;
  tocreation: string;
}

export class ConnectiontypeDataPage extends DataPage{
    content: Connectiontype[];
}
