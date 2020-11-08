# Where Away?

Generate a keyboard-navigable personal bookmark webpage from your bookmarks
manifest. Translates a bookmark registry into an HTML bookmark page that does
the same thing as your web browser's bookmark toolbar, except it's keyboard
navigable. The navigation is inspired by intelliJ and Excel's Alt+ shortcuts
where a number/letter is superimposed/underlined on the actions, pressing the
number/letter takes that action.

## The name

from [Nautical Dictionary from MarineWaypoints.com](http://www.marinewaypoints.com/learn/glossary/glossary.shtml)

> Where Away? - Inquiry addressed to a look-out man, demanding precise direction
> of an object he has sighted and reported.

Read more in the [related ADR](doc/adr/0002-name-the-project-where-away.md)

## Usage

    npx where-away < bookmarks.json > bookmarks.html

## Developer Notes

![Test & Publish](https://github.com/alexanderbird/where-away/workflows/Test%20&%20Publish/badge.svg)

### Testing

 - full regression: `npm test`. This runs all the test suites:
 - test suites:
   - unit tests: `npm run test:unit`
   - acceptance test: `npm run test:acceptance`
      - this creates a test sandbox by creating a temp directory, initializing
        npm, installing where-away (from this directory)
      - it also runs the `where-away` cli in that sandbox to generate an HTML
        file
      - then we use Jest in the test/acceptance/**/*.spec.js files to test the
        contents of that generated HTML file
