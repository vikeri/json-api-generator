"use strict";

module.exports = function(vars) {

    var express = require('express');
    var _ = require('lodash');
    require('console.table');
    var path = require('path');
    var fs = require('fs');
    var dummyjson = require('dummy-json');
    var loremIpsum = require('lorem-ipsum');
    var open = require('open');

    try {
        var files = fs.readdirSync(vars.templateDir);
    }
    catch(err) {
        if (vars.templateDir) {
            console.log('Directory not found: '+ vars.templateDir);
        } else {
            console.log('You have to specify a template directory (templateDir)');
        }
        process.exit();
    }

    var app = express();

    app.use(function(req, res, next) {
        res.header("Access-Control-Allow-Origin", "*");
        res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
        res.set('Content-Type', 'application/json');
        next();
    });



    var helpers = _.assign({
            imageUrl: function() {
                return "http://lorempixel.com/" + dummyjson.randomInt(60, 500) + "/" + dummyjson.randomInt(60, 500);
            },
            text: function() {
                return loremIpsum({
                    sentenceLowerBound: 10,
                    sentenceUpperBound: 200
                });
            },
            randomFloat: function(min, max) {
                return dummyjson.randomFloat(min, max);
            }
        },
        vars.helpers);


    // Reads all hbs files and creates their urls

    var templates = {};
    var routes = [];
    console.log('\nAvailable routes (GET):');
    for (var i in files) {
        if (path.extname(files[i]) === ".hbs") {
            var url = "/" + path.basename(files[i], '.hbs').replace("-", "/");
            var file = fs.readFileSync(vars.templateDir + files[i], {
                encoding: 'utf8'
            });
            routes.push(url);
            console.log(url);
            templates[url] = {
                url: url,
                file: dummyjson.parse(file, {
                    data: {},
                    helpers: helpers
                })
            };
        }
    }

    _.each(templates, function(template) {
        var json = JSON.stringify(template.file);
        app.get(template.url, function(req, res) {
            if (vars.log) {
                console.log(template.url);
            }
            res.send(JSON.parse(this));
        }.bind(json));
    });


    var portNo = vars.port ? vars.port : 1989;
    var address = vars.address ? vars.address : 'localhost';

    var server = app.listen(portNo, address, function() {

        var port = server.address().port;
        var address = server.address().address;

        console.log('\nExample app listening at http://%s:%s', address, port);

    });
    if (vars.open) {
        open("http://" + address + ":" + portNo + routes[0]);
    }
};
