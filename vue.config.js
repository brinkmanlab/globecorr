const VuetifyLoaderPlugin = require('vuetify-loader/lib/plugin');
const mdDeflist = require('markdown-it-deflist');
const path = require('path');

module.exports = {
    parallel: true,
    configureWebpack: {
        resolve: {
            alias: {
                "#": path.resolve(__dirname, 'static/')
            }
        },
        module: {
            rules: [
                {
                    test: /\.md$/,
                    use: ['vue-template-loader', {
                        loader: 'wrap-loader',
                        options: {
                            before: '<section class="markdown">',
                            after: '</section>'
                        }
                    }, {
                        loader: 'markdown-it-loader',
                        options: {
                            preset: 'default',
                            html: true,
                            use: [mdDeflist]
                        }
                    }, {
                        loader: 'string-replace-loader',
                        options: {
                            search: '\\[([^\\]]+)\\]\\(#(/[^\\)]*)\\)',
                            replace: (match, label, path) => `<router-link to="${path}">${label}</router-link>`,
                            flags: 'g'
                        }
                    }],
                }
            ],
        },
        plugins: [
            new VuetifyLoaderPlugin(),
        ]
    }
};
