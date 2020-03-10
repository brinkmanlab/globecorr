const { src, dest, parallel } = require('gulp');
const md = require('gulp-markdownit');
const rename = require('gulp-rename');
const header = require('gulp-header');
const markdownToJSON = require('gulp-markdown-to-json');
const concatJson = require('gulp-concat-json-to-array');

const MD_PLUGINS = ['markdown-it-deflist'];
const MD_CONFIG = {options: {html: true/*, linkify: true*/}, plugins: MD_PLUGINS};

const mdI = require('markdown-it')(MD_CONFIG.preset || 'default', MD_CONFIG.options || {});

MD_PLUGINS.forEach(plugin => {
    mdI.use(require(plugin), mdI.options);
});

function news() {
    // Render all news markdown to json, sorted by date
    return src('static/news/*.md')
        //.pipe(ListStream.obj())
        .pipe(markdownToJSON(mdI.render.bind(mdI), 'news.json'))
        .pipe(concatJson('news.json', (data)=>{
            const d = JSON.stringify(data.map(item=>{item.date = new Date(item.date); return item}).sort((a,b)=>b.date-a.date));
            return Buffer.alloc(d.length, d);
        })) // TODO list-streams broken for some reason, subbing this in
        .pipe(dest('src/assets/'));
}

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

exports.default = parallel(pages, news);
