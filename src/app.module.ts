import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
import { DatabaseModule } from './database/database.module';
import { AddressModule } from './address/address.module';

@Module({
  imports: [AuthModule, UserModule, DatabaseModule, AddressModule],
})
export class AppModule {}
