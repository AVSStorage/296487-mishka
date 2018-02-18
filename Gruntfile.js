"use strict";

module.exports = function(grunt) {
  require("load-grunt-tasks")(grunt);

  grunt.initConfig({
    less: {
      style: {
        files: {
          "build/css/style.css": "source/less/style.less"
        }
      }
    },

    postcss: {
      style: {
        options: {
          processors: [
            require("autoprefixer")()
          ]
        },
        src: "build/css/*.css"
      }
    },

    browserSync: {
      server: {
        bsFiles: {
          src: [
            ["build/*.html", "build/css/*.css"]
          ]
        },
        options: {
          server: "build/",
          watchTask: true,
          notify: false,
          open: true,
          cors: true,
          ui: false
        }
      }
    },

    watch: {
      html: {
        files: ["build/*.html"],
        tasks: ["posthtml"]
      },
      style: {
        files: ["build/less/**/*.less"],
        tasks: ["less", "csso"]
      }
    },

    csso: {
      style: {
        options: {
          report: "gzip"
        },
        files: {
          "build/css/style.min.css": ["build/css/style.css"]
        }
      }
    },

    imagemin: {
      images: {
        options: {
          optimizationLevel: 3,
          progressive: true
        },
        files: [{
          expand: true,
          src: ["build/img/**/*.{png,jpg,svg}"]
        }]
      }
    },

    cwebp: {
      images: {
        options: {
          q: 90
        },
        files: [{
          expand: true,
          src: ["build/img/**/*.{png,jpg}"]
        }]
      }
    },

    svgstore : {
      options: {
        includeTitleElement: false
      },
      sprite: {
        files: {
          "build/img/sprite.svg": ["build/img/icon-*.svg"]
        }
      }
    },

    posthtml: {
      options: {
        use: [
          require("posthtml-include")()
        ]
      },
      html: {
        files: [{
          expand: true,
          src: ["build/*.html"],
          dest: "build"
        }]

      }
    },

    copy: {
      build: {
        files: [{
          expand: true,
          cwd: "source",
          src: [
            "fonts/**/*.{woff,woff2}",
            "img/**",
            "less/**",
            "*.html",
            "js/**"
          ],
          dest: "build"
        }]
      }
    },

    clean: {
      build: ["build"]
    }
    });

  grunt.registerTask("serve", ["browserSync", "watch"]);
  grunt.registerTask("build", [
    "clean",
    "copy",
    "less",
    "postcss",
    "csso",
    "svgstore",
    "posthtml"
  ]);

};
