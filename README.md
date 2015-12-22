# Build

```shell
$ npm install
$ npm run build
```

Open `index.html` in a navigator.
 
# Hosted version
An hosted version is available on [GitHub Pages](http://snes.ninja/goog_assignment).
 
# Changes
- Added forgotten `Directions` on the map.
- When loading the `data.json` file, checks if the protocol used to load `index.html` is `file:` then load it from `gh-page`, else load the file relative to the `index.html` path.
