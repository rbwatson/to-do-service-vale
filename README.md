# `to-do-service-vale`

Vale style definitions and configurations for use in the `to-do-service-*` repos.
If they define the styles that you'd like to apply to other documentation files,
you can fork this repo and adapt the files for use in other projects.

Vale is a document text linter to check for and report content that doesn't conform to the style guide.
This repo contains only the style and configuration files that a project can apply.
It doesn't contain any of the source code of the Vale app.

## How to use this repo on your projects

1. [Fork this repo to your GitHub account](https://github.com/UWC2-APIDOC/to-do-service-vale/fork).
2. Clone your fork of this repo to your development system.
    Remember the directory of the clone.
3. [Install Vale on your development system](https://vale.sh/docs/install).

If you are using another editor, stop here.
You'll need to determine if your editor or IDE supports the Vale extension and how to install and configure it for your IDE.

If you're using, or you want to use the VS Code IDE, continue.

1. If you don't already have VS Code installed on your development system, [install VS Code now](https://code.visualstudio.com/download).
2. [Add the Vale extension to VS Code on your development system](https://marketplace.visualstudio.com/items?itemName=ChrisChinchilla.vale-vscode).
3. In your VS Code editor, configure Vale to use the styles in this repo. In VS Code:
   1. Open the **Settings** page.
   2. In the **Settings** page, use the search bar to find the **`vale CLI`** settings.
   3. In the list of settings, locate the **`Vale › Vale CLI: Config`** setting.
   4. In the **`Vale › Vale CLI: Config`** setting, enter the full directory path of your clone of this repo, and then append `/.vale.ini` to that path.
     For example, if the clone of this repo is in the `/Users/username/GitHubRepos/UWC2-APIDOC/to-do-service-vale/` directory, the value of the **`Vale › Vale CLI: Config`** setting would be `/Users/username/GitHubRepos/UWC2-APIDOC/to-do-service-vale/.vale.ini`.
   5. Close the **Settings** page.
   6. Quit and restart VS Code.

At this point, VS Code calls the Vale text linter when you open a file in the VS Code editor and when you save it.
The **Problems** pane contains the errors found. The errors are also underlined in the document.

## Usage notes

- Open the **Problems** pane in the VS Code window to see the errors found in the document.
- You might consider installing the [Markdown essentials](https://marketplace.visualstudio.com/items?itemName=AdrienTecher.markdown-essentials) extension to VS Code to keep the Markdown source formatted consistently.
   If you install this extension, add this JSON segment to the `settings.json` in VS Code:

      ```
      "markdownlint.config": {
        "MD007": { "indent": 4 },
        "MD036": false,
        "MD049": { "style": "underscore" },
        "MD050": { "style": "asterisk" }
      }
      ```
      
   Note that changes to MarkdownLint styles must be made by hand in `settings.json`.
- The Vale linter won't check the contents as you change the files.
    You must save the document file to update the list of errors.
- You must manually refresh your clone of this repo to keep the styles and configuration current.
    If you aren't seeing some style errors reported by another reviewer
    in a code/document reviewer, it might be time to update the files.

    To update your copy of these styles and configurations:
    1. In a browser:
       1. Go to your GitHub account and open your fork of the `to-do-service-vale` repo.
       2. In your fork of the `to-do-service-vale` repo, select **Sync fork**.
    2. On your development computer:
       1. In your GitHub Desktop:
          1. Open your clone of the `to-do-service-vale` repo.
          2. In your clone, select **Fetch origin**.
       2. In a command line tool: `CMD` on Windows or `terminal` on MacOS and Linux:
          1. Go to the workspace directory of your clone of the `to-do-service-vale` repo.
          2. Enter the command: `git pull origin main` to update the `main` branch of the clone.
