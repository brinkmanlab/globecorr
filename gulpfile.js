const { src, dest, parallel } = require('gulp');
const md = require('gulp-markdownit');
const rename = require('gulp-rename');
const header = require('gulp-header');

const MD_PLUGINS = ['markdown-it-deflist'];
const MD_CONFIG = {options: {html: true/*, linkify: true*/}, plugins: MD_PLUGINS};

const md_inst = require('markdown-it')(MD_CONFIG.preset || 'default', MD_CONFIG.options || {});

MD_PLUGINS.forEach(plugin => {
    md_inst.use(require(plugin), md_inst.options);
});

function pages() {
    // Render static markdown to html fragments
    return src('static/*.md')
        .pipe(md(MD_CONFIG))
        .pipe(rename({
            extname: ".htm",
        }))
        .pipe(header('<!-- DO NOT MODIFY! THIS CONTENT WAS DYNAMICALLY GENERATED AND ANY CHANGES WILL BE OVERWRITTEN. See ../static/*.md -->\n'))
        .pipe(dest('src/assets/'));
}

exports.default = parallel(pages);
