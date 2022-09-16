import { Module } from '@nestjs/common';
import { AerolineaService } from './aerolinea.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AerolineaEntity } from './aerolinea.entity';

@Module({
  imports: [TypeOrmModule.forFeature([AerolineaEntity])],
  controllers: [],
  providers: [AerolineaService],
})
export class AerolineaModule {}
