module.exports = [
  {
    phrase: 'us at',
    regex: /(((find)|(with)|(visit)|(meet))\s*(us)\s*(at)*)/i,
    prefix: true,
    postfix: false,
    negation: false
  }, {
    phrase: 'are at/in',
    regex: /((we|(we're|we\s*are|were|we"re))\s*(are)*\s*(at|in))/i,
    prefix: true,
    postfix: false,
    negation: false
  }, {
    phrase: 'head/go to',
    regex: /((head|go)\s*(over|on)*\s*(to|at))/i,
    prefix: true,
    postfix: false,
    negation: false
  }, {
    phrase: 'at the',
    regex: /((at)\s*(the))/i,
    prefix: true,
    postfix: false,
    negation: false
  }, {
    phrase: 'tomorrow',
    regex: /(tomorrow|tmrw|2mrw|2morrow|tmrow)/i,
    prefix: true,
    postfix: true,
    negation: true
  }
]
