import { Component, OnInit } from '@angular/core';
import Modal from 'bootstrap/js/dist/modal';
import { Address } from 'src/app/models/address';
import { AddressService } from 'src/app/services/addresses/address.service';
import { AddressType } from 'src/app/models/address-type';

@Component({
  selector: 'app-address-list',
  templateUrl: './address-list.component.html',
  styleUrls: ['./address-list.component.scss'],
})
export class AddressListComponent implements OnInit {
  addresses: Address[] = [];
  columns = [
    { field: 'userName', label: 'Usuário' },
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

  constructor(private addressService: AddressService) {}

  ngOnInit(): void {
    this.getAddresses(this.page);
  }

  getAddresses(page: number = 1) {
    this.loading = true;
    this.addressService.getAddresses(page - 1, this.pageSize).subscribe({
      next: (res: any) => {
        console.log('Resposta da API de endereços:', res);
        this.addresses = (res.content || []).map((addr: any) => ({
          ...addr,
          userName: addr.user?.name || '-',
        }));
        this.total = res.totalElements || 0;
        this.loading = false;
      },
      error: () => {
        this.loading = false;
      },
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
        this.getAddresses(this.page);
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
          this.getAddresses(this.page);
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
        this.getAddresses(this.page);
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
