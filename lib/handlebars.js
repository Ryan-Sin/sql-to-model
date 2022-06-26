const Handlebars = require("handlebars");

/**
 * @author Ryan
 * @description 컬럼 데코레이터 설정
 */
Handlebars.registerHelper("checkColunm", (columnInfo, options) => {
  if (
    columnInfo.columnName === "created_at" &&
    columnInfo.columnType === "datetime"
  ) {
    columnInfo.columnDecorator = "@CreateDateColumn";
    return options.fn(columnInfo);
  } else if (
    columnInfo.columnName === "updated_at" &&
    columnInfo.columnType === "datetime"
  ) {
    columnInfo.columnDecorator = "@UpdateDateColumn";
    return options.fn(columnInfo);
  } else if (
    columnInfo.columnName === "deleted_at" &&
    columnInfo.columnType === "datetime"
  ) {
    columnInfo.columnDecorator = "@DeleteDateColumn";
    return options.fn(columnInfo);
  } else {
    columnInfo.columnDecorator = "@Column";
    return options.fn(columnInfo);
  }
});
