import { IsNotEmpty, IsString } from 'class-validator';

export class AerolineaDto {
  @IsString()
  @IsNotEmpty()
  readonly nombre: string;

  @IsString()
  @IsNotEmpty()
  readonly descripcion: string;

  @IsString()
  @IsNotEmpty()
  readonly fechaFundacion: string;

  @IsString()
  @IsNotEmpty()
  readonly paginaWeb: string;
}
