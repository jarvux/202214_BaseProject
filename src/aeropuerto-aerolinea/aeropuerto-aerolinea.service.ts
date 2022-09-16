import { Injectable } from '@nestjs/common';
import { AeropuertoEntity } from '../aeropuerto/aeropuerto.entity';
import { AerolineaEntity } from '../aerolinea/aerolinea.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import {
  BusinessError,
  BusinessLogicException,
} from '../shared/errors/business-errors';
@Injectable()
export class AeropuertoAerolineaService {
  constructor(
    @InjectRepository(AeropuertoEntity)
    private readonly aeropuertoRepository: Repository<AeropuertoEntity>,

    @InjectRepository(AerolineaEntity)
    private readonly aerolineaRepository: Repository<AerolineaEntity>,
  ) {}

  async addAirportToAirline(
    aerolineaId: string,
    aeropuertoId: string,
  ): Promise<AerolineaEntity> {
    const aeropuerto = await this.getAeropuertoByAeropuertoId(aeropuertoId);
    const aerolinea = await this.getAerolineaByAerolineaId(aerolineaId);

    aerolinea.aeropuertos = [...aerolinea.aeropuertos, aeropuerto];
    return await this.aerolineaRepository.save(aerolinea);
  }

  async findAirportsFromAirline(
    aerolineaId: string,
  ): Promise<AeropuertoEntity[]> {
    const aerolinea = await this.getAerolineaByAerolineaId(aerolineaId);
    return aerolinea.aeropuertos;
  }

  async findAirportFromAirline(
    aerolineaId: string,
    aeropuertoId: string,
  ): Promise<AeropuertoEntity> {
    const aerolinea = await this.getAerolineaByAerolineaId(aerolineaId);
    const aeropuerto = await this.getAeropuertoByAeropuertoId(aeropuertoId);

    const aerolineaAeropuerto: AeropuertoEntity = aerolinea.aeropuertos.find(
      (e) => e.id === aeropuerto.id,
    );

    if (!aerolineaAeropuerto)
      throw new BusinessLogicException(
        'El aeropuerto con el id dado no esta asociado a la aerolinea',
        BusinessError.PRECONDITION_FAILED,
      );

    return aerolineaAeropuerto;
  }

  async updateAirportsFromAirline(
    aerolineaId: string,
    aeropuertos: AeropuertoEntity[],
  ): Promise<AerolineaEntity> {
    const aerolinea = await this.getAerolineaByAerolineaId(aerolineaId);

    for (let i = 0; i < aeropuertos.length; i++) {
      await this.getAerolineaByAerolineaId(aeropuertos[i].id);
    }

    aerolinea.aeropuertos = aeropuertos;
    return await this.aerolineaRepository.save(aerolinea);
  }

  async deleteAirportFromAirline(aerolineaId: string, aeropuertoId: string) {
    const aeropuerto = await this.getAeropuertoByAeropuertoId(aeropuertoId);
    const aerolinea = await this.getAerolineaByAerolineaId(aerolineaId);

    const aerolineAeropuertos: AeropuertoEntity = aerolinea.aeropuertos.find(
      (e) => e.id === aeropuerto.id,
    );

    if (!aerolineAeropuertos)
      throw new BusinessLogicException(
        'El aeropuerto con el id dado no esta asociado a la aerolinea',
        BusinessError.PRECONDITION_FAILED,
      );

    aerolinea.aeropuertos = aerolinea.aeropuertos.filter(
      (e) => e.id !== aeropuertoId,
    );
    await this.aerolineaRepository.save(aerolinea);
  }

  async getAerolineaByAerolineaId(aerolineaId: string) {
    const aerolinea: AerolineaEntity = await this.aerolineaRepository.findOne({
      where: { id: aerolineaId },
      relations: ['aeropuertos'],
    });
    if (!aerolinea)
      throw new BusinessLogicException(
        'La aerolinea con el id dado no fue encontrada',
        BusinessError.NOT_FOUND,
      );
    return aerolinea;
  }

  async getAeropuertoByAeropuertoId(aeropuertoId: string) {
    const aeropuerto: AeropuertoEntity =
      await this.aeropuertoRepository.findOne({
        where: { id: aeropuertoId },
        relations: ['aerolineas'],
      });
    if (!aeropuerto)
      throw new BusinessLogicException(
        'El aeropuerto con el id dado no fue encontrado',
        BusinessError.NOT_FOUND,
      );
    return aeropuerto;
  }
}
