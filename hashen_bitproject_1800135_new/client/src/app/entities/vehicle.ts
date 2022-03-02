import {User} from './user';
import {Vehicletype} from './vehicletype';
import {DataPage} from '../shared/data-page';
import {Unit} from './unit';

export class Vehicle {
  id: number;
  no: string;
  vehicletype: Vehicletype;
  brand: string;
  model: string;
  regyear: string;
  photo: string;
  description: string;
  unit: Unit;
  creator: User;
  tocreation: string;
}

export class VehicleDataPage extends DataPage{
    content: Vehicle[];
}
