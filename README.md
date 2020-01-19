# slideNavigation
js library for interactive gesture-based navigation on hirarchical websites. To try it yourself, see the following example taken from https://en.wikipedia.org/wiki/Tree:

https://peteole.github.io/slideNavigation/wikipediaTreeExample.html

## How to use it
Include the following lines into the header of your website:
``` html
    <link rel='stylesheet' type='text/css' media='screen' href='https://peteole.github.io/slideNavigation/design.css'>
    <script src='https://peteole.github.io/touchmove/touchmove.js'></script>
    <script src='https://peteole.github.io/slideNavigation/main.js'></script>
```
Your browser will automatically transform the document structure into a gesture-navigatable website. The structure will be derived from the use of h1, h2 h3 etc elements. Note that only elements which are the first child of the body element will be considered.
