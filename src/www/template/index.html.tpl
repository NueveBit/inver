<!DOCTYPE html>
<html ng-app="inverApp">
    <head>
        <meta charset="utf-8" />
        <meta name="format-detection" content="telephone=no" />
        <!-- WARNING: for iOS 7, remove the width=device-width and height=device-height attributes. See https://issues.apache.org/jira/browse/CB-4323 -->
        <meta name="viewport" content="user-scalable=no, initial-scale=1, maximum-scale=1, minimum-scale=1, width=device-width, height=device-height, target-densitydpi=device-dpi" />

        <link href='http://fonts.googleapis.com/css?family=Source+Sans+Pro' rel='stylesheet' type='text/css'>

        <%= headerInclude %>
        <% _.forEach(scripts, function(script) { %><script type="text/javascript" src="<%- script %>"></script><% }); %>

        <title>inVer</title>

    </head>
    <body ng-view>
        
    </body>
</html>