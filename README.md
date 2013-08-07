Imager.js
==========

A project by the talented devs at BBC News and Addy Osmani.

*Note: Please note this project is not ready for production and is currently in development*

This is an experiment in offering developers an interim solution to responsive images based on the [ImageEnhancer](https://gist.github.com/Integralist/6157139) concept researched and developed by BBC news. At present, support for `srcset` and `PictureFill` are not widespread and the polyfills for these solutions also come with a number of drawbacks. 

[Mark McDonnell](https://gist.github.com/Integralist) was kind enough to document the BBC's approach for us and walkthrough how the general solution is tackled by their site. 
Our goal is to try putting together a good demo project of how a similar setup can be used by anyone together with some Grunt tooling for generating the necessary responsive images required by the solution.

Much of this work can be repurposed to work with a more standards-based approach once support improves in modern browsers.

For the purposes of maintaining a distinguishment between the ImageEnhancer concept built by the BBC and this project, we're calling it Imager.js for now.