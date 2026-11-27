// Card decks. Format per line:  Name|deck|trait trait trait
// Traits power the shared hint ("Both of you are yellow"). Add your own freely.
window.WHOAMI_DECKS = {
  animals: 'Animals', food: 'Food & drink', jobs: 'Jobs', things: 'Everyday things',
  places: 'Places', people: 'Famous people', games: 'Video games', characters: 'Characters', mine: 'Your cards'
};

window.WHOAMI_PHRASE = {
  pet: 'are common pets', fly: 'can fly', water: 'live in or near water', scary: 'scare a lot of people',
  big: 'are bigger than a person', tiny: 'are tiny', aussie: 'are very Australian', bw: 'are black and white',
  farm: 'are found on a farm', night: 'come out at night', fruit: 'are fruits', sweet: 'are sweet',
  yellow: 'are yellow', red: 'are red', green: 'are green', orange: 'are orange', white: 'are white',
  round: 'are round', drink: 'are drinks', hot: 'are usually hot', cold: 'are cold',
  breakfast: 'are breakfast things', smelly: 'can be smelly', uniform: 'wear a uniform',
  outdoor: 'are outdoors a lot', wheels: 'have to do with wheels', electric: 'need electricity',
  kitchen: 'belong in a kitchen', bathroom: 'belong in a bathroom', bedroom: 'belong in a bedroom',
  music: 'are about music', sport: 'are about sport', fire: 'have to do with fire', rich: 'are rich',
  space: 'have to do with space', royal: 'are royalty', health: 'have to do with health',
  travel: 'have to do with travel', asian: 'are from Asia', snack: 'are snacks', legs4: 'have four legs',
  soft: 'are soft', wear: 'are things you wear', money: 'have to do with money', school: 'have to do with school',
  internet: 'are big on the internet', actor: 'are actors', funny: 'are known for being funny',
  danger: 'can be dangerous', hero: 'are heroes', magic: 'have to do with magic',
  build: 'are about building', multiplayer: 'are played online with friends', nintendo: 'are Nintendo games',
  retro: 'are old-school classics', puzzle: 'are puzzle games', shooter: 'are shooting games',
  mobile: 'are phone games', racing: 'are racing games'
};

window.WHOAMI_CARDS = `
Dog|animals|pet legs4
Cat|animals|pet legs4 night
Hamster|animals|pet tiny
Goldfish|animals|pet water orange tiny
Elephant|animals|big legs4
Giraffe|animals|big legs4 yellow
Penguin|animals|water bw cold
Shark|animals|water scary danger
Dolphin|animals|water
Octopus|animals|water
Eagle|animals|fly
Owl|animals|fly night
Bat|animals|fly night scary
Kangaroo|animals|aussie
Koala|animals|aussie soft
Snake|animals|scary danger
Spider|animals|scary tiny
Bee|animals|fly yellow tiny
Ant|animals|tiny
Butterfly|animals|fly tiny
Mosquito|animals|fly tiny night
Frog|animals|green water
Crocodile|animals|water scary green danger aussie
Panda|animals|bw asian legs4
Zebra|animals|bw legs4
Lion|animals|legs4 danger yellow
Tiger|animals|legs4 orange danger
Monkey|animals|
Horse|animals|farm legs4
Cow|animals|farm bw legs4
Chicken|animals|farm
Pig|animals|farm legs4
Sheep|animals|farm white soft
Polar bear|animals|white cold big danger
Camel|animals|big legs4 hot
Pizza|food|round hot
Sushi|food|asian
Burger|food|hot
Banana|food|fruit yellow sweet
Apple|food|fruit red round
Watermelon|food|fruit green round
Durian|food|fruit smelly asian
Lemon|food|fruit yellow
Strawberry|food|fruit red sweet
Orange|food|fruit orange round
Avocado|food|fruit green
Chocolate|food|sweet snack
Ice cream|food|sweet cold
Cheese|food|yellow smelly
Egg|food|breakfast white
Bread|food|breakfast
Cereal|food|breakfast
Coffee|food|drink hot breakfast
Bubble tea|food|drink sweet cold asian
Milk|food|drink white breakfast
Coca-Cola|food|drink sweet cold
Beer|food|drink cold
Instant noodles|food|hot asian snack
Nasi goreng|food|hot asian
Chilli|food|red hot
Popcorn|food|snack
Donut|food|sweet round snack
Birthday cake|food|sweet
Vegemite|food|aussie breakfast
Tim Tam|food|aussie sweet snack
Meat pie|food|aussie hot
Carrot|food|orange
Broccoli|food|green
Corn|food|yellow
Potato chips|food|snack
Doctor|jobs|uniform health
Nurse|jobs|uniform health
Dentist|jobs|health
Teacher|jobs|school
Police officer|jobs|uniform danger
Firefighter|jobs|uniform fire danger hero
Chef|jobs|uniform kitchen hot
Pilot|jobs|uniform fly travel
Flight attendant|jobs|uniform fly travel
Astronaut|jobs|space uniform
Farmer|jobs|farm outdoor
Barista|jobs|drink
Delivery rider|jobs|wheels outdoor
Uber driver|jobs|wheels
Lawyer|jobs|money
Banker|jobs|money rich
Mechanic|jobs|wheels
Programmer|jobs|electric
YouTuber|jobs|internet electric
Magician|jobs|magic funny
Clown|jobs|funny
Lifeguard|jobs|water outdoor hero
Plumber|jobs|water bathroom
Soldier|jobs|uniform danger
DJ|jobs|music electric night
Singer|jobs|music
Photographer|jobs|
Builder|jobs|outdoor uniform
Cleaner|jobs|bathroom
Footballer|jobs|sport outdoor
Security guard|jobs|uniform night
Tour guide|jobs|travel outdoor
Phone|things|electric internet
Laptop|things|electric internet school
Umbrella|things|travel
Toothbrush|things|bathroom
Toilet|things|bathroom white
Toilet paper|things|bathroom white soft
Fridge|things|kitchen electric cold big
Microwave|things|kitchen electric hot
Spoon|things|kitchen
Chopsticks|things|kitchen asian
Rice cooker|things|kitchen electric asian
Pillow|things|bedroom soft
Bed|things|bedroom big soft
Alarm clock|things|bedroom electric
Mirror|things|bathroom
Glasses|things|wear
Sunglasses|things|wear
Backpack|things|school travel wear
Shoe|things|wear smelly
Sock|things|wear smelly soft
Key|things|
Wallet|things|money
Credit card|things|money
Bicycle|things|wheels outdoor
Car|things|wheels big
Skateboard|things|wheels sport
Headphones|things|electric music wear
Guitar|things|music
Candle|things|fire
Lighter|things|fire
Balloon|things|round fly
Basketball|things|round sport orange
Remote control|things|electric
Passport|things|travel
Suitcase|things|travel wheels
Pen|things|school
Television|things|electric
Beach|places|water outdoor hot
School|places|school
Hospital|places|health
Airport|places|fly travel
McDonald's|places|
Gym|places|sport
Library|places|school
Cinema|places|night
Supermarket|places|money
Church|places|
Zoo|places|outdoor
Bali|places|travel asian hot water
Sydney Opera House|places|aussie music
Melbourne|places|aussie
Eiffel Tower|places|travel big
Disneyland|places|travel magic
The Moon|places|space round night
Mount Everest|places|cold big outdoor
Antarctica|places|cold white
Sahara Desert|places|hot outdoor
Amazon rainforest|places|green outdoor
Swimming pool|places|water sport
Casino|places|money night
Train station|places|travel wheels
Bathroom|places|bathroom
Kitchen|places|kitchen
Nightclub|places|music night
Hotel|places|travel bedroom
Japan|places|asian travel
Great Barrier Reef|places|aussie water
Taylor Swift|people|music rich
Cristiano Ronaldo|people|sport rich
Lionel Messi|people|sport rich
Michael Jordan|people|sport rich
Usain Bolt|people|sport
Elon Musk|people|rich space
Mark Zuckerberg|people|rich internet
Bill Gates|people|rich
MrBeast|people|internet rich
Michael Jackson|people|music
Albert Einstein|people|school
Jackie Chan|people|actor funny asian
Dwayne "The Rock" Johnson|people|actor sport
Keanu Reeves|people|actor
Rihanna|people|music rich
Kim Kardashian|people|rich internet
Gordon Ramsay|people|kitchen
Queen Elizabeth II|people|royal rich
Steve Irwin|people|aussie
Hugh Jackman|people|actor aussie
Margot Robbie|people|actor aussie
Mr Bean|people|funny actor
Lisa (Blackpink)|people|music asian
BTS|people|music asian
Bruno Mars|people|music
Ed Sheeran|people|music
Neil Armstrong|people|space hero
Steve Jobs|people|rich electric
Shakira|people|music
Charlie Chaplin|people|funny actor
Minecraft|games|build multiplayer
Super Mario Bros.|games|nintendo retro red
Mario Kart|games|nintendo racing wheels multiplayer
Pac-Man|games|retro yellow round
Tetris|games|retro puzzle
Space Invaders|games|retro space
Snake (Nokia)|games|retro mobile
Sonic the Hedgehog|games|retro
Street Fighter|games|retro danger asian
Solitaire|games|puzzle retro
Fortnite|games|shooter multiplayer
Call of Duty|games|shooter danger
PUBG|games|shooter multiplayer mobile
Valorant|games|shooter multiplayer
Roblox|games|build multiplayer
The Sims|games|build
Among Us|games|multiplayer mobile funny
Pokémon|games|nintendo asian
The Legend of Zelda|games|nintendo magic
Animal Crossing|games|nintendo
Wii Sports|games|nintendo sport
Grand Theft Auto (GTA)|games|wheels danger
FIFA / EA Sports FC|games|sport multiplayer
Candy Crush|games|mobile puzzle sweet
Angry Birds|games|mobile fly red
Flappy Bird|games|mobile fly
Subway Surfers|games|mobile
Temple Run|games|mobile
Clash of Clans|games|mobile multiplayer
Mobile Legends|games|mobile multiplayer asian
Plants vs. Zombies|games|green
League of Legends|games|multiplayer magic
Genshin Impact|games|magic asian
Just Dance|games|music multiplayer
Guitar Hero|games|music
Mickey Mouse|characters|
Pikachu|characters|yellow tiny
SpongeBob|characters|yellow water funny
Spider-Man|characters|hero red
Batman|characters|hero rich night
Superman|characters|hero fly
Harry Potter|characters|magic school
Shrek|characters|green funny
Elsa|characters|royal magic cold
Mario|characters|red
Santa Claus|characters|red fly magic
Doraemon|characters|asian
Hello Kitty|characters|white asian
Winnie the Pooh|characters|yellow sweet
Iron Man|characters|hero rich fly
Darth Vader|characters|space danger
Minions|characters|yellow funny
Tooth Fairy|characters|magic fly
Peppa Pig|characters|
Naruto|characters|asian orange
`.trim().split('\n').map(l => {
  const [n, d, t] = l.split('|');
  return { n: n.trim(), d: d.trim(), t: (t || '').split(' ').filter(Boolean) };
});

// Picture shown on each card (cards without one show their initials).
window.WHOAMI_EMOJI = Object.fromEntries(`
Dog=🐶|Cat=🐱|Hamster=🐹|Goldfish=🐠|Elephant=🐘|Giraffe=🦒|Penguin=🐧|Shark=🦈|Dolphin=🐬|Octopus=🐙|Eagle=🦅|Owl=🦉|Bat=🦇|Kangaroo=🦘|Koala=🐨|Snake=🐍|Spider=🕷️|Bee=🐝|Ant=🐜|Butterfly=🦋|Mosquito=🦟|Frog=🐸|Crocodile=🐊|Panda=🐼|Zebra=🦓|Lion=🦁|Tiger=🐯|Monkey=🐵|Horse=🐴|Cow=🐮|Chicken=🐔|Pig=🐷|Sheep=🐑|Polar bear=🐻‍❄️|Camel=🐫
Pizza=🍕|Sushi=🍣|Burger=🍔|Banana=🍌|Apple=🍎|Watermelon=🍉|Lemon=🍋|Strawberry=🍓|Orange=🍊|Avocado=🥑|Chocolate=🍫|Ice cream=🍦|Cheese=🧀|Egg=🥚|Bread=🍞|Cereal=🥣|Coffee=☕|Bubble tea=🧋|Milk=🥛|Coca-Cola=🥤|Beer=🍺|Instant noodles=🍜|Nasi goreng=🍛|Chilli=🌶️|Popcorn=🍿|Donut=🍩|Birthday cake=🎂|Tim Tam=🍪|Meat pie=🥧|Carrot=🥕|Broccoli=🥦|Corn=🌽|Potato chips=🥔|Vegemite=🫙|Durian=🍈
Doctor=🩺|Nurse=💉|Dentist=🦷|Teacher=🧑‍🏫|Police officer=👮|Firefighter=🧑‍🚒|Chef=🧑‍🍳|Pilot=🧑‍✈️|Flight attendant=🛫|Astronaut=🧑‍🚀|Farmer=🧑‍🌾|Barista=☕|Delivery rider=🛵|Uber driver=🚕|Lawyer=⚖️|Banker=🏦|Mechanic=🔧|Programmer=💻|YouTuber=📹|Magician=🎩|Clown=🤡|Lifeguard=🛟|Plumber=🪠|Soldier=🪖|DJ=🎧|Singer=🎤|Photographer=📷|Builder=👷|Cleaner=🧹|Footballer=⚽|Security guard=🛡️|Tour guide=🗺️
Phone=📱|Laptop=💻|Umbrella=☂️|Toothbrush=🪥|Toilet=🚽|Toilet paper=🧻|Fridge=🧊|Spoon=🥄|Chopsticks=🥢|Rice cooker=🍚|Bed=🛏️|Alarm clock=⏰|Mirror=🪞|Glasses=👓|Sunglasses=🕶️|Backpack=🎒|Shoe=👟|Sock=🧦|Key=🔑|Wallet=👛|Credit card=💳|Bicycle=🚲|Car=🚗|Skateboard=🛹|Headphones=🎧|Guitar=🎸|Candle=🕯️|Lighter=🔥|Balloon=🎈|Basketball=🏀|Passport=🛂|Suitcase=🧳|Pen=🖊️|Television=📺|Pillow=☁️|Remote control=📺
Beach=🏖️|School=🏫|Hospital=🏥|Airport=✈️|McDonald's=🍟|Gym=🏋️|Library=📚|Cinema=🎬|Supermarket=🛒|Church=⛪|Zoo=🐒|Bali=🌴|Sydney Opera House=🎭|Melbourne=🚋|Eiffel Tower=🗼|Disneyland=🏰|The Moon=🌕|Mount Everest=🏔️|Antarctica=🧊|Sahara Desert=🏜️|Amazon rainforest=🌳|Swimming pool=🏊|Casino=🎰|Train station=🚉|Bathroom=🛁|Kitchen=🍳|Nightclub=🪩|Hotel=🏨|Japan=🗾|Great Barrier Reef=🪸
Taylor Swift=🎤|Cristiano Ronaldo=⚽|Lionel Messi=⚽|Michael Jordan=🏀|Usain Bolt=⚡|Elon Musk=🚀|Mark Zuckerberg=📘|Bill Gates=💻|MrBeast=💸|Michael Jackson=🕺|Albert Einstein=🧠|Jackie Chan=🥋|Dwayne "The Rock" Johnson=💪|Keanu Reeves=🕶️|Rihanna=☔|Kim Kardashian=💄|Gordon Ramsay=🍳|Queen Elizabeth II=👑|Steve Irwin=🐊|Hugh Jackman=🎭|Margot Robbie=🎀|Mr Bean=🧸|Lisa (Blackpink)=🎵|BTS=💜|Bruno Mars=🎶|Ed Sheeran=🎸|Neil Armstrong=🌕|Steve Jobs=🍏|Shakira=💃|Charlie Chaplin=🎩
Minecraft=⛏️|Super Mario Bros.=🍄|Mario Kart=🏎️|Pac-Man=🟡|Tetris=🧱|Space Invaders=👾|Snake (Nokia)=🐍|Sonic the Hedgehog=🦔|Street Fighter=🥊|Solitaire=🃏|Fortnite=🪂|Call of Duty=🎖️|PUBG=🍗|Valorant=🎯|Roblox=🟥|The Sims=💎|Among Us=🚀|Pokémon=🔴|The Legend of Zelda=🗡️|Animal Crossing=🍃|Wii Sports=🎳|Grand Theft Auto (GTA)=🚓|FIFA / EA Sports FC=⚽|Candy Crush=🍬|Angry Birds=🐦|Flappy Bird=🐤|Subway Surfers=🛹|Temple Run=🏃|Clash of Clans=🏰|Mobile Legends=⚔️|Plants vs. Zombies=🌻|League of Legends=🧙|Genshin Impact=✨|Just Dance=💃|Guitar Hero=🎸
Mickey Mouse=🐭|Pikachu=⚡|SpongeBob=🧽|Spider-Man=🕷️|Batman=🦇|Superman=🦸|Harry Potter=🪄|Shrek=🧅|Elsa=❄️|Mario=🍄|Santa Claus=🎅|Doraemon=🔔|Hello Kitty=🎀|Winnie the Pooh=🍯|Iron Man=🦾|Darth Vader=🌑|Minions=🍌|Tooth Fairy=🧚|Peppa Pig=🐷|Naruto=🍥
`.trim().split(/[\n|]/).map(p => p.split('=')));
