// Use ESM import syntax
import { execSync } from "child_process";
import inquirer from "inquirer";
import fs from "fs";
import path from "path";
import { type } from "os";

async function createLernaComponent() {
  const answers = await inquirer.prompt([
    {
      type: "input",
      name: "componentName",
      message: "What's the name of the Component?",
    },
    {
      type: "list",
      name: "componentType",
      message: "What type of is the component is this?",
      choices: ["Hook", "Component", "Page"],
    },
  ]);
  const { componentName, componentType } = answers;

  if (componentType == "Hook") {
    execSync(`npx lerna create ${componentName} --yes ./packages/hooks/`);
  } else if (packageType == "Component") {
    execSync(`npx lerna create ${componentName} --yes ./packages/components/`);
  } else if (packageType == "Page") {
    execSync(`npx lerna create ${componentName} --yes ./packages/pages/`);
  }
}

createLernaComponent();
/* async function createLernaPackage() {
  const answers = await inquirer.prompt([
    {
      type: "input",
      name: "componentName",
      message: "What's the name of the Component?",
    },
    {
      type: "list",
      name: "componentType",
      message: "What type of is the component is this?",
      choices: ["hook", "component", "page"],
    },
  ]);

  const { packageName, packageType } = answers;

  // Use Lerna to create a new package
  execSync(`npx lerna create ${packageName} --yes`, { stdio: "inherit" });

  // Based on the package type, add starter files
  const packagePath = path.join("packages", packageName);
  const srcPath = path.join(packagePath, "stories");

  if (!fs.existsSync(srcPath)) {
    fs.mkdirSync(srcPath, { recursive: true });
  }

  // Example: Adding starter files for a hook
  if (packageType === "hook") {
    const hookFilePathtsx = path.join(srcPath, `${packageName}.tsx`);
    const hookFilePathmdx = path.join(srcPath, `${packageName}.tsx`);
    const hookFilePathstoriestsx = path.join(srcPath, `${packageName}.tsx`);
    const hookFilePath = path.join(srcPath, `${packageName}.tsx`);

    fs.writeFileSync(hookFilePath, "// Starter content for hook");
    // ... add other files as needed
  }
  // Repeat for 'component' and 'page', adjusting file creation as needed

  console.log(`Package ${packageName} created as a ${packageType}.`);
}

createLernaPackage(); */
