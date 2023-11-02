drop table if exists likes;
drop table if exists comment;
drop table if exists rate;
drop table if exists articles;
drop table if exists users;
drop table if exists avatars;

create table avatars (
    fileName VARCHAR(50) NOT NULL PRIMARY KEY,
    name VARCHAR(50) NOT NULL   
);

create table users (
    id INTEGER NOT NULL PRIMARY KEY,
    username VARCHAR(20) NOT NULL UNIQUE,
    fName VARCHAR(50) NOT NULL,
    lName VARCHAR(50) NOT NULL,
    password BLOB NOT NULL,
    dateOfBirth DATE,
    description VARCHAR(260),
    avatar VARCHAR(50) NOT NULL,
    token BLOB,
    FOREIGN KEY (avatar) references avatars (fileName)
);

create table articles (
    id INTEGER NOT NULL PRIMARY KEY,
    authorId INTEGER NOT NULL,
    content TEXT NOT NULL,
    avRating REAL,
    title VARCHAR(80),
    imgFileName VARCHAR(20),
    imgCaption VARCHAR(80),
    FOREIGN KEY (authorId) references users (id) ON DELETE CASCADE
);

create table comment (
    id INTEGER NOT NULL PRIMARY KEY,
    userId INTEGER NOT NULL,
    articleId INTEGER NOT NULL,
    content VARCHAR(260) NOT NULL,
    FOREIGN KEY (userId) references users (id),
    FOREIGN KEY (articleId) references articles (id) ON DELETE CASCADE
);

create table rate (
    userId INTEGER NOT NULL,
    articleId INTEGER NOT NULL,
    rating INTEGER NOT NULL,
    PRIMARY KEY (userId, articleId),
    FOREIGN KEY (userId) references users (id),
    FOREIGN KEY (articleId) references articles (id) ON DELETE CASCADE
);

create table likes (
    userId INTEGER NOT NULL,
    commentId INTEGER NOT NULL,
    PRIMARY KEY (userId, commentId),
    FOREIGN KEY (userId) references users (id),
    FOREIGN KEY (commentId) references comment (id) ON DELETE CASCADE                      
);

insert into avatars (fileName, name) values 
("avocado.png", "avocado"),
("bell-pepper.png", "bell-pepper"),
("donut.png", "donut"), 
("egg.png", "egg"),
("hamburger.png", "hamburger"),
("pizza.png", "pizza"),
("spaghetti.png", "spaghetti"),
("strawberry.png", "strawberry");

insert into users (id, username, fName, lName, password, dateOfBirth, description, avatar) values
(1, "doggy", "Molly", "Leslie", "dogzRule1", '1995-06-15',"Puppy kitty ipsum dolor sit good dog throw wet nose.", "bell-pepper.png"),
(2, "pusspuss", "Beauty", "Toogood", "cats89", '2010-05-20', "Cage Fido yawn chow swimming Rover bark Scooby snacks house train", "pizza.png"),
(3, "BirdSing", "Very", "Loud", "I8worms", '2000-01-02', "Bird Food kisses run fast wet nose purr", "strawberry.png");

insert into articles (id, authorId, content, title, imgFileName, imgCaption) values 
(1, 1, "
There's a forty year old lady there let us feast. Meow and walk away push your water glass on the floor crash against wall but walk away like nothing happened. Allways wanting food jump on human and sleep on her all night long be long in the bed, purr in the morning and then give a bite to every human around for not waking up request food, purr loud scratch the walls, the floor, the windows, the humans find box a little too small and curl up with fur hanging out proudly present butt to human and furball roll roll roll yet meow meow you are my owner so here is a dead bird. Jump five feet high and sideways when a shadow moves paw at beetle and eat it before it gets away this human feeds me, i should be a god. Annoy owner until he gives you food say meow repeatedly until belly rubs, feels good. Find empty spot in cupboard and sleep all day taco cat backwards spells taco cat. I show my fluffy belly but it's a trap! if you pet it i will tear up your hand sit as close as possible to warm fire without sitting on cold floor ignore the squirrels, you'll never catch them anyway so stand in front of the computer screen. Spit up on light gray carpet instead of adjacent linoleum nyan nyan goes the cat, scraaaaape scraaaape goes the walls when the cat murders them with its claws yet human clearly uses close to one life a night no one naps that long so i revive by standing on chestawaken! but meow meow you are my owner so here is a dead bird. Attempt to leap between furniture but woefully miscalibrate and bellyflop onto the floor; what's your problem? i meant to do that now i shall wash myself intently hiiiiiiiiii feed me now. I vomit in the bed in the middle of the night fall asleep on the washing machine and pee in the shoe yet destroy couch as revenge claw drapes cat milk copy park pee walk owner escape bored tired cage droppings sick vet vomit.", "Delicious Cake", "cake.jpeg", "The best cake ever!"),

(2, 2, "
Serves: 6
There's a forty year old lady there let us feast. Meow and walk away push your water glass on the floor crash against wall but walk away like nothing happened. Allways wanting food jump on human and sleep on her all night long be long in the bed, purr in the morning and then give a bite to every human around for not waking up request food, purr loud scratch the walls, the floor, the windows, the humans find box a little too small and curl up with fur hanging out proudly present butt to human and furball roll roll roll yet meow meow you are my owner so here is a dead bird. Jump five feet high and sideways when a shadow moves paw at beetle and eat it before it gets away this human feeds me, i should be a god. Annoy owner until he gives you food say meow repeatedly until belly rubs, feels good. Find empty spot in cupboard and sleep all day taco cat backwards spells taco cat. I show my fluffy belly but it's a trap! if you pet it i will tear up your hand sit as close as possible to warm fire without sitting on cold floor ignore the squirrels, you'll never catch them anyway so stand in front of the computer screen. Spit up on light gray carpet instead of adjacent linoleum nyan nyan goes the cat, scraaaaape scraaaape goes the walls when the cat murders them with its claws yet human clearly uses close to one life a night no one naps that long so i revive by standing on chestawaken! but meow meow you are my owner so here is a dead bird. Attempt to leap between furniture but woefully miscalibrate and bellyflop onto the floor; what's your problem? i meant to do that now i shall wash myself intently hiiiiiiiiii feed me now. I vomit in the bed in the middle of the night fall asleep on the washing machine and pee in the shoe yet destroy couch as revenge claw drapes cat milk copy park pee walk owner escape bored tired cage droppings sick vet vomit.
", "Fluffy Pancakes", "pancakes.jpeg", "High stack of pancakes"),

(3, 2, "
Sleep on keyboard sleeps on my head or spread kitty litter all over house do not try to mix old food with new one to fool me! get scared by sudden appearance of cucumber. Making bread on the bathrobe cat is love, cat is life yet catasstrophe or i shall purr myself to sleep, yet going to catch the red dot today going to catch the red dot today but burrow under covers, but love you, then bite you. Slap kitten brother with paw dead stare with ears cocked but chase after silly colored fish toys around the house run as fast as i can into another room for no reason steal the warm chair right after you get up pet me pet me pet me pet me, bite, scratch, why are you petting me but always hungry. Make meme, make cute face trip on catnip and knock dish off table head butt cant eat out of my own dish, kitty scratches couch bad kitty but i like cats because they are fat and fluffy. Meow for food, then when human fills food dish, take a few bites of food and continue meowing suddenly go on wild-eyed crazy rampage. Chew on cable bite off human's toes cats are cute purr or check cat door for ambush 10 times before coming in so inspect anything brought into the house. Jump on counter removed by human jump on counter again removed by human meow before jumping on counter this time to let the human know am coming back chew foot put toy mouse in food bowl run out of litter box at full speed for i love cats i am one wake up scratch humans leg for food then purr then i have a and relax, but plan steps for world domination. Adventure always ask to be pet then attack owners hand mmmmmmmmmeeeeeeeeooooooooowwwwwwww. Poop on floor and watch human clean up i will ruin the couch with my claws. Fall asleep upside-down i'm going to lap some water out of my master's cup meow and purr while eating", "Healthy Food Bowl", "bowl.jpeg", "Yum and soooo healthy"),

(4, 3, "
walk on car leaving trail of paw prints on hood and windshield for toilet paper attack claws fluff everywhere meow miao french ciao litterbox so i shredded your linens for you. Swat turds around the house. Sit on the laptop human is in bath tub, emergency! drowning! meooowww! bite the neighbor's bratty kid, yet woops poop hanging from butt must get rid run run around house drag poop on floor maybe it comes off woops left brown marks on floor human slave clean lick butt now for meowing non stop for food. Meow for food, then when human fills food dish, take a few bites of food and continue meowing paw at beetle and eat it before it gets away, so suddenly go on wild-eyed crazy rampage yet lie on your belly and purr when you are asleep for cat cat moo moo lick ears lick paws. Licks your face. Sniff other cat's butt and hang jaw half open thereafter snuggles up to shoulders or knees and purrs you to sleep yet rub whiskers on bare skin act innocent i is not fat, i is fluffy but fish i must find my red catnip fishy fish chase red laser dot spit up on light gray carpet instead of adjacent linoleum. Pushes butt to face meowing chowing and wowing ask for petting or pretend you want to go out but then don't eat all the power cords i hate cucumber pls dont throw it at me, while happily ignoring when being called. Pee on walls it smells like breakfast. Poop on floor and watch human clean up. Lasers are tiny mice i will be pet i will be pet and then i will hiss and meowwww so sleep in the bathroom sink why must they do that. Caticus cuteicus attack feet, so lick butt purr like an angel, relentlessly pursues moth. Eat too much then proceed to regurgitate all over living room carpet while humans eat dinner damn that dog climb into cupboard and lick the salt off rice cakes, push your water glass on the floor and floof tum, tickle bum, jellybean footies curly toes, cat mojo whenever a door is opened, rush in before the human.", "Fruity Cupcakes", "cupcakes.jpeg", "Every fruit imaginable"),

(5, 1, "
Purr why use post when this sofa is here dream about hunting birds for instead of drinking water from the cat bowl, make sure to steal water from the toilet scratch so owner bleeds. Making bread on the bathrobe pounce on unsuspecting person woops poop hanging from butt must get rid run run around house drag poop on floor maybe it comes off woops left brown marks on floor human slave clean lick butt now lick human with sandpaper tongue for demand to have some of whatever the human is cooking, then sniff the offering and walk away hell is other people meowzer. Use lap as chair i love cats i am one wake up scratch humans leg for food then purr then i have a and relax i will be pet i will be pet and then i will hiss. Hopped up on catnip take a big fluffing crap ðŸ’© cat slap dog in face yet eat the rubberband, find empty spot in cupboard and sleep all day, hiss at vacuum cleaner. Stare at guinea pigs russian blue sit on human they not getting up ever for if it fits, i sits. Murr i hate humans they are so annoying somehow manage to catch a bird but have no idea what to do next, so play with it until it dies of shock or pet me pet me pet me pet me, bite, scratch, why are you petting me scratch me there, elevator butt who's the baby, i hate cucumber pls dont throw it at me destroy dog. Have my breakfast spaghetti yarn brown cats with pink ears. Wack the mini furry mouse i see a bird i stare at it i meow at it i do a wiggle come here birdy and what a cat-ass-trophy! love and coo around boyfriend who purrs and makes the perfect moonlight eyes so i can purr and swat the glittery gleaming yarn to him (the yarn is from a $125 sweater) see owner, run in terror yet making bread on the bathrobe meow all night. I show my fluffy belly but it's a trap! if you pet it i will tear up your hand Gate keepers of hell who's the baby claws in the eye of the beholder meow meow we are 3 small kittens sleeping most of our time, we are around 15 weeks old i think, i donâ€™t know i canâ€™t count. Kitty kitty pussy cat doll relentlessly pursues moth. Sit on the laptop your pillow is now my pet bed. Flex claws on the human's belly and purr like a lawnmower spend all night ensuring people don't sleep sleep all day, for haha you hold me hooman i scratch yet behind the couch stinky cat and eat too much then proceed to regurgitate all over living room carpet while humans eat dinner. do not try to mix old food with new one to fool me! purr while eating. Push your water glass on the floor. Toilet paper attack claws fluff everywhere meow miao french ciao litterbox sit in box and human give me attention meow for rub face on owner and kitty kitty pussy cat doll stand in front of the computer screen mouse. Make meme, make cute face i show my fluffy belly but it's a trap!", "Sugar Free Gingerbread Men", "gingerbread.jpeg", "Run run as fast as you can...");

insert into comment (id, userId, articleId, content) values
(1, 2, 3, "So Good!!!"),
(2, 3, 4, "Yuck!!!!"),
(3, 1, 2, "I want to try this"),
(4, 2, 1, "how much time does this take?"),
(5, 2, 5, "ooohhhh"),
(6, 1, 4, "can I use coconut flour?");

insert into rate (userId, articleId, rating) values
(1, 2, 5),
(1, 3, 3),
(2, 1, 4),
(3, 1, 2),
(2, 4, 1),
(3, 5, 3);

insert into likes (userId, commentId) values
(1, 2),
(3, 2),
(1, 6),
(1, 3),
(2, 2);
