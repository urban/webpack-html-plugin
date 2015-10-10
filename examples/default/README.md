# Default Example

This is a basic example that only builds assets for your project such as JavaScript, CSS, and etc. to the `public` directory.

## Commands

```sh
$ npm install
$ npm run dev
$ npm run build
```


## Code

```js
import getConfig from '@urban/webpack-config'

const isDev = process.argv.some(arg => /webpack-dev-server$/.test(arg))

export default getConfig({
  context: __dirname,
  entry: [
        './src/index.js',
        ...(isDev ? ['webpack/hot/dev-server'] : [])
      ],
  output: {
    path: './public/'
  }
}, isDev)
```


## License

This software is released into the public domain.
