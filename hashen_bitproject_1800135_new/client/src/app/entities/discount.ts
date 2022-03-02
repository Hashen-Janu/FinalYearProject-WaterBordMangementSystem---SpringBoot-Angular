import {User} from './user';
import {Discounttype} from './discounttype';
import {DataPage} from '../shared/data-page';
import {Discountstatus} from './discountstatus';
import {Connectiontype} from './connectiontype';

export class Discount {
  id: number;
  code: string;
  name: string;
  discountstatus: Discountstatus;
  discounttype: Discounttype;
  value: number;
  connectiontypeList: Connectiontype[];
  description: string;
  creator: User;
  tocreation: string;
}

export class DiscountDataPage extends DataPage{
    content: Discount[];
}
