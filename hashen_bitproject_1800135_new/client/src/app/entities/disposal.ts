import {User} from './user';
import {Disposalitem} from './disposalitem';
import {DataPage} from '../shared/data-page';

export class Disposal {
  id: number;
  code: string;
  reason: string;
  date: string;
  disposalitemList: Disposalitem[];
  creator: User;
  tocreation: string;
}

export class DisposalDataPage extends DataPage{
    content: Disposal[];
}
