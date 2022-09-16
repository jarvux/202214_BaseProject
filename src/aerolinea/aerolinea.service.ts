import { Injectable } from '@nestjs/common';
import { AerolineaEntity } from './aerolinea.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import {
  BusinessError,
  BusinessLogicException,
} from '../shared/errors/business-errors';

@Injectable()
export class AerolineaService {
  constructor(
    @InjectRepository(AerolineaEntity)
    private readonly aerolineaRepositorio: Repository<AerolineaEntity>,
  ) {}

  async create(aerolinea: AerolineaEntity): Promise<AerolineaEntity> {
    const fechaActual = new Date();
    if (aerolinea.fechaFundacion >= fechaActual) {
      throw new BusinessLogicException(
        'La fecha de fundacion debe ser menor a la fecha actual',
        BusinessError.PRECONDITION_FAILED,
      );
    }
    return await this.aerolineaRepositorio.save(aerolinea);
  }

  async findAll(): Promise<AerolineaEntity[]> {
    return await this.aerolineaRepositorio.find({
      relations: ['aeropuertos'],
    });
  }

  async findOne(id: string): Promise<AerolineaEntity> {
    const aerolinea: AerolineaEntity = await this.aerolineaRepositorio.findOne({
      where: { id },
      relations: ['aeropuertos'],
    });
    if (!aerolinea)
      throw new BusinessLogicException(
        'La aerolinea con el id dado no existe',
        BusinessError.NOT_FOUND,
      );
    return aerolinea;
  }

  async update(
    id: string,
    aerolinea: AerolineaEntity,
  ): Promise<AerolineaEntity> {
    const fechaActual = new Date();
    const persistAerolinea: AerolineaEntity =
      await this.aerolineaRepositorio.findOne({ where: { id } });
    if (!persistAerolinea)
      throw new BusinessLogicException(
        'La aerolinea con el id dado no existe',
        BusinessError.NOT_FOUND,
      );
    if (aerolinea.fechaFundacion >= fechaActual) {
      throw new BusinessLogicException(
        'La fecha de fundacion debe ser menor a la fecha actual',
        BusinessError.PRECONDITION_FAILED,
      );
    }
    return await this.aerolineaRepositorio.save({
      ...persistAerolinea,
      ...aerolinea,
    });
  }

  async delete(id: string) {
    const aerolinea: AerolineaEntity = await this.aerolineaRepositorio.findOne({
      where: { id },
    });
    if (!aerolinea)
      throw new BusinessLogicException(
        'La aerolinea con el id dado no existe',
        BusinessError.NOT_FOUND,
      );
    await this.aerolineaRepositorio.remove(aerolinea);
  }
}
