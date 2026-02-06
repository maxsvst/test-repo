#!/usr/bin/env node

// Импорт необходимых зависимостей
import { join } from "path";
import { mkdirSync, rmSync } from "fs";
import { execSync } from "child_process";

if (process.argv.length < 3) {
  console.log("Необходимо ввести имя приложения.");
  console.log("Например :");
  console.log("    npx create-ipro-microfront ipro-catalog");
  process.exit(1);
}

const projectName = process.argv[2]; // Название проекта - ipro-catalog
const currentPath = process.cwd(); // Текущая директория - Desktop/Projects
const projectPath = join(currentPath, projectName); // Абсолютный путь - Desktop/Projects/ipro-catalog
const binPath = path.join(projectPath, "bin"); // Путь к папке bin
const gitFolderPath = path.join(projectPath, ".git"); // Путь к папке .git
const git_repo = "https://github.com/maxsvst/test-repo.git";

// Валидация имени проекта
try {
  mkdirSync(projectPath); // Попытка создать директорию
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
    if (fs.existsSync(gitFolderPath)) {
      fs.rmSync(gitFolderPath, { recursive: true, force: true });
      console.log("Папка .git удалена.");
    }

    console.log("Удаление папки bin...");
    if (fs.existsSync(binPath)) {
      fs.rmSync(binPath, { recursive: true, force: true });
      console.log("Папка bin удалена.");
    }

    console.log("Инициализация нового репозитория Git...");
    execSync("git init");

    console.log("Загрузка завершена!");
  } catch (err) {
    console.error("Произошла ошибка во время инициализации:", err.message);
    process.exit(1);
  }
}
main();
