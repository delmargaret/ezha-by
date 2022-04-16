import { CateringFacilityCategory } from './cateringFacilityCategory';
import { DishStatuses } from './dishStatuses';

export interface Dish {
  id: string;
  dishName: string;
  dishIconUrl: string;
  description: string;
  price: number;
  dishStatus: DishStatuses;
  cateringFacilityCategory: CateringFacilityCategory;
}
