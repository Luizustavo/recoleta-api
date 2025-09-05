import { NestFactory } from '@nestjs/core';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Configuração do Swagger
  const config = new DocumentBuilder()
    .setTitle('Recoleta API')
    .setDescription('API para cadastro e gerenciamento de resíduos')
    .setVersion('1.0')
    .addTag('auth', 'Autenticação e validação de token')
    .addTag('user', 'Gerenciamento de usuários')
    .addTag('address', 'Gerenciamento de endereços')
    .addTag('waste', 'Cadastro e gerenciamento de resíduos')
    .addBearerAuth(
      {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        name: 'JWT',
        description: 'Enter JWT token',
        in: 'header',
      },
      'JWT-auth',
    )
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document, {
    customSiteTitle: 'Recoleta API Documentation',
    customfavIcon: '/favicon.ico',
    customCss: '.swagger-ui .topbar { display: none }',
  });

  await app.listen(process.env.PORT ?? 3005);
  console.log(
    `🚀 Server running on http://localhost:${process.env.PORT ?? 3005}`,
  );
  console.log(
    `📚 Swagger documentation available at http://localhost:${process.env.PORT ?? 3005}/api`,
  );
}

void bootstrap();
