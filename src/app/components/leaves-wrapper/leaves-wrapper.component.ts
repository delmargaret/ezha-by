import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-leaves-wrapper',
  templateUrl: './leaves-wrapper.component.html',
  styleUrls: ['./leaves-wrapper.component.scss'],
})
export class LeavesWrapperComponent implements OnInit {
  @Input() leavesClass: string = 'normal';

  constructor() {}

  ngOnInit(): void {}
}
