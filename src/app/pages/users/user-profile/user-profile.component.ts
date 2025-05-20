import { Component, OnInit } from '@angular/core';
import { UserService } from 'src/app/services/users/user.service';
import { User } from 'src/app/models/user';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from 'src/app/services/auth/auth.service';
import { ActivatedRoute } from '@angular/router';
import { AddressType } from 'src/app/models/address-type';
import { Address } from 'src/app/models/address';
import { Modal } from 'bootstrap';
import { AddressService } from 'src/app/services/addresses/address.service';

@Component({
  selector: 'app-user-profile',
  templateUrl: './user-profile.component.html',
  styleUrls: ['./user-profile.component.scss'],
})
export class UserProfileComponent implements OnInit {
  user: User | null = null;

  addresses: Address[] = [];
  columns = [
    { field: 'street', label: 'Rua' },
    { field: 'number', label: 'Número' },
    { field: 'complement', label: 'Complemento' },
    { field: 'neighborhood', label: 'Bairro' },
    { field: 'city', label: 'Cidade' },
    { field: 'state', label: 'Estado' },
    { field: 'zipCode', label: 'CEP' },
    { field: 'type', label: 'Tipo' },
    { field: 'actions', label: 'Ações' },
  ];
  page = 1;
  pageSize = 5;
  total = 0;
  loading = false;
  addressToDelete?: Address;
  addressToEdit?: Address;

  addressTypes = [
    { value: AddressType.RESIDENTIAL, label: 'Residencial' },
    { value: AddressType.COMMERCIAL, label: 'Comercial' },
    { value: AddressType.DELIVERY, label: 'Entrega' },
    { value: AddressType.BILLING, label: 'Cobrança' },
  ];

  constructor(
    private userService: UserService,
    private toastr: ToastrService,
    private route: ActivatedRoute,
    private addressService: AddressService
  ) {}

  ngOnInit() {
    const usuarioId = Number(this.route.snapshot.params['id']);
    this.getUserById(usuarioId);

    this.getAddressById(usuarioId);
  }

  editUser = () => {
    if (!this.user) return;
    this.userService.updateUser(this.user).subscribe({
      next: () => this.toastr.success('Perfil atualizado com sucesso!'),
      error: () => this.toastr.error('Erro ao atualizar perfil'),
    });
  };

  getUserById(idUser: number) {
    this.userService.getUserById(idUser).subscribe((user: User) => {
      this.user = user;
    });
  }

  getAddressById(idUser: number) {
    this.addressService
      .getAddressesByUserId(idUser)
      .subscribe((addresses: Address[] = []) => {
        this.addresses = (addresses || []).map((addr) => ({
          ...addr,
          userName: addr.user?.name || (this.user?.name ?? '-'),
        }));
      });
  }

  onEditAddress(address: Address) {
    this.addressService.getAddressById(address.id!).subscribe({
      next: (data) => {
        console.log('Dados recebidos para edição:', data);
        this.addressToEdit = data;
        const modal = document.getElementById('editAddressModal');
        if (modal) {
          const bsModal = new Modal(modal);
          bsModal.show();
        }
      },
      error: (err) => {
        console.error('Erro ao buscar endereço para edição', err);
      },
    });
  }

  onSaveAddress(address: any) {
    const userId = address.userId || (address.user && address.user.id);
    const addressData = { ...address };
    delete addressData.userId;
    this.addressService.createAddress(addressData, userId).subscribe({
      next: () => {
        const modal = document.getElementById('addressModal');
        if (modal) {
          const bsModal = Modal.getInstance(modal);
          bsModal?.hide();
        }
        this.getAddressById(this.page);
      },
      error: (err) => {
        console.error('Erro ao criar endereço', err);
      },
    });
  }

  onUpdateAddress(address: Address) {
    if (!this.addressToEdit) return;

    const updatePayload = {
      ...address,
      id: this.addressToEdit.id,
      user: this.addressToEdit.user,
    };
    this.addressService
      .updateAddress(this.addressToEdit.id!, updatePayload)
      .subscribe({
        next: () => {
          if (this.user) {
            this.getAddressById(this.user.id!);
          }
          this.addressToEdit = undefined;
          const modal = document.getElementById('editAddressModal');
          if (modal) {
            const bsModal = Modal.getInstance(modal);
            bsModal?.hide();
          }
        },
        error: (err) => {
          console.error('Erro ao atualizar endereço', err);
        },
      });
  }

  onDeleteAddress(address: Address) {
    this.addressToDelete = address;
    const modal = document.getElementById('deleteAddressModal');
    if (modal) {
      const bsModal = new Modal(modal);
      bsModal.show();
    }
  }

  confirmDeleteAddress() {
    if (!this.addressToDelete) return;
    this.addressService.deleteAddress(this.addressToDelete.id!).subscribe({
      next: () => {
        if (this.user) {
          this.getAddressById(this.user.id!);
        }
        this.addressToDelete = undefined;
        const modal = document.getElementById('deleteAddressModal');
        if (modal) {
          const bsModal = Modal.getInstance(modal);
          bsModal?.hide();
        }
      },
      error: (err) => {
        console.error('Erro ao excluir endereço', err);
      },
    });
  }

  openCreateAddressModal() {
    const modal = document.getElementById('addressModal');
    if (modal) {
      const bsModal = new Modal(modal);
      bsModal.show();
    }
  }

  getTypeLabel(type: AddressType | string): string {
    const found = this.addressTypes.find((t) => t.value === type);
    return found ? found.label : type;
  }
}
