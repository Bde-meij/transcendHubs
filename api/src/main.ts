import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as cookieParser from 'cookie-parser';

async function bootstrap() {
	const app = await NestFactory.create(AppModule);

	app.setGlobalPrefix('api');

	app.enableCors({
		origin: ["http://f1r3s14.codam.nl:4200"],
		credentials: false,
	})

	app.use(cookieParser());

	await app.listen(3000);
}
bootstrap();
