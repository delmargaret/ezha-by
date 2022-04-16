import { VehicleTypes } from './vehicleTypes';

export interface CourierRequest {
  name: string;
  surname: string;
  patronymic: string;
  phone: string;
  email: string;
  vehicleType: VehicleTypes;
  fuelConsumption: number;
}
