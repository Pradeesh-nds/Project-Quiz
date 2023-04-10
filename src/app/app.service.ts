import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AppService {

  constructor(private http: HttpClient, private router: Router) { }



  loginUser(data: any) {

    return this.http.post("http://localhost:5000/api/login", data);

  }

  
  getAuthorization() {
    return this.http.post("http://localhost:5000/api/authentication", {header:null});
  }
  dailyQuiz(){
    return this.http.post("http://localhost:5000/api/dailyquiz", {header:null});
  }


  storeToken(token: any,data:any) {
    const username=data.username;
     sessionStorage.setItem('user',username)
    if (token != undefined) {
      sessionStorage.setItem('token', token);

    }
  }

 submitAnswers(answers:any){
  return this.http.post("http://localhost:5000/api/submitanswers",{answers});
 }

  createQuestion(question: any,options:any) {
    return this.http.post("http://localhost:5000/api/createquestion", {question,options});
  }


}
