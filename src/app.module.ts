import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ProductEntity } from './product/product.entity';
import { ProductModule } from './product/product.module';
import { StoreEntity } from './store/store.entity';
import { StoreModule } from './store/store.module';
import { AerolineaModule } from './aerolinea/aerolinea.module';
import { AeropuertoModule } from './aeropuerto/aeropuerto.module';
import { AeropuertoAerolineaModule } from './aeropuerto-aerolinea/aeropuerto-aerolinea.module';
import { AerolineaEntity } from './aerolinea/aerolinea.entity';
import { AeropuertoEntity } from './aeropuerto/aeropuerto.entity';

@Module({
  imports: [
    ProductModule,
    StoreModule,
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost',
      port: 5432,
      username: 'postgres',
      password: 'postgres',
      database: 'store',
      entities: [ProductEntity, StoreEntity, AerolineaEntity, AeropuertoEntity],
      dropSchema: true,
      synchronize: true,
      keepConnectionAlive: true,
    }),
    AerolineaModule,
    AeropuertoModule,
    AeropuertoAerolineaModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
