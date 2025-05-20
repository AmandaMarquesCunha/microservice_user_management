import 'bootstrap';
import Modal from 'bootstrap/js/dist/modal';
import { Component, OnInit } from '@angular/core';
import { UserService } from 'src/app/services/users/user.service';
import { User } from 'src/app/models/user';
import { ToastrService } from 'ngx-toastr';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-users-list',
  templateUrl: './users-list.component.html',
  styleUrls: ['./users-list.component.scss'],
})
export class UsersListComponent implements OnInit {
  users: User[] = [];
  loading = false;
  page = 1;
  pageSize = 5;
  total = 0;

  registerForm: FormGroup;
  selectedUser: User | null = null;
  userToDelete: User | null = null;
  userLogged: User | null = null;

  columns = [
    { field: 'name', label: 'Nome' },
    { field: 'email', label: 'E-mail' },
    { field: 'role', label: 'Perfil' },
    { field: 'actions', label: 'Ações' },
  ];

  constructor(
    private fb: FormBuilder,
    private userService: UserService,
    private toastr: ToastrService
  ) {
    this.registerForm = this.fb.group({
      id: [null],
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required],
    });
  }

  ngOnInit() {
    this.getUsers();
    this.userService.getCurrentUser().subscribe({
      next: (user) => {
        this.userLogged = user;
      },
      error: () => {
        this.userLogged = null;
      },
    });
  }

  getUsers(page: number = 1) {
    this.loading = true;
    this.userService.getAllUsersPaginated(page - 1, this.pageSize).subscribe({
      next: (res) => {
        this.users = res.content;
        this.total = res.totalElements;
        this.page = page;
      },
      error: () => this.toastr.error('Erro ao carregar usuários'),
      complete: () => (this.loading = false),
    });
  }

  onEditUser(user: User) {
    this.selectedUser = user;

    this.registerForm.patchValue({
      id: user.id,
      name: user.name,
      email: user.email,
    });

    const modal = document.getElementById('userEditModal');
    if (modal) {
      const bsModal = new Modal(modal);
      bsModal.show();
    }
  }

  openCreateUserModal() {
    this.selectedUser = null;
    setTimeout(() => {
      const modal = document.getElementById('userCreateModal');
      if (modal) {
        const backdrops = document.querySelectorAll('.modal-backdrop');
        backdrops.forEach((b) => b.parentNode?.removeChild(b));
        document.body.classList.remove('modal-open');
        document.body.style.overflow = '';
        (document.activeElement as HTMLElement)?.blur();
        const bsModal = new Modal(modal);
        bsModal.show();
      }
    }, 50);
  }

  createUser(user: User) {
    this.userService.createUser(user).subscribe({
      next: () => {
        this.toastr.success('Usuário criado com sucesso!');
        this.getUsers(this.page);
        setTimeout(() => {
          const modal = document.getElementById('userCreateModal');
          if (modal) {
            let bsModal = Modal.getInstance(modal);
            if (!bsModal) {
              bsModal = new Modal(modal);
            }
            bsModal.hide();
          }
          const backdrop = document.querySelector('.modal-backdrop');
          if (backdrop) {
            backdrop.parentNode?.removeChild(backdrop);
          }
          document.body.classList.remove('modal-open');
          document.body.style.overflow = '';
          (document.activeElement as HTMLElement)?.blur();
        }, 100);
      },
      error: () => this.toastr.error('Erro ao criar usuário'),
    });
  }

  updateUser(user: User) {
    console.log('update', user);
    this.userService.updateUser(user).subscribe({
      next: () => {
        this.toastr.success('Usuário atualizado com sucesso!');
        this.getUsers(this.page);
        setTimeout(() => {
          const modal = document.getElementById('userEditModal');
          if (modal) {
            let bsModal = Modal.getInstance(modal);
            if (!bsModal) {
              bsModal = new Modal(modal);
            }
            bsModal.hide();
          }
          const backdrop = document.querySelector('.modal-backdrop');
          if (backdrop) {
            backdrop.parentNode?.removeChild(backdrop);
          }
          document.body.classList.remove('modal-open');
          document.body.style.overflow = '';
          (document.activeElement as HTMLElement)?.blur();
        }, 100);
      },
      error: () => this.toastr.error('Erro ao atualizar usuário'),
    });
  }

  onDeleteUser(user: User) {
    this.userToDelete = user;
    const modal = document.getElementById('deleteUserModal');
    if (modal) {
      const bsModal = new Modal(modal);
      bsModal.show();
    }
  }

  confirmDeleteUser() {
    if (!this.userToDelete) return;
    this.userService.deleteUser(this.userToDelete?.id ?? 0).subscribe({
      next: () => {
        this.toastr.success('Usuário excluído com sucesso!');
        this.getUsers(this.page);
      },
      error: () => this.toastr.error('Erro ao excluir usuário'),
      complete: () => {
        this.userToDelete = null;
        const modal = document.getElementById('deleteUserModal');
        if (modal) {
          const bsModal = Modal.getInstance(modal);
          if (bsModal) {
            bsModal.hide();
          }
        }
      },
    });
  }
}
