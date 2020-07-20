import inquirer from "inquirer";
import ImageResizer from "../utils/ImageResizer";

const iconPrompt = [
  {
    name: "iconToResize",
    type: "list",
    message:
      "Which icon to resize?\n  - Inspect /output/icon-candidates and select the icon by its number\n",
    choices: "12345".split(""),
  },
];

(async () => {
  const { iconToResize } = await inquirer.prompt(iconPrompt);
  new ImageResizer().resize(iconToResize);
})();
