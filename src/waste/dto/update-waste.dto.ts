export class UpdateWasteDto {
  waste?: {
    tipoResiduo?:
      | 'eletrônicos'
      | 'orgânicos'
      | 'plásticos'
      | 'papel'
      | 'vidros'
      | 'metais'
      | 'madeira'
      | 'têxteis'
      | 'diversos';
    peso?: number;
    quantidade?: number;
    unidade?: 'kg' | 'litros' | 'unidades';
    condicao?: 'novo' | 'usado' | 'danificado';
    embalagem?: 'sim' | 'não';
    dataDescarte?: string; // YYYY-MM-DD
    horaDescarte?: string; // HH:MM
    descricaoAdicional?: string;
    imagens?: string[];
  };
  address?: {
    rua?: string;
    numero?: string;
    complemento?: string;
    bairro?: string;
    cidade?: string;
    estado?: string;
    cep?: string;
    referencia?: string;
    principal?: boolean;
  };
}
