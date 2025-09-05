import { ApiProperty } from '@nestjs/swagger';

export class CreateAddressDto {
  @ApiProperty({
    description: 'Nome da rua',
    example: 'Rua das Flores, 123',
  })
  street: string;

  @ApiProperty({
    description: 'Nome da cidade',
    example: 'São Paulo',
  })
  city: string;

  @ApiProperty({
    description: 'Estado (UF)',
    example: 'SP',
  })
  state: string;

  @ApiProperty({
    description: 'País',
    example: 'Brasil',
    required: false,
  })
  country?: string;

  @ApiProperty({
    description: 'CEP',
    example: '01234-567',
  })
  zipCode: string;

  @ApiProperty({
    description: 'Longitude (coordenada)',
    example: -46.633308,
    required: false,
  })
  longitude?: number;

  @ApiProperty({
    description: 'Latitude (coordenada)',
    example: -23.55052,
    required: false,
  })
  latitude?: number;
}
