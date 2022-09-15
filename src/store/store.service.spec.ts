import { Test, TestingModule } from '@nestjs/testing';
import { TypeOrmTestingConfig } from '../shared/testing-utils/typeorm-testing-config';
import { Repository } from 'typeorm';
import { StoreEntity } from './store.entity';
import { StoreService } from './store.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { faker } from '@faker-js/faker';

describe('StoreService', () => {
  let service: StoreService;
  let repository: Repository<StoreEntity>;
  let storesList = [];

  const seedDatabase = async () => {
    repository.clear();
    storesList = [];
    for (let i = 0; i < 5; i++) {
      const store: StoreEntity = await repository.save({
        name: faker.company.name(),
        city: faker.address.cityName(),
        address: faker.address.streetAddress()
      })
      storesList.push(store);
    }
  }

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [...TypeOrmTestingConfig()],
      providers: [
        StoreService],
    }).compile();

    service = module.get<StoreService>(StoreService);
    repository = module.get<Repository<StoreEntity>>(getRepositoryToken(StoreEntity));
    await seedDatabase();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('findAll should return all stores', async () => {
    const stores: StoreEntity[] = await service.findAll();
    expect(stores).not.toBeNull();
    expect(stores).toHaveLength(storesList.length);
  });

  it('findOne should return a store by id', async () => {
    const storedStore: StoreEntity = storesList[0];
    const store: StoreEntity = await service.findOne(storedStore.id);
    expect(store).not.toBeNull();
    expect(store.name).toEqual(storedStore.name)
    expect(store.city).toEqual(storedStore.city)
    expect(store.address).toEqual(storedStore.address)
  });

  it('findOne should throw an exception for an invalid store', async () => {
    await expect(() => service.findOne("0")).rejects.toHaveProperty("message", "The store with the given id was not found")
  });

  it('create should return a new store', async () => {
    const store: StoreEntity = {
      id: "",
      name: faker.company.name(),
      city: faker.address.cityName(),
      address: faker.address.streetAddress(),
      products: []
    }

    const newStore: StoreEntity = await service.create(store);
    expect(newStore).not.toBeNull();

    const storedStore: StoreEntity = await repository.findOne({ where: { id: newStore.id } })
    expect(storedStore).not.toBeNull();
    expect(storedStore.name).toEqual(newStore.name)
    expect(storedStore.city).toEqual(newStore.city)
    expect(storedStore.address).toEqual(newStore.address)
  });

});
