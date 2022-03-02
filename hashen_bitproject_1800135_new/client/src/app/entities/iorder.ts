import {User} from './user';
import {Orderitem} from './orderitem';
import {Iorderstatus} from './iorderstatus';
import {DataPage} from '../shared/data-page';

export class Iorder {
  id: number;
  code: string;
  doordered: string;
  dorequired: string;
  dorecived: string;
  iorderstatus: Iorderstatus;
  orderitemList: Orderitem[];
  description: string;
  creator: User;
  tocreation: string;
}

export class IorderDataPage extends DataPage{
    content: Iorder[];
}
