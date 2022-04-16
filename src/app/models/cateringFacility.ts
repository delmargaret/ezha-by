import { CateringFacilityStatuses } from './cateringFacilityStatuses';
import { CateringFacilityTypes } from './cateringFacilityTypes';
import { Tag } from './tag';
import { Towns } from './towns';

export interface CateringFacility {
  id: string;
  cateringFacilityName: string;
  cateringFacilityIconUrl: string;
  deliveryTime: string;
  deliveryPrice: number;
  cateringFacilityType: CateringFacilityTypes;
  workingHours: string;
  town: Towns;
  street: string;
  houseNumber: string;
  cateringFacilityStatus: CateringFacilityStatuses;
  cateringFacilityTags: Tag[];
}
