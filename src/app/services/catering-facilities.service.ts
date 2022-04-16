import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { CateringFacility } from '../models/cateringFacility';
import { Dish } from '../models/dish';
import { ConfigService } from './config.service';

@Injectable()
export class CateringFacilitiesService {
  constructor(private http: HttpClient) {}

  GetAllCateringFacilities(): Observable<CateringFacility[]> {
    return this.http.get<CateringFacility[]>(
      ConfigService.addBaseAddress('api/catering-facilities')
    );
  }

  GetAllDishes(cateringFacilityId: string) {
    return this.http.get<Dish[]>(
      ConfigService.addBaseAddress(
        `api/dishes?cateringFacilityId=${cateringFacilityId}`
      )
    );
  }
}
