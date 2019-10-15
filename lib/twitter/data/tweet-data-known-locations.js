module.exports = {
  arlington: [
    {
      neighborhood: 'ballston',
      alias: ['virginia square'],
      regex: /(ballston|balston|balllston|blston|blstn)|((virginia|virgina|virgina|vrgina)\s*(square|sqre|squar|sqr|sqre))/i,
      location: {
        coordinates: [38.881831, -77.111292],
        address: 'Virginia Square Arlington, VA 22201',
      },
    }, {
      neighborhood: 'rosslyn',
      regex: /(rosslyn|rslyn|roslyn|rosslynn|roslynn)/i,
      location: {
        coordinates: [38.897156, -77.072390],
        address: 'Rosslyn, Virginia  22209',
      },
    },
  ],
  dc: [
    {
      neighborhood: '',
      regex: /(\w*)\s*(and|&|&&|nd)\s*(\d(\w*)?)/i,
      location: {
        coordinates: [],
        address: '',
      },
    }, {
      neighborhood: 'union station',
      regex: /((union|unon|unin)\s*(station|stion|statin|stn))/i,
      location: {
        coordinates: [38.897102, -77.006339],
        address: '50 Massachusetts Ave NE, Washington, DC 20002',
      },
    }, {
      neighborhood: 'lenfant plaza',
      regex: /((l('|"|’)*enfant|l('|"|’)*fnt|l('|"|’)*enfan|l('|"|’)*enfnt|l('|"|’)*nfnt)\s*(plaza|pl|plza|plz)*)/i,
      location: {
        coordinates: [38.884200, -77.025811],
        address: '10th St SW, Washington, DC 20024',
      },
    }, {
      neighborhood: 'foggy bottom',
      regex: /((foggy|fogy|fgy)\s*(bottom|bttm|botom|bottm))/i,
      location: {
        coordinates: [38.899291, -77.047859],
        address: '0079 0064, Washington, DC 20052',
      },
    }, {
      neighborhood: 'franklin square',
      regex: /((franklin|frnkln|frnklin|frankln|frnk)\s*(square|sqr|squar|squre|sq))/i,
      location: {
        coordinates: [38.901938, -77.030820],
        address: 'Franklin Square Fountain, 950 13th St NW, Washington, DC 20005',
      },
    }, {
      neighborhood: 'noma',
      regex: /(noma)|((north|n)\s*(of)*\s*(mass|massachuesetts)\s*(ave|avenue))/i,
      location: {
        coordinates: [38.900318, -77.011744],
        address: 'H St NW, Washington, DC 20001',
      },
    }, {
      neighborhood: 'chinatown',
      regex: /((gallery|gal)\s*(place|pl))|((capital|cptl|cap)\s*(one|1)\s*(arena|arna)*)|((verizon|vrzn|verizn|vrizon)\s*(cntr|center))|((china|chin)\s*(town|twn))/i,
      location: {
        coordinates: [38.898482, -77.021965],
        address: '700 G St NW, Washington, DC 20001',
      },
    }, {
      neighborhood: 'farragut square',
      regex: /((farragut|fargut|farragt|farrgut)\s*(square|sqre|squar|sqr|sqre))/i,
      location: {
        coordinates: [38.902033, -77.038995],
        address: '0185W 0800, Washington, DC 20006',
      },
    }, {
      neighborhood: 'metro center station',
      regex: /((metro|mtro|mtr)\s*(center|centr|cntr)\s*(station|stion|staton|statin)*)/i,
      location: {
        coordinates: [38.898375, -77.028065],
        address: 'Metro Center, 607 13th St NW, Washington, DC 20005',
      },
    },
  ],
  vienna: [
    {
      neighborhood: 'gallows',
      regex: /(tip|tp|)\s*((gallows|gallow|gllow|galow|gallow))/i,
      location: {
        coordinates: [38.912916, -77.226185],
        address: '1919 Gallows Road, VA 22201',
      },
    },
  ],
};

//(\w*)\s*(and|&|&&|nd)\s*(\d(\w*)?) <= the regex to incorporate for address (might want to improve)
//it will have no neighboor hood
//in tweet parser if no neighboorhood then it must be searched
//depending on what the city is you prefix the fuzzy search with City name for better search results
//make search to google api, if exists it matches and append all the location data