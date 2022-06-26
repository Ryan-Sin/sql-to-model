const fs = require("fs");
const xfs = require("fs.extra");
const path = require("path");

const { sqlParsing } = require("./sql-parsing");
const { generateFile } = require("./generate-file");

const generate = module.exports;

/**
 * @author Ryan
 *
 * @param {String} sqlDir 참조할 sql 디렉토리 경로
 * @param {String} targetDir 생성될 디렉토리 경로(없다면 디렉토리를 생성)
 * @param {String} modelType TypeORM, Sequelize(ORM 선택)
 * @param {String} database MySQL, MariaDB, Postgresql ...(DB 설정)
 */
generate.setSqlToModel = async ({ sqlDir, targetDir, modelType, database }) => {
  //sql File 디렉토리 조회
  const fileList = fs.readdirSync(sqlDir);

  //.sql 파일만 추출
  const sqlFileList = fileList.filter((sqlFile) => sqlFile.includes(".sql"));

  for (let index = 0; index < sqlFileList.length; index++) {
    const sqlFileName = sqlFileList[index];

    let entityInfo;
    let templatePath;

    if (modelType === "TypeORM") {
      templatePath = path.resolve(
        __dirname,
        "../templates/typeorm/___.entity.ts"
      );
    }

    if (database === "MySql" || database === "MariaDB") {
      entityInfo = sqlParsing(sqlDir, sqlFileName);
    }

    await generateDirectoryStructure(targetDir, templatePath, entityInfo);
  }
};

/**
 * @author Ryan
 * @description 파일 생성
 * @param {String} targetDir 생성될 디렉토리 경로(없다면 디렉토리를 생성)
 * @param {String} templatePath 선택한 템플릿 경로
 * @param {Object} entityInfo sql 파일 파싱 정보 목록
 */
function generateDirectoryStructure(targetDir, templatePath, entityInfo) {
  if (!fs.existsSync(targetDir)) fs.mkdirSync(targetDir);

  new Promise((resolve, reject) => {
    //폴더가 없다면 생성
    /**
     * @author Ryan
     * @description 내가 생성하고 싶은 디렉토리에 템플릿 디렉토리를 카피한다.
     */
    xfs.copyRecursive(templatePath, targetDir, (err) => {
      if (err) return reject(err);

      //내가 설정한 템플릿 정보를 가져온다.
      const walker = xfs.walk(templatePath, {
        followLinks: false,
      });

      /**
       * @author Ryan
       * @description 템플릿 안에 있는 파일들을 가져온다.
       *
       * @param root 폴더 경로 (Ex:/Users/ryan/ryan/swagger/sql-to-model/templates/typeorm)
       * @param stats 파일 정보
       */
      walker.on("file", async (root, stats, next) => {
        try {
          if (stats.name.substring(0, 3) === "___") {
            //파일 생성
            await generateFile({
              root,
              targetDir,
              entityInfo,
              file_name: stats.name,
            });

            const template_path = path.resolve(targetDir, "___.entity.ts");

            //카피한 템플릿 파일을 삭제
            fs.unlink(template_path, next);
            next();
          }
        } catch (e) {
          reject(e);
        }
      });
      walker.on("errors", (root, nodeStatsArray) => {
        reject(nodeStatsArray);
      });
      walker.on("end", async () => {
        resolve();
      });
    });
    resolve();
  });
}
