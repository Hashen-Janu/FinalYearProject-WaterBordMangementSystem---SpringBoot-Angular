import {User} from './user';
import {Iorder} from './iorder';
import {DataPage} from '../shared/data-page';
import {Itemreciveitem} from './itemreciveitem';

export class Itemrecive {
  id: number;
  code: string;
  iorder: Iorder;
  date: string;
  itemreciveitemList: Itemreciveitem[];
  description: string;
  creator: User;
  tocreation: string;
}

export class ItemreciveDataPage extends DataPage{
    content: Itemrecive[];
}
