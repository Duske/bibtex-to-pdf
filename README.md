#bibtex-to-pdf

This little console application gathers all sources with a url from a bibtex library and converts them via **wkhtmltopdf** to pdf files.
Feel free to contribute!

##Installation##
```
npm install
```

Please make sure that you have **wkhtmltopdf** installed. The easiest way to do this is to
[download](http://wkhtmltopdf.org/downloads.html#stable) a prebuilt version for your system.

##Start conversion##
```
npm start
```

###Options###
* path to bibtex file, **default** is the local application directory

```
node app.js -path /path/to/my/bibtexlib/library.lib
```

##TODO##
* Accept cli args for settings
* Add configurable destination path
* More sophisticated parsing
* Improve test cases
