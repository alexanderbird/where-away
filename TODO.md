# TODO

- add validation and defaults
  - use the first character of the label as the key if
      - no key is provided
      - the key is an empty string
  - root node must be `<bookmark>`
    - children keys must be unique
  - `<link>`
    - cannot have children
    - must have href
    - must have label
    - key must be no more than one character long
  - `<group>`
    - must have label
    - key must be no more than one character long
    - children keys must be unique
- add support for specifying which occurance of the key to emphasize (so you can
  choose something other than the first occurance).
  - Update demo to use this for "What cli **a**rguments..."
- clean up cli arguments
  - input xml should be a file name not stdin
  - add support for a json config file (cli args override json config?)
  - add documentation
  - rename the parameters: `html-head`, `html-body-header`, `html-body-footer`
- update parameter input to include the label text from the parameter bookmark
  - so that folks using it don't have to remember what they pressed while
    they're adding parameters
  - this requires some restructuring since the `<input>` is the root but we'll
    need to wrap it in a `<div>` and update the CSS accordingly
- do a once-over of the documentation
- release 1.0.0
