
# Walkie doggie API

* [Prerequisites](#prerequisites)
* [Starting the api](#starting-be)
    * [Environment variables](#environment-be)
    * [Modes](#modes)
        * [Development](#development)
        * [Testing](#testing)
* [Documentation](#documentation)

<a id="prerequisites"></a>
## Prerequisites

You need to have installed:

* [npm](https://www.npmjs.com/get-npm)

* [docker](https://www.docker.com/products/docker-desktop)
<a id="backend"></a>
## Backend
Inside this section we assume the `backend` folder as the root of the project.

<a id="starting-be"></a>
### Starting the backend

The backend consists in two containers, one for the application and the other for the database. You can start the application in two different modes (development or testing) and in both of them you need to create an environment file (`.env.development` or `.env.testing`) in the root folder. These are the environment variables:

<a id="environment-be"></a>
#### Environment variables
You can also check the `.env.example` file for guidance:
##### `POSTGRES_HOST` (required)
The host of the database.
##### `POSTGRES_PORT` (required)
The port of the database.
##### `POSTGRES_USER` (required)
The user for accessing the database.
##### `POSTGRES_PASSWORD` (required)
The password for accessing the database.
##### `POSTGRES_DB` (required)
The name of the database.
##### `SECRET` (required)
The `secret` value used for JWT generation and verification.
##### `HASHING_SALTS` (required)
Amount of salts used for hashing the users' password.
##### `POSTGRES_LOGGING` (optional | default = `false`)
If true, the application will log every database query.
##### `PORT` (optional | default = `8080`)
The port in which the application will be running.
##### `LOGGER_MIN_LEVEL` (optional | default = `debug`)
We use [pino](https://github.com/pinojs/pino) for logging. You can refer to their [documentation files](https://github.com/pinojs/pino/tree/master/docs) and see the available [levels](https://github.com/pinojs/pino/blob/master/docs/api.md#levels).
Number of results per page for paginated endpoints.
##### `MOMENT_TIMEZONE` (optional | default = `America/Buenos_Aires`)
Timezone in which the dates of the responses will be shown.
##### `AUTOMATICALLY_UP` (optional | default = `false`)
If true, the application will run pending database migrations before start listening.
<a id="development"></a>
#### Modes

<a id="development"></a>
##### Development mode

You have to run `npm run docker-start-dev`.
The containers will be run in background with the following names:

- **Application**: walkie-doggie-api-dev
- **Database**: walkie-doggie-db-dev

The application will be accesible from [http://localhost:8080/](http://localhost:8080/) and the port **9229** will be available to link a debugger.
In this mode you can connect your host machine to the database with the following information:

- **Host**: `POSTGRES_HOST`
- **Port**: 35432
- **Username**: `POSTGRES_USER`
- **Password**: `POSTGRES_PASSWORD`
- **Database name**: `POSTGRES_DB`

<a id="testing"></a>
##### Testing mode

You have to run `npm run docker-test`.
The container (in foreground) will be run the tests, print the coverage and finally will be stopped.

.