import { Component } from '@angular/core';
import { AppService } from '../app.service';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { NgForm } from '@angular/forms';
import { AppComponent } from '../app.component';
@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent {
  optionletter: any = ['a', 'b', 'c', 'd'];
  answers: any = {};
  questions: any = [];
  submitted: any = false;
  date=new Date();
  public constructor(private appService: AppService,
    private router: Router,
    private http: HttpClient,
    private appComponent:AppComponent) { }
  ngOnInit() {
    this.appComponent.islogedin=true;
    this.appService.getAuthorization().subscribe((res: any) => {
      if(res.Authorization==false){
       this.router.navigate(['/'])
      }
    
     });
    if (!sessionStorage.getItem('submitted')) {
      this.appService.dailyQuiz().subscribe((res: any) => {
        this.questions = res.rows;
        console.log(this.questions)


      });
    }

  }
  redirection(key:any){
    if(key=="home"){
      this.router.navigate(['/home']);
    }

  }
  onSubmit(submit: NgForm) {
    console.log(this.answers)
    const user = sessionStorage.getItem('user');
    const senddata = [];
    senddata.push({ 'submitedby': user })
    for (let i = 0; i < Object.keys(this.answers).length; i++) {
      senddata.push({ 'Question_Id': Object.keys(this.answers)[i], 'Answer': Object.values(this.answers)[i] })
    }

    console.log(senddata)
    this.appService.submitAnswers(senddata).subscribe((res: any) => {
      if (res.message == 'success') {
        this.submitted = true;
        alert('success')
        sessionStorage.setItem('submitted', 'true');


      }
      else {
        alert('Answer not Submitted')
      }
    });


  }
  



}
