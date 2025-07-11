# How to Run

## I. Build the Plugin Bridge on Your Local Machine

1. Clone the `jtl-platform-plugin-service` repository.
2. Switch to the branch `plugin-bridge-refactoring...`
   > ⚠️ You’ll need to determine the exact name of the latest updated branch manually.
3. Navigate to the `js-core` folder and run:

   ```bash
   yarn && yarn build && yarn pack
   ```

4. Repeat the same steps in the js-internal-react folder:

**II. Install the Plugin Bridge**.  
After running yarn pack, a .tgz package file will be generated.

- Create a .npmrc file if it doesn’t already exist.

- Install the generated .tgz files using:
  ```bash
   yarn add file:<path-to-tgz-file>
  ```
- Run `yarn` again to install dependencies:

**III. Run the Application**.  
these are 2 command to run

- `yarn dev` run the host
- `yarn dev:mini-app` run the plugin app.

🚀 Open http://localhost:3100/playground in your browser to start your work.
