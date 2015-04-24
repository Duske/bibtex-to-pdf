#bibtex-to-pdf

This program fetches all your urls a bibtex library and converts them via **wkhtmltopdf** to pdf files.
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
* path to bibtex file

```
npm start -path /path/to/my/bibtexlib/library.lib
```

##TODO##
* Accept cli args for settings
* More sophisticated parsing
