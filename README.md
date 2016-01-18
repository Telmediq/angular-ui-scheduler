angular-ui-scheduler
=================

A UI widget for creating or editing repeating calendar entries. Dynamically injects HTML anwhere in an Angular app. Provides methods for converting schedule entry to and from RRule format, based on the [iCalendar RFC](http://www.ietf.org/rfc/rfc2445.txt).

Installing
---------

    bower install angular-ui-scheduler
    
add `angular-ui-scheduler` to your list of dependencies of your angular app
 

Contributing
------------

Contributions are very welcome, this project does work but there's still a lot of room for improvement.

Regular setup: 
  
    npm install -g gulp
    npm install -g live-server

    bower install
    npm install

To build

    gulp build watch
    
To test

    gulp test

Publishing a new version

    gulp release
    
Demo
----------
Clone on your local machine and run  

    npm start