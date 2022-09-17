import { Module } from '@nestjs/common';
import { AeropuertoAerolineaService } from './aeropuerto-aerolinea.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AeropuertoEntity } from '../aeropuerto/aeropuerto.entity';
import { AerolineaEntity } from '../aerolinea/aerolinea.entity';
import { AeropuertoAerolineaController } from './aeropuerto-aerolinea.controller';

@Module({
  imports: [TypeOrmModule.forFeature([AeropuertoEntity, AerolineaEntity])],
  providers: [AeropuertoAerolineaService],
  controllers: [AeropuertoAerolineaController],
})
export class AeropuertoAerolineaModule {}
