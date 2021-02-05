import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})

export class AppComponent {
  // AppComponent.setInterval(event, 5000);
  imageNumber: number = 1;

  ngOnInit() {
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
