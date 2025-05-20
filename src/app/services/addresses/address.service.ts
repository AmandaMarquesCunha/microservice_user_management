import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Address } from 'src/app/models/address';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class AddressService {
  private readonly api = `${environment.apiUrl}/addresses`;

  constructor(private http: HttpClient) {}

  createAddress(address: Address, userId: number): Observable<Address> {
    return this.http.post<Address>(`${this.api}/v1/create/${userId}`, address);
  }

  getAddresses(
    page = 0,
    size = 10,
    sortBy = 'street',
    direction = 'asc'
  ): Observable<any> {
    const url = `${this.api}/v1/list?page=${page}&size=${size}&sortBy=${sortBy}&direction=${direction}`;
    return this.http.get<any>(url);
  }

  getAddressById(id: number): Observable<Address> {
    return this.http.get<Address>(`${this.api}/v1/list/${id}`);
  }

  getAddressesByUserId(userId: number) {
    return this.http.get<Address[]>(`${this.api}/v1/list-addresses/${userId}/`);
  }

  updateAddress(id: number, address: Address): Observable<Address> {
    return this.http.put<Address>(`${this.api}/v1/update/${id}`, address);
  }

  deleteAddress(id: number): Observable<void> {
    return this.http.delete<void>(`${this.api}/v1/delete/${id}`);
  }

  getAddressByCep(cep: string): Observable<Address> {
    return this.http.get<Address>(`${this.api}/v1/cep/${cep}`);
  }
}
