# Category
cat = {
    'ADD': 'ADDRESS',
    'HT': 'HASHTAG',
    'NBR': 'NEIGHBORHOOD',
    'NULL': 'NULL'
}

# Time
t = {
    'TOD': 'TODAY',
    'TMRW': 'TOMORROW',
    'DT': 'DATE',
    'TIME': 'TIME',
    'NULL': 'NULL'
}

# Affirmation
aff = {
    'POS': 'POSITIVE',
    'NEG': 'NEGATIVE',
    'NULL': 'NULL'
}

# Training Data
train_data = [
("'This is my f**king country': Racist white woman arrested for attacking passengers on New York bus https://t.co/Rfm0jauh72", {'category': [(cat['NULL'], [])], 'time': [(t['NULL'], [])], 'affirmation': [(aff['NULL'], [])] }),
("RT @mussie671: Freestyle #3, Fiasco type shiiii https://t.co/0GTJscWORW", {'category': [(cat['NULL'], [])], 'time': [(t['NULL'], [])], 'affirmation': [(aff['NULL'], [])] }),
("What you think Cole? @JColeNC @JColeDirect https://t.co/oE4Ipvq6hL", {'category': [(cat['NULL'], [])], 'time': [(t['NULL'], [])], 'affirmation': [(aff['NULL'], [])] }),
("⚡️ “Redskins dominate the Raiders on Sunday Night Football ”https://t.co/4VuHWOs1gX", {'category': [(cat['NULL'], [])], 'time': [(t['DT'], [37,49])], 'affirmation': [(aff['NULL'], [])] }),
("RT @NWSSanJuan: 215PM FLASH FLOOD EMERGENCY for A Dam Failure in Isabela Municipality y Quebradillas Municipality in Puerto Rico... #prwx h…", {'category': [(cat['NBR'], [65,85]), (cat['NBR'], [88,113])], 'time': [(t['TIME'], [16,21])], 'affirmation': [(aff['NULL'], [])] }),
("Posted @chinatown on the corner of 7th &amp; D st. NW, PERFECT WEATHER TO SLIDE UP!!", {'category': [(cat['ADD'], [35,53])], 'time': [(t['NULL'], [])], 'affirmation': [(aff['POS'], [0,34])] }),
("Good Morning DMV, we are @ChinaTown on the corner of 7th &amp; G st NW. Hand crafted burgers, endless toppings, Hand cut fries,  PULL UP !!!", {'category': [(cat['ADD'], [53,70])], 'time': [(t['NULL'], [])], 'affirmation': [(aff['POS'], [18,52])] }),
("Good Morning DMV, we are @ChinaTown on the corner of 7th &amp; G st. NW serving our delicious hand crafted burgers and Home made fries. PULL UP!", {'category': [(cat['ADD'], [53,71])], 'time': [(t['NULL'], [])], 'affirmation': [(aff['POS'], [18,52])] }),
("Good morning angry burger lovers, we are back in China town, 7th &amp; G st. NW serving our delicious hand crafted burgers and home made fries!!", {'category': [(cat['ADD'], [61,79])], 'time': [(t['NULL'], [])], 'affirmation': [(aff['POS'], [34,59])] }),
("Good Morning Angry burger lovers, we are serving @Chinatown on the corner of 7th and G st NW. See you there!", {'category': [(cat['ADD'], [77,92])], 'time': [(t['NULL'], [])], 'affirmation': [(aff['POS'], [34,76])] }),
("Good morning DMV we are @ChinaTown today, on the corner of 7th and F st NW. COME EAT ‘EM UP!!!", {'category': [(cat['ADD'], [59,74])], 'time': [(t['TOD'], [34,40])], 'affirmation': [(aff['POS'], [17,58])] }),
("Good morning angry burger lovers, we are serving on the corner of 25th &amp; M today, see you there!", {'category': [(cat['ADD'], [66,78])], 'time': [(t['TOD'], [79,84])], 'affirmation': [(aff['POS'], [34,65])] }),
("Good morning DMV, we are serving lunch China town on the corner of 7th &amp; D st NW. Come get you some!!", {'category': [(cat['ADD'], [39,49]), (cat['ADD'], [67,84])], 'time': [(t['NULL'], [])], 'affirmation': [(aff['POS'], [18,66])] }),
("Good morning angry burger lovers, we are @L’enfant plaza serving our delicious burgers and hand cut fries! See you there!", {'category': [(cat['ADD'], [42,56])], 'time': [(t['NULL'], [])], 'affirmation': [(aff['POS'], [34, 86])] }),
("Good morning DMV, we will be on the cornor of 19th &amp; L st. NW serving our delicious hand crafted burgers and hand cut fries. SEE YOU THERE!", {'category': [(cat['ADD'], [46,65])], 'time': [(t['NULL'], [])], 'affirmation': [(aff['POS'], [18,45])] }),
("Good morning DMV, We are on the corner of 25th &amp; M st NW kicking out our delicious burgers, BMF’s and hand cut fries! Come get you some!!", {'category': [(cat['ADD'], [42,60])], 'time': [(t['NULL'], [])], 'affirmation': [(aff['POS'], [18,41])] }),
("Good morning DMV, We will be serving @ 25th &amp; M today. See ya there!", {'category': [(cat['ADD'], [39,51])], 'time': [(t['TOD'], [52,57])], 'affirmation': [(aff['POS'], [18,36])] }),
("Good morning DMV, it’s a beautiful day, we’ll be @Chinatown on the corner of 7th &amp; G st. Serving our delicious burgers and hand cut fries!!", {'category': [(cat['ADD'], [77,91])], 'time': [(t['NULL'], [])], 'affirmation': [(aff['POS'], [40,76])] }),
("Come enjoy lunch with us at Virginia Ave and 20th st NW from 11am to 2pm 😋 see you soon! #arepas #patacones… https://t.co/F3BQPKzWNf", {'category': [(cat['ADD'], [28,55])], 'time': [(t['TIME'], [61,72])], 'affirmation': [(aff['POS'], [0,27])] }),
("Happy humpday!! Find us at Farragut square from 11:30am to 2pm! 🤗 see you soon! #arepas #patacones #venezuelanfood… https://t.co/IENRYU3X0I", {'category': [(cat['ADD'], [27,42])], 'time': [(t['TIME'], [48,62])], 'affirmation': [(aff['POS'], [16,26])] }),
("Happy Friday!!! Come join us for lunch today at 20 Massachusetts Ave by Union Station from 11:30am to 2pm. See you… https://t.co/mb0RzawFgm", {'category': [(cat['ADD'], [48,68]), (cat['NBR'], [72,85])], 'time': [(t['TOD'], [39,44]), (t['TIME'],[91,105])], 'affirmation': [(aff['POS'], [16,47])] }),
("Happy Friday!! Cone have lunch with us by 20 Massachusetts Ave. close by Union Station. Window open from 11am to 1:… https://t.co/rPOxYH2h32", {'category': [(cat['ADD'], [42,62]), (cat['NBR'],[73,86])], 'time': [(t['NULL'], [])], 'affirmation': [(aff['POS'], [15,41])] }),
("Happy humpday! Have lunch with us today at Farragut Square from 11am to 1:30pm. See you at lunchtime 😋 #arepas… https://t.co/1aGfOUvRJN", {'category': [(cat['NBR'], [43,58])], 'time': [(t['TIME'], [64,78])], 'affirmation': [(aff['POS'], [15,42])] }),
("Happy Friday! 🤗 come have lunch with us! today we are by 20 Massachusetts Ave. one block from Union Station. Will b… https://t.co/i9WpS2a3qp", {'category': [(cat['ADD'], [57,77]), (cat['NBR'], [94,107])], 'time': [(t['TOD'], [41,46])], 'affirmation': [(aff['POS'], [41,56])] }),
("Happy humpday!! Have lunch with us today at Farragut Sq on 17th St NW from 11am to 2pm 🤤 see you at lunchtime!… https://t.co/uD8N5dv0c3", {'category': [(cat['NBR'], [44,55]), (cat['ADD'], [59,69])], 'time': [(t['TOD'], [35,40]),(t['TIME'], [75,86])], 'affirmation': [(aff['POS'], [16,43])] }),
("Come have lunch with us today at L St and 18th St NW from 11am to 2pm. 😋 #arepas #patacones #venezuelanfood… https://t.co/iAYU60TBW2", {'category': [(cat['ADD'], [33,52])], 'time': [(t['TIME'], [58,69])], 'affirmation': [(aff['POS'], [0,32])] }),
("Happy Friday! Come have lunch with us at Virginia Ave and 20th St NW from 11:30am to 2pm. 🤤 #arepas #patacones… https://t.co/AgbiimSwmG", {'category': [(cat['ADD'], [41,68])], 'time': [(t['TIME'], [74,88])], 'affirmation': [(aff['POS'], [14,40])] }),
("Find us by Union Station today from 11am to 1:30pm! See you at lunchtime! 🤗 #arepas #patacones #cachapas… https://t.co/m0RnNakUfN", {'category': [(cat['NBR'], [11,24])], 'time': [(t['TOD'], [25,30]), (t['TIME'], [36,50])], 'affirmation': [(aff['POS'], [0,10])] }),
("Happy humpday! We are at L St and 18th St NW from 11am to 2pm. 😋 see you soon! #arepas #patacones #venezuelanfood… https://t.co/zdqlNAdmHx", {'category': [(cat['ADD'], [25,44])], 'time': [(t['TIME'], [50,61])], 'affirmation': [(aff['POS'], [15,24])] }),
("Come have lunch with us at L’Enfant Plaza Station from 11:30am to 2pm. 🤤 #arepas #patacones #venezuelanfood… https://t.co/ncYg97TWhn", {'category': [(cat['NBR'], [27,49])], 'time': [(t['TIME'], [55,69])], 'affirmation': [(aff['POS'], [0,26])] }),
("Happy Friday! Find us at L St and 19th St NW from 11:30 am to 2pm. #arepas #patacones #venezuelanfood #foodtruck… https://t.co/mHSgLR8vFD", {'category': [(cat['ADD'], [25,44])], 'time': [(t['TIME'], [50,65])], 'affirmation': [(aff['POS'], [14,24])] }),
("Come find us by Union Station from 11:30am to 2pm. See you at lunchtime 🤤 #arepas #patacones #venezuelanfood… https://t.co/mgtXfhQF9z", {'category': [(cat['NBR'], [16,29])], 'time': [(t['TIME'], [35,49])], 'affirmation': [(aff['POS'], [0,15])] }),
("Happy Friday! We are at Virginia Ave and 20th St NW from 11am to 2pm. See you soon 😋 #arepas #patacones… https://t.co/rdiOS2M8FD", {'category': [(cat['ADD'], [24,51])], 'time': [(t['TIME'], [57,68])], 'affirmation': [(aff['POS'], [14,23])] }),
("Come find us by Union Station today from 11:15am to 2pm 🤤 #arepas #patacones #empanadas #venezuelanfood #foodtruck… https://t.co/loxNI3jDYw", {'category': [(cat['NBR'], [16,29])], 'time': [(t['TOD'], [30,35]), (t['TIME'], [40,55])], 'affirmation': [(aff['POS'], [0,15])] }),
("Happy humpday! Come have lunch with us at L St and 19th St NW from 11:15am to 2pm. See you soon 😋 #arepas… https://t.co/uIc90Wi5R4", {'category': [(cat['ADD'], [42,61])], 'time': [(t['TIME'], [67,81])], 'affirmation': [(aff['POS'], [15,41])] }),
("Come have lunch with us at L’Enfant Plaza Station from 11:30am to 2pm. #arepas #patacones #venezuelanfood… https://t.co/rHlc8dBTq0", {'category': [(cat['NBR'], [27,49])], 'time': [(t['TIME'], [55,69])], 'affirmation': [(aff['POS'], [0,26])] }),
("RT @Mahou_DC: Mahou Session IPA on tap now @ArepaZone! #beer #cerveza https://t.co/bU42scrCT2", {'category': [(cat['NULL'], [])], 'time': [(t['NULL'], [])], 'affirmation': [(aff['NULL'], [])] }),
("RT @hylandwx: This Patacón from @ArepaZone is ginormous, but oh so tasty 😋 @UnionMarketDC https://t.co/fMvJcgHU4n", {'category': [(cat['NULL'], [])], 'time': [(t['NULL'], [])], 'affirmation': [(aff['NULL'], [])] }),
("RT @isalara: Recogiendo un pan de jamón! 😛 (at @ArepaZone in Washington, DC) https://t.co/AwgQw1JKo7", {'category': [(cat['NULL'], [])], 'time': [(t['NULL'], [])], 'affirmation': [(aff['NULL'], [])] }),
("RT @renerincon: @porlagoma @jesusalemarin @ArepaZone Si M&amp;M fue muy grato ver a ‘Eterna Juventud’, muy buenos recuerdos de Venevisión y Tel…", {'category': [(cat['NULL'], [])], 'time': [(t['NULL'], [])], 'affirmation': [(aff['NULL'], [])] }),
("RT @porlagoma: Alegra tanto ver a los venezolanos que tienen éxito con sus emprendimientos en Estados Unidos, como mis amigos queridos de @…", {'category': [(cat['NULL'], [])], 'time': [(t['NULL'], [])], 'affirmation': [(aff['NULL'], [])] }),
("RT @LizarazNava: @porlagoma @ArepaZone La mejor arepa que he disfrutado en mi vida. Ricas!", {'category': [(cat['NULL'], [])], 'time': [(t['NULL'], [])], 'affirmation': [(aff['NULL'], [])] }),
("RT @CapHarvestDC: Make your taste buds dance this Friday by picking up one of @ArepaZone's famous arepas for lunch! Some of their many opti…", {'category': [(cat['NULL'], [])], 'time': [(t['NULL'], [])], 'affirmation': [(aff['NULL'], [])] }),
("RT @cecasanovap: Juego del DC United: ¿Los cánticos? En español. ¿La comida? La gente de @ArepaZone tiene a medio estadio comiendo arep…", {'category': [(cat['NULL'], [])], 'time': [(t['NULL'], [])], 'affirmation': [(aff['NULL'], [])] }),
("RT @PopeDupontCircl: If you are looking for lunch in Sunday-desolate downtown DC, @ArepaZone is a great option on 14th https://t.co/vhFucNu…", {'category': [(cat['NULL'], [])], 'time': [(t['NULL'], [])], 'affirmation': [(aff['NULL'], [])] }),
("RT @freedomlovererh: Missed @ArepaZone so much when I was away! so glad to be back :) https://t.co/eanmDvOnUa", {'category': [(cat['NULL'], [])], 'time': [(t['NULL'], [])], 'affirmation': [(aff['NULL'], [])] }),
("RT @SmorgasburgDC: If you haven't grabbed a tostones trio from @arepazone, what are you waiting for? Referred to as a patacón, it's a mouth…", {'category': [(cat['NULL'], [])], 'time': [(t['NULL'], [])], 'affirmation': [(aff['NULL'], [])] }),
("RT @AllThingsGo: The Fall Classic food lineup is here! Let us know what eats you’re most excited for in the replies 🍔 #ATGFallClassichttp…", {'category': [(cat['NULL'], [])], 'time': [(t['NULL'], [])], 'affirmation': [(aff['NULL'], [])] }),
("RT @Amused_Jade: Chicha de arroz, patacon con Pollo, and cachapas con carne#food #foodpics #foodie #dcfoodie @arepazone https://t.co/QTeH…", {'category': [(cat['NULL'], [])], 'time': [(t['NULL'], [])], 'affirmation': [(aff['NULL'], [])] }),
("RT @tolimolidc: Thank you for including us, @Eater_DC ! Love to see your friends @ArepaZone x Kuya Ja's Lechon Belly, and more on the list…", {'category': [(cat['NULL'], [])], 'time': [(t['NULL'], [])], 'affirmation': [(aff['NULL'], [])] }),
("RT @RobertoNasser: @luciovilla @ArepaZone for awesome Venezuelan food!", {'category': [(cat['NULL'], [])], 'time': [(t['NULL'], [])], 'affirmation': [(aff['NULL'], [])] }),
("RT @NaniaWTOP: Everything we do, we’ve made it a macro version of our family’s recipes … Just calling the matriarchs in both of our familie…", {'category': [(cat['NULL'], [])], 'time': [(t['NULL'], [])], 'affirmation': [(aff['NULL'], [])] }),
("RT @byamichelle: Still regretting the day my Venezuelan friend introduced me to the @ArepaZone around the corner. So delicious and so impos…", {'category': [(cat['NULL'], [])], 'time': [(t['NULL'], [])], 'affirmation': [(aff['NULL'], [])] }),
("Laissez les bon temps rouler 🎉 Get your king cake doughnuts, baby not included this #mardigras. Available in DC and… https://t.co/dzs6PerpQa", {'category': [(cat['NULL'], [])], 'time': [(t['NULL'], [])], 'affirmation': [(aff['NULL'], [])] }),
("We’re at Farragut Square for lunch today DC! Catch us from 11:30-1 😎", {'category': [(cat['NBR'], [9,24])], 'time': [(t['TOD'], [35,40]), (t['TIME'], [59,66])], 'affirmation': [(aff['POS'], [0,8])] }),
("The perfect cheddar biscuit &amp; fried chicken-what more could you want in a breakfast? 📸: @lindakuehl #astrodoughnuts https://t.co/S4PQdpPRdG", {'category': [(cat['NULL'], [])], 'time': [(t['NULL'], [])], 'affirmation': [(aff['NULL'], [])] }),
("Good morning DC! Catch us at L’Enfant Plaza from 11:30-1pm today 😋", {'category': [(cat['NBR'], [29,43])], 'time': [(t['TIME'], [49,58]), (t['TOD'], [59,64])], 'affirmation': [(aff['POS'], [17,28])] }),
("Returning to work after a long weekend bites-luckily our chocolate covered strawberry doughnuts taste pretty great… https://t.co/JBGiZveUD3", {'category': [(cat['NULL'], [])], 'time': [(t['NULL'], [])], 'affirmation': [(aff['NULL'], [])] }),
("We know it might not feel like summer outside, but one bite of our Key Lime doughnut and it's suddenly sunny &amp; 75 😎… https://t.co/kCerlKvLr9", {'category': [(cat['NULL'], [])], 'time': [(t['NULL'], [])], 'affirmation': [(aff['NULL'], [])] }),
("DC: the truck is at Farragut today from 11:30 to 1 🤘🏻", {'category': [(cat['NBR'], [20,28])], 'time': [(t['TOD'], [29,34]), (t['TIME'], [40,50])], 'affirmation': [(aff['POS'], [4,19])] }),
("Hey, LA! Catch the Astro Truck in today from 11-2 in Playa Del Rey! https://t.co/fT83xI7E4D", {'category': [(cat['NBR'], [53,66])], 'time': [(t['TOD'], [34,39]), (t['TIME'], [45,49])], 'affirmation': [(aff['POS'], [9,39])] }),
("Have you ordered your #Valentines yet 💘? Surprise your loved ones with a mini box of these beauties via the link in… https://t.co/79VwnvEVWK", {'category': [(cat['NULL'], [])], 'time': [(t['NULL'], [])], 'affirmation': [(aff['NULL'], [])] }),
("We've got our 👀 on the prize today//📸:@fooodmuncher #astrodoughnuts https://t.co/w74xL21y4M", {'category': [(cat['NULL'], [])], 'time': [(t['NULL'], [])], 'affirmation': [(aff['NULL'], [])] }),
("Union Station friends! Find our truck today from 11:30-1:00. See you soon!", {'category': [(cat['NBR'], [0,13])], 'time': [(t['TOD'], [38,43]), (t['TIME'], [49,59])], 'affirmation': [(aff['POS'], [23,43])] }),
("Nothing says 'I Love You' quite like a box of doughnuts 💘 Share a box with that special someone or at your Galentin… https://t.co/V3CNYQECZj", {'category': [(cat['NULL'], [])], 'time': [(t['NULL'], [])], 'affirmation': [(aff['NULL'], [])] }),
("NOMA friends, we’ll see you on the truck today from 11:30 to 1:00. Happy Friday 🙌", {'category': [(cat['NBR'], [0,4])], 'time': [(t['TOD'], [41,46]), (t['TIME'], [52,65])], 'affirmation': [(aff['POS'], [14,46])] }),
("The perfect lunch doesn't exist....oh wait 😎 Pre-order yours at https://t.co/6yG5Eyqf7V 📸: @thejenchase https://t.co/8mgodtHUky", {'category': [(cat['NULL'], [])], 'time': [(t['NULL'], [])], 'affirmation': [(aff['NULL'], [])] }),
("Our love language is doughnuts 💘 🍩: Blood Orange Mimosa with orange-champagne glaze, chocolate drizzle &amp; gold spri… https://t.co/kHQZlu5gOX", {'category': [(cat['NULL'], [])], 'time': [(t['NULL'], [])], 'affirmation': [(aff['NULL'], [])] }),
("Say good morning to Key Lime Pie, Blood Orange Mimosa, Tiramisu &amp; Chocolate Covered Strawberry, available all Febru… https://t.co/g4Kw6qO2TY", {'category': [(cat['NULL'], [])], 'time': [(t['NULL'], [])], 'affirmation': [(aff['NULL'], [])] }),
("Celebrating #FryDay in NOMA this morning! Catch the truck from 11:30-1", {'category': [(cat['NBR'], [23,27])], 'time': [(t['TIME'], [63,70])], 'affirmation': [(aff['POS'], [42,62])] }),
("We’ll be at L’Enfant Plaza today from 11:30-1:00. See you soon!", {'category': [(cat['NBR'], [12,26])], 'time': [(t['TOD'], [27,32]), (t['TIME'], [38,48])], 'affirmation': [(aff['POS'], [0,11])] }),
("RT @DCSLIDERSTRUCK: Say yes to jobs &amp; city revenue &amp; pass complete food truck ordinance @TimLovain #AlexandriaHeartsFoodTrucks 🍔🍔", {'category': [(cat['NULL'], [])], 'time': [(t['NULL'], [])], 'affirmation': [(aff['NULL'], [])] }),
("hi everyone looks like we are taking off for a week vacation wilbe back soon", {'category': [(cat['NULL'], [])], 'time': [(t['NULL'], [])], 'affirmation': [(aff['NULL'], [])] }),
("http://t.co/ffFrNASthI", {'category': [(cat['NULL'], [])], 'time': [(t['NULL'], [])], 'affirmation': [(aff['NULL'], [])] }),
("RT @TopDogTruck: @Partytrucks thanks for lunch.  I like the new falafel recipe.", {'category': [(cat['NULL'], [])], 'time': [(t['NULL'], [])], 'affirmation': [(aff['NULL'], [])] }),
("RT @TopDogTruck: @Partytrucks thanks for lunch yesterday.  The chicken was delicious.", {'category': [(cat['NULL'], [])], 'time': [(t['NULL'], [])], 'affirmation': [(aff['NULL'], [])] }),
("RT @richcadieux: @RestonPatch View from my front door on Barrel Cooper Court http://t.co/u3UJjixo", {'category': [(cat['ADD'], [57,76])], 'time': [(t['NULL'], [])], 'affirmation': [(aff['NULL'], [])] }),
("RT @CarisSevern: @RestonPatch You can tell it's not Reston, though - the phone-pole thingie... http://t.co/ZQ6fp2gS", {'category': [(cat['NBR'], [52,58])], 'time': [(t['NULL'], [])], 'affirmation': [(aff['NULL'], [])] }),
("RT @KC_Kreative: Thanks @PartyTrucks (ATIP) and @Scoops2u for a super tasty lunch today. Nothing like a gyro and 'chipwich' to fill you up!", {'category': [(cat['NULL'], [])], 'time': [(t['NULL'], [])], 'affirmation': [(aff['NULL'], [])] }),
("Serving at @ResidenceInn Largo - 1330 Caraway Court  Largo From 5:30PM-8:30PM EDT http://t.co/lA7xharyp6", {'category': [(cat['ADD'], [25,51])], 'time': [(t['TIME'], [64,77])], 'affirmation': [(aff['POS'], [0,10])] }),
("At navy yard ready to open", {'category': [(cat['NBR'], [3,12])], 'time': [(t['NULL'], [])], 'affirmation': [(aff['POS'], [13,26])] }),
("Ready to serve at friendship heights", {'category': [(cat['NBR'], [18,36])], 'time': [(t['NULL'], [])], 'affirmation': [(aff['POS'], [0,17])] }),
("Ready to serve our Delicious angus bulgogi at friendship heights", {'category': [(cat['NBR'], [46,64])], 'time': [(t['NULL'], [])], 'affirmation': [(aff['POS'], [0,14])] }),
("We are here at navy yard with angus aeye round bulgogi and fusion tacos", {'category': [(cat['NBR'], [15,24])], 'time': [(t['NULL'], [])], 'affirmation': [(aff['POS'], [0,14])] }),
("We here at Virginia ave folks", {'category': [(cat['ADD'], [11,23])], 'time': [(t['NULL'], [])], 'affirmation': [(aff['POS'], [0,10])] }),
("Friendship heights", {'category': [(cat['NBR'], [0,18])], 'time': [(t['NULL'], [])], 'affirmation': [(aff['NULL'], [])] }),
("We are at lenfant plaza serving our delicious bulgogi, fusion tacos and spicy pork subs", {'category': [(cat['NBR'], [10,23])], 'time': [(t['NULL'], [])], 'affirmation': [(aff['POS'], [0,9])] }),
("Navy Yard on this rainy Friday!", {'category': [(cat['NBR'], [0,9])], 'time': [(t['NULL'], [])], 'affirmation': [(aff['POS'], [10,30])] }),
("Good morning! We are at the State Dept on Virginia ave &amp; 20th! Look for the red truck :)", {'category': [(cat['ADD'], [28,65])], 'time': [(t['NULL'], [])], 'affirmation': [(aff['POS'], [14,27])] }),
("No parking at Friendship Heights.. We'll be back tomorrow!", {'category': [(cat['NBR'], [14,32])], 'time': [(t['NULL'], [])], 'affirmation': [(aff['NEG'], [35,57]), (aff['NEG'], [0,13])] }),
("Sorry everyone! Change of plans.. Heading to Friendship Heights. We'll be back to State Dept next Wed.", {'category': [(cat['NBR'], [45,63])], 'time': [(t['NULL'], [])], 'affirmation': [(aff['POS'], [34,44]), (aff['POS'], [65,81])] }),
("State Department (Virginia Ave) today!", {'category': [(cat['ADD'], [0,31])], 'time': [(t['TOD'], [32,37])], 'affirmation': [(aff['POS'], [32,40])] }),
("We are at 20th and L St today next to Wells Fargo!", {'category': [(cat['ADD'], [10,23])], 'time': [(t['TOD'], [24,29])], 'affirmation': [(aff['POS'], [0,9])] }),
("Navy Yard today! Windows up in 15mins!", {'category': [(cat['NBR'], [0,9])], 'time': [(t['TOD'], [10,15])], 'affirmation': [(aff['POS'], [17,30])] }),
("Happy Friday! Union Station today!", {'category': [(cat['NBR'], [14,27])], 'time': [(t['TOD'], [28,33])], 'affirmation': [(aff['NULL'], [])] }),
("Friendship Heights today! @FeedFHeights @MazzaGallerieDC", {'category': [(cat['NBR'], [0,18])], 'time': [(t['TOD'], [19,24])], 'affirmation': [(aff['NULL'], [])] }),
("#arlington we're rocking long bridge park today. Come check us out for some fish tacos on a hot day.", {'category': [(cat['NBR'], [25,41]), (cat['NBR'], [1,10])], 'time': [(t['TOD'], [42,47])], 'affirmation': [(aff['NULL'], [])] }),
("Thx @TommyWells for standing up for food trucks!", {'category': [(cat['NULL'], [])], 'time': [(t['NULL'], [])], 'affirmation': [(aff['NULL'], [])] }),
("Thanks @VincentOrangeDC for putting forward better food truck regs!", {'category': [(cat['NULL'], [])], 'time': [(t['NULL'], [])], 'affirmation': [(aff['NULL'], [])] }),
("Getting ready for the rest of the week. See you all soon.", {'category': [(cat['NULL'], [])], 'time': [(t['NULL'], [])], 'affirmation': [(aff['NULL'], [])] }),
("We are not serving food, so sorry", {'category': [(cat['NULL'], [])], 'time': [(t['NULL'], [])], 'affirmation': [(aff['NEG'], [0,17])] }),

# Only Affirmation, without location tagging from here on

("Thank you @TommyWells for your strong support for our local food trucks &amp; for your amendment!", {'category': [(cat['NULL'], [])], 'time': [(t['NULL'], [])], 'affirmation': [(aff['NULL'], [])] }),
("#CrystalCity we'll be serving up warm Cuban sandwiches and cold drinks. Come check us out.", {'category': [(cat['NULL'], [])], 'time': [(t['NULL'], [])], 'affirmation': [(aff['POS'], [])] }),
("#ballston, balstatonions get ready for the cubanators!!", {'category': [(cat['NULL'], [])], 'time': [(t['NULL'], [])], 'affirmation': [(aff['POS'], [])] }),
("Gotta take a day off, Tour de Fat was too much fun. See you tomorrow.", {'category': [(cat['NULL'], [])], 'time': [(t['NULL'], [])], 'affirmation': [(aff['NEG'], [])] }),
("#tour de fat today. Come down to Yards park and try your favorite Cuban speciality paired with New Belgium beer.", {'category': [(cat['NULL'], [])], 'time': [(t['NULL'], [])], 'affirmation': [(aff['POS'], [])] }),
("Council Committee votes to reject proposed regs! THANK YOU @VincentOrangeDC @JimGrahamWard1 @GrossoAtLarge @CMYMA @marycheh!", {'category': [(cat['NULL'], [])], 'time': [(t['NULL'], [])], 'affirmation': [(aff['NULL'], [])] }),
("#rossyln, uh oh rosslynators, watch out here comes the Cubanator. 'Get to the choppa'", {'category': [(cat['NULL'], [])], 'time': [(t['NULL'], [])], 'affirmation': [(aff['POS'], [])] }),
("What's better than fresh Cuban food? Cuban food with a new Belgium beer! See us this weekend at the tour de fat.", {'category': [(cat['NULL'], [])], 'time': [(t['NULL'], [])], 'affirmation': [(aff['NULL'], [])] }),
("#crystal city, don't forget about the tres leche cake!!!", {'category': [(cat['NULL'], [])], 'time': [(t['NULL'], [])], 'affirmation': [(aff['NULL'], [])] }),
("Everyone come see us this weekend at the Tour de Fat to try our specialities paired with different beers. Suggestions?", {'category': [(cat['NULL'], [])], 'time': [(t['NULL'], [])], 'affirmation': [(aff['NULL'], [])] }),
("#arlington courthouse, no signs of rain come try a delicious Cuban!!!", {'category': [(cat['NULL'], [])], 'time': [(t['NULL'], [])], 'affirmation': [(aff['POS'], [])] }),
("#arlington court house, we will have Cubans and burritos ready to go from 11-2 so if its raining don't worry it will only be just a second", {'category': [(cat['NULL'], [])], 'time': [(t['NULL'], [])], 'affirmation': [(aff['POS'], [])] }),
("#Rosslyn, don't worry be happy a lo Cubano is here.", {'category': [(cat['NULL'], [])], 'time': [(t['NULL'], [])], 'affirmation': [(aff['POS'], [])] }),
("our new schedule, mon- rosslyn,tues-Arlington court house, wed-crystal city,Thursday-ballston, fri-rosslyn", {'category': [(cat['NULL'], [])], 'time': [(t['NULL'], [])], 'affirmation': [(aff['NULL'], [])] }),
("'@StationCDRKelly: Day 121. The #Nile at night is like a jewel. Good night from @Space_Station! #YearInSpace http://t.co/L17WDcvk14'MY PEEPS", {'category': [(cat['NULL'], [])], 'time': [(t['NULL'], [])], 'affirmation': [(aff['NULL'], [])] }),
("RT @StationCDRKelly: Day 121. The #Nile at night is like a jewel. Good night from @Space_Station! #YearInSpace http://t.co/T6TTkVyiRw", {'category': [(cat['NULL'], [])], 'time': [(t['NULL'], [])], 'affirmation': [(aff['NULL'], [])] }),
("'@MrTerrificPants: Omg. Why do we put cheese on EVERYTHING?!?' Because it makes it Pretty...", {'category': [(cat['NULL'], [])], 'time': [(t['NULL'], [])], 'affirmation': [(aff['NULL'], [])] }),
("RT @CapitolRvrFront: Packing ur #FridayNightConcert picnic? Many #CapitolRiverfront options + @Agua301WDC @BabasBigBite @bigcheesetruck! ht…", {'category': [(cat['NULL'], [])], 'time': [(t['NULL'], [])], 'affirmation': [(aff['NULL'], [])] }),
("Please help this child if you can. Check it out  http://t.co/kiFxsXkMNh", {'category': [(cat['NULL'], [])], 'time': [(t['NULL'], [])], 'affirmation': [(aff['NULL'], [])] }),
("RT @timelesstrendsb: So excited to have Baba's Big Bite joining us this Saturday for our grand opening in Aldie! Yum yum yum! http://t.co/v…", {'category': [(cat['NULL'], [])], 'time': [(t['NULL'], [])], 'affirmation': [(aff['NULL'], [])] }),
("RT @BallstonBID: #CourageWall coming to #Ballston tomorrow! Check it out and make an affirmation at Welburn Square starting at 4pm http://t…", {'category': [(cat['NULL'], [])], 'time': [(t['NULL'], [])], 'affirmation': [(aff['NULL'], [])] }),
("Whats up Rosslyn Baba's Is curbside flipping some Deliciousness.🍔 Come by &amp; Grab a Bite.", {'category': [(cat['NULL'], [])], 'time': [(t['NULL'], [])], 'affirmation': [(aff['POS'], [])] }),
("Whats up 20th &amp; L st Babas is Curbside serving up some Deliciousness. Its been too long...", {'category': [(cat['NULL'], [])], 'time': [(t['NULL'], [])], 'affirmation': [(aff['POS'], [])] }),
("'@burgerdays: Burger Days Rated Rookie.  https://t.co/W8yDy3QWGX' LIKE AH BOSS", {'category': [(cat['NULL'], [])], 'time': [(t['NULL'], [])], 'affirmation': [(aff['NULL'], [])] }),
("RT @burgerdays: Burger Days Rated Rookie.  https://t.co/c96EyuWViY", {'category': [(cat['NULL'], [])], 'time': [(t['NULL'], [])], 'affirmation': [(aff['NULL'], [])] }),
("We're parked in front of @ABC7News", {'category': [(cat['NULL'], [])], 'time': [(t['NULL'], [])], 'affirmation': [(aff['POS'], [])] }),
("Whats up Rosslyn Baba's Is curbside serving up some Deliciousness. Its been too long", {'category': [(cat['NULL'], [])], 'time': [(t['NULL'], [])], 'affirmation': [(aff['POS'], [])] }),
("RT @MensHumor: #math http://t.co/jw5l0DAI6q", {'category': [(cat['NULL'], [])], 'time': [(t['NULL'], [])], 'affirmation': [(aff['NULL'], [])] }),
("Hey Rosslyn Baba's Is not curbside flipping today Deliciousness. No burgers sorry.", {'category': [(cat['NULL'], [])], 'time': [(t['NULL'], [])], 'affirmation': [(aff['NEG'], [])] }),
("Bad News! We are not serving today.", {'category': [(cat['NULL'], [])], 'time': [(t['NULL'], [])], 'affirmation': [(aff['NEG'], [])] }),
]

# {'category': [(cat['NULL'], [])], 'time': [(t['NULL'], [])], 'affirmation': [(aff['NULL'], [])] }

def validate_train_data(train_data, show=False):
    len_data = len(train_data)
    print(len_data)

    i = 1

    for tweet in train_data:
        tweet_data = tweet[1]
        
        print(f'Tweet {i}')
        print(tweet[0])
        i += 1

        if 'category' not in tweet_data or 'time' not in tweet_data or 'affirmation' not in tweet_data:
            print(f'ERROR: Missing key {tweet_data}')
            continue
        
        if show == True:
            if tweet_data['category'][0][0] != cat['NULL']:
                j = 1
                for category in tweet_data['category']:
                    print(f'{category[0]}: {tweet[0][category[1][0]:category[1][1]]} ', end = '')
                    j += 1
                print('')
            
            if tweet_data['time'][0][0] != t['NULL']:
                j = 1
                for time in tweet_data['time']:
                    print(f'{time[0]}: {tweet[0][time[1][0]:time[1][1]]} ', end = '')
                    j += 1
                print('')

            if tweet_data['affirmation'][0][0] != t['NULL']:
                j = 1
                for affirmation in tweet_data['affirmation']:
                    print()
                    if len(tweet_data['affirmation'][0][1]):   
                        print(f'{affirmation[0]}: {tweet[0][affirmation[1][0]:affirmation[1][1]]} ', end = '')
                    else:
                        print(f'{affirmation[0]}', end = '')
                    j += 1
                print('')
        
        print('_____')
        print('')

# validate_train_data(train_data, True)