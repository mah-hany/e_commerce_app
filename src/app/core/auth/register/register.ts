import { Component, inject, signal, WritableSignal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators, AbstractControl, ValidationErrors } from '@angular/forms';
import { AuthService } from '../../services/auth_service/auth-service';


function passwordMatchValidator(control: AbstractControl): ValidationErrors | null {
  const password    = control.get('password')?.value;
  const rePassword  = control.get('rePassword')?.value;
  return password === rePassword ? null : { mismatch: true };
}

@Component({
  selector: 'app-register',
  imports: [CommonModule, RouterModule, ReactiveFormsModule],
  templateUrl: './register.html',
  styleUrl: './register.css',
})
export class Register {

  private readonly authService = inject(AuthService);
  private fb= inject(FormBuilder);
  private router= inject(Router);


  showPassword:        WritableSignal<boolean> = signal(false);
  showConfirmPassword: WritableSignal<boolean> = signal(false);
  isLoading:           WritableSignal<boolean> = signal(false);
  errorMessage:        WritableSignal<string>  = signal('');
 
  registerForm: FormGroup = this.fb.group({
    name:       ['', [Validators.required, Validators.minLength(3)]],
    email:      ['', [Validators.required, Validators.email]],
    password:   ['', [Validators.required, Validators.minLength(8)]],
    rePassword: ['', Validators.required],
    phone:      ['', [Validators.required, Validators.pattern(/^[+]?[\d\s\-]{10,15}$/)]],
    terms:      [false, Validators.requiredTrue],
  }, { validators: passwordMatchValidator });

  passwordStrength = computed(() => {
    const val: string = this.registerForm?.get('password')?.value || '';
    const len = val.length;
 
    if (len === 0)  return { width: '0%',   color: 'bg-gray-200',  textColor: 'text-gray-400', label: '' };
    if (len < 6)    return { width: '25%',  color: 'bg-red-400',   textColor: 'text-red-500',  label: 'Weak' };
    if (len < 8)    return { width: '50%',  color: 'bg-yellow-400',textColor: 'text-yellow-500',label: 'Fair' };
    if (len < 12)   return { width: '75%',  color: 'bg-blue-400',  textColor: 'text-blue-500', label: 'Good' };
    return           { width: '100%', color: 'bg-green-500', textColor: 'text-green-600',label: 'Strong' };
  });
  togglePassword(): void {
    this.showPassword.update(v => !v);
  }
  toggleConfirmPassword(): void {
    this.showConfirmPassword.update(v => !v);
  }
  onSubmit(): void {
    if (this.registerForm.invalid) return;
 
    this.isLoading.set(true);
    this.errorMessage.set('');
 
    const { name, email, password, rePassword, phone } = this.registerForm.value;
 
    this.authService.signup({ name, email, password, rePassword, phone }).subscribe({
      next: () => {
        this.isLoading.set(false);
        this.router.navigate(['/login']);
      },
      error: (err) => {
        this.isLoading.set(false);
        this.errorMessage.set(err?.error?.message || 'Registration failed. Please try again.');
      }
    });
  }





}
