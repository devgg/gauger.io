'use strict';

define(['jquery'],
    function($) {
        var authorJoinString = ' and ';
        var publisherJoinString = ' and ';


        function AjaxSettings(settings) {
            this.timeout = 5000;
            for (var setting in settings) {
                if (settings.hasOwnProperty(setting)) {
                    this[setting] = settings[setting];
                }
            }
        }

        AjaxSettings.prototype = {
            constructor: AjaxSettings,
            ajaxError: function() {
                numberResults++;
                console.log('error occured');
            }
        };



        function Api(name, url, ajaxSuccess, ajaxSettings) {
            this.name = name;
            this.url = url;
            this.ajaxSuccess = ajaxSuccess;
            this.ajaxSettings = ajaxSettings;
            this.ajaxTimeout = 5000;
        }

        Api.prototype = {
            constructor: Api,
            ajaxError: function () {
                numberResults++;
                console.log('error occured');
            },
            executeQuery: function(isbn, position) {
                this.currentIsbn = isbn;
                this.currentPosition = position;
                var settings = {
                    success: this.ajaxSuccess,
                    error: this.ajaxError,
                    timeout: this.ajaxTimeout,
                    context: this
                };
                var ajaxSettings = this.ajaxSettings();
                for (var property in ajaxSettings) {
                    if (ajaxSettings.hasOwnProperty(property)) {
                        settings[property] = ajaxSettings[property];
                    }
                }
                return $.ajax(this.url(isbn), settings);
            }
        };

        function join(array, joinString, targetProperty) {
            this[targetProperty] = array.join(joinString);
        }

        function mapToPropertyAndJoin(array, property, joinString, targetProperty) {
            this[targetProperty] = array.map(function (element) {
                return element[property];
            }).join(joinString);
        }

        function getProperty(source, targetProperty) {
            this[targetProperty] = source;
        }

        function convertToDate(source, targetProperty) {
            this[targetProperty] = new Date(source).getFullYear();
        }

        function callFunctionIfPresent(object, property, func) {
            if (object.hasOwnProperty(property)) {
                func();
            }
        }

        function handleResult(bibtexEntries, position) {
            numberResults++;
            resultEntries[position] = bibtexEntries;
            if (numberResults === apis.length) {
                resultEntries = [].concat.apply([], resultEntries);
                result = objectToBibtex(mergeResultArrays());
            }
        }

        function mergeResultArrays() {
            return resultEntries.reduce(function (entry1, entry2) {
                for (var property in entry1) {
                    entry2[property] = entry1[property];
                }
                return entry2;
            }, {});
        }

        function objectToBibtex(object) {
            var bibtex = '@book{' + currentIsbn.replace(/\s/g, '') + ',\n';
            for (var property in object) {
                bibtex += '\t' + property + ' = {' + object[property] + '},\n';
            }
            bibtex += '\tisbn = {' + currentIsbn + '}';
            return bibtex + '\n}';
        }


        var googleApi = new Api(
            'Google Books',
            function() {
                return 'https://www.googleapis.com/books/v1/volumes';
            },
            function (response) {
                var bibtexEntries = [];
                if (response.hasOwnProperty('items')) {
                    response.items.forEach(function (book) {
                        book = book.volumeInfo;

                        var bibtexEntry = {};
                        var author = join.bind(bibtexEntry, book.authors, authorJoinString, 'author');
                        var title = getProperty.bind(bibtexEntry, book.title, 'title');
                        var publisher = getProperty.bind(bibtexEntry, book.publisher, 'publisher');
                        var year = convertToDate.bind(bibtexEntry, book.publishedDate, 'year');

                        callFunctionIfPresent(book, 'authors', author);
                        callFunctionIfPresent(book, 'title', title);
                        callFunctionIfPresent(book, 'publisher', publisher);
                        callFunctionIfPresent(book, 'publishedDate', year);

                        bibtexEntries.push(bibtexEntry);
                    }, this);
                }
                handleResult(bibtexEntries, this.currentPosition);
            },
            function() {
                return {
                    data: {
                        q: 'isbn:' + this.currentIsbn
                    }
                }
            }
        );

        /*,
         complete: function() {
         $('#status_open_library').prop('class', 'status_ready');
         }*/

        var openLibraryApi = new Api(
            'Open Library',
            function() {
                return 'https://openlibrary.org/api/books';
            },
            function(response) {
                var bibtexEntries = [];
                if (response.hasOwnProperty('ISBN:' + this.currentIsbn)) {
                    var book = response['ISBN:' + this.currentIsbn];
                    var bibtexEntry = {};

                    var author = mapToPropertyAndJoin.bind(bibtexEntry, book.authors, 'name', authorJoinString, 'author');
                    var title = getProperty.bind(bibtexEntry, book.title, 'title');
                    var publisher = mapToPropertyAndJoin.bind(bibtexEntry, book.publishers, 'name', publisherJoinString, 'publisher');
                    var year = convertToDate.bind(bibtexEntry, book.publish_date, 'year');

                    callFunctionIfPresent(book, 'authors', author);
                    callFunctionIfPresent(book, 'title', title);
                    callFunctionIfPresent(book, 'publishers', publisher);
                    callFunctionIfPresent(book, 'publish_date', year);
                    bibtexEntries.push(bibtexEntry);
                }
                handleResult(bibtexEntries, this.currentPosition);
            },
            function() {
                return {
                    data: {
                        format: 'javascript',
                        jscmd: 'data',
                        bibkeys: 'ISBN:' + this.currentIsbn
                    },
                    jsonp: "callback",
                    dataType: "jsonp"
                }
            }
        );


        var worldcatApi = new Api(
            'WorldCat',
            function() {
                return 'http://xisbn.worldcat.org/webservices/xid/isbn/' + this.currentIsbn;
            },
            function (response) {
                console.log(response);
                var bibtexEntries = [];
                if (response.hasOwnProperty('list')) {
                    response.list.forEach(function (book) {

                        var bibtexEntry = {};
                        var author = getProperty.bind(bibtexEntry, book.author, 'author');
                        var title = getProperty.bind(bibtexEntry, book.title, 'title');
                        var publisher = getProperty.bind(bibtexEntry, book.publisher, 'publisher');
                        var year = convertToDate.bind(bibtexEntry, book.year, 'year');
                        var address = getProperty.bind(bibtexEntry, book.city, 'address');
                        var edition = getProperty.bind(bibtexEntry, book.ed, 'edition');

                        callFunctionIfPresent(book, 'author', author);
                        callFunctionIfPresent(book, 'title', title);
                        callFunctionIfPresent(book, 'publisher', publisher);
                        callFunctionIfPresent(book, 'year', year);
                        callFunctionIfPresent(book, 'city', address);
                        callFunctionIfPresent(book, 'ed', edition);
                        bibtexEntries.push(bibtexEntry);
                    }, this);
                }
                handleResult(bibtexEntries, this.currentPosition);
            },
            function() {
                return {
                    data: {
                        method: 'getMetadata',
                        format: 'json',
                        fl: '*'
                    },
                    jsonp: "callback",
                    dataType: "jsonp"
                }
            }
        );


        var apis = [googleApi, openLibraryApi, worldcatApi];

        var currentIsbn;
        var numberResults;
        var resultEntries;
        var result;


        function executeQuery(isbn) {
            currentIsbn = isbn;
            numberResults = 0;
            resultEntries = [[], [], []];
            var deferreds = apis.map(function(api, position) {
                return api.executeQuery(isbn, position);
            });
            return deffereds; //$.when.apply($.ajax, deferreds);
        }

        function getResult() {
            return result;
        }


        return {
            executeQuery: executeQuery,
            getResult: getResult
        };
    }
);


/*
 @book{3809434469,
 ,
 isbn = {3809434469}
 }*/
