#!/usr/bin/env node

// Импорт необходимых зависимостей
const { execSync } = require("child_process");
const path = require("path");
const fs = require("fs");

if (process.argv.length < 3) {
  console.log("Необходимо ввести имя приложения.");
  console.log("Например :");
  console.log("    npx create-ipro-microfront ipro-catalog");
  process.exit(1);
}

const projectName = process.argv[2]; // Название проекта - ipro-catalog
const currentPath = process.cwd(); // Текущая директория - Desktop/Projects
const projectPath = path.join(currentPath, projectName); // Абсолютный путь - Desktop/Projects/ipro-catalog
const git_repo = "https://github.com/maxsvst/test-repo.git";

// Валидация имени проекта
try {
  fs.mkdirSync(projectPath); // Попытка создать директорию
} catch (err) {
  if (err.code === "EEXIST") {
    console.log(
      `Папка ${projectName} уже существует в текущей директории, придумайте другое название.`,
    );
  } else {
    console.log(err);
  }
  process.exit(1);
}

async function main() {
  try {
    console.log("Скачивание проекта...");
    execSync(`git clone --depth 1 ${git_repo} ${projectPath}`);

    process.chdir(projectPath);

    console.log("Установка зависимостей...");
    execSync("npm install");

    console.log("Удаление папки .git...");
    execSync("npx rimraf ./.git");

    // Нужно ли удалять папку bin для конечного пользователя?
    fs.rmdirSync(path.join(projectPath, "bin"), { recursive: true });

    console.log("Загрузка завершена!");
  } catch (err) {
    console.log(err);
  }
}
main();
