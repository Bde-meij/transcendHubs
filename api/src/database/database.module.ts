import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Friend } from 'src/friends/entities/friend.entity';
import { User } from 'src/user/entities/user.entity';

@Module({
	imports: [
		TypeOrmModule.forRootAsync({
			imports: [ConfigModule],
			inject: [ConfigService],
			useFactory: (configService: ConfigService) => ({
				type: 'postgres',
				host: configService.getOrThrow('POSTGRES_HOST'),
				port: configService.getOrThrow('POSTGRES_PORT'),
				username: configService.getOrThrow('POSTGRES_USERNAME'),
				password: configService.getOrThrow('POSTGRES_PASSWORD'),
				database: configService.getOrThrow('POSTGRES_DB'),
				synchronize: configService.getOrThrow('POSTGRES_SYNC'),
				logging: true,
				entities: [
					User,
					Friend,
				],
			})
		}),
	]
})
export class DatabaseModule {}
