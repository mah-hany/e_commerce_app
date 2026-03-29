import { Component, inject, PLATFORM_ID, signal, WritableSignal } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, ReactiveFormsModule, ValidationErrors, Validators } from '@angular/forms';
import { MyaccountService } from '../../core/services/myaccount_service/myaccount-service';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { RouterModule } from '@angular/router';

function passwordMatchValidator(control: AbstractControl): ValidationErrors | null {
  const newPass     = control.get('newPassword')?.value;
  const confirmPass = control.get('confirmPassword')?.value;
  return newPass === confirmPass ? null : { mismatch: true };
}

@Component({
  selector: 'app-myaccount',
  imports: [CommonModule, RouterModule, ReactiveFormsModule],
  templateUrl: './myaccount.html',
  styleUrl: './myaccount.css',
})
export class Myaccount {
  private fb             = inject(FormBuilder);
  private accountService = inject(MyaccountService);
  private platformId     = inject(PLATFORM_ID);
 
  // Profile form signals
  profileLoading: WritableSignal<boolean> = signal(false);
  profileSuccess: WritableSignal<boolean> = signal(false);
  profileError:   WritableSignal<string>  = signal('');
 
  // Password form signals
  passwordLoading:  WritableSignal<boolean> = signal(false);
  passwordSuccess:  WritableSignal<boolean> = signal(false);
  passwordError:    WritableSignal<string>  = signal('');
  showCurrentPass:  WritableSignal<boolean> = signal(false);
  showNewPass:      WritableSignal<boolean> = signal(false);
  showConfirmPass:  WritableSignal<boolean> = signal(false);
 
  // Forms
  profileForm: FormGroup = this.fb.group({
    name:  ['', Validators.required],
    email: ['', [Validators.required, Validators.email]],
    phone: ['', Validators.required],
  });
 
  passwordForm: FormGroup = this.fb.group({
    currentPassword: ['', [Validators.required, Validators.minLength(6)]],
    newPassword:     ['', [Validators.required, Validators.minLength(6)]],
    confirmPassword: ['', Validators.required],
  }, { validators: passwordMatchValidator });
 
  ngOnInit(): void {
    if (isPlatformBrowser(this.platformId)) {
      // Pre-fill name from localStorage
      const name = localStorage.getItem('userName') || '';
      this.profileForm.patchValue({ name });
    }
  }
 
  saveProfile(): void {
    if (this.profileForm.invalid) return;
 
    this.profileLoading.set(true);
    this.profileSuccess.set(false);
    this.profileError.set('');
 
    const { name, email, phone } = this.profileForm.value;
 
    this.accountService.updateProfile({ name, email, phone }).subscribe({
      next: (res) => {
        this.profileLoading.set(false);
        this.profileSuccess.set(true);
        // Update stored name
        if (isPlatformBrowser(this.platformId)) {
          localStorage.setItem('userName', res.user?.name || name);
        }
        setTimeout(() => this.profileSuccess.set(false), 3000);
      },
      error: (err) => {
        this.profileLoading.set(false);
        this.profileError.set(err?.error?.message || 'Failed to update profile.');
      }
    });
  }
 
  changePassword(): void {
    if (this.passwordForm.invalid) return;
    if (this.passwordForm.errors?.['mismatch']) {
      this.passwordError.set('New passwords do not match.');
      return;
    }
 
    this.passwordLoading.set(true);
    this.passwordSuccess.set(false);
    this.passwordError.set('');
 
    const { currentPassword, newPassword, confirmPassword } = this.passwordForm.value;
 
    // this.accountService.changePassword({ currentPassword, password: newPassword, rePassword: confirmPassword }).subscribe({
    //   next: () => {
    //     this.passwordLoading.set(false);
    //     this.passwordSuccess.set(true);
    //     this.passwordForm.reset();
    //     setTimeout(() => this.passwordSuccess.set(false), 3000);
    //   },
    //   error: (err) => {
    //     this.passwordLoading.set(false);
    //     this.passwordError.set(err?.error?.message || 'Failed to change password.');
    //   }
    // });
  }
}
