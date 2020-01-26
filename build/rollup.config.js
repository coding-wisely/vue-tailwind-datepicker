import commonjs from '@rollup/plugin-commonjs'; // Convert CommolnJS modules to ES6
import vue from 'rollup-plugin-vue'; // Handle .vue SFC files
import bubble from '@rollup/plugin-buble'; // Transpile/polyfill with reasonable browser support
export default {
    input: 'src/wrapper.js', // Path relative to package.json
    output: {
        name: 'VueTailwindDatepicker',
        exports: 'named',
    },
    external: [ 'moment' ],
    plugins: [
        commonjs(),
        vue({
            css: true, // Dynamically inject css as a <style> tag
            compileTemplate: true, // Explicitly convert template to render function
        }),
        bubble(), // Transpile to ES5
    ],
};