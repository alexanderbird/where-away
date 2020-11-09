module.exports = {
  linkData: {
    external: { key: 'e', label: 'External Link' },
    parameter: { key: 'p', label: 'External Link with Parameter' },
    child: {
      key: 'c',
      label: 'Child Page',
      external: { key: 'a', label: 'Another External Link' },
      parameter: { key: 'p', label: 'Another External Link with Parameter' },
    },
  },
}
