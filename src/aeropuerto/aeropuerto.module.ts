import { Module } from '@nestjs/common';
import { AeropuertoService } from './aeropuerto.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AeropuertoEntity } from './aeropuerto.entity';

@Module({
  imports: [TypeOrmModule.forFeature([AeropuertoEntity])],
  controllers: [],
  providers: [AeropuertoService],
})
export class AeropuertoModule {}
