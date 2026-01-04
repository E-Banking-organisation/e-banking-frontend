import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService, LoginResponse } from '../services/auth.service';
import { firstValueFrom } from 'rxjs';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  loginForm!: FormGroup;
  twoFaForm!: FormGroup;

  loading = false;
  submitted = false;
  twoFaSubmitted = false;

  error = '';
  success = '';

  show2FA = false;
  phoneNumber = '';
  pinId = '';

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private authService: AuthService
  ) {
    if (this.authService.isLoggedIn()) {
      const user = this.authService.currentUserValue;
      if (user) {
        this.authService.redirectBasedOnRole(user);
      }
    }
  }

  ngOnInit(): void {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required]
    });

    this.twoFaForm = this.fb.group({
      code: ['', [Validators.required, Validators.pattern(/^\d{4}$/)]]
    });
  }

  get f() {
    return this.loginForm.controls;
  }

  get f2() {
    return this.twoFaForm.controls;
  }

  onSubmit(): void {
    this.submitted = true;
    this.error = '';
    this.success = '';

    if (this.loginForm.invalid) {
      return;
    }

    this.loading = true;

    this.authService.login(
      this.f['email'].value,
      this.f['password'].value
    ).subscribe({
      next: () => {
        const user = this.authService.currentUserValue;
        if (user) {
          this.authService.redirectBasedOnRole(user);
        }
        this.loading = false;
      },
      error: err => {
        this.error = err?.error || 'Erreur de connexion';
        this.loading = false;
      }
    });
  }
}
