import { forwardRef, Module } from '@nestjs/common';
import { AddressService } from './address.service';
import { AddressController } from './address.controller';
import { DatabaseModule } from 'src/database/database.module';
import { AuthModule } from 'src/auth/auth.module';

@Module({
  imports: [DatabaseModule, forwardRef(() => AuthModule)],
  exports: [AddressService],
  controllers: [AddressController],
  providers: [AddressService],
})
export class AddressModule {}
