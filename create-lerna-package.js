// Use ESM import syntax
import { execSync } from "child_process";
import inquirer from "inquirer";
import fs from "fs";
import path from "path";

// Component templates
import componentTemplate from "./src/templates/components/component.js";
import componentStoriesTemplate from "./src/templates/components/component.stories.js";
import componentMdxTemplate from "./src/templates/components/component.mdx.js";

import hookTemplate from "./src/templates/hooks/hook.js";
import hookStoriesTemplate from "./src/templates/hooks/hook.stories.js";
import hookMdxTemplate from "./src/templates/hooks/hook.mdx.js";
import hookShowcaseTemplate from "./src/templates/hooks/hook.showcase.js";

// Hook templates

async function createLernaComponent() {
  let componentType = await getComponentType();
  let newTypeDirectory = "";

  if (componentType == "Create new type") {
    const newComponentTypeName = await getNewComponentTypeName();
    newTypeDirectory = await createNewTypeDirectory(newComponentTypeName);
    componentType = newComponentTypeName;
    await updateLernaJson(newTypeDirectory);
  }

  const componentName = await getComponentName(componentType);
  await createPackage(componentName, componentType);

  const packagePath = `packages/${componentType}/${componentName}`;
  const storiesPath = packagePath + `/stories`;
  const libPath = packagePath + `/lib`;
  const packageJsonPath = packagePath + `/package.json`;

  await initFolders(libPath, storiesPath);
  await initTemplates(libPath, storiesPath, componentName, componentType);

  const [packageDescription, packageKeywords] = await getPackageInfo();
  updatePackageJson(
    packageJsonPath,
    packageDescription,
    packageKeywords,
    componentName
  );
}

createLernaComponent();

async function getComponentType() {
  const componentTypes = await getExistingPackagesDirectories();
  const answer = await inquirer.prompt([
    {
      type: "list",
      name: "componentType",
      message: "Choose type of new Component ?",
      choices: [...componentTypes, "Create new type"],
    },
  ]);
  const componentType = answer.componentType;

  return componentType;
}

async function getExistingPackagesDirectories() {
  return fs
    .readdirSync("packages/", { withFileTypes: true })
    .filter((dirent) => dirent.isDirectory())
    .map((dirent) => dirent.name);
}

async function getNewComponentTypeName() {
  const answer = await inquirer.prompt([
    {
      type: "input",
      name: "newComponentType",
      message: "What is the name of new component type ?",
      validate: (input) => {
        // Regex to ensure the name is alphanumeric and may include dashes and underscores
        if (/^[a-z0-9-_]+$/.test(input)) {
          return true;
        }
        return "Name must be lowercase, alphanumeric and can include dashes and underscores only (no spaces or special characters).";
      },
    },
  ]);

  const newComponentTypeName = answer.newComponentType;
  const directoriesNames = await getExistingPackagesDirectories();

  if (
    directoriesNames.some(
      (name) => name.toLowerCase() == newComponentTypeName.toLowerCase()
    )
  ) {
    console.log(
      "The component type with the same name already exists. Please enter a different name."
    );
    return getNewComponentTypeName();
  } else {
    return newComponentTypeName;
  }
}

async function createNewTypeDirectory(newComponentTypeName) {
  const path = `packages/${newComponentTypeName.toLowerCase()}`;
  if (!fs.existsSync(path)) {
    fs.mkdirSync(path, { recursive: true });
  }
  return path;
}

async function updateLernaJson(newTypeDirectory) {
  if (fs.existsSync("package.json"))
    fs.readFile("package.json", "utf8", (err, data) => {
      if (err) {
        console.log(err);
        return;
      }

      let packageJsonData = JSON.parse(data);
      (packageJsonData.workspaces = [
        ...packageJsonData.workspaces,
        `${newTypeDirectory}/*`,
      ]),
        console.log(packageJsonData.workspaces);
      const updatedJson = JSON.stringify(packageJsonData, null, 2);
      fs.writeFileSync("package.json", updatedJson, "utf-8", (err) => {
        if (err) {
          console.log(err);
          return;
        }
      });
    });
}

async function getComponentName(componentType) {
  const answer = await inquirer.prompt([
    {
      type: "input",
      name: "componentName",
      message: "What's the name of the Component?",
    },
  ]);

  const componentName = answer.componentName;
  if (fs.existsSync(`packages/${componentType}/${componentName}`)) {
    console.log(
      "The component with the same name already exists. Please enter a different name."
    );
    return getComponentName();
  }
  return componentName;
}

async function getPackageInfo() {
  const answers = await inquirer.prompt([
    {
      type: "input",
      name: "description",
      message: "Description of the package",
    },
    { type: "input", name: "keywords", message: "Package keywords" },
  ]);
  const { description, keywords } = answers;
  const keywordsArray = keywords.split(",").map((keyword) => keyword.trim());

  return [description, keywordsArray];
}

async function initTemplates(
  libPath,
  storiesPath,
  componentName,
  componentType
) {
  const templates = await getExistingTemplatesDirectories();
  console.log(templates);

  if (templates[componentType]) {
    const directoryPath = path.join("src", "templates", `${componentType}`);
    try {
      const files = fs.readdirSync(directoryPath);

      // Import each file dynamically
      const importPromises = files.map((file) => {
        const fullPath = path.join(directoryPath, file);
        return import(fullPath); // Dynamic import based on the full path
      });

      // Wait for all imports to resolve
      const modules = await Promise.all(importPromises);

      // Do something with imported modules, example: log default export if available
      modules.forEach((module, index) => {
        console.log(
          `Module ${index}:`,
          module.default ? module.default : "No default export"
        );
      });
    } catch (error) {
      console.error("Error importing components:", error);
    }
  }

  if (fs.existsSync(libPath) && fs.existsSync(storiesPath)) {
    if (componentType == "hook") {
      createHookTemplate(libPath, storiesPath, componentName);
    } else if (componentType == "component") {
      createComponentTemplate(libPath, storiesPath, componentName);
    }
  }
}

async function getExistingTemplatesDirectories() {
  const templatesDir = "src/templates";
  const directories = fs
    .readdirSync(templatesDir, { withFileTypes: true })
    .filter((dirent) => dirent.isDirectory())
    .reduce((acc, dirent) => {
      acc[dirent.name] = path.join("./", templatesDir, dirent.name);
      console.log(acc, dirent);

      return acc;
    }, {});
  return directories;
}

function createHookTemplate(libPath, storiesPath, componentName) {
  fs.rmSync(`${libPath}/${componentName}.js`);
  fs.writeFileSync(
    `${libPath}/${componentName}.tsx`,
    hookTemplate(componentName)
  );
  fs.writeFileSync(
    `${storiesPath}/${componentName}.stories.tsx`,
    hookStoriesTemplate(componentName)
  );
  fs.writeFileSync(
    `${storiesPath}/${componentName}.mdx`,
    hookMdxTemplate(componentName)
  );
  fs.writeFileSync(
    `${storiesPath}/${componentName}.showcase.tsx`,
    hookShowcaseTemplate(componentName)
  );
}

function createComponentTemplate(libPath, storiesPath, componentName) {
  fs.rmSync(`${libPath}/${componentName}.js`);
  fs.writeFileSync(
    `${libPath}/${componentName}.tsx`,
    componentTemplate(componentName)
  );
  fs.writeFileSync(
    `${storiesPath}/${componentName}.stories.tsx`,
    componentStoriesTemplate(componentName)
  );
  fs.writeFileSync(
    `${storiesPath}/${componentName}.mdx`,
    componentMdxTemplate(componentName)
  );
}

function updatePackageJson(
  packageJsonPath,
  packageDescription,
  packageKeywords,
  componentName
) {
  if (fs.existsSync(packageJsonPath))
    fs.readFile(packageJsonPath, "utf8", (err, data) => {
      if (err) {
        console.log(err);
        return;
      }

      let packageJsonData = JSON.parse(data);
      packageJsonData.main = `${componentName}.tsx`;
      packageJsonData.description = packageDescription;
      packageJsonData.packageKeywords = packageKeywords;

      const updatedJson = JSON.stringify(packageJsonData, null, 2);
      fs.writeFileSync(packageJsonPath, updatedJson, "utf-8", (err) => {
        if (err) {
          console.log(err);
          return;
        }
      });
    });
}

async function createPackage(componentName, componentType) {
  execSync(
    `npx lerna create ${componentName} --yes  ./packages/${componentType}/`
  );
}

async function initFolders(libPath, storiesPath) {
  if (!fs.existsSync(libPath)) {
    fs.mkdirSync(libPath, { recursive: true });
  }
  if (!fs.existsSync(storiesPath)) {
    fs.mkdirSync(storiesPath, { recursive: true });
  }
}
