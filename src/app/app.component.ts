import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AppService } from './app.service';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'angular_login';
  public constructor(private router: Router,
    private appService:AppService){}
  createQuestion() {
    this.appService.getAuthorization().subscribe((res: any) => {
      if (res.Admin == false) {
        alert("Only Admin Can Access");
      }
      else {
        this.router.navigate(['/Question']);
      }
    });
  }
}
