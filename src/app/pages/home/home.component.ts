import { Component, OnInit } from '@angular/core';
import { UserService } from 'src/app/services/users/user.service';
import { User } from 'src/app/models/user';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements OnInit {
  user: User | null = null;

  constructor(private userService: UserService) {}

  ngOnInit() {
    this.userService.getCurrentUser().subscribe({
      next: (user: User) => {
        this.user = user;
        console.log('Usuário logado:', user);
        if (user && user.role) {
          console.log('Role do usuário logado:', user.role);
        }
      },
      error: () => {
        console.error('Erro ao buscar usuário logado');
        this.user = null;
      },
    });
  }
}
