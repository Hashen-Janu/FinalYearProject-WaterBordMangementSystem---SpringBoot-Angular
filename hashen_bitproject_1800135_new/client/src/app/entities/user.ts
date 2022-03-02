import {Role} from './role';
import {DataPage} from '../shared/data-page';
import {Employee} from './employee';

export class User {
  id: number;
  roleList: Role[];
  username: string;
  password: string;
  status: string;
  tocreation: string;
  creator: User;
  photo: string;

  employee: Employee;

  static getDisplayName(user: User): string{
    if (user.employee) { return user.employee.code + '-' + user.employee.nametitle.name + ' ' + user.employee.callingname; }
    return user.username;
  }
}

export class UserDataPage extends DataPage{
  content: User[];
}