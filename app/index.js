'use strict';
var util = require('util');
var path = require('path');
var yeoman = require('yeoman-generator');
var yosay = require('yosay');
var chalk = require('chalk');


var DegPatternlabGenerator = module.exports = yeoman.generators.Base.extend({

    initializing: function() {
        this.pkg = require('../package.json');
    },

    prompting: function() {
        var cb = this.async();

        // Have Yeoman greet the user.
        this.log(yosay('Welcome to the marvelous DEG Patternlab generator!'));

        var prompts = [
            {
                type: 'input',
                name: 'projectName',
                message: 'What is the name of this project?',
                default: 'DEG Project'
            },
            {
                type: 'checkbox',
                message: 'Wanna install some stuff?',
                name: 'features',
                choices: [
                    {
                        name: 'jQuery (1.11.1)',
                        value: 'includeJquery'
                    },
                    {
                        name: 'Modernizr (2.8.2)',
                        value: 'includeModernizr'
                    }
                ]
            },
            {
                type: 'list',
                message: 'What type of project is this?',
                name: 'projectType',
                choices: [
                    {
                        name: 'No Platform',
                        value: 'general'
                    },
                    {
                        name: 'Magento',
                        value: 'magento'
                    },
                    {
                        name: 'WordPress',
                        value: 'wordpress'
                    }
                ]
            }
        ];

        this.prompt(prompts, function(props) {
            var features = props.features;
            function hasFeature (feat) {
                return features.indexOf(feat) !== -1;
            }

            this.projectName = props.projectName;
            this.includeJquery = hasFeature('includeJquery');
            this.includeModernizr = hasFeature('includeModernizr');
            this.projectType = props.projectType;

            this.dependencies = {};

            if ( this.includeJquery ) {
                this.dependencies["jquery"] = "~1.11.1";
            }

            if ( this.includeModernizr ) {
                this.dependencies["modernizr"] = "~2.8.2";
            }

            cb();

        }.bind(this));

    },

    copyingFiles: function() {
        var done = this.async();

        this.copy('_package.json', 'package.json');
        this.copy('_bower.json', 'bower.json');
        this.copy('_Gruntfile.js', 'Gruntfile.js');
        this.directory('grunt', 'grunt');

        done();
    }

    cloningPatternLab: function() {
        var done = this.async();

        this.remote('degdigital', 'patternlab-php', 'master', function(err, remote) {
            remote.directory('.', '');
            done();
        });

    },

    cloningPatternLabTemplates: function() {
        var done = this.async();

        this.remote('degdigital', 'patternlab-templates', 'master', function(err, remote) {
            remote.directory('.', 'source');
            done();
        });
    },

    installingDependencies: function () {
        this.on('end', function() {
            this.installDependencies({
                callback: function () {
                    //this.spawnCommand('grunt', ['copy:patternlab']);
                }.bind(this)
            });
        });
    }
});