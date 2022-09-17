import { faker } from '@faker-js/faker';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { AerolineaEntity } from '../aerolinea/aerolinea.entity';
import { AeropuertoEntity } from '../aeropuerto/aeropuerto.entity';
import { TypeOrmTestingConfig } from '../shared/testing-utils/typeorm-testing-config';
import { Repository } from 'typeorm';
import { AeropuertoAerolineaService } from './aeropuerto-aerolinea.service';

describe('AerolineaAeropuertoService', () => {
  let service: AeropuertoAerolineaService;
  let aerolineaRepository: Repository<AerolineaEntity>;
  let aerolinea: AerolineaEntity;

  let aeropuertoRepository: Repository<AeropuertoEntity>;
  let aeropuertosList: AeropuertoEntity[];

  const seedDatabase = async () => {
    await aeropuertoRepository.clear();
    await aerolineaRepository.clear();

    aeropuertosList = [];
    for (let i = 0; i < 5; i++) {
      const aeropuerto: AeropuertoEntity = await aeropuertoRepository.save({
        nombre: faker.company.name(),
        codigo: '12345',
        pais: 'Polombia',
        ciudad: 'Tabogo',
      });
      aeropuertosList.push(aeropuerto);
    }

    aerolinea = await aerolineaRepository.save({
      nombre: faker.company.name(),
      descripcion: faker.lorem.sentence(),
      fechaFundacion: new Date(2018, 11, 24, 10, 33, 30, 0),
      paginaWeb: faker.internet.url(),
      aeropuertos: aeropuertosList,
    });
  };

  const getNewAeropuerto = () => {
    return aeropuertoRepository.save({
      nombre: faker.company.name(),
      codigo: '12345',
      pais: 'Colombia',
      ciudad: 'Bogota',
    });
  };

  const getNewAerolinea = () => {
    return aerolineaRepository.save({
      nombre: faker.company.name(),
      descripcion: faker.lorem.sentence(),
      fechaFundacion: new Date(2018, 11, 24, 10, 33, 30, 0),
      paginaWeb: faker.internet.url(),
    });
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [...TypeOrmTestingConfig()],
      providers: [AeropuertoAerolineaService],
    }).compile();

    service = module.get<AeropuertoAerolineaService>(
      AeropuertoAerolineaService,
    );
    aeropuertoRepository = module.get<Repository<AeropuertoEntity>>(
      getRepositoryToken(AeropuertoEntity),
    );
    aerolineaRepository = module.get<Repository<AerolineaEntity>>(
      getRepositoryToken(AerolineaEntity),
    );
    await seedDatabase();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('addAirportToAirline should add an aeropuerto to a aerolinea', async () => {
    const newAeropuerto: AeropuertoEntity = await getNewAeropuerto();
    const newAerolinea: AerolineaEntity = await getNewAerolinea();

    const result: AerolineaEntity = await service.addAirportToAirline(
      newAerolinea.id,
      newAeropuerto.id,
    );

    expect(result.aeropuertos.length).toBe(1);
    expect(result.aeropuertos[0]).not.toBeNull();
    expect(result.aeropuertos[0].nombre).toBe(newAeropuerto.nombre);
  });

  it('addAirportToAirline should thrown exception for an invalid aeropuerto', async () => {
    const newAerolinea: AerolineaEntity = await getNewAerolinea();

    await expect(() =>
      service.addAirportToAirline(newAerolinea.id, '0'),
    ).rejects.toHaveProperty(
      'message',
      'El aeropuerto con el id dado no fue encontrado',
    );
  });

  it('addAirportToAirline should throw an exception for an invalid aerolinea', async () => {
    const newAeropuerto: AeropuertoEntity = await getNewAeropuerto();

    await expect(() =>
      service.addAirportToAirline('0', newAeropuerto.id),
    ).rejects.toHaveProperty(
      'message',
      'La aerolinea con el id dado no fue encontrada',
    );
  });

  it('findAirportFromAirline should return aeropuerto by aerolinea', async () => {
    const aeropuerto: AeropuertoEntity = aeropuertosList[0];
    const storedAeropuerto: AeropuertoEntity =
      await service.findAirportFromAirline(aerolinea.id, aeropuerto.id);
    expect(storedAeropuerto).not.toBeNull();
    expect(storedAeropuerto.nombre).toBe(aeropuerto.nombre);
  });

  it('findAirportFromAirline should throw an exception for an invalid aeropuerto', async () => {
    await expect(() =>
      service.findAirportFromAirline(aerolinea.id, '0'),
    ).rejects.toHaveProperty(
      'message',
      'El aeropuerto con el id dado no fue encontrado',
    );
  });

  it('findAirportFromAirline should throw an exception for an invalid aerolinea', async () => {
    const aeropuerto: AeropuertoEntity = aeropuertosList[0];
    await expect(() =>
      service.findAirportFromAirline('0', aeropuerto.id),
    ).rejects.toHaveProperty(
      'message',
      'La aerolinea con el id dado no fue encontrada',
    );
  });

  it('findAirportFromAirline should throw an exception for an aeropuerto not associated to the aerolinea', async () => {
    const newAeropuerto: AeropuertoEntity = await getNewAeropuerto();

    await expect(() =>
      service.findAirportFromAirline(aerolinea.id, newAeropuerto.id),
    ).rejects.toHaveProperty(
      'message',
      'El aeropuerto con el id dado no esta asociado a la aerolinea',
    );
  });

  it('findAirportsFromAirline should return aeropuertos by aerolinea', async () => {
    const aeropuertos: AeropuertoEntity[] =
      await service.findAirportsFromAirline(aerolinea.id);
    expect(aeropuertos.length).toBe(aeropuertosList.length);
  });

  it('findAirportsFromAirline should throw an exception for an invalid aerolinea', async () => {
    await expect(() =>
      service.findAirportsFromAirline('0'),
    ).rejects.toHaveProperty(
      'message',
      'La aerolinea con el id dado no fue encontrada',
    );
  });

  it('updateAirportsFromAirline should update aeropuertos list for a aerolinea', async () => {
    const newAeropuerto: AeropuertoEntity = await getNewAeropuerto();

    const updatedAerolinea: AerolineaEntity =
      await service.updateAirportsFromAirline(aerolinea.id, [newAeropuerto]);
    expect(updatedAerolinea.aeropuertos.length).toBe(1);
    expect(updatedAerolinea.aeropuertos[0].nombre).toBe(newAeropuerto.nombre);
  });

  it('updateAirportsFromAirline should throw an exception for an invalid aerolinea', async () => {
    const newAeropuerto: AeropuertoEntity = await getNewAeropuerto();

    await expect(() =>
      service.updateAirportsFromAirline('0', [newAeropuerto]),
    ).rejects.toHaveProperty(
      'message',
      'La aerolinea con el id dado no fue encontrada',
    );
  });

  it('updateAirportsFromAirline should throw an exception for an invalid aeropuerto', async () => {
    const newAeropuerto: AeropuertoEntity = aeropuertosList[0];
    newAeropuerto.id = '0';

    await expect(() =>
      service.updateAirportsFromAirline(aerolinea.id, [newAeropuerto]),
    ).rejects.toHaveProperty(
      'message',
      'El aeropuerto con el id dado no fue encontrado',
    );
  });

  it('deleteAeropuertoToAerolinea should remove an aeropuerto from a aerolinea', async () => {
    const aeropuerto: AeropuertoEntity = aeropuertosList[0];

    await service.deleteAirportFromAirline(aerolinea.id, aeropuerto.id);

    const storedAerolinea: AerolineaEntity = await aerolineaRepository.findOne({
      where: { id: `${aerolinea.id}` },
      relations: ['aeropuertos'],
    });
    const deletedAeropuerto: AeropuertoEntity =
      storedAerolinea.aeropuertos.find((a) => a.id === aeropuerto.id);

    expect(deletedAeropuerto).toBeUndefined();
  });

  it('deleteAeropuertoToAerolinea should thrown an exception for an invalid aeropuerto', async () => {
    await expect(() =>
      service.deleteAirportFromAirline(aerolinea.id, '0'),
    ).rejects.toHaveProperty(
      'message',
      'El aeropuerto con el id dado no fue encontrado',
    );
  });

  it('deleteAeropuertoToAerolinea should thrown an exception for an invalid aerolinea', async () => {
    const aeropuerto: AeropuertoEntity = aeropuertosList[0];
    await expect(() =>
      service.deleteAirportFromAirline('0', aeropuerto.id),
    ).rejects.toHaveProperty(
      'message',
      'La aerolinea con el id dado no fue encontrada',
    );
  });

  it('deleteAeropuertoToAerolinea should thrown an exception for an non asocciated aeropuerto', async () => {
    const newAeropuerto: AeropuertoEntity = await getNewAeropuerto();

    await expect(() =>
      service.deleteAirportFromAirline(aerolinea.id, newAeropuerto.id),
    ).rejects.toHaveProperty(
      'message',
      'El aeropuerto con el id dado no esta asociado a la aerolinea',
    );
  });
});
