import {Usecase} from './usecase';
import {DataPage} from '../shared/data-page';
import {User} from './user';

export class Role {
  id: number;
  name: string;
  usecaseList: Usecase[];
  userList: User[];
  tocreation: string;
  creator: User;

  get activeUserCount(): number{
    let count = 0;

    for (const user of this.userList) {
      if (user.status !== 'Deactivated') {
        count++;
      }
    }

    return count;
  }
}

export class RoleDataPage extends DataPage{
  content: Role[];
}
