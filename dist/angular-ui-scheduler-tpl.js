(function(module) {
try { module = angular.module("angular-ui-scheduler"); }
catch(err) { module = angular.module("angular-ui-scheduler", []); }
module.run(["$templateCache", function($templateCache) {
  "use strict";
  $templateCache.put("angular-ui-scheduler/src/angularUiScheduler.html",
    "<div class=\"row angular-ui-scheduler\">\n" +
    "    <div class=\"col-md-12\">\n" +
    "\n" +
    "        <form class=\"form\" role=\"form\" name=\"scheduler_form\" novalidate>\n" +
    "\n" +
    "            <div class=\"row\" ng-if=\"!hideStart\">\n" +
    "                <div class=\"col-md-5\">\n" +
    "                    <div class=\"form-group\">\n" +
    "                        <label><span class=\"red-text\">*</span> Start Date <span class=\"fmt-help\"> mm/dd/yyyy</span></label>\n" +
    "                        <input type=\"date\" class=\"form-control\" name=\"schedulerStartDt\" ng-model=\"uiState.schedulerStartDt\" placeholder=\"mm/dd/yyyy\" required>\n" +
    "\n" +
    "                    </div>\n" +
    "                </div>\n" +
    "                <div class=\"col-md-7\">\n" +
    "                    <div class=\"form-group\">\n" +
    "                        <label><span class=\"red-text\">*</span> Start Time <span class=\"fmt-help\">HH24:MM:SS</span><span class=\"fmt-help\" ng-show=\"!schedulerShowTimeZone\">UTC</span></label>\n" +
    "                        <div class=\"form-inline\">\n" +
    "                            <input name=\"schedulerStartHour\" type=\"number\" class=\"form-control\" ng-model=\"schedulerStartHour\" ng-model-options=\"{ getterSetter: true }\" min=\"0\" max=\"23\" required>\n" +
    "                            <span>:</span><input name=\"schedulerStartMinute\" type=\"number\" class=\"form-control\" ng-model=\"schedulerStartMinute\" ng-model-options=\"{ getterSetter: true }\" min=\"0\" max=\"59\" required>\n" +
    "                            <span>:</span><input name=\"schedulerStartSecond\" type=\"number\" class=\"form-control\" ng-model=\"schedulerStartSecond\" ng-model-options=\"{ getterSetter: true }\" min=\"0\" max=\"59\" required>\n" +
    "                        </div>\n" +
    "                        <div class=\"error\" ng-show=\"scheduler_form.schedulerStartHour.$invalid || scheduler_form.schedulerStartMinute.$invalid ||scheduler_form.schedulerStartSecond.$invalid \">Time must be in HH24:MM:SS format</div>\n" +
    "                    </div>\n" +
    "                </div>\n" +
    "            </div>\n" +
    "\n" +
    "            <div class=\"row\">\n" +
    "                <div class=\"col-md-4\" ng-if=\"schedulerShowTimeZone\">\n" +
    "                    <div class=\"form-group\">\n" +
    "                        <label>Local Time Zone</label>\n" +
    "                        <select name=\"schedulerTimeZone\" ng-model=\"schedulerTimeZone\" ng-options=\"z.name for z in timeZones\"\n" +
    "                                required class=\"form-control \"></select>\n" +
    "                    </div>\n" +
    "                </div>\n" +
    "\n" +
    "            </div>\n" +
    "\n" +
    "            <div class=\"row\">\n" +
    "                <div class=\"col-md-4\">\n" +
    "                    <div class=\"form-group\">\n" +
    "                        <label>Repeat frequency</label>\n" +
    "                        <select name=\"schedulerFrequency\" ng-model=\"uiState.schedulerFrequency\"\n" +
    "                                ng-options=\"f.name for f in frequencyOptions\" required class=\"form-control\">\n" +
    "\n" +
    "                        </select>\n" +
    "                    </div>\n" +
    "                    <div class=\"error\" ng-show=\"scheduler_form.schedulerFrequency.$invalid\"></div>\n" +
    "                </div>\n" +
    "                <div class=\"col-md-4\">\n" +
    "                    <div class=\"form-group\" ng-show=\"schedulerShowInterval\">\n" +
    "                        <label>Every</label>\n" +
    "                        <div class=\"input-group\">\n" +
    "                            <input name=\"schedulerInterval\" type=\"number\" class=\"form-control\"\n" +
    "                                   ng-model=\"uiState.schedulerInterval\" min=\"1\" max=\"999\">\n" +
    "                            <span class=\"input-group-addon\" ng-bind=\"schedulerIntervalLabel\"></span>\n" +
    "                        </div>\n" +
    "                        <div class=\"error\" ng-show=\"scheduler_form.schedulerInterval.$invalid\">Provide a value between 1 and 999</div>\n" +
    "                    </div>\n" +
    "                </div>\n" +
    "            </div>\n" +
    "\n" +
    "            <div class=\"row\" ng-show=\"uiState.schedulerFrequency && uiState.schedulerFrequency.value == 'monthly'\">\n" +
    "                <div class=\"col-md-12\">\n" +
    "                    <div class=\"form-group option-pad-left\">\n" +
    "                        <div class=\"radio col-md-2\">\n" +
    "                            <label><input type=\"radio\" value=\"day\" ng-model=\"uiState.monthlyRepeatOption\" ng-change=\"monthlyRepeatChange()\" name=\"monthlyRepeatOption\"> on day</label>\n" +
    "                        </div>\n" +
    "                        <div class=\"col-md-3\" style=\"padding-top:5px\">\n" +
    "                            <input name=\"monthDay\" type=\"number\" class=\"form-control\" ng-disabled=\"uiState.monthlyRepeatOption != 'day'\"\n" +
    "                                   ng-model=\"uiState.monthDay\" min=\"1\" max=\"31\">\n" +
    "                            <div class=\"error\" ng-show=\"scheduler_form.monthDay.$invalid\">Must be between 1 and 31</div>\n" +
    "                        </div>\n" +
    "                    </div>\n" +
    "                </div>\n" +
    "            </div>\n" +
    "\n" +
    "            <div class=\"row option-pad-bottom\" ng-show=\"uiState.schedulerFrequency && uiState.schedulerFrequency.value == 'monthly'\">\n" +
    "                <div class=\"col-md-12\">\n" +
    "                    <div class=\"form-group option-pad-left\">\n" +
    "                        <div class=\"radio col-md-2\">\n" +
    "                            <label><input type=\"radio\" value=\"other\" ng-model=\"uiState.monthlyRepeatOption\" ng-change=\"monthlyRepeatChange()\" name=\"monthlyRepeatOption\"> on\n" +
    "                                the</label>\n" +
    "                        </div>\n" +
    "                        <div class=\"col-md-3\">\n" +
    "                            <select name=\"monthlyOccurrence\" ng-model=\"uiState.monthlyOccurrence\" ng-options=\"o.name for o in occurrences\"\n" +
    "                                    ng-disabled=\"uiState.monthlyRepeatOption != 'other'\" class=\"form-control \"></select>\n" +
    "                        </div>\n" +
    "                        <div class=\"col-md-3\">\n" +
    "                            <select name=\"monthlyWeekDay\" ng-model=\"uiState.monthlyWeekDay\" ng-options=\"w.name for w in weekdays\"\n" +
    "                                    ng-disabled=\"uiState.monthlyRepeatOption != 'other'\" class=\"form-control \"></select>\n" +
    "                        </div>\n" +
    "                    </div>\n" +
    "                </div>\n" +
    "            </div>\n" +
    "\n" +
    "            <div class=\"row\" ng-show=\"uiState.schedulerFrequency && uiState.schedulerFrequency.value == 'yearly'\">\n" +
    "                <div class=\"col-md-12\">\n" +
    "                    <div class=\"form-group option-pad-left\">\n" +
    "                        <div class=\"radio col-md-2\">\n" +
    "                            <label><input type=\"radio\" value=\"month\" ng-model=\"uiState.yearlyRepeatOption\" ng-change=\"yearlyRepeatChange()\" name=\"yearlyRepeatOption\"> on</label>\n" +
    "                        </div>\n" +
    "                        <div class=\"col-md-3 padding-top-slim\">\n" +
    "                            <select name=\"yearlyMonth\" ng-model=\"uiState.yearlyMonth\" ng-options=\"m.name for m in months\"\n" +
    "                                    ng-disabled=\"uiState.yearlyRepeatOption != 'month'\" class=\"form-control \"></select>\n" +
    "                        </div>\n" +
    "                        <div class=\"col-md-3 padding-top-slim\">\n" +
    "                            <input name=\"monthDay\" type=\"number\" class=\"form-control\" ng-disabled=\"uiState.yearlyRepeatOption != 'month'\"\n" +
    "                                   ng-model=\"uiState.monthDay\" min=\"1\" max=\"31\">\n" +
    "                            <div class=\"error\" ng-show=\"scheduler_form.monthDay.$invalid\">Must be between 1 and 31</div>\n" +
    "                        </div>\n" +
    "                    </div>\n" +
    "                </div>\n" +
    "            </div>\n" +
    "\n" +
    "            <div class=\"row option-pad-bottom\" ng-if=\"uiState.schedulerFrequency && uiState.schedulerFrequency.value == 'yearly'\">\n" +
    "                <div class=\"col-md-12\">\n" +
    "                    <div class=\"form-group option-pad-left\">\n" +
    "                        <div class=\"radio col-md-2\">\n" +
    "                            <label><input type=\"radio\" value=\"other\" ng-model=\"uiState.yearlyRepeatOption\" ng-change=\"yearlyRepeatChange()\" name=\"yearlyRepeatOption\"> on the</label>\n" +
    "                        </div>\n" +
    "                        <div class=\"col-md-2 padding-top-slim\">\n" +
    "                            <select name=\"yearlyOccurrence\" ng-model=\"uiState.yearlyOccurrence\" ng-options=\"o.name for o in occurrences\"\n" +
    "                                    ng-disabled=\"uiState.yearlyRepeatOption != 'other'\" class=\"form-control \"></select>\n" +
    "                        </div>\n" +
    "                        <div class=\"col-md-2 padding-top-slim\">\n" +
    "                            <select name=\"yearlyWeekDay\" ng-model=\"uiState.yearlyWeekDay\" ng-options=\"w.name for w in weekdays\"\n" +
    "                                    ng-disabled=\"uiState.yearlyRepeatOption != 'other'\" class=\"form-control \"></select>\n" +
    "                        </div>\n" +
    "                        <div class=\"col-md-2 padding-top-slim\">\n" +
    "                            <select name=\"yearlyOtherMonth\" ng-model=\"uiState.yearlyOtherMonth\" ng-options=\"m.name for m in months\"\n" +
    "                                    ng-disabled=\"uiState.yearlyRepeatOption != 'other'\" class=\"form-control \"></select>\n" +
    "                        </div>\n" +
    "                    </div>\n" +
    "                </div>\n" +
    "            </div>\n" +
    "\n" +
    "            <div class=\"form-group option-pad-left option-pad-bottom\" ng-if=\"uiState.schedulerFrequency && uiState.schedulerFrequency.value == 'weekly'\">\n" +
    "                <label><span class=\"red-text\">*</span> On Days</label>\n" +
    "                <div class=\"input-group\">\n" +
    "                    <div class=\"btn-group\">\n" +
    "                        <button type=\"button\" class=\"btn btn-default\" ng-class=\"{ 'active' : uiState.weekDays.indexOf('su') !== -1}\" ng-click=\"setWeekday('su')\">Sun</button>\n" +
    "                        <button type=\"button\" class=\"btn btn-default\" ng-class=\"{ 'active' : uiState.weekDays.indexOf('mo') !== -1}\" ng-click=\"setWeekday('mo')\">Mon</button>\n" +
    "                        <button type=\"button\" class=\"btn btn-default\" ng-class=\"{ 'active' : uiState.weekDays.indexOf('tu') !== -1}\" ng-click=\"setWeekday('tu')\">Tue</button>\n" +
    "                        <button type=\"button\" class=\"btn btn-default\" ng-class=\"{ 'active' : uiState.weekDays.indexOf('we') !== -1}\" ng-click=\"setWeekday('we')\">Wed</button>\n" +
    "                        <button type=\"button\" class=\"btn btn-default\" ng-class=\"{ 'active' : uiState.weekDays.indexOf('th') !== -1}\" ng-click=\"setWeekday('th')\">Thu</button>\n" +
    "                        <button type=\"button\" class=\"btn btn-default\" ng-class=\"{ 'active' : uiState.weekDays.indexOf('fr') !== -1}\" ng-click=\"setWeekday('fr')\">Fri</button>\n" +
    "                        <button type=\"button\" class=\"btn btn-default\" ng-class=\"{ 'active' : uiState.weekDays.indexOf('sa') !== -1}\" ng-click=\"setWeekday('sa')\">Sat</button>\n" +
    "                    </div>\n" +
    "                </div>\n" +
    "                <div class=\"error\" ng-show=\"uiState.weekDays.length == 0\">Select one or more days</div>\n" +
    "            </div>\n" +
    "\n" +
    "            <div class=\"row\">\n" +
    "                <div class=\"col-md-4\">\n" +
    "                    <div class=\"form-group\" ng-show=\"schedulerShowInterval\">\n" +
    "                        <label>End</label>\n" +
    "                        <div>\n" +
    "                            <select name=\"schedulerEnd\" ng-model=\"uiState.schedulerEnd\" ng-options=\"e.name for e in endOptions\" required class=\"form-control \"\n" +
    "                                    ng-change=\"schedulerEndChange()\"></select>\n" +
    "                        </div>\n" +
    "                    </div>\n" +
    "                </div>\n" +
    "                <div class=\"col-md-4\" ng-if=\"uiState.schedulerEnd && uiState.schedulerEnd.value == 'after'\">\n" +
    "                    <div class=\"form-group no-label\">\n" +
    "                        <div class=\"input-group\">\n" +
    "                            <input type=\"number\" name=\"schedulerOccurrenceCount\" class=\"form-control\" ng-model=\"uiState.schedulerOccurrenceCount\" min=\"1\" max=\"999\">\n" +
    "                            <span class=\"input-group-addon\">Occurrence(s)</span>\n" +
    "                        </div>\n" +
    "                        <div class=\"error\" ng-show=\"scheduler_form.schedulerOccurrenceCount.$invalid\">Provide a value between 1 and 999</div>\n" +
    "                    </div>\n" +
    "                </div>\n" +
    "                <div class=\"col-md-4\" ng-if=\"uiState.schedulerEnd && uiState.schedulerEnd.value == 'on'\">\n" +
    "                    <div class=\"form-group no-label\">\n" +
    "\n" +
    "                        <input type=\"date\" name=\"schedulerEndDt\" class=\"form-control\" ng-model=\"uiState.schedulerEndDt\" data-min-today=\"true\" required>\n" +
    "\n" +
    "                        <div class=\"error\" ng-show=\"scheduler_form.schedulerEndDt.$invalid\">Provide a valid date</div>\n" +
    "                    </div>\n" +
    "                </div>\n" +
    "            </div>\n" +
    "        </form>\n" +
    "    </div><!-- col-md-12 -->\n" +
    "</div><!-- row -->\n" +
    "");
}]);
})();
