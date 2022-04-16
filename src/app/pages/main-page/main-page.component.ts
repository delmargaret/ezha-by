import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Towns } from 'src/app/models/towns';

@Component({
  selector: 'app-main-page',
  templateUrl: './main-page.component.html',
  styleUrls: ['./main-page.component.scss'],
})
export class MainPageComponent implements OnInit {
  towns = Towns;
  townIsValid: boolean = true;

  constructor(private router: Router) {}

  redirectToPartner() {
    this.router.navigate(['./partner']);
  }

  redirectToCourier() {
    this.router.navigate(['./courier']);
  }

  ngOnInit(): void {}

  changeTown() {
    this.townIsValid = true;
  }

  selectLocation(event: any, town: string): void {
    event.preventDefault();
    event.stopPropagation();

    this.townIsValid = true;
    if (!town || town == 'none') {
      this.townIsValid = false;
      return;
    }

    let currentTown = parseInt(town);
    this.router.navigate(['./cafes'], {
      queryParams: { town: currentTown },
      queryParamsHandling: 'merge',
    });
  }
}
