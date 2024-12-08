import { Module } from '@nestjs/common';
import {
  ConfigModuleOptions,
  ConfigModule as NestConfigModule,
} from '@nestjs/config';
import Joi from 'joi';
import { join } from 'path';

//@ts-expect-error - the type is correct
const joiJson = Joi.extend((joi) => {
  return {
    type: 'object',
    base: joi.object(),
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    coerce(value, _schema) {
      if (value[0] !== '{' && !/^\s*\{/.test(value)) {
        return;
      }

      try {
        return { value: JSON.parse(value) };
      } catch (err) {
        console.error(err);
      }
    },
  };
});

type DB_SCHEMA_TYPE = {
  DB_VENDOR: 'mysql' | 'sqlite';
  DB_HOST: string;
  DB_PORT: number;
  DB_USERNAME: string;
  DB_PASSWORD: string;
  DB_DATABASE: string;
  DB_LOGGING: boolean;
  DB_AUTOLOAD_MODELS: boolean;
};

export type CONFIG_SCHEMA_TYPE = DB_SCHEMA_TYPE;

type CONFIG_GOOGLE_SCHEMA_TYPE = {
  GOOGLE_CLOUD_CREDENTIALS: object;
  GOOGLE_CLOUD_STORAGE_BUCKET_NAME: string;
};

export const CONFIG_GOOGLE_SCHEMA: Joi.StrictSchemaMap<CONFIG_GOOGLE_SCHEMA_TYPE> =
  {
    GOOGLE_CLOUD_CREDENTIALS: joiJson.object().required(),
    GOOGLE_CLOUD_STORAGE_BUCKET_NAME: Joi.string().required(),
  };

type CONFIG_RABBITMQ_SCHEMA_TYPE = {
  RABBITMQ_URI: string;
};

export const CONFIG_RABBITMQ_SCHEMA: Joi.StrictSchemaMap<CONFIG_RABBITMQ_SCHEMA_TYPE> =
  {
    RABBITMQ_URI: Joi.string().required(),
  };

export const CONFIG_DB_SCHEMA: Joi.StrictSchemaMap<DB_SCHEMA_TYPE> = {
  DB_VENDOR: Joi.string().valid('mysql', 'sqlite').required(),
  DB_HOST: Joi.string().required(),
  DB_PORT: Joi.number().integer().when('DB_VENDOR', {
    is: 'mysql',
    then: Joi.required(),
  }),
  DB_USERNAME: Joi.string().when('DB_VENDOR', {
    is: 'mysql',
    then: Joi.required(),
  }),
  DB_PASSWORD: Joi.string().when('DB_VENDOR', {
    is: 'mysql',
    then: Joi.required(),
  }),
  DB_DATABASE: Joi.string().when('DB_VENDOR', {
    is: 'mysql',
    then: Joi.required(),
  }),

  DB_LOGGING: Joi.boolean().required(),
  DB_AUTOLOAD_MODELS: Joi.boolean().required(),
};

const validationSchema = Joi.object({
  ...CONFIG_DB_SCHEMA,
});

@Module({})
export class ConfigModule extends NestConfigModule {
  static forRoot(options: ConfigModuleOptions = {}) {
    const { envFilePath, ...otherOptions } = options;
    return super.forRoot({
      isGlobal: true,
      envFilePath: [
        ...(Array.isArray(envFilePath) ? envFilePath! : [envFilePath!]),
        join(process.cwd(), 'envs', `.env.${process.env.NODE_ENV!}`),
        join(process.cwd(), 'envs', `.env`),
      ],
      validationSchema,
      ...otherOptions,
      ...CONFIG_GOOGLE_SCHEMA,
      ...CONFIG_RABBITMQ_SCHEMA,
    });
  }
}
