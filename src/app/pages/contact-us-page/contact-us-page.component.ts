import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { FeedbackCategories } from 'src/app/models/feedbackCategories';
import { Towns } from 'src/app/models/towns';
import { Store } from '@ngrx/store';
import { AppState } from 'src/app/state/app.state';
import { CateringFacilitiesState } from 'src/app/models/state/cateringFacilitiesState';
import { Subject, takeUntil } from 'rxjs';
import { CateringFacility } from 'src/app/models/cateringFacility';
import { RequestsService } from 'src/app/services/requests.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-contact-us-page',
  templateUrl: './contact-us-page.component.html',
  styleUrls: ['./contact-us-page.component.scss'],
})
export class ContactUsPageComponent implements OnInit, OnDestroy {
  feedbackForm: FormGroup;
  types = FeedbackCategories;
  towns = Towns;
  currentType = FeedbackCategories.Review;
  currentTown = Towns.Minsk;
  cateringFacilities: CateringFacility[] = [];
  cateringFacilitiesInCurrentTown: CateringFacility[] = [];
  currentCateringFacility: CateringFacility | null = null;
  currentCateringFacilityIsValid: boolean = true;
  private $unsubscribe: Subject<void> = new Subject<void>();

  constructor(
    private store: Store<AppState>,
    private requestsService: RequestsService,
    private router: Router
  ) {
    this.feedbackForm = new FormGroup({
      name: new FormControl('', Validators.required),
      surname: new FormControl('', Validators.required),
      email: new FormControl('', [Validators.required, Validators.email]),
      patronymic: new FormControl(),
      feedback: new FormControl(),
    });
  }

  ngOnInit(): void {
    this.store
      .select<CateringFacilitiesState>((state) => state.cateringFacilitiesState)
      .pipe(takeUntil(this.$unsubscribe))
      .subscribe((cateringFacilitiesState) => {
        this.cateringFacilities = cateringFacilitiesState.allCateringFacilities;
        this.cateringFacilitiesInCurrentTown = this.cateringFacilities.filter(
          (x) => x.town === this.currentTown
        );
        this.currentCateringFacility =
          this.cateringFacilitiesInCurrentTown[0] ?? null;
      });
  }

  get patronymic() {
    return this.feedbackForm.get('patronymic');
  }

  get name() {
    return this.feedbackForm.get('name');
  }

  get surname() {
    return this.feedbackForm.get('surname');
  }

  get email() {
    return this.feedbackForm.get('email');
  }

  get feedback() {
    return this.feedbackForm.get('feedback');
  }

  onSubmit(event: any) {
    event.preventDefault();
    event.stopPropagation();

    if (this.feedbackForm?.invalid) {
      this.patronymic?.invalid && this.patronymic.markAsDirty();
      this.name?.invalid && this.name.markAsDirty();
      this.surname?.invalid && this.surname.markAsDirty();
      this.email?.invalid && this.email.markAsDirty();
      this.feedback?.invalid && this.feedback.markAsDirty();
      return;
    }

    if (!this.currentCateringFacility) {
      this.currentCateringFacilityIsValid = false;
      return;
    }
    this.currentCateringFacilityIsValid = true;

    this.requestsService
      .AddFeedback({
        name: this.name?.value,
        surname: this.surname?.value,
        patronymic: this.patronymic?.value,
        email: this.email?.value,
        text: this.feedback?.value,
        feedbackCategory: this.currentType,
        cateringFacilityId: this.currentCateringFacility.id,
      })
      .subscribe({
        next: () => this.router.navigate(['']),
        error: (e) => console.error(e),
      });
  }

  onChangeType(type: string) {
    this.currentType = parseInt(type);
  }

  onChangeLocationType(type: string) {
    this.currentTown = parseInt(type);
    this.cateringFacilitiesInCurrentTown = this.cateringFacilities.filter(
      (x) => x.town === parseInt(type)
    );
    this.currentCateringFacility =
      this.cateringFacilitiesInCurrentTown[0] ?? null;
  }

  onChangeCateringFacility(id: string) {
    this.currentCateringFacility =
      this.cateringFacilities.find((x) => x.id === id) ?? null;
  }

  ngOnDestroy(): void {
    this.$unsubscribe.next();
    this.$unsubscribe.complete();
  }
}
