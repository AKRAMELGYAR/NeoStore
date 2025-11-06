import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule } from '@nestjs/config';
import { BrandModule, CategoryModule, SubCategoryModule, UserModule, ProductModule, CouponModule, CartModule, OrderModule } from './modules';
import { GlobalModule } from './GlobalModule';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: './config/.env',
    }),
    MongooseModule.forRoot(process.env.URL as string),

    GlobalModule,
    UserModule,
    CategoryModule,
    SubCategoryModule,
    BrandModule,
    ProductModule,
    CouponModule,
    CartModule,
    OrderModule
  ],
  controllers: [AppController],
  providers: [AppService],
})


export class AppModule { }
