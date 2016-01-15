angular-ui-scheduler
=================

A UI widget for creating or editing repeating calendar entries. Dynamically injects HTML anwhere in an Angular app. Provides methods for converting schedule entry to and from RRule format, based on the [iCalendar RFC](http://www.ietf.org/rfc/rfc2445.txt).

Installing
---------

    bower install angular-ui-scheduler

Demo App
----------
See contributing below and then  

    npm start

Contributing
------------
Regular setup: 
  
    npm install -g gulp
    npm install -g live-server

    bower install
    npm install

To build

    gulp build watch
    
To test

    gulp test


---

Run tests found in the ./tests directory. GetRRule.js provides a set of unit tests. Install [Karma](http://karma-runner.github.io/0.12/index.html), and launch with the folllowing:

    cd test
    karma start

SetRRule.js provides end-to-end tests that run with [Protractor](https://github.com/angular/protractor). Follow the instructions to install protractor and a local selenium server (assuming you don't have access to an existing selenium server). Launch the provided sample app (as described above) in a terminal session. In a separate terminal session launch a local selenium server. The test configuration file expects the web server to run at localhost:8000 and the selenium server to run at localhost:4444. In a third session luanch the tests:
 
Session 1:   
    node ./scripts/web-server.js 8000

Session 2:
    webdriver-manager start

Session 3:
    cd tests
    protractor protractorConf.js


