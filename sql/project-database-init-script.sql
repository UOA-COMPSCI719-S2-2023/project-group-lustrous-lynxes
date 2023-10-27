drop table if exists likes;
drop table if exists images;
drop table if exists comment;
drop table if exists rate;
drop table if exists articles;
drop table if exists users;
drop table if exists avatars;

create table avatars (
    filName VARCHAR(50) NOT NULL PRIMARY KEY,
    name VARCHAR(50) NOT NULL   
);

create table users (
    id INTEGER NOT NULL PRIMARY KEY,
    username VARCHAR(20) NOT NULL UNIQUE,
    fName VARCHAR(50) NOT NULL,
    lName VARCHAR(50) NOT NULL,
    password BLOB NOT NULL,
    description VARCHAR(260),
    avatar VARCHAR(50) NOT NULL,
    token BLOB,
    FOREIGN KEY (avatar) references avatars (filName)
);

create table articles (
    id INTEGER NOT NULL PRIMARY KEY,
    authorId INTEGER NOT NULL,
    content TEXT NOT NULL,
    avRating REAL,
    title VARCHAR(80),
    FOREIGN KEY (authorId) references users (id)
);

create table comment (
    id INTEGER NOT NULL PRIMARY KEY,
    userId INTEGER NOT NULL,
    articleId INTEGER NOT NULL,
    content VARCHAR(260) NOT NULL,
    FOREIGN KEY (userId) references users (id),
    FOREIGN KEY (articleId) references articles (id)
);

create table rate (
    userId INTEGER NOT NULL,
    articleId INTEGER NOT NULL,
    rating INTEGER NOT NULL,
    PRIMARY KEY (userId, articleId),
    FOREIGN KEY (userId) references users (id),
    FOREIGN KEY (articleId) references articles (id)
);

create table images (
    filName VARCHAR(50) NOT NULL PRIMARY KEY,
    caption VARCHAR(100) NOT NULL,
    articleId INTEGER NOT NULL,
    FOREIGN KEY (articleId) references articles (id)
);

create table likes (
    userId INTEGER NOT NULL,
    commentId INTEGER NOT NULL,
    liking INTEGER NOT NULL,
    PRIMARY KEY (userId, commentId),
    FOREIGN KEY (userId) references users (id),
    FOREIGN KEY (commentId) references comment (id)                       
);

insert into avatars (filName, name) values 
("avocado.png", "avocado"),
("bell-pepper.png", "bell-pepper"),
("donut.png", "donut"), 
("egg.png", "egg"),
("hamburger.png", "hamburger"),
("pizza.png", "pizza"),
("spaghetti.png", "spaghetti"),
("strawberry.png", "strawberry");

insert into users (id, username, fName, lName, password, description, avatar) values
(1, "doggy", "Molly", "Leslie", "dogzRule1", "Puppy kitty ipsum dolor sit good dog throw wet nose.", "bell-pepper.png"),
(2, "pusspuss", "Beauty", "Toogood", "cats89", "Cage Fido yawn chow swimming Rover bark Scooby snacks house train", "pizza.png"),
(3, "BirdSing", "Very", "Loud", "I8worms", "Bird Food kisses run fast wet nose purr", "strawberry.png");

insert into articles (id, authorId, content, title) values 
(1, 1, "
Serves: 2
Source: http://www.taste.com.au/recipes/18343/chinese+omelette
Course: Breakfast
Ingredients:
50 g snow peas, trimmed, thinly sliced
50 g beansprouts, trimmed
1 green onion, thinly sliced
1 long red chilli, thinly sliced
1 cm piece ginger, finely grated
1 garlic clove, crushed
2 tablespoons oyster sauce
4 eggs
olive oil cooking spray
Directions:
Place snow peas in a heatproof bowl. Cover with boiling water. Stand for 3 minutes. Drain. Rinse under cold water.

Combine snow peas, beansprouts, onion and chilli in a bowl.

Combine ginger, garlic, oyster sauce and 1 tablespoon hot water in a jug.

Beat eggs and 2 tablespoons cold water in a bowl until combined. Season with pepper.

Heat a wok over medium-high heat. Spray with oil. Pour half of egg mixture into the wok. Swirl to coat. Cook for 30 seconds or until just set. Slide omelette onto a plate. Cover to keep warm. Repeat with remaining egg mixture.

Spread snow pea mixture over one half of each omelette. Fold in half to enclose filling. Drizzle with sauce. Serve.", "Chinese omelette"),

(2, 2, "
Serves: 6
Source: http://www.taste.com.au/recipes/15948/breakfast+blt+salad
Photo Url: https://plantoeat.s3.amazonaws.com/recipes/5276106/5c67dac89883485d55e9b7f294e05dc947806a3f-original.jpg?1446878018
Course: Breakfast
Main Ingredient: Vegetables
Ingredients:
250 g punnet cherry tomatoes
2 tablespoons extra virgin olive oil
1 garlic bulb
3 (about 175g) bacon rashers, cut in half widthways
1/2 cup (125g) whole-egg mayonnaise
2 tablespoons lemon juice
6 cups (100g) wild rocket, washed, dried
1 avocado, halved, stone removed, peeled, thinly sliced
1 bunch chives, coarsely chopped
Directions:
Preheat oven to 250°C. Place cherry tomatoes on an oven tray, drizzle with 2 teaspoons of oil and season with salt and pepper. Roast in oven for 8 minutes or until tomatoes soften slightly. Remove from oven and set aside to cool.

Meanwhile, wrap garlic in foil and cook in oven for 20 minutes or until soft. Set aside to cool. Cut in half widthways and squeeze pulp into a bowl. Discard skin.

Heat remaining oil in a large non-stick frying pan over medium-high heat. Add bacon and cook for 2-3 minutes each side or until crisp. Transfer to a plate lined with paper towel.

Place garlic, mayonnaise and lemon juice in the bowl of a food processor and process until smooth. Taste and season with salt and pepper.

Combine tomatoes, bacon, rocket and avocado in a bowl. Sprinkle with chives and drizzle with dressing to serve.
", "Breakfast BLT salad"),

(3, 2, "
Serves: 13
Source: https://www.melskitchencafe.com/chocolate-peanut-butter-brownies/
Photo Url: https://plantoeat.s3.amazonaws.com/recipes/17891995/de53bf71fba0cf4f3a1759aa6901af42c9af89ee-original.jpg?1543892786
Prep Time: 15 Min
Cook Time: 25 Min
Course: Desserts
Ingredients:
12 tablespoons (6 ounces) butter, softened
3/4 cup creamy peanut butter
2 cups (15 ounces) granulated sugar
4 large eggs
1 teaspoon vanilla extract
1/2 cup (2 ounces) Dutch-process, or natural, unsweetened cocoa powder (see note)
1 3/4 cups (8.75 ounces) all-purpose flour
1/4 teaspoon salt
3/4 teaspoon baking powder
12 ounces semisweet chocolate chunk, or chocolate chips
Directions:
Preheat the oven to 350 degrees F. Lightly grease a 9X13-inch aluminum/metal pan and set aside.

In a large bowl, whip the butter and peanut butter together with an electric mixer until smooth and creamy, 1-2 minutes. Add the sugar and mix well. Add the eggs and vanilla and mix until combined. Stir in the cocoa until the mixture is smooth and no dry streaks remain.

Add the flour, baking powder and salt. Stir once or twice (there will still be dry spots) and then add the chocolate chunks or chips. Stir until no dry streaks remain; the batter will be thick.

Spread the batter evenly in the pan.

Bake for 20-24 minutes until a toothpick inserted in the center comes out with a few moist crumbs. Don’t overbake!

Let the brownies cool completely in the pan. Cut into squares and serve chilled or at room temperature. The baked and cooled brownies freeze well.", "Double Chocolate Peanut Butter Brownies"),

(4, 3, "
Serves: 30
Source: https://www.foodnetwork.com/recipes/ree-drummond/cake-eyeballs-2269193
Photo Url: https://plantoeat.s3.amazonaws.com/recipes/17930670/21d7b72bd878b633046ebd19308c233a0e6c757a-original.jpg?1544147755
Prep Time: 2 Hr
Cook Time: 25 Min
Course: Desserts
Tags: dessert
Ingredients:
1 (18.25-ounce) box red velvet, or yellow cake mix, (plus required ingredients)
1 (12-ounce) can frosting, (any kind)
12 ounces white chocolate melting disks
Assorted gel icing, for decorating
Directions:
Prepare the cake mix according to the package directions for a 9-by-13-inch cake or two 9-inch cakes. Allow to cool slightly in the pan, then remove to a rack, cover with a dish towel and let cool completely.

Break off sections of the cake and crumble in a large bowl. When finished, you should have a bunch of very fine cake crumbs. Using a rubber spatula, work the frosting into the cake until it is no longer visible. (Even if you use white frosting with red velvet cake, the white will eventually blend in entirely.)

Next, roll the mixture into 1 1/2-inch balls (a small ice cream scoop helps with this) and set on a parchment-lined baking sheet. This is important: Pop &#39;em in the freezer, uncovered, for at least an hour. The cake balls need to be very firm before coating them.

When the cake balls are nice and firm, place the white chocolate in a heatproof bowl set over a pan of simmering water. (Don&#39;t let the bowl touch the water.) Stir occasionally until the chocolate is melted and smooth. Remove the bowl from the pan. Add the cake balls one at a time to the melted white chocolate and gently roll to coat. Using a fork, lift out the cake balls, then tap the fork against the side of the bowl to remove the excess chocolate. With a toothpick, push the ball off of the fork and back onto the parchment-lined baking sheet. Let set at room temperature, 10 to 15 minutes. Decorate with gel icing to look like eyeballs.

Photograph by Coral Von Zumwalt", "Cake Eyeballs"),

(5, 1, "
Description: Sugar free gingerbread men are the perfect treat to take to festive parties or why not make them all year round for a crunchy cookie?
Serves: 30
Source: https://www.ditchthecarbs.com/sugar-free-gingerbread-men/
Photo Url: https://plantoeat.s3.amazonaws.com/recipes/18019825/62d399bc8210cd7035a9865e38b73ac11f5669de-original.jpg?1544738784
Prep Time: 20 Min
Cook Time: 12 Min
Course: Desserts
Ingredients:
110 g butter, (softened)
4 tbsp granulated sweetener of choice, (or more, to your taste)
1 egg
200 g almond meal/flour
4 tbsp coconut flour
2 tsp ground ginger
1/2 tsp ground cloves
4 tbsp butter
4 tbsp cream cheese ((regular not spreadable))
powdered sweetener, (to taste)
1 tsp vanilla
Directions:
, Sugar free gingerbread men

Mix the butter and sweetener together until light and fluffy.

Add the egg and mix.

Add all the other dry ingredients and mix until well combined.

Adjust the dough with extra almond flour or water until the dough is the right consistency to be rolled out.

Roll between two sheets of baking parchment, cut out various shapes using cookie cutters and place on a lined baking tray.

Bake at 180C/350F for 10-12 minutes or until cooked (cooking times will vary considerably for this recipe and how crispy you like your gingerbread men). Once cooked, you may want to turn them upside down and bake for a further minute to ensure they are crisp.

, Sugar free icing/frosting

Microwave for 10-15 seconds or heat on the stove gently to soften (not melt) the butter and cream cheese together. Mix.

Add the vanilla and add sweetener to taste. Mix.

Allow to cool slightly and thicken enough to be able to be piped onto the gingerbread men.

If the icing/frosting is too thick, add a few drops of water, if too thin, allow to cool in the fridge to allow the butter and cream cheese to solidify slightly.", "Sugar Free Gingerbread Men");

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

insert into images (articleId, caption, filName) values
(1, "Good Fat", "avocado.png"),
(2, "ding dong", "bell-pepper.png"),
(3, "hmm donuts", "donut.png"),
(4, "smells like Rotorua", "egg.png"),
(5, "Love burgers", "burger.png");

insert into likes (userId, commentId, liking) values
(1, 2, 1),
(3, 2, 1),
(1, 6, 1),
(1, 3, 1),
(2, 2, 1);
    

