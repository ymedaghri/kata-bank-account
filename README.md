# kata-bank-account
Kata BankRepository Account

# Requirements
- yarn or npm
- nodeJS

# Application entrypoint 
- SWAGGER UI : http://localhost:4000/documentation

# All available commands are available in the script section of the package.json file
```
 {
    "start": "tsc && node dist/app.js",
    "serve": "TS_NODE_FILES=true LOGGER_FORMAT=text nodemon",
    "serve:inspect": "nodemon --exec 'node --inspect --require ts-node/register ./src/main.ts'",
    "test": "NODE_ENV=test mocha -r ts-node/register test/**/*.test.ts",
    "prettier": "prettier --config .prettierrc \"src/**/*.ts\" \"test/**/*.ts\" --write",
    "build": "tsc -p ./tsconfig.build.json"
  },
```

# Examples
```
 yarn test
 yarn serve
 yarn build
```

