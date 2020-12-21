
# HiveAdmin

npm install -g @angular/cli

https://angular.io/guide/architecture#whats-next






#Hive Revison History
##Version History Table
| Version | Version Date | Completed Requests |
|:---   |:---:          |:---                 |
|11.0.4 | 2020-12-14   | [X] Create App 





---
###Version History >

##### 11.0.4 
- [X] Create App, Angular Material




#### Requests <
- [ ] Create App Angular CLI, Angular Material (2020-12-14)
- [ ] Add Lint options ts,(s)css






---

###Bundle Analyzer 
######(J:Paket Analizi, Angular9 Ivy ile birlikte paket boyutları ve paketleme değiştirildi.)
npm install -g webpack-bundle-analyzer
run ng build --stats-json (don’t use flag --prod). 

By enabling --stats-json you will get an additional file stats.json
run webpack-bundle-analyzer path/to/your/stats.json and your browser will pop up the page at localhost:8888.

codelyzer kaldırıldı...

tslint -> eslint geçişi..


#####Dipnot
* J: For Junior in Turkish.

npm init nx-workspace hive --npm-scope=hive --preset=angular --app-name=hive-admin --linter=eslint --no-nx-cloud --style=scss --package-manager=npm

cd hive

npx json -I -f nx.json -e "this.affected.defaultBase = 'main';"

npx json -I -f angular.json -e "this.cli.packageManager = 'npm';"

npm uninstall codelyzer tslint

npx json -I -f angular.json -e "this.schematics['@nrwl/angular:application'].strict = true;"

npx json -I -f angular.json -e "this.schematics['@nrwl/angular:library'].strict = true;"

npx json -I -f angular.json -e "this.schematics['@nrwl/angular'].application.unitTestRunner = 'jest';"

npx json -I -f angular.json -e "this.schematics['@nrwl/angular'].library.unitTestRunner = 'jest';"

npx json -I -f angular.json -e "this.schematics['@nrwl/angular'].application.e2eTestRunner = 'protractor';"

nx generate remove hive-admin-e2e

nx generate remove hive-admin

nx generate @nrwl/angular:application --name=hive-admin --prefix=hive --tags="type:app,scope:hive" --no-interactive

npx json -I -f nx.json -e "this.projects['hive-admin-e2e'].tags = ['type:e2e','scope:hive'];"

npx json -I -f angular.json -e "this.projects['hive-admin'].architect.build.configurations.production.budgets = [{ type: 'initial', maximumWarning: '500kb', maximumError: '1mb' }, { type: 'anyComponentStyle', maximumWarning: '2kb', maximumError: '4kb' }];"

nx generate @nrwl/angular:library --name=hivelib --directory=hivelib --prefix=hivelib --tags="type:feature,scope:hive" --buildable --no-interactive

npm uninstall codelyzer
