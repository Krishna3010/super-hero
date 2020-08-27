import { Component, OnInit } from '@angular/core';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {Router} from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  signInForm = new FormGroup({
    user_id: new FormControl('', [
      Validators.required,
    ]),
    password: new FormControl('', [
      Validators.required,
    ])
  });
  constructor(private router: Router) { }

  ngOnInit(): void {
  }

  canSubmit(): boolean {
    return this.signInForm.valid;
  }

  submit() {
    this.router.navigate(['dashboard']);
  }

}
