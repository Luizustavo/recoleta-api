export class CreateAddressDto {
  street: string;
  city: string;
  state: string;
  country?: string;
  zipCode: string;
  longitude?: number;
  latitude?: number;
}
