import {User} from './user';
import {Gender} from './gender';
import {Nametitle} from './nametitle';
import {Designation} from './designation';
import {DataPage} from '../shared/data-page';
import {Employeestatus} from './employeestatus';
import {Unit} from './unit';

export class Employee {
  id: number;
  code: string;
  nametitle: Nametitle;
  callingname: string;
  fullname: string;
  dobirth: string;
  gender: Gender;
  nic: string;
  photo: string;
  mobile: string;
  land: string;
  email: string;
  address: string;
  designation: Designation;
  dorecruit: string;
  employeestatus: Employeestatus;
  description: string;
  creator: User;
  unit: Unit;
  tocreation: string;
}

export class EmployeeDataPage extends DataPage{
    content: Employee[];
}
