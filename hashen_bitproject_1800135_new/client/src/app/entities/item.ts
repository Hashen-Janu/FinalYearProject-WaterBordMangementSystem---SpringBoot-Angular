import {User} from './user';
import {DataPage} from '../shared/data-page';

export class Item {
  id: number;
  code: string;
  name: string;
  price: number;
  qty: number;
  rop: number;
  photo: string;
  description: string;
  creator: User;
  tocreation: string;
}

export class ItemDataPage extends DataPage{
    content: Item[];
}
