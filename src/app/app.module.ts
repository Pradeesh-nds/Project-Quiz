import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LoginComponent } from './login/login.component';

import { HttpClientModule,HTTP_INTERCEPTORS } from '@angular/common/http';
import { Observable } from 'rxjs';
import {MatFormFieldModule} from '@angular/material/form-field';

import {MatButtonModule} from '@angular/material/button';
import {MatInputModule} from '@angular/material/input';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations'; 
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { QuestionsComponent } from './questions/questions.component';

import { AuthInterceptor } from './authInterceptor';
const routes:Routes=[
  {path:'',component:LoginComponent},
  {path:'home',component:HomeComponent},
  {path:'Question',component:QuestionsComponent}
]
@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    HomeComponent,
    QuestionsComponent
  ],
  imports: [
   
      MatButtonModule,
      MatFormFieldModule,
      MatInputModule,FormsModule,
      BrowserAnimationsModule,
    BrowserModule,RouterModule,RouterModule.forRoot(routes),
    AppRoutingModule,FormsModule,HttpClientModule
  ],
  providers: [ { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true },],

  bootstrap: [AppComponent]
})
export class AppModule { }
