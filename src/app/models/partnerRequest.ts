import { CateringFacilityTypes } from './cateringFacilityTypes';

export interface PartnerRequest {
  cateringFacilityName: string;
  name: string;
  surname: string;
  patronymic: string;
  phone: string;
  email: string;
  cateringFacilityType: CateringFacilityTypes;
}
