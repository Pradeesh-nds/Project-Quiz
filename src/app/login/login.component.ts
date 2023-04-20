import { HttpClient } from '@angular/common/http';
import { Component,OnInit } from '@angular/core';
import { Route, Router } from '@angular/router';
import { AppService } from '../app.service';



@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {

username: any='';
password: any='';
errormessage1:any=''
//  data={username:this.username,password:this.password}
 
  public constructor(
    private router:Router,
    private appService:AppService,
    private http :HttpClient,
 
    ){}
  ngOnInit(){
    
    sessionStorage.clear();
  }
  onSubmit(){
    const data={
      username: this.username,
      password: this.password
    };
    
  this.appService.loginUser(data).subscribe((response:any)=>{
    this.appService.storeToken(response.token,data);
   this.errormessage1=response['error message']
  if(response.token!=undefined){
   
    this.router.navigate(['/home'])
    
  }
  
    })
  }

}