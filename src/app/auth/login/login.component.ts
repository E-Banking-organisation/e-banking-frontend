import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService, LoginResponse, VerifyResponse } from '../services/auth.service';
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
    private formBuilder: FormBuilder,
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
    this.loginForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required]
    });

    this.twoFaForm = this.formBuilder.group({
      code: ['', [Validators.required, Validators.pattern(/^\d{4}$/)]]
    });

  }

  get f() { return this.loginForm.controls; }
  get f2() { return this.twoFaForm.controls; }

  onSubmit(): void {
    this.submitted = true;
    this.error = '';
    this.success = '';
    if (this.loginForm.invalid) {
      return;
    }
    this.loading = true;
    this.authService.login(this.f['email'].value, this.f['password'].value)
      .subscribe({
        next: (response: LoginResponse) => {
          if (response.pinId && response.phoneNumber) {
            this.show2FA = true;
            this.phoneNumber = this.maskPhoneNumber(response.phoneNumber);
            this.pinId = response.pinId;
            this.loading = false;
          } else {
            const user = this.authService.currentUserValue;
            if (user) {
              this.authService.redirectBasedOnRole(user);
            } else {
              this.error = 'Erreur: utilisateur non connecté après la connexion';
              console.error('User not set after login:', response);
            }
            this.loading = false;
          }
        },
        error: error => {
          this.error = error.message;
          this.loading = false;
          console.error('Login error:', error);
        }
      });
  }


  async onVerifyCode(): Promise<void> {
    this.twoFaSubmitted = true;
    this.error = '';
    this.success = '';
    if (this.twoFaForm.invalid) {
      return;
    }
    this.loading = true;
    try {
      const response = await firstValueFrom(this.authService.verifyCode(this.f2['code'].value));
      const user = this.authService.currentUserValue;
      if (!user || !user.email) {
        console.error('User or email missing:', user);
        throw new Error('Email non récupéré après vérification');
      }

      this.authService.redirectBasedOnRole({
        id: response.clientId,
        email: user.email,
        firstName: '',
        lastName: '',
        role: response.role,
        token: response.token
      });

      this.loading = false;
      this.twoFaSubmitted = false;
    } catch (error: any) {
      this.error = error.message || 'Code de vérification invalide ou erreur serveur';
      this.loading = false;
      console.error('Verification error:', error);
    }
  }

  private maskPhoneNumber(phoneNumber: string): string {
    return phoneNumber.slice(0, 5) + '******' + phoneNumber.slice(-3);
  }


  private credentialToJson(credential: PublicKeyCredential): any {
    const response = credential.response as AuthenticatorAttestationResponse | AuthenticatorAssertionResponse;
    const json: any = {
      id: credential.id,
      rawId: this.arrayBufferToBase64url(credential.rawId),
      type: credential.type,
      response: {
        clientDataJSON: this.arrayBufferToBase64url(response.clientDataJSON)
      }
    };

    if ('attestationObject' in response) {
      json.response.attestationObject = this.arrayBufferToBase64url(response.attestationObject);
    }
    if ('authenticatorData' in response) {
      json.response.authenticatorData = this.arrayBufferToBase64url(response.authenticatorData);
    }
    if ('signature' in response) {
      json.response.signature = this.arrayBufferToBase64url(response.signature);
    }
    if ('userHandle' in response && response.userHandle) {
      json.response.userHandle = this.arrayBufferToBase64url(response.userHandle);
    }

    return json;
  }

  private arrayBufferToBase64url(buffer: ArrayBuffer): string {
    const bytes = new Uint8Array(buffer);
    let binary = '';
    for (let i = 0; i < bytes.byteLength; i++) {
      binary += String.fromCharCode(bytes[i]);
    }
    return btoa(binary).replace(/\+/g, '-').replace(/\//g, '_').replace(/=/g, '');
  }


}
