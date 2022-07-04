# Sql(DDL) To Model

## Summary

```text
Create a data model using DDL syntax(Using the .sql file extension file)
```

<br/>

## Support

> Database

1. MySql
2. MariaDB

> ORM

1. TypeORM

<br/>

## Requirements

- Node.js v14.+

<br/>

## Install

```bash
# npm
$ npm install -g @newko/sql-to-model

# yarn
$ yarn global add @newko/sql-to-model
```

<br/>

## CLI

```bash
$ model-generate -s [*.sql] -t [target directory] -m [model type] -d [database]
```

<br/>

## Examples

```bash
#Options
options :
  -s, --sqlDir <sqlDir> (.sql File Target directory to reference)
  -t, --targetDir <targetDir> (Name of the project you want to create)
  -m, --modelType <modelType> (TypeORM, Sequelize || default option: TypeORM)
  -d, --database <database> (MySql, MariaDB, Postgresql.. || default option: MySql)

#Command
$ model-generate -s ./sql -t ./ryan

$ model-generate -s ./sql -t ./ryan -m TypeORM -d MySql
```
