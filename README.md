# DOM language

This is a little experiment around using the DOM to represent an [AST](https://en.wikipedia.org/wiki/Abstract_syntax_tree) that can be evaluated in the browser with JavaScript. One neat side effect of this is the ability to use CSS to render a meaningful visual representation of the program being executed.

Clearly, this is not a performant way to do things, but it is fun :)

After cloning the repository, open up any of the files found in the `prog` directory in your browser -- you should see it represented visually, and you'll see any output logged to the console.

## About the language

At this point, it is extremely simple and undocumented. All statements are executed in a global context. A rudimentary type system currently consisting of `string`, `number`, and `boolean` are mapped to native JavaScript types for evaluation.

## Online Example

* [Euclidean Algorithm](https://cdn.rawgit.com/benburwell/doml/master/prog/euclideanAlgorithm.html)
* [Simple `while` loop](https://cdn.rawgit.com/benburwell/doml/master/prog/simpleWhileLoop.html)
* [Defining and calling a function](https://cdn.rawgit.com/benburwell/doml/master/prog/function.html)
