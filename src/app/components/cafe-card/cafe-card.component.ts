import { Component, Input, OnInit } from '@angular/core';
import { CateringFacility } from 'src/app/models/cateringFacility';
import { CateringFacilityTypes } from 'src/app/models/cateringFacilityTypes';

@Component({
  selector: 'app-cafe-card',
  templateUrl: './cafe-card.component.html',
  styleUrls: ['./cafe-card.component.scss'],
})
export class CafeCardComponent implements OnInit {
  @Input() cafe: CateringFacility | null = null;

  constructor() {}

  ngOnInit(): void {}

  get mainPicture() {
    return this.cafe?.cateringFacilityIconUrl
      ? this.cafe?.cateringFacilityIconUrl
      : '../../../assets/19.png';
  }

  get type() {
    switch (this.cafe?.cateringFacilityType) {
      case CateringFacilityTypes.Cafe:
      default:
        return 'Кафе';
      case CateringFacilityTypes.Restaurant:
        return 'Ресторан';
      case CateringFacilityTypes.Shop:
        return 'Магазин';
    }
  }

  get price() {
    return this.cafe?.deliveryPrice
      ? `${this.cafe.deliveryPrice} р.`
      : 'Бесплатно';
  }

  get tags() {
    return this.cafe?.cateringFacilityTags?.length
      ? this.cafe?.cateringFacilityTags?.length > 2
        ? `${this.cafe?.cateringFacilityTags[0]}, ${this.cafe?.cateringFacilityTags[1]}...`
        : this.cafe?.cateringFacilityTags.map((x) => x.tagName).join(', ')
      : '';
  }
}
