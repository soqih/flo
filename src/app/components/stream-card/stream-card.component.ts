import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-stream-card',
  templateUrl: './stream-card.component.html',
  styleUrls: ['./stream-card.component.css']
})
export class StreamCardComponent implements OnInit {

  @Input() username: string;
  @Input() name: string;
  @Input() avatar: string;
  @Input() title: string;
  @Input() views: number;
  @Input() likes: number;
  @Input() dislikes: number;

  constructor() { }
  ngOnInit(): void {
  }
}







