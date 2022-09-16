import { TypeOrmModule } from '@nestjs/typeorm';
import { ProductEntity } from '../../product/product.entity';
import { StoreEntity } from '../../store/store.entity';
import { AerolineaEntity } from '../../aerolinea/aerolinea.entity';
import { AeropuertoEntity } from '../../aeropuerto/aeropuerto.entity';

export const TypeOrmTestingConfig = () => [
  TypeOrmModule.forRoot({
    type: 'sqlite',
    database: ':memory:',
    dropSchema: true,
    entities: [ProductEntity, StoreEntity, AerolineaEntity, AeropuertoEntity],
    synchronize: true,
    keepConnectionAlive: true,
  }),
  TypeOrmModule.forFeature([
    ProductEntity,
    StoreEntity,
    AerolineaEntity,
    AeropuertoEntity,
  ]),
];
