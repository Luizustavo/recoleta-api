import { ApiProperty } from '@nestjs/swagger';

export class CreateWasteDto {
  @ApiProperty({
    description: 'Dados do resíduo',
    type: 'object',
    properties: {
      tipoResiduo: {
        type: 'string',
        enum: [
          'eletronicos',
          'organicos',
          'plasticos',
          'papel',
          'vidros',
          'metais',
          'madeira',
          'texteis',
          'diversos',
        ],
        description:
          'Tipo do resíduo (aceita com ou sem acento). Ex: plasticos ou plásticos',
        example: 'plasticos',
      },
      peso: {
        type: 'number',
        description: 'Peso do resíduo',
        example: 2.5,
      },
      quantidade: {
        type: 'number',
        description: 'Quantidade de itens',
        example: 1,
      },
      unidade: {
        type: 'string',
        enum: ['kg', 'litros', 'unidades'],
        description: 'Unidade de medida',
        example: 'kg',
      },
      condicao: {
        type: 'string',
        enum: ['novo', 'usado', 'danificado'],
        description: 'Condição do resíduo',
        example: 'usado',
      },
      embalagem: {
        type: 'string',
        enum: ['sim', 'não'],
        description: 'Possui embalagem',
        example: 'não',
      },
      dataDescarte: {
        type: 'string',
        description: 'Data de descarte no formato YYYY-MM-DD',
        example: '2025-09-05',
      },
      horaDescarte: {
        type: 'string',
        description: 'Hora de descarte no formato HH:MM',
        example: '14:30',
      },
      descricaoAdicional: {
        type: 'string',
        description: 'Descrição adicional do resíduo',
        example: 'Notebook antigo funcionando',
        required: false,
      },
      imagens: {
        type: 'array',
        items: { type: 'string' },
        description: 'Array de imagens em base64',
        example: ['data:image/jpeg;base64,/9j/4AAQSkZJRgABAQEASA...'],
        required: false,
      },
    },
    example: {
      tipoResiduo: 'plasticos',
      peso: 2.5,
      quantidade: 1,
      unidade: 'kg',
      condicao: 'usado',
      embalagem: 'não',
      dataDescarte: '2025-09-05',
      horaDescarte: '14:30',
      descricaoAdicional: 'Garrafas PET limpas',
    },
  })
  waste: {
    tipoResiduo:
      | 'eletronicos'
      | 'organicos'
      | 'plasticos'
      | 'papel'
      | 'vidros'
      | 'metais'
      | 'madeira'
      | 'texteis'
      | 'diversos';
    peso: number;
    quantidade: number;
    unidade: 'kg' | 'litros' | 'unidades';
    condicao: 'novo' | 'usado' | 'danificado';
    embalagem: 'sim' | 'não';
    dataDescarte: string; // YYYY-MM-DD
    horaDescarte: string; // HH:MM
    descricaoAdicional?: string;
    imagens?: string[];
  };

  @ApiProperty({
    description: 'Endereço de descarte do resíduo',
    type: 'object',
    properties: {
      rua: {
        type: 'string',
        description: 'Nome da rua',
        example: 'Rua das Flores',
      },
      numero: {
        type: 'string',
        description: 'Número do imóvel',
        example: '123',
      },
      complemento: {
        type: 'string',
        description: 'Complemento do endereço',
        example: 'Apartamento 45',
        required: false,
      },
      bairro: {
        type: 'string',
        description: 'Bairro',
        example: 'Centro',
      },
      cidade: {
        type: 'string',
        description: 'Cidade',
        example: 'São Paulo',
      },
      estado: {
        type: 'string',
        description: 'Estado (UF)',
        example: 'SP',
      },
      cep: {
        type: 'string',
        description: 'CEP no formato 00000-000',
        example: '01234-567',
      },
      referencia: {
        type: 'string',
        description: 'Ponto de referência',
        example: 'Próximo ao mercado',
        required: false,
      },
      principal: {
        type: 'boolean',
        description: 'Define se é o endereço principal do usuário',
        example: true,
      },
    },
    example: {
      rua: 'Rua das Flores',
      numero: '123',
      bairro: 'Centro',
      cidade: 'São Paulo',
      estado: 'SP',
      cep: '01234-567',
      principal: true,
    },
  })
  address: {
    rua: string;
    numero: string;
    complemento?: string;
    bairro: string;
    cidade: string;
    estado: string;
    cep: string;
    referencia?: string;
    principal: boolean;
  };
}
