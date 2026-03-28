import { Component, inject, signal, WritableSignal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from '../../services/auth_service/auth-service';

@Component({
  selector: 'app-login',
  imports: [CommonModule, RouterModule, ReactiveFormsModule],
  templateUrl: './login.html',
  styleUrl: './login.css',
})
export class Login {

  private fb= inject(FormBuilder);
  private readonly authService = inject(AuthService);
  private router= inject(Router);

  showPassword: WritableSignal<boolean> = signal(false);
  isLoading:    WritableSignal<boolean> = signal(false);
  errorMessage: WritableSignal<string>  = signal('');

  loginForm: FormGroup = this.fb.group({
    email:    ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(6)]],
  });

  togglePassword(): void {
    this.showPassword.update(v => !v);
  }

  onSubmit(): void {
    if (this.loginForm.invalid) return;

    this.isLoading.set(true);
    this.errorMessage.set('');

    const { email, password } = this.loginForm.value;

    this.authService.singin({ email, password }).subscribe({
      next: (res) => {
        this.isLoading.set(false);
        localStorage.setItem('token', res.token);
        localStorage.setItem('userName', res.user.name);
        this.router.navigate(['/home']);
      },
      error: (err) => {
        this.isLoading.set(false);
        this.errorMessage.set(err?.error?.message || 'Invalid email or password. Please try again.');
      }
    });
  }
}
