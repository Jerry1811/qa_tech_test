# Quality Assurance Engineer - Technical Test

## Running Tests

```
git clone https://github.com/Jerry1811/qa_tech_test.git
cd qa_tech_task
npm install
```

To run tests locally, create a cypress.env.json file at the root of the project  
Copy the template for environment variables in the cypress.env.example file  
Set values for environment variables in the created cypress.env.json file

### Run UI Automation tests and generate report

```
npm test
npm run test:report
```

### Run API Automation tests

```
npm run api:test
```
