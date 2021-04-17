import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-no-content',
  templateUrl: './no-content.component.html',
  styleUrls: ['./no-content.component.css']
})
export class NoContentComponent implements OnInit {
  @Input() where: string;

  constructor() { }
  
  ngOnInit(): void {
  }

}
