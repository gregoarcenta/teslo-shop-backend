<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo-small.svg" width="120" alt="Nest Logo" /></a>
</p>

## Description

This is an initial configuration to start developing a backend application with the nest framework, this configuration includes the passport library for authentication and validation via json web token.

The database used by default is Postgres and initially a 'users' table is created to be able to create and log in users, which also includes the 'roles' field to carry out the roles that define a user.

## Project setup

```bash
$ pnpm install
```

## Define environment variables

creates a ```.env``` file in the project root based on ```.env.example```

> If you want to make a change or add a new environment variable you must overwrite the __.env.config.ts__ file inside the config folder and add your respective validations

## Other settings

Within the same config folder there are more configuration files, if you want to change the duration of the jwt token enter ```jwt.config.ts```, in the same way if you want to make changes to the TypeORM configuration enter ```typeorm.config.ts``` and add them Additionally, if you want to add more roles, enter ```roles.config.ts``` and add them in the enum

## Authentication

To request that a route require an authentication token, set the ```@Auth()``` decorator:

```typescript
@Get('private-route')
@Auth()
privateRoute(@GetUser() user: User) {
  return this.exampleService.exampleMethod(user);
}
```
> The __@GetUser()__ decorator is used to obtain the user token owner

If you want to add that only a specific role can access a certain route, place the associated enum:

```@Auth(Role.ADMIN)``` or as well ```@Auth(Role.ADMIN, Role.USER)``` for various roles

## Swagger API

Go to ``` http://localhost:3000/api ```

## Compile and run the project in develop mode

```bash
# development
$ pnpm run start:dev
```

## Run tests

```bash
# unit tests
$ pnpm run test

# e2e tests
$ pnpm run test:e2e

# test coverage
$ pnpm run test:cov
```