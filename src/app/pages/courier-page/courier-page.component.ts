import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { VehicleTypes } from 'src/app/models/vehicleTypes';
import { RequestsService } from 'src/app/services/requests.service';

@Component({
  selector: 'app-courier-page',
  templateUrl: './courier-page.component.html',
  styleUrls: ['./courier-page.component.scss'],
})
export class CourierPageComponent implements OnInit {
  courierForm: FormGroup;
  types = VehicleTypes;
  currentType = VehicleTypes.Car;

  constructor(
    private requestsService: RequestsService,
    private router: Router
  ) {
    this.courierForm = new FormGroup({
      name: new FormControl('', Validators.required),
      surname: new FormControl('', Validators.required),
      email: new FormControl('', [Validators.required, Validators.email]),
      phone: new FormControl('', [Validators.required]),
      patronymic: new FormControl(),
      fuelConsumption: new FormControl(),
    });
  }

  ngOnInit(): void {}

  get fuelConsumption() {
    return this.courierForm.get('fuelConsumption');
  }

  get patronymic() {
    return this.courierForm.get('patronymic');
  }

  get name() {
    return this.courierForm.get('name');
  }

  get surname() {
    return this.courierForm.get('surname');
  }

  get email() {
    return this.courierForm.get('email');
  }

  get phone() {
    return this.courierForm.get('phone');
  }

  onChangeType(type: string) {
    this.currentType = parseInt(type);

    if (this.currentType === this.types.Bike) {
      !this.fuelConsumption?.value && this.fuelConsumption?.setValue(1);
    } else {
      this.fuelConsumption?.setValue('');
    }
  }

  onSubmit(event: any) {
    event.preventDefault();
    event.stopPropagation();

    if (this.courierForm?.invalid) {
      this.patronymic?.invalid && this.patronymic.markAsDirty();
      this.name?.invalid && this.name.markAsDirty();
      this.surname?.invalid && this.surname.markAsDirty();
      this.email?.invalid && this.email.markAsDirty();
      this.phone?.invalid && this.phone.markAsDirty();
      this.currentType !== this.types.Bike &&
        this.fuelConsumption?.invalid &&
        this.fuelConsumption?.markAsDirty();
      return;
    }

    this.requestsService
      .AddCourierRequest({
        name: this.name?.value,
        surname: this.surname?.value,
        patronymic: this.patronymic?.value,
        phone: this.phone?.value,
        email: this.email?.value,
        vehicleType: this.currentType,
        fuelConsumption:
          this.currentType === this.types.Bike
            ? 0
            : this.fuelConsumption?.value,
      })
      .subscribe({
        next: () => this.router.navigate(['']),
        error: (e) => console.error(e),
      });
  }
}
