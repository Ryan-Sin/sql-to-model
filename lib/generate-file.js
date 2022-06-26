const path = require("path");
const fs = require("fs");
const Handlebars = require("handlebars");
const _ = require("lodash");

//커스텀 handlebars 함수를 불러와 등록한다.
require("./handlebars");

/**
 * @author Ryan
 * @description 파일 쓰기
 *
 * @param {String} root 템플릿 디렉토리 경로 (절대경로/sql-to-model/templates/typeorm)
 * @param {String} targetDir 생성할 디렉토리 경로
 * @param {String} entityInfo 파싱할 데이터 정보
 * @param {String} file_name 템플릿 파일 이름 (Ex: '___.entity.ts')
 * */
function generateFile({ root, targetDir, entityInfo, file_name }) {
  new Promise((resolve, reject) => {
    fs.readFile(path.join(root, file_name), "utf8", (err, data) => {
      if (err) return reject(err);

      //컴파일 될 파일 이름
      const newFileName = file_name.replace(
        "___",
        _.kebabCase(entityInfo.entityName)
      );

      const targetFile = path.resolve(targetDir, newFileName);

      const template = Handlebars.compile(data.toString());

      const content = template({
        openbrace: "{",
        closebrace: "}",
        entityName: entityInfo.entityName,
        indexInfoList: entityInfo.indexInfoList,
        uniqueInfoList: entityInfo.uniqueInfoList,
        columnInfoList: entityInfo.columnInfoList,
      });

      fs.writeFile(targetFile, content, "utf8", (err) => {
        if (err) return reject(err);
        resolve();
      });
    });
  });
}

module.exports = {
  generateFile,
};
