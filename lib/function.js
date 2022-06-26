const _ = require("lodash");

/**
 * @author Ryan
 * @descriptin 변수명에 하이픈(-), 언더바(-) 정보를 제외하고 카멜 케이스 변수명을 변경
 *
 * @param {String} data 변수명
 * @returns {String}
 */
function setCamelCase(data) {
  if (data.includes("-") || data.includes("_")) {
    const dataInfo = data.includes("-")
      ? data.split("-")
      : data.includes("_")
      ? data.split("_")
      : null;

    if (dataInfo == null) {
      return _.camelCase(data).replace(/ /g, "");
    }

    let variable = "";

    for (let index = 0; index < dataInfo.length; index++) {
      const variableName = dataInfo[index];

      variable +=
        index === 0
          ? _.camelCase(variableName).replace(/ /g, "")
          : _.startCase(variableName).replace(/ /g, "");
    }

    return variable;
  }

  return _.camelCase(data).replace(/ /g, "");
}

//테이블 이름 추출
function findTableName(columnInfo) {
  return columnInfo
    .replace("(", "") //여는 소괄호 제거
    .replace(/\s/g, "") //전체 공백 제거
    .replace("createtable", "") // 명령어 제거
    .replace("CREATETABLE", ""); // 명령어 제거
}

//컬럼 이름 추출
function findColumnName(columnInfo) {
  const columnNameRegExp = /\`([^)]+)\`/;

  return columnNameRegExp.exec(columnInfo) !== null
    ? [
        columnNameRegExp.exec(columnInfo)[0].replace("`", "").replace("`", ""),
        setCamelCase(
          columnNameRegExp.exec(columnInfo)[0].replace("`", "").replace("`", "")
        ),
      ]
    : "컬럼 이름이 없음";
}

//컬럼 타입 추출
function findColumnType(columnInfo) {
  const columnRegExpList =
    /VARCHAR|CHAR|VARBINARY|BINARY|TINYTEXT|TINYBLOB|LONGTEXT|MEDIUMTEXT|TEXT|LONGBLOB|MEDIUMBLOB|BLOB|ENUM|SET|BIT|BOOLEAN|BOOL|TINYINT|SMALLINT|MEDIUMINT|INT|INTEGER|BIGINT|FLOAT|DOUBLE|DECIMAL|DATETIME|TIMESTAMP|DATE|TIME|YEAR/;

  const variableStringRegExpList =
    /VARCHAR|CHAR|VARBINARY|BINARY|TINYTEXT|TINYBLOB|LONGTEXT|MEDIUMTEXT|TEXT|LONGBLOB|MEDIUMBLOB|BLOB/;
  const variableNumberRegExpList =
    /BIT|TINYINT|SMALLINT|MEDIUMINT|INT|INTEGER|BIGINT|FLOAT|DOUBLE|DECIMAL/;
  const variableDateRegExpList = /DATETIME|TIMESTAMP|DATE|TIME|YEAR/;
  const variableBooleanRegExpList = /BOOLEAN|BOOL/;
  const variableEtcRegExpList = /ENUM|SET/;

  if (columnRegExpList.exec(columnInfo) !== null) {
    const column = columnRegExpList.exec(columnInfo)[0];

    let columnType;
    let variableType;

    if (variableStringRegExpList.exec(column) !== null) {
      columnType = column.toLowerCase();
      variableType = "string";
    } else if (variableNumberRegExpList.exec(column) !== null) {
      columnType = column.toLowerCase();
      variableType = "number";
    } else if (variableDateRegExpList.exec(column) !== null) {
      columnType = column.toLowerCase();
      variableType = "Date";
    } else if (variableBooleanRegExpList.exec(column) !== null) {
      columnType = column.toLowerCase();
      variableType = "boolean";
    } else if (variableEtcRegExpList.exec(column) !== null) {
      columnType = column.toLowerCase();
      variableType = "any";
    } else {
      columnType = column.toLowerCase();
      variableType = "string";
    }

    return [columnType, variableType];
  } else {
    return ["varchar", "string"];
  }
}

//Null 값 추출
function findNullable(columnInfo) {
  const nullableRegExpList = /NOT NULL|NOTNULL|NULL/;

  if (nullableRegExpList.exec(columnInfo) === null) return false;

  switch (nullableRegExpList.exec(columnInfo)[0]) {
    case "NOT NULL":
      return false;
    default:
      return true;
  }
}

//Auto Increment 추출
function findAutoIncrement(columnInfo) {
  const autoIncrementExp = /AUTO_INCREMENT/;

  if (autoIncrementExp.exec(columnInfo) === null) return false;

  switch (autoIncrementExp.exec(columnInfo)[0]) {
    case "AUTO_INCREMENT":
      return true;
    default:
      return false;
  }
}

//코멘트 추출
function findComment(columnInfo) {
  return columnInfo.split("COMMENT")[1] !== undefined
    ? columnInfo.split("COMMENT")[1]
    : "";
}

//기본 값 추출
function findDefaultValue(columnInfo) {
  return columnInfo.split("DEFAULT")[1] !== undefined
    ? columnInfo.split("DEFAULT")[1].split("COMMENT")[0]
    : "";
}

//PrimaryKey 추출
function findPrimaryKey(columnInfo) {
  const columnNameRegExp = /\(([^)]+)\)/;

  if (columnNameRegExp.exec(columnInfo) !== null) {
    return columnNameRegExp.exec(columnInfo)[1].replace(" ", ",").split(",");
  }
}

module.exports = {
  setCamelCase,
  findTableName,
  findColumnName,
  findColumnType,
  findNullable,
  findAutoIncrement,
  findComment,
  findDefaultValue,
  findPrimaryKey,
};
