import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
import { DatabaseModule } from './database/database.module';
import { AddressModule } from './address/address.module';
import { WasteModule } from './waste/waste.module';
import { MongooseModule } from '@nestjs/mongoose';

@Module({
  imports: [
    MongooseModule.forRoot(String(process.env.DATABASE_URL), {
      ssl: true,
      tlsAllowInvalidCertificates: true,
      retryWrites: true,
      w: 'majority',
    }),
    AuthModule,
    UserModule,
    DatabaseModule,
    AddressModule,
    WasteModule,
  ],
})
export class AppModule {}
