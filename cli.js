#!/usr/bin/env node

const path = require("path");
const generate = require("./lib/generate");
const { program } = require("commander");

/**
 * Options:
 *  -s, --sqlDir <sqlDir> 참조할 sql 디렉토리 경로
 *  -t, --targetDir <targetDir> 생성될 디렉토리 경로(없다면 디렉토리를 생성)
 *  -m, --modelType <modelType> TypeORM, Sequelize(ORM 선택)
 *  -d, --database <database> MySQL, MariaDB, Postgresql ...(DB 설정)
 */

program
  .requiredOption("-s, --sqlDir <sqlDir>", "참조할 sql 디렉토리 경로")
  .requiredOption(
    "-t, --targetDir <targetDir>",
    "생성될 디렉토리 경로(없다면 디렉토리를 생성)"
  )
  .option("-m, --modelType <modelType>", "TypeORM OR Sequelize", "TypeORM")
  .option("-d, --database <database>", "MySql, MariaDB, Postgresql...", "MySql")
  .parse();

const { sqlDir, targetDir, modelType, database } = program.opts();

/**
 * @author Ryan
 * @description 모델 생성
 */
generate.setSqlToModel({
  sqlDir: path.resolve(sqlDir),
  targetDir: path.resolve(targetDir),
  modelType,
  database,
});
