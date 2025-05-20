import { Component, ElementRef, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from 'src/app/services/auth/auth.service';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { User } from 'src/app/models/user';
import { UserService } from 'src/app/services/users/user.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
})
export class LoginComponent {
  user: User = {} as User;

  loginForm: FormGroup;
  registerForm: FormGroup;
  loading = false;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private userService: UserService,
    private toastr: ToastrService,
    private router: Router
  ) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required],
    });

    this.registerForm = this.fb.group({
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required],
    });
  }

  onSubmit() {
    if (this.loginForm.invalid) return;

    this.loading = true;
    const { email, password } = this.loginForm.value;

    this.authService.login(email, password).subscribe({
      next: (res) => {
        this.toastr.success('Login realizado com sucesso!');
        // localStorage.setItem('token', res.token);
        // localStorage.setItem('role', res.role);
        this.router.navigate(['/home']);
      },
      error: (err) => {
        this.toastr.error(err.error.message || 'Erro ao realizar login');
        this.loading = false;
      },
      complete: () => {
        this.loading = false;
      },
    });
  }

  createUser = () => {
    if (this.registerForm.invalid) return;

    const userData: User = this.registerForm.value;

    this.userService.createUser(userData).subscribe({
      next: () => {
        this.toastr.success('Usuário criado com sucesso!');
        this.registerForm.reset();
      },
      error: () => this.toastr.error('Erro ao criar usuário'),
    });
  };
}
