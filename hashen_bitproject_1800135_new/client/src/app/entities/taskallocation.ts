import {User} from './user';
import {Vehicle} from './vehicle';
import {Tasktype} from './tasktype';
import {Employee} from './employee';
import {Complaint} from './complaint';
import {DataPage} from '../shared/data-page';
import {Gramaniladharidiv} from './gramaniladharidiv';
import {Connectionrequest} from './connectionrequest';
import {Taskallocationitem} from './taskallocationitem';
import {Reconnectionrequest} from './reconnectionrequest';
import {Modificationrequest} from './modificationrequest';
import {Disconnectionrequest} from './disconnectionrequest';
import {Taskallocationstatus} from './taskallocationstatus';

export class Taskallocation {
  id: number;
  code: string;
  date: string;
  time: string;
  tasktype: Tasktype;
  pobox: string;
  //add title to EEntity
  title: string;
  street: string;
  gramaniladharidiv: Gramaniladharidiv;
  connectionrequest: Connectionrequest;
  disconnectionrequest: Disconnectionrequest;
  reconnectionrequest: Reconnectionrequest;
  modificationrequest: Modificationrequest;
  complaint: Complaint;
  taskallocationstatus: Taskallocationstatus;
  remarks: string;
  taskallocationitemList: Taskallocationitem[];
  vehicleList: Vehicle[];
  employeeList: Employee[];
  creator: User;
  tocreation: string;
}

export class TaskallocationDataPage extends DataPage{
    content: Taskallocation[];
}
