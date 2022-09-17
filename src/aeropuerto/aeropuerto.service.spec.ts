import { faker } from '@faker-js/faker';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { TypeOrmTestingConfig } from '../shared/testing-utils/typeorm-testing-config';
import { Repository } from 'typeorm';
import { AeropuertoEntity } from './aeropuerto.entity';
import { AeropuertoService } from './aeropuerto.service';

describe('AeropuertoService', () => {
  let service: AeropuertoService;
  let repository: Repository<AeropuertoEntity>;
  let aeropuertoList: Array<AeropuertoEntity>;

  const seedDatabase = async () => {
    await repository.clear();
    aeropuertoList = [];

    for (let i = 0; i < 5; i++) {
      const aeropuerto: AeropuertoEntity = await repository.save({
        nombre: faker.company.name(),
        codigo: '1234567',
        pais: faker.company.name(),
        ciudad: faker.company.name(),
      });
      aeropuertoList.push(aeropuerto);
    }
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [...TypeOrmTestingConfig()],
      providers: [AeropuertoService],
    }).compile();

    service = module.get<AeropuertoService>(AeropuertoService);
    repository = module.get<Repository<AeropuertoEntity>>(
      getRepositoryToken(AeropuertoEntity),
    );

    await seedDatabase();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('findAll should return all aeropuerto', async () => {
    const aeropuerto: AeropuertoEntity[] = await service.findAll();
    expect(aeropuerto).not.toBeNull();
    expect(aeropuerto).toHaveLength(aeropuertoList.length);
  });

  it('findOne should return a aeropuerto by id', async () => {
    const aeropuerto: AeropuertoEntity = await service.findOne(
      aeropuertoList[0].id,
    );
    expect(aeropuerto).not.toBeNull();
    expect(aeropuerto.nombre).toEqual(aeropuertoList[0].nombre);
  });

  it('findOne should throw an exception for an invalid aeropuerto', async () => {
    await expect(() => service.findOne('0')).rejects.toHaveProperty(
      'message',
      'El aeropuerto con el id dado no existe',
    );
  });

  it('create should return a new aeropuerto', async () => {
    const aeropuerto: AeropuertoEntity = {
      id: '',
      nombre: faker.company.name(),
      codigo: '123456789',
      pais: faker.company.name(),
      ciudad: faker.company.name(),
      aerolineas: [],
    };
    const newAeropuerto: AeropuertoEntity = await service.create(aeropuerto);
    expect(newAeropuerto).not.toBeNull();
    const storedAeropuerto: AeropuertoEntity = await repository.findOne({
      where: { id: `${newAeropuerto.id}` },
    });
    expect(storedAeropuerto).not.toBeNull();
    expect(storedAeropuerto.id).not.toBeNull();
    expect(storedAeropuerto.nombre).toEqual(newAeropuerto.nombre);
  });

  it('update should modify a aeropuerto', async () => {
    const aeropuerto: AeropuertoEntity = aeropuertoList[0];
    aeropuerto.nombre = 'New name';
    aeropuerto.codigo = '123';
    const updatedAeropuerto: AeropuertoEntity = await service.update(
      aeropuerto.id,
      aeropuerto,
    );
    expect(updatedAeropuerto).not.toBeNull();
    const storedAeropuerto: AeropuertoEntity = await repository.findOne({
      where: { id: `${aeropuerto.id}` },
    });
    expect(storedAeropuerto).not.toBeNull();
    expect(storedAeropuerto.nombre).toEqual(aeropuerto.nombre);
  });

  it('update should throw an exception for an invalid aeropuerto', async () => {
    let aeropuerto: AeropuertoEntity = aeropuertoList[0];
    aeropuerto = {
      ...aeropuerto,
      nombre: 'New name',
    };
    await expect(() => service.update('0', aeropuerto)).rejects.toHaveProperty(
      'message',
      'El aeropuerto con el id dado no existe',
    );
  });

  it('delete should remove a aeropuerto', async () => {
    const aeropuerto: AeropuertoEntity = aeropuertoList[0];
    await service.delete(aeropuerto.id);
    const deletedAeropuerto: AeropuertoEntity = await repository.findOne({
      where: { id: `${aeropuerto.id}` },
    });
    expect(deletedAeropuerto).toBeNull();
  });

  it('delete should throw an exception for an invalid aeropuerto', async () => {
    const aeropuerto: AeropuertoEntity = aeropuertoList[0];
    await service.delete(aeropuerto.id);
    await expect(() => service.delete('0')).rejects.toHaveProperty(
      'message',
      'El aeropuerto con el id dado no existe',
    );
  });
});
