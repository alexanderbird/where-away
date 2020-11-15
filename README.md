# Where Away?

Generate a keyboard-navigable personal bookmark webpage from your bookmarks
manifest. Translates a bookmark registry into an HTML bookmark page that does
the same thing as your web browser's bookmark toolbar, except it's keyboard
navigable. The navigation is inspired by intelliJ and Excel's Alt+ shortcuts
where a number/letter is superimposed/underlined on the actions, pressing the
number/letter takes that action.

## 0.x.x isn't usable

I'm iterating towards something useful. I'll bump to 1.x.x once this actually
does something. Until then, some or all of the output is canned data that passes
my ATDD tests but won't help you (unless you want to get an idea of what the
generated HTML is like).

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
 - manual testing: you can run `npm run sandbox` to create a new sandbox,
   process some sample input (from the acceptance test fixtures directory) and
   open the rendered html file

#### Notes on Acceptance Test suite

To be truly end-to-end, each test run gets its own temporary directory and a
fresh npm install of `where-away` from disk. This is good for having a
convincing test, but it's slowish to start. (Aside: we refer to that temporary
directory as a test sandbox.) If you're iterating on your test code without
changing the production code, there's no need to create a new temporary
directory every time. After running it once, copy the tmp path from the command
output. It looks something like this:

     ▸ Creating temp directory
        ↳ /tmp/where-away-test.eNZbXKbi5

On the next run, prefix the command with
`TEST_SANDBOX=/tmp/where-away-test.eNZbXKbi5` to skip the sandbox creation step.
