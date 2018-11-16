module.exports = {
  'arlington': [
    {
      'neighborhood': 'ballston',
      'alias': ['virginia square'],
      'regex': /(ballston|balston|balllston|blstn)|((virginia|virgina|virgina|vrgina)\s*(square|sqre|squar|sqr|sqre))/i,
      'location': {
        'coordinates': [38.881831, -77.111292],
        'address': 'Virginia Square Arlington, VA 22201'
      }
    }, {
      'neighborhood': 'rosslyn',
      'regex': /(rosslyn|rslyn|roslyn|rosslynn|roslynn)/i,
      'location': {
        'coordinates': [38.897156, -77.072390],
        'address': 'Rosslyn, Virginia  22209'
      }
    }
  ],
  'dc': [
    {
      'neighborhood': 'union station',
      'location': {
        'coordinates': [38.897102, -77.006339],
        'address': '50 Massachusetts Ave NE, Washington, DC 20002'
      }
    }, {
      'neighborhood': 'lenfant plaza',
      'regex': /(l('|"|’)*enfant|l('|"|’)*fnt|l('|"|’)*enfan|l('|"|’)*enfnt|l('|"|’)*nfnt)/i,
      'location': {
        'coordinates': [38.884200, -77.025811],
        'address': '10th St SW, Washington, DC 20024'
      }
    }, {
      'neighborhood': 'foggy bottom',
      'location': {
        'coordinates': [38.899291, -77.047859],
        'address': '0079 0064, Washington, DC 20052'
      }
    }, {
      'neighborhood': 'franklin square',
      'location': {
        'coordinates': [38.901938, -77.030820],
        'address': 'Franklin Square Fountain, 950 13th St NW, Washington, DC 20005'
      }
    }
  ]
}
