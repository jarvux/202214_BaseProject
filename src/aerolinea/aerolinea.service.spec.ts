import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { TypeOrmTestingConfig } from '../shared/testing-utils/typeorm-testing-config';
import { Repository } from 'typeorm';
import { AerolineaEntity } from './aerolinea.entity';
import { AerolineaService } from './aerolinea.service';
import { faker } from '@faker-js/faker';

describe('AerolineaService', () => {
  let service: AerolineaService;
  let repository: Repository<AerolineaEntity>;
  let aerolineaList: Array<AerolineaEntity>;

  const seedDatabase = async () => {
    await repository.clear();
    aerolineaList = [];
    for (let i = 0; i < 5; i++) {
      const aerolinea: AerolineaEntity = await repository.save({
        nombre: faker.company.name(),
        descripcion: faker.lorem.sentence(),
        fechaFundacion: new Date(),
        paginaWeb: faker.internet.url(),
      });
      aerolineaList.push(aerolinea);
    }
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [...TypeOrmTestingConfig()],
      providers: [AerolineaService],
    }).compile();

    service = module.get<AerolineaService>(AerolineaService);
    repository = module.get<Repository<AerolineaEntity>>(
      getRepositoryToken(AerolineaEntity),
    );
    await seedDatabase();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('findAll should return all aerolineas', async () => {
    const aerolineas: AerolineaEntity[] = await service.findAll();
    expect(aerolineas).not.toBeNull();
    expect(aerolineas).toHaveLength(aerolineaList.length);
  });

  it('findOne should return a aerolinea by id', async () => {
    const storedAerolinea: AerolineaEntity = aerolineaList[0];
    const aerolinea: AerolineaEntity = await service.findOne(
      storedAerolinea.id,
    );
    expect(aerolinea).not.toBeNull();
    expect(aerolinea.nombre).toEqual(storedAerolinea.nombre);
    expect(aerolinea.descripcion).toEqual(storedAerolinea.descripcion);
  });

  it('findOne should throw an exception for an invalid aerolinea', async () => {
    await expect(() => service.findOne('0')).rejects.toHaveProperty(
      'message',
      'La aerolinea con el id dado no existe',
    );
  });

  it('create should return a new aerolinea', async () => {
    const aerolinea: AerolineaEntity = {
      id: '',
      nombre: faker.company.name(),
      descripcion: faker.lorem.sentence(),
      fechaFundacion: new Date(2018, 11, 24, 10, 33, 30, 0),
      paginaWeb: faker.internet.url(),
      aeropuertos: [],
    };

    const newAerolinea: AerolineaEntity = await service.create(aerolinea);
    expect(newAerolinea).not.toBeNull();

    const storedAerolinea: AerolineaEntity = await repository.findOne({
      where: { id: `${newAerolinea.id}` },
    });
    expect(storedAerolinea).not.toBeNull();
    expect(storedAerolinea.id).not.toBeNull();
    expect(storedAerolinea.nombre).toEqual(newAerolinea.nombre);
    expect(storedAerolinea.descripcion).toEqual(newAerolinea.descripcion);
  });

  it('update should modify a aerolinea', async () => {
    const aerolinea: AerolineaEntity = aerolineaList[0];
    aerolinea.nombre = 'New name';
    aerolinea.descripcion = 'New description';
    const updatedAerolinea: AerolineaEntity = await service.update(
      aerolinea.id,
      aerolinea,
    );
    expect(updatedAerolinea).not.toBeNull();
    const storedAerolinea: AerolineaEntity = await repository.findOne({
      where: { id: `${aerolinea.id}` },
    });
    expect(storedAerolinea).not.toBeNull();
    expect(storedAerolinea.nombre).toEqual(aerolinea.nombre);
    expect(storedAerolinea.descripcion).toEqual(aerolinea.descripcion);
  });

  it('update should throw an exception for an invalid aerolinea', async () => {
    let aerolinea: AerolineaEntity = aerolineaList[0];
    aerolinea = {
      ...aerolinea,
      nombre: 'New name',
      descripcion: 'New address',
    };
    await expect(() => service.update('0', aerolinea)).rejects.toHaveProperty(
      'message',
      'La aerolinea con el id dado no existe',
    );
  });

  it('delete should remove a aerolinea', async () => {
    const aerolinea: AerolineaEntity = aerolineaList[0];
    await service.delete(aerolinea.id);
    const deletedAerolinea: AerolineaEntity = await repository.findOne({
      where: { id: `${aerolinea.id}` },
    });
    expect(deletedAerolinea).toBeNull();
  });

  it('delete should throw an exception for an invalid aerolinea', async () => {
    const aerolinea: AerolineaEntity = aerolineaList[0];
    await service.delete(aerolinea.id);
    await expect(() => service.delete('0')).rejects.toHaveProperty(
      'message',
      'La aerolinea con el id dado no existe',
    );
  });
});
