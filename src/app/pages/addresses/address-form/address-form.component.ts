import {
  Component,
  OnInit,
  Output,
  EventEmitter,
  Input,
  OnChanges,
  SimpleChanges,
} from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Address } from 'src/app/models/address';
import { UserService } from 'src/app/services/users/user.service';
import { User } from 'src/app/models/user';
import { AddressService } from 'src/app/services/addresses/address.service';
import { AddressType } from 'src/app/models/address-type';

@Component({
  selector: 'app-address-form',
  templateUrl: './address-form.component.html',
  styleUrls: ['./address-form.component.scss'],
})
export class AddressFormComponent implements OnInit, OnChanges {
  @Input() address?: Address;
  @Output() save = new EventEmitter<Address>();
  @Output() update = new EventEmitter<Address>();
  addressForm!: FormGroup;
  users: User[] = [];
  addressTypes = [
    { value: AddressType.RESIDENTIAL, label: 'Residencial' },
    { value: AddressType.COMMERCIAL, label: 'Comercial' },
    { value: AddressType.DELIVERY, label: 'Entrega' },
    { value: AddressType.BILLING, label: 'Cobrança' },
  ];

  constructor(
    private fb: FormBuilder,
    private userService: UserService,
    private addressService: AddressService
  ) {}

  ngOnInit(): void {
    this.createForm();
    this.userService.getAllUsers().subscribe((users: any) => {
      if (users && users.content) {
        this.users = users.content;
      } else {
        this.users = users;
      }

      if (this.address) {
        const patch: any = {
          street: this.address.street,
          number: this.address.number,
          complement: this.address.complement,
          neighborhood: this.address.neighborhood,
          city: this.address.city,
          state: this.address.state,
          zipCode: this.address.zipCode,
          type: this.address.type,
          userId: this.address.user?.id || '',
        };
        this.addressForm.patchValue(patch);
      }
    });
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['address'] && this.addressForm && this.address) {
      const patch: any = {
        street: this.address.street,
        number: this.address.number,
        complement: this.address.complement,
        neighborhood: this.address.neighborhood,
        city: this.address.city,
        state: this.address.state,
        zipCode: this.address.zipCode,
        type: this.address.type,
        userId: this.address.user?.id || '',
      };
      this.addressForm.patchValue(patch);
    }
  }

  private createForm() {
    this.addressForm = this.fb.group({
      street: ['', Validators.required],
      number: ['', Validators.required],
      complement: [''],
      neighborhood: ['', Validators.required],
      city: ['', Validators.required],
      state: ['', Validators.required],
      zipCode: ['', Validators.required],
      type: ['', Validators.required],
      userId: ['', Validators.required],
    });
  }

  submit() {
    if (this.addressForm.invalid) {
      // Marca todos os campos como tocados para exibir mensagens
      Object.keys(this.addressForm.controls).forEach((field) => {
        const control = this.addressForm.get(field);
        control?.markAsTouched({ onlySelf: true });
      });
      // Foca no primeiro campo inválido
      const firstInvalid = Object.keys(this.addressForm.controls).find(
        (key) => this.addressForm.get(key)?.invalid
      );
      if (firstInvalid) {
        const el = document.querySelector(
          `[formcontrolname="${firstInvalid}"]`
        );
        if (el) (el as HTMLElement).focus();
      }
      return;
    }
    const formValue = this.addressForm.value;
    const userId = Number(formValue.userId);
    const { userId: _, ...addressData } = formValue;
    if (this.address && this.address.id) {
      this.update.emit({
        ...addressData,
        id: this.address.id,
        user: this.address.user,
      });
    } else {
      this.save.emit({ ...addressData, userId });
      this.addressForm.reset();
    }
  }

  searchCep() {
    const cep = this.addressForm.get('zipCode')?.value;
    if (cep && cep.length >= 8) {
      this.addressService.getAddressByCep(cep).subscribe({
        next: (data) => {
          if (data) {
            this.addressForm.patchValue({
              street: data.street,
              complement: data.complement,
              neighborhood: data.neighborhood,
              city: data.city,
              state: data.state,
            });
          }
        },
        error: (err) => {
          console.warn('CEP não encontrado ou erro na busca', err);
        },
      });
    }
  }

  getTypeLabel(type: AddressType | string): string {
    const found = this.addressTypes.find((t) => t.value === type);
    return found ? found.label : type;
  }
}
