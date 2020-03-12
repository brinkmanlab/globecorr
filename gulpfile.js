const { src, dest, parallel } = require('gulp');
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

exports.default = parallel(news);
