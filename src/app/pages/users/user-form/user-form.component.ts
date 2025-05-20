import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { User } from 'src/app/models/user';
import { UserRole } from 'src/app/models/user-role';
import { UserService } from 'src/app/services/users/user.service';

@Component({
  selector: 'app-user-form',
  templateUrl: './user-form.component.html',
  styleUrls: ['./user-form.component.scss'],
})
export class UserFormComponent {
  @Output('submit') enviarParent: EventEmitter<any> = new EventEmitter();
  @Input() userToEdit: User | null = null;
  userForm!: FormGroup;

  @Input() user: User | null = null;
  @Input() buttonLabel: string = '';
  @Input() newUser: boolean = false;
  @Input() onSubmit: () => void = () => {};
  @Input() isEdit: boolean = false;
  @Input() actionBackButton: string = '';

  roles = Object.values(UserRole);

  constructor(
    private fb: FormBuilder,
    private userService: UserService,
    private toastr: ToastrService
  ) {}

  ngOnInit(): void {
    this.initForm();
    if (this.userToEdit && this.userToEdit.id) {
      this.userForm.patchValue(this.userToEdit);
    } else if (this.user) {
      this.userForm.patchValue(this.user);
    }
    this.userService.getCurrentUser().subscribe({
      next: (user) => {
        this.user = user;
      },
      error: (err) => {
        console.error(err);
      },
    });
  }

  ngOnChanges() {
    if (this.userForm && this.userToEdit && this.userToEdit.id) {
      this.userForm.patchValue(this.userToEdit);
    } else if (this.userForm && this.user) {
      this.userForm.patchValue(this.user);
    }
  }

  initForm() {
    this.userForm = this.fb.group({
      id: [null],
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.required]],
      role: [''],
    });
  }

  submit() {
    if (this.userForm.invalid) {
      Object.keys(this.userForm.controls).forEach((field) => {
        const control = this.userForm.get(field);
        control?.markAsTouched({ onlySelf: true });
      });

      const firstInvalid = Object.keys(this.userForm.controls).find(
        (key) => this.userForm.get(key)?.invalid
      );
      if (firstInvalid) {
        const el = document.querySelector(
          `[formcontrolname="${firstInvalid}"]`
        );
        if (el) (el as HTMLElement).focus();
      }
      return;
    }
    let userData: User = this.userForm.value;

    if (this.userToEdit && this.userToEdit.id && !userData.id) {
      userData = { ...userData, id: this.userToEdit.id };
    }
    this.enviarParent.emit(userData);
    this.userForm.reset();
  }

  handleSubmit() {
    this.submit();
  }
}
