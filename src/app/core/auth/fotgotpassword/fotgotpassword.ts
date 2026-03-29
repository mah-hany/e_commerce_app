import { CommonModule } from '@angular/common';
import { Component, inject, signal, WritableSignal } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../services/auth_service/auth-service';

@Component({
  selector: 'app-fotgotpassword',
  imports: [CommonModule, RouterModule, ReactiveFormsModule],
  templateUrl: './fotgotpassword.html',
  styleUrl: './fotgotpassword.css',
})

export class Fotgotpassword  {

  private fb= inject(FormBuilder);
  private authService = inject(AuthService);
  private router= inject(Router);


  currentStep: WritableSignal<number>  = signal(1);
  isLoading:   WritableSignal<boolean> = signal(false);
  errorMsg:    WritableSignal<string>  = signal('');
  successMsg:  WritableSignal<string>  = signal('');
  showNewPass: WritableSignal<boolean> = signal(false);


  emailForm: FormGroup = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
  });

  codeForm: FormGroup = this.fb.group({
    code: ['', Validators.required],
  });

  resetForm: FormGroup = this.fb.group({
    email:       ['', [Validators.required, Validators.email]],
    newPassword: ['', [Validators.required, Validators.minLength(6)]],
  });

  submitEmail(): void {
  if (this.emailForm.invalid) return;
  this.isLoading.set(true);
  this.errorMsg.set('');
  this.successMsg.set('');

  this.authService.forgotPassword({ email: this.emailForm.value.email }).subscribe({
    next: (res) => {
      this.isLoading.set(false);
      this.successMsg.set(res?.message || 'Reset code sent to your email.');
      this.resetForm.patchValue({ email: this.emailForm.value.email });
      setTimeout(() => {
        this.successMsg.set('');
        this.currentStep.set(2);
      }, 1500);
    },
    error: (err) => {
      this.isLoading.set(false);
      this.errorMsg.set(err?.error?.message || 'Failed to send reset email.');
    }
  });
}

  // ── Step 2: Verify code ──
  submitCode(): void {
  if (this.codeForm.invalid) return;
  this.isLoading.set(true);
  this.errorMsg.set('');
  this.successMsg.set('');

  this.authService.verifyResetCode({ resetCode: this.codeForm.value.code }).subscribe({
    next: () => {
      this.isLoading.set(false);
      this.successMsg.set('Code verified successfully!');
      setTimeout(() => {
        this.successMsg.set('');
        this.currentStep.set(3);
      }, 1500);
    },
    error: (err) => {
      this.isLoading.set(false);
      this.errorMsg.set(err?.error?.message || 'Reset code is invalid or has expired.');
    }
  });
 }

  // ── Step 3: Reset password ──
  submitReset(): void {
  if (this.resetForm.invalid) return;
  this.isLoading.set(true);
  this.errorMsg.set('');
  this.successMsg.set('');

  const { email, newPassword } = this.resetForm.value;

  this.authService.resetPassword({ email, newPassword }).subscribe({
    next: () => {
      this.isLoading.set(false);
      this.successMsg.set('Password reset successfully! Redirecting to login...');
      setTimeout(() => this.router.navigate(['/login']), 2000);
    },
    error: (err) => {
      this.isLoading.set(false);
      this.errorMsg.set(err?.error?.message || 'Failed to reset password.');
    }
  });
 }

}