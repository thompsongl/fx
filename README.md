# fx

___

A file explorer using the GitHub API

* [GitHub tree API](https://docs.github.com/en/rest/git/trees)
* [Primer Octicons](https://primer.style/octicons/)
* [Theme UI Polaris](https://github.com/system-ui/theme-ui/blob/ec4cdc977941d5174f876128f4ed40256a2b863f/packages/preset-polaris/src/index.ts)


<details>
<summary>Bootstrapped from [gianluca-venturini/express-react-webpack-starter](https://github.com/gianluca-venturini/express-react-webpack-starter)</summary>


# Express React Webpack starter
A starter Webpack 4 configuration for basic projects with Express and React.

## Features
- Build single page web apps with typescript.

## Dependencies
- Install `node`
    - Use NVM (https://github.com/nvm-sh/nvm): `nvm install lts/dubnium && nvm use lts/dubnium`
    - Alternatively you can download and install it manually: https://nodejs.org/en/download/
- Install `yarn ^1.10.1`
    - Use brew (https://brew.sh/): `brew install yarn`
    - Alternatively you can download and install it manually: https://classic.yarnpkg.com/en/docs/install

## Development
- Download and install VSCode: https://code.visualstudio.com/
- Read the setup guide https://code.visualstudio.com/docs/setup/setup-overview
    - Launching VSCode from the command line: Open the Command Palette (F1) and type `shell command` to find the `Shell Command: Install 'code' command in PATH command`
        - After doing this you can start VSCode on a repo with `code .`
- Install TSLint extension in VSCode https://marketplace.visualstudio.com/items?itemName=ms-vscode.vscode-typescript-tslint-plugin
- In order to run the debugger for backend/tests put a breakpoint in VSCode and run this command in VSCode (`CMD + SHIFT + P`): `Debug: attach node to process`. You can also enable `Debug: Toggle Auto Attach` to start the debugger every time a node process is started from VSCode terminal.
- To open a terminal in VSCode: ```CTRL + ` ```

## Usage
- Install dependencies: `yarn install`
- Build application (both frontend and backend in http://localhost:8080): `yarn build`
    - Some browser automatically redirects you to `https` so make sure to disable the automatic redirect
- Watch for changes and build application: `yarn build-watch`
- Build frontend, watch for changes and hot reload (port 8000): `yarn build-hot-reload`
    - All the backend requests will be forwarded to port 8080 so you need to run the backend
- Run application (port 8080): `yarn start`
- Run tests: `yarn test`
- Remove all the generated files: `yarn clean`

## Useful links
- Typescript guide: https://basarat.gitbook.io/typescript/
- VSCode custom settings: https://github.com/gianluca-venturini/env_confs/tree/master/vs_codet
</details>
