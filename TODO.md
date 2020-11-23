# TODO

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
