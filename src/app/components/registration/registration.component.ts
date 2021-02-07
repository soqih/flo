import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-registration',
  templateUrl: './registration.component.html',
  styleUrls: ['./registration.component.css']
})
export class RegistrationComponent implements OnInit {
  imageNumber: number = 1;
  constructor() { }

  ngOnInit(): void {
    const inte = setInterval(() => {
      if (this.imageNumber == 1)
        this.imageNumber = 2;
      else if (this.imageNumber == 2)
        this.imageNumber = 3
      else if (this.imageNumber == 3)
        this.imageNumber = 1;

    }, 4000)
  }

}
