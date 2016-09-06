module.exports = function(grunt) {
    require("load-grunt-tasks")(grunt);
    var config = grunt.file.readYAML("Gruntconfig.yml");

    grunt.initConfig({
        responsive_images: {
            dev: {
                options: {
                    engine: "gm",
                    sizes: [{
                        width: 320,
                        quality: 20
                    }, {
                        width: 640,
                        quality: 30
                    }, {
                        width: 1024,
                        quality: 30
                    }, {
                        width: 1600,
                        quality: 20
                    }]
                },
                files: [{
                    expand: true,
                    src: ["*.{jpg,gif,png}", "!udacity_logo.png"],
                    cwd: config.imgSrcDir,
                    dest: config.imgDir
                }]
            }
        },

        lint5: {
            dirPath: config.src,
            defaults: {
                "email": "a@a.com",
                "username": "abcd"
            },
            templates: [
                "index.html"
            ],
            ignoreList: []
        },

        htmlhint: {
            html1: {
                options: {
                    "tag-pair": true
                },
                src: [config.src + "*.html"]
            },
            html2: {
                options: {
                    "tag-pair": true
                },
                src: [config.src + "*.html"]
            }
        },

        csslint: {
            strict: {
                options: {
                    import: 2
                },
                src: [config.cssSrcDir + "*.css", "!" + config.cssSrcDir + "*.min.css"]
            },
            lax: {
                options: {
                    import: false
                },
                src: [config.cssSrcDir + "style.css"]
            }
        },

        prettyugly: {
            options: {},
            minify_separate: {
                expand: true,
                cwd: config.cssSrcDir,
                src: ["*.css", "!*.min.css"],
                dest: config.cssDir,
                ext: ".min.css",
                extDot: "first"
            }
        },

        jshint: {
            options: {
                "eqeqeq": true
            },
            all: [
                "Gruntfile.js",
                config.jsSrcDir + "app.js",
                config.jsSrcDir + "engine.js",
                config.jsSrcDir + "constants.js",
                config.jsSrcDir + "resources.js",
                "!" + config.jsSrcDir + "bootstrap.min.js",
                "!" + config.jsSrcDir + "jquery.min.js",
                "!" + config.jsSrcDir + "jquery.js"
            ]
        }
    });

    grunt.registerTask("default", [
//        "lint5",
//        "htmlhint",
        "csslint",
        "prettyugly",
        "jshint",
        "responsive_images"
    ]);

};