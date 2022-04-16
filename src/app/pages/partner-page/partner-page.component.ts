import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { CateringFacilityTypes } from 'src/app/models/cateringFacilityTypes';
import { RequestsService } from 'src/app/services/requests.service';

@Component({
  selector: 'app-partner-page',
  templateUrl: './partner-page.component.html',
  styleUrls: ['./partner-page.component.scss'],
})
export class PartnerPageComponent implements OnInit {
  partnerForm: FormGroup;
  types = CateringFacilityTypes;
  currentType = CateringFacilityTypes.Cafe;

  constructor(
    private requestsService: RequestsService,
    private router: Router
  ) {
    this.partnerForm = new FormGroup({
      cafeName: new FormControl('', [Validators.required]),
      name: new FormControl('', Validators.required),
      surname: new FormControl('', Validators.required),
      email: new FormControl('', [Validators.required, Validators.email]),
      phone: new FormControl('', [Validators.required]),
      patronymic: new FormControl(),
    });
  }

  ngOnInit(): void {}

  get cafeName() {
    return this.partnerForm.get('cafeName');
  }

  get patronymic() {
    return this.partnerForm.get('patronymic');
  }

  get name() {
    return this.partnerForm.get('name');
  }

  get surname() {
    return this.partnerForm.get('surname');
  }

  get email() {
    return this.partnerForm.get('email');
  }

  get phone() {
    return this.partnerForm.get('phone');
  }

  onChangeType(type: string) {
    this.currentType = parseInt(type);
  }

  onSubmit(event: any) {
    event.preventDefault();
    event.stopPropagation();

    if (this.partnerForm?.invalid) {
      this.cafeName?.invalid && this.cafeName.markAsDirty();
      this.patronymic?.invalid && this.patronymic.markAsDirty();
      this.name?.invalid && this.name.markAsDirty();
      this.surname?.invalid && this.surname.markAsDirty();
      this.email?.invalid && this.email.markAsDirty();
      this.phone?.invalid && this.phone.markAsDirty();
      return;
    }

    this.requestsService
      .AddPartnerRequest({
        cateringFacilityName: this.cafeName?.value,
        name: this.name?.value,
        surname: this.surname?.value,
        patronymic: this.patronymic?.value,
        phone: this.phone?.value,
        email: this.email?.value,
        cateringFacilityType: this.currentType,
      })
      .subscribe({
        next: () => this.router.navigate(['']),
        error: (e) => console.error(e),
      });
  }
}
