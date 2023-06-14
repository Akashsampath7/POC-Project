import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { ApiService, Roles } from '../shared/api.service';
import { AuthService } from '../shared/auth.service';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  userRole: string;
  fullname: string;
  password: string;
  errorMessage: string;
  loggedInUser: string;
  adminPhotoUrl: SafeResourceUrl;
  
  public loginForm !: FormGroup
  apiService: any;

  constructor(private formBuilder: FormBuilder, private http: HttpClient, private router: Router, private api: ApiService, private authService: AuthService, private sanitizer: DomSanitizer) { 
    const imagePath = 'assets/loginn-logo.png';
    this.adminPhotoUrl = this.sanitizer.bypassSecurityTrustResourceUrl(imagePath);
  }

  ngOnInit(): void {
    this.loginForm = this.formBuilder.group({
      email:[''],
      password:['']
    });
  }
  login(){
    this.http.get<any>("http://localhost:3000/signupUsers")
    .subscribe(res=>{
      const user=res.find((a:any)=> {
        return a.email === this.loginForm.value.email && a.password === this.loginForm.value.password
      });
      if(this.fullname === 'admin' && this.password === 'admin'){
        this.router.navigate(['/author']);
        //this.router.navigate(['/dashboard'])
        alert("Login Success");
        sessionStorage.setItem('encryptedPwd',btoa('admin'));
        console.log(atob('YWRtaW4='));
        this.loginForm.reset();
        this.userRole='admin';
        sessionStorage.setItem('userRole', this.userRole);
        this.apiService.setLoggedInEmail(this.fullname);
        
      } else if (this.fullname === 'teacher' && this.password === 'teacher') {
      this.router.navigate(['/dashboard']);
      alert("Login Success");
      sessionStorage.setItem('encryptedPwd',btoa('teacher'));
        console.log(atob('dGVhY2hlcg=='));
      this.loginForm.reset();
      this.userRole='teacher';
      sessionStorage.setItem('userRole', this.userRole);

    } else if (this.fullname === 'student' && this.password === 'student') {
      this.router.navigate(['/dashboard']);
      alert("Login Success");
      sessionStorage.setItem('encryptedPwd',btoa('student'));
        console.log(atob('c3R1ZGVudA=='));
      this.loginForm.reset();
      this.userRole='student';
      sessionStorage.setItem('userRole', this.userRole);

    } else {
      console.log('Invalid credentials');
      alert("user not found!!");
      this.loginForm.reset();
    }
  })
  }
}