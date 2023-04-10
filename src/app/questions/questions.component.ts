import { Component } from '@angular/core';
import { AppService } from '../app.service';
import { Route, Router } from '@angular/router';
import {HttpClient,HttpHeaders, HttpInterceptor,HttpHandler, HttpEvent, HttpRequest} from '@angular/common/http';
import { Observable } from 'rxjs';
import { FormsModule, NgForm } from '@angular/forms';


@Component({
  selector: 'app-questions',
  templateUrl: './questions.component.html',
  styleUrls: ['./questions.component.css']
})
export class QuestionsComponent {
  inputs:any[]=[];
 
  ngOnInit(){
    
    this.appService.getAuthorization().subscribe((res: any) => {
     if(res.Authorization==false||res.Admin==false){
      this.router.navigate(['/'])
     }
   
    });

   }
   formsubmitted=false;
 question: any='';
  option_a: any='';
  option_b: any='';
  option_c: any='';
  option_d: any='';
  validhours:any='';
  created=sessionStorage.getItem('user')

addInput(){
if(this.inputs.length<2){
  this.inputs.push({value:''});
  }
}
removeInput(){
  if(this.inputs.length>0){
        this.inputs.pop();
    
  }
}
  errormessage:any='';
  public constructor(private appService:AppService,
    private router:Router,
    private http:HttpClient){}

onSubmit(submit:NgForm){   
  this.formsubmitted=true;
  if(this.inputs.length>0){
    this.option_c=this.inputs[0].value;
    if(this.inputs.length==2){
      this.option_d=this.inputs[1].value;
    }
  }
 
 var questions={question:this.question,hours:this.validhours,created:this.created}
 var options={option1:this.option_a,option2:this.option_b,option3:this.option_c,option4:this.option_d}
 this.appService.createQuestion(questions,options).subscribe((response:any)=>{
alert(response.message);
 })
 submit.reset()
}

}
