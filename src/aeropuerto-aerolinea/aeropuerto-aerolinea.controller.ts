import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Param,
  Post,
  Put,
  UseInterceptors,
} from '@nestjs/common';
import { BusinessErrorsInterceptor } from '../shared/interceptors/business-errors.interceptor';
import { AeropuertoAerolineaService } from './aeropuerto-aerolinea.service';
import { AeropuertoDto } from '../aeropuerto/aeropuerto.dto';
import { plainToInstance } from 'class-transformer';
import { AeropuertoEntity } from '../aeropuerto/aeropuerto.entity';

@Controller('airlines')
@UseInterceptors(BusinessErrorsInterceptor)
export class AeropuertoAerolineaController {
  constructor(
    private readonly aeropuertoAerolineaService: AeropuertoAerolineaService,
  ) {}

  @Post(':aerolineaId/airports/:aeropuertoId')
  async addAirportToAirline(
    @Param('aerolineaId') aerolineaId: string,
    @Param('aeropuertoId') aeropuertoId: string,
  ) {
    return await this.aeropuertoAerolineaService.addAirportToAirline(
      aerolineaId,
      aeropuertoId,
    );
  }

  @Get(':aerolineaId/airports')
  async findAirportsFromAirline(@Param('aerolineaId') aerolineaId: string) {
    return await this.aeropuertoAerolineaService.findAirportsFromAirline(
      aerolineaId,
    );
  }

  @Get(':aerolineaId/airports/:aeropuertoId')
  async findAirportFromAirline(
    @Param('aerolineaId') aerolineaId: string,
    @Param('aeropuertoId') aeropuertoId: string,
  ) {
    return await this.aeropuertoAerolineaService.findAirportFromAirline(
      aerolineaId,
      aeropuertoId,
    );
  }

  @Put(':aerolineaId/airports')
  async updateAirportsFromAirline(
    @Param('aerolineaId') aerolineaId: string,
    @Body() aeropuertosDto: AeropuertoDto[],
  ) {
    const aeropuertos = plainToInstance(AeropuertoEntity, aeropuertosDto);
    return await this.aeropuertoAerolineaService.updateAirportsFromAirline(
      aerolineaId,
      aeropuertos,
    );
  }

  @Delete(':aerolineaId/airports/:aeropuertoId')
  @HttpCode(204)
  async deleteAirportFromAirline(
    @Param('aerolineaId') aerolineaId: string,
    @Param('aeropuertoId') aeropuertoId: string,
  ) {
    return await this.aeropuertoAerolineaService.deleteAirportFromAirline(
      aerolineaId,
      aeropuertoId,
    );
  }
}
