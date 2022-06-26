const fs = require("fs");
const path = require("path");

const {
  setPascalCase,
  findTableName,
  findColumnName,
  findColumnType,
  findNullable,
  findAutoIncrement,
  findComment,
  findDefaultValue,
  findPrimaryKey,
} = require("./function");

function sqlParsing(sqlDir, sqlFileName) {
  //파일 정보 조회
  const sqlFileInfoList = fs.readFileSync(
    path.resolve(sqlDir, sqlFileName),
    "utf8"
  );

  const entityInfo = {
    entityName: "",
    entityClassName: "",
    indexInfoList: [],
    uniqueInfoList: [],
    columnInfoList: [],
  };

  const columnInfoList = [];

  //줄 바꿈 기준으로 자른다.
  const createTableSyntax = sqlFileInfoList.split("\n");

  for (let index = 0; index < createTableSyntax.length; index++) {
    const tableColumnInfo = createTableSyntax[index];

    const columnInfoObject = {};
    const columnInfo = tableColumnInfo
      .replace(/^\s+|\s+$/g, "") //앞, 뒤 띄어쓰기 제거
      .replace(/ +/g, " ") //여러 띄어쓰기를 하나의 띄어쓰기로 변경
      .replace(",", ""); //쉼표 제거

    //첫번째 소괄호 예외처리
    if (tableColumnInfo === "(") {
      continue;
    }

    //빈줄 예외처리
    else if (tableColumnInfo === "") {
      continue;
    }
    //닫히는 괄호시 예외처리
    else if (tableColumnInfo === ");" || tableColumnInfo === ")") {
      continue;
    }

    //테이블 이름 조회
    if (index === 0) {
      const tableName = findTableName(createTableSyntax[0]);
      entityInfo.entityName = tableName;
      entityInfo.entityClassName = setPascalCase(tableName);

      continue;
    }
    //컬럼 속성 리스트 조회
    else {
      //해당 정규식에 해당하지 않아야 Column에 사용된다.
      const columnListRegExp =
        /ALTER TABLE|PRIMARY KEY|CREATE INDEX|CREATE UNIQUE INDEX|ON/;

      if (columnListRegExp.exec(columnInfo) === null) {
        //컬럼 이름 조회
        const columnNames = findColumnName(columnInfo);
        columnInfoObject.columnName = columnNames[0];
        columnInfoObject.variableName = columnNames[1];

        //컬럼 타입 조회
        const columnTypes = findColumnType(columnInfo);
        columnInfoObject.columnType = columnTypes[0];
        columnInfoObject.variableType = columnTypes[1];

        //Null 상태 조회
        const nullabel = findNullable(columnInfo);
        columnInfoObject.nullabel = nullabel;

        //AutoIncrement 조회
        const autoIncrement = findAutoIncrement(columnInfo);
        columnInfoObject.autoIncrement = autoIncrement;

        //기본 값 조회
        const defaultValue = findDefaultValue(columnInfo, columnTypes[0]);
        columnInfoObject.defaultValue = defaultValue;

        //코멘트 조회
        const comment = findComment(columnInfo);
        columnInfoObject.comment = comment;

        columnInfoList.push(columnInfoObject);
        continue;
      }

      //Primary Key
      const primaryKeyRegExp = /PRIMARY KEY/;
      if (
        primaryKeyRegExp.exec(columnInfo) !== null &&
        primaryKeyRegExp.exec(columnInfo)[0] === "PRIMARY KEY"
      ) {
        const primaryList = findPrimaryKey(columnInfo);

        for (let index = 0; index < primaryList.length; index++) {
          const primaryInfo = primaryList[index];

          for (let index = 0; index < columnInfoList.length; index++) {
            const columnInfo = columnInfoList[index];
            if (columnInfo.columnName === primaryInfo) {
              columnInfo.primary = true;
            }
          }
        }

        continue;
      }

      //Index
      const createIndexRegExp = /CREATE INDEX/;

      if (
        createIndexRegExp.exec(columnInfo) !== null &&
        createIndexRegExp.exec(columnInfo)[0] === "CREATE INDEX"
      ) {
        const createIndexOnRegExp = /ON/;

        //ON 값이 다음 줄에 있다면.
        if (createIndexOnRegExp.exec(columnInfo) !== null) {
          const indexList = columnInfo.split(entityInfo.entityName);

          const indexInfo = indexList[2]
            .replace(";", "")
            .replace("(", "")
            .replace(")", "");
          const indexInfoList = "['" + indexInfo + "']";

          entityInfo.indexInfoList.push(indexInfoList);
        }
        //ON 값이 한 줄에 있다면.
        else {
          const columnInfo = createTableSyntax[index + 1];
          const indexList = columnInfo.split(entityInfo.entityName);

          const indexInfo = indexList[1]
            .replace(";", "")
            .replace("(", "")
            .replace(")", "");

          const indexInfoList = "['" + indexInfo + "']";

          entityInfo.indexInfoList.push(indexInfoList);
        }

        continue;
      }

      //Unique
      const createUniqueRegExp = /CREATE UNIQUE INDEX/;

      if (
        createUniqueRegExp.exec(columnInfo) !== null &&
        createUniqueRegExp.exec(columnInfo)[0] === "CREATE UNIQUE INDEX"
      ) {
        const createUinqueOnRegExp = /ON/;
        //ON 값이 다음 줄에 있다면.
        if (createUinqueOnRegExp.exec(columnInfo) !== null) {
          const uniqueList = columnInfo.split(entityInfo.entityName);

          const uniqueInfo = uniqueList[2]
            .replace(";", "")
            .replace("(", "")
            .replace(")", "");

          const uniqueInfoList = "['" + uniqueInfo + "']";

          entityInfo.uniqueInfoList.push(uniqueInfoList);
        }
        //ON 값이 한 줄에 있다면.
        else {
          const columnInfo = createTableSyntax[index + 1];
          const uniqueList = columnInfo.split(entityInfo.entityName);

          const uniqueInfo = uniqueList[1]
            .replace(";", "")
            .replace("(", "")
            .replace(")", "");

          const uniqueInfoList = "['" + uniqueInfo + "']";

          entityInfo.uniqueInfoList.push(uniqueInfoList);
        }
        continue;
      }
    }
  }
  entityInfo.columnInfoList = columnInfoList;

  return entityInfo;
}

module.exports = {
  sqlParsing,
};
