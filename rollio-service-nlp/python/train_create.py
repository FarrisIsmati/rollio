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
]

# {'category': [(cat['NULL'], [])], 'time': [(t['NULL'], [])], 'affirmation': [(aff['NULL'], [])] }

def validate_train_data(train_data, show=False):
    len_data = len(train_data)
    print(len_data)

    i = 1

    for tweet in train_data:
        tweet_data = tweet[1]
        
        print(f'Tweet {i}')
        i += 1

        if 'category' not in tweet_data or 'time' not in tweet_data or 'affirmation' not in tweet_data:
            print(f'ERROR: Missing key {tweet_data}')
            continue
        
        if show == True:
            if tweet_data['category'][0][0] != cat['NULL']:
                j = 1
                for category in tweet_data['category']:
                    print(f'{category[0]} {j}: {tweet[0][category[1][0]:category[1][1]]} ', end = '')
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
                    print(f'{affirmation[0]}: {tweet[0][affirmation[1][0]:affirmation[1][1]]} ', end = '')
                    j += 1
                print('')
        
        print('_____')
        print('')

validate_train_data(train_data, True)