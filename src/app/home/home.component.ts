import { Component } from '@angular/core';
import { AppService } from '../app.service';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { NgForm } from '@angular/forms';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent {
  optionletter: any = ['a', 'b', 'c', 'd'];
  answers: any = {};
  questions: any = [];
  submitted: any = sessionStorage.getItem();
  public constructor(private appService: AppService,
    private router: Router,
    private http: HttpClient) { }
  ngOnInit() {
    this.appService.getAuthorization().subscribe((res: any) => {
      if (res.Authorization == false) {
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
