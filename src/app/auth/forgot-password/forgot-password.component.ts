import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { RouterLink, ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-forgot-password',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.css']
})
export class ForgotPasswordComponent implements OnInit {
  forgotForm!: FormGroup;
  resetForm!: FormGroup;
  loading = false;
  submitted = false;
  successMessage = '';
  errorMessage = '';
  token: string | null = null;
  isResetMode = false;

  constructor(
    private formBuilder: FormBuilder,
    private authService: AuthService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    // Subscribe to query parameters to handle dynamic changes
    this.route.queryParams.subscribe(params => {
      this.token = params['token'] || null;
      this.isResetMode = !!this.token;

    });

    this.forgotForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]]
    });

    this.resetForm = this.formBuilder.group({
      password: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', Validators.required]
    }, {validators: this.passwordMatchValidator});
  }

    passwordMatchValidator(form: FormGroup) {
      return form.get('password')!.value === form.get('confirmPassword')!.value
        ? null : { mismatch: true };
    }

    get f() { return this.forgotForm.controls; }
    get r() { return this.resetForm.controls; }

    onSubmit(): void {
      this.submitted = true;
      this.successMessage = '';
      this.errorMessage = '';

      if (this.isResetMode) {
      if (this.resetForm.invalid || !this.token) {
        console.error('Reset form invalid or token missing:', {
          token: this.token,
          formErrors: this.resetForm.errors,
          passwordErrors: this.r['password'].errors,
          confirmPasswordErrors: this.r['confirmPassword'].errors
        });
        return;
      }

      this.loading = true;
      this.authService.resetPassword( 
        this.token!,
        this.forgotForm.value.email,
        this.r['password'].value
      )
      .subscribe({
          next: (response) => {
            this.successMessage = response.message || 'Mot de passe réinitialisé avec succès.';
            this.loading = false;
            this.resetForm.reset();
            this.submitted = false;
            setTimeout(() => this.router.navigate(['/auth/login']), 2000);
          },
          error: (error) => {
            console.error('Reset password error:', error);
            this.errorMessage = error.error?.message || 'Une erreur est survenue. Veuillez réessayer plus tard.';
            this.loading = false;
          }
        });
    } else {
      if (this.forgotForm.invalid) {
        console.error('Forgot form invalid:', this.forgotForm.errors);
        return;
      }

      this.loading = true;
      this.authService.forgotPassword(this.f['email'].value)
        .subscribe({
          next: (response) => {
            this.successMessage = response.message || 'Un email de réinitialisation a été envoyé à votre adresse email.';
            this.loading = false;
            this.forgotForm.reset();
            this.submitted = false;
          },
          error: (error) => {
            console.error('Forgot password error:', error);
            this.errorMessage = error.error?.message || 'Une erreur est survenue. Veuillez réessayer plus tard.';
            this.loading = false;
          }
        });
    }
  }
}
