import {User} from './user';
import {DataPage} from '../shared/data-page';
import {Itemreturnitem} from './itemreturnitem';

export class Itemreturn {
  id: number;
  code: string;
  reason: string;
  date: string;
  itemreturnitemList: Itemreturnitem[];
  creator: User;
  tocreation: string;
}

export class ItemreturnDataPage extends DataPage{
    content: Itemreturn[];
}
