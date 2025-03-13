class CountryballGame {
    constructor() {
        // Define world boundaries first
        this.worldBounds = {
            minX: -40,
            maxX: 40,
            minZ: -40,
            maxZ: 40
        };

        // Initialize the clock for animation timing
        this.clock = new THREE.Clock();
        
        this.scene = new THREE.Scene();
        this.camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
        this.renderer = new THREE.WebGLRenderer();
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        document.body.appendChild(this.renderer.domElement);
        
        // Add this line AFTER creating the canvas
        this.renderer.domElement.__game = this;

        // Initialize interactable objects array
        this.interactableObjects = [];

        // Player settings
        this.moveSpeed = 0.1;
        this.playerHeight = 1.7;
        this.camera.position.y = this.playerHeight;

        // Movement controls
        this.moveForward = false;
        this.moveBackward = false;
        this.moveLeft = false;
        this.moveRight = false;
        this.velocity = new THREE.Vector3();
        this.direction = new THREE.Vector3();
        this.cameraAngle = 0;
        this.rotationSpeed = 0.1;

        // Cooking system with categories
        this.ingredientCategories = {
            meat: [
                { id: 'beef', name: 'Beef', icon: '🥩', rarity: 'common' },
                { id: 'chicken', name: 'Chicken', icon: '🍗', rarity: 'common' },
                { id: 'pork', name: 'Pork', icon: '🥓', rarity: 'common' },
                { id: 'fish', name: 'Fish', icon: '🐟', rarity: 'common' },
                { id: 'salmon', name: 'Salmon', icon: '🐠', rarity: 'uncommon' },
                { id: 'shrimp', name: 'Shrimp', icon: '🦐', rarity: 'uncommon' },
                { id: 'crab', name: 'Crab', icon: '🦀', rarity: 'rare' },
                { id: 'lobster', name: 'Lobster', icon: '🦞', rarity: 'rare' },
                { id: 'duck', name: 'Duck', icon: '🦆', rarity: 'rare' },
                { id: 'caviar', name: 'Caviar', icon: '🥄', rarity: 'legendary' }  // Moving from 'other' to 'meat' as it's fish eggs
            ],
            vegetables: [
                { id: 'potato', name: 'Potato', icon: '🥔', rarity: 'common' },
                { id: 'carrot', name: 'Carrot', icon: '🥕', rarity: 'common' },
                { id: 'tomato', name: 'Tomato', icon: '🍅', rarity: 'common' },
                { id: 'onion', name: 'Onion', icon: '🧅', rarity: 'common' },
                { id: 'garlic', name: 'Garlic', icon: '🧄', rarity: 'common' },
                { id: 'cabbage', name: 'Cabbage', icon: '🥬', rarity: 'common' },
                { id: 'broccoli', name: 'Broccoli', icon: '🥦', rarity: 'uncommon' },
                { id: 'corn', name: 'Corn', icon: '🌽', rarity: 'uncommon' },
                { id: 'mushroom', name: 'Mushroom', icon: '🍄', rarity: 'uncommon' },
                { id: 'avocado', name: 'Avocado', icon: '🥑', rarity: 'rare' },
                { id: 'tofu', name: 'Tofu', icon: '🧊', rarity: 'uncommon' },
                { id: 'peas', name: 'Peas', icon: '🟢', rarity: 'common' },
                { id: 'blueberry', name: 'Blueberry', icon: '🫐', rarity: 'uncommon' }  // Missing from recipes
            ],
            grains: [
                { id: 'rice', name: 'Rice', icon: '🍚', rarity: 'common' },
                { id: 'bread', name: 'Bread', icon: '🍞', rarity: 'common' },
                { id: 'pasta', name: 'Pasta', icon: '🍝', rarity: 'uncommon' },
                { id: 'noodles', name: 'Noodles', icon: '🍜', rarity: 'uncommon' },
                { id: 'flour', name: 'Flour', icon: '🌾', rarity: 'common' }
            ],
            dairy: [
                { id: 'milk', name: 'Milk', icon: '🥛', rarity: 'common' },
                { id: 'cheese', name: 'Cheese', icon: '🧀', rarity: 'uncommon' },
                { id: 'butter', name: 'Butter', icon: '🧈', rarity: 'uncommon' },
                { id: 'egg', name: 'Egg', icon: '🥚', rarity: 'common' }
            ],
            fruits: [
                { id: 'apple', name: 'Apple', icon: '🍎', rarity: 'common' },
                { id: 'banana', name: 'Banana', icon: '🍌', rarity: 'common' },
                { id: 'orange', name: 'Orange', icon: '🍊', rarity: 'common' },
                { id: 'lemon', name: 'Lemon', icon: '🍋', rarity: 'uncommon' },
                { id: 'strawberry', name: 'Strawberry', icon: '🍓', rarity: 'uncommon' },
                { id: 'blueberry', name: 'Blueberry', icon: '🫐', rarity: 'uncommon' },
                { id: 'pineapple', name: 'Pineapple', icon: '🍍', rarity: 'rare' }
            ],
            spices: [
                { id: 'salt', name: 'Salt', icon: '🧂', rarity: 'common' },
                { id: 'pepper', name: 'Pepper', icon: '🌶️', rarity: 'common' },
                { id: 'curry', name: 'Curry Powder', icon: '🍛', rarity: 'uncommon' },
                { id: 'gochugaru', name: 'Korean Chili', icon: '🌶️', rarity: 'uncommon' },
                { id: 'wasabi', name: 'Wasabi', icon: '🥬', rarity: 'rare' },
                { id: 'truffle', name: 'Truffle', icon: '🍄', rarity: 'legendary' }
            ],
            sauces: [
                { id: 'soy_sauce', name: 'Soy Sauce', icon: '🍶', rarity: 'common' },
                { id: 'honey', name: 'Honey', icon: '🍯', rarity: 'common' },
                { id: 'olive_oil', name: 'Olive Oil', icon: '🫒', rarity: 'uncommon' },
                { id: 'gochujang', name: 'Gochujang', icon: '🥫', rarity: 'uncommon' },
                { id: 'sesame_oil', name: 'Sesame Oil', icon: '🫗', rarity: 'uncommon' },
                { id: 'fish_sauce', name: 'Fish Sauce', icon: '🐟', rarity: 'rare' },
                { id: 'maple_syrup', name: 'Maple Syrup', icon: '🍁', rarity: 'uncommon' }
            ],
            other: [
                { id: 'ice', name: 'Ice', icon: '🧊', rarity: 'common' },
                { id: 'chocolate', name: 'Chocolate', icon: '🍫', rarity: 'uncommon' },
                { id: 'coconut', name: 'Coconut', icon: '🥥', rarity: 'uncommon' },
                { id: 'seaweed', name: 'Seaweed', icon: '🌿', rarity: 'uncommon' },
                { id: 'sesame_seeds', name: 'Sesame Seeds', icon: '⚪', rarity: 'uncommon' },
                { id: 'vodka', name: 'Vodka', icon: '🍾', rarity: 'rare' },
                { id: 'gravy', name: 'Gravy', icon: '🥣', rarity: 'uncommon' }  // Already in other, just confirming
            ]
        };

        // Remove the duplicate caviar from 'other' category
        this.ingredientCategories.other = this.ingredientCategories.other.filter(item => item.id !== 'caviar');

        // Make sure the ingredients list is updated after modifying categories
        this.ingredients = Object.values(this.ingredientCategories).flat();

        // Define recipes with quality ratings
        this.recipes = [
            // Japanese cuisine
            { ingredients: ['salmon', 'rice', 'wasabi'], result: 'Deluxe Salmon Sushi', icon: '🍣', rating: 'Charizard Class' },
            { ingredients: ['salmon', 'rice'], result: 'Salmon Sushi', icon: '🍣', rating: 'Great!' },
            { ingredients: ['fish', 'rice'], result: 'Fish Sushi', icon: '🍣', rating: 'Good!' },
            { ingredients: ['salmon', 'ice'], result: 'Japanese Sashimi', icon: '🍱', rating: 'Great!' },
            { ingredients: ['rice', 'egg', 'soy_sauce'], result: 'Tamago Gohan', icon: '🍚', rating: 'Great!' },
            
            // Western cuisine
            { ingredients: ['beef', 'potato', 'salt'], result: 'Steak & Potatoes', icon: '🥩', rating: 'Great!' },
            { ingredients: ['beef', 'potato', 'salt', 'truffle'], result: 'Gourmet Steak', icon: '🥩', rating: 'Charizard Class' },
            { ingredients: ['chicken', 'rice', 'curry'], result: 'Curry Chicken', icon: '🍛', rating: 'Great!' },
            { ingredients: ['pasta', 'tomato', 'cheese'], result: 'Pasta Pomodoro', icon: '🍝', rating: 'Great!' },
            { ingredients: ['bread', 'cheese', 'tomato'], result: 'Grilled Cheese Sandwich', icon: '🥪', rating: 'Good!' },
            
            // Soups and stews
            { ingredients: ['chicken', 'carrot', 'potato', 'onion'], result: 'Chicken Soup', icon: '🍲', rating: 'Great!' },
            { ingredients: ['beef', 'carrot', 'potato', 'onion'], result: 'Beef Stew', icon: '🍲', rating: 'Great!' },
            { ingredients: ['fish', 'potato', 'onion', 'milk'], result: 'Fish Chowder', icon: '🍜', rating: 'Great!' },
            
            // Desserts
            { ingredients: ['apple', 'bread', 'egg', 'honey'], result: 'Apple Pie', icon: '🥧', rating: 'Great!' },
            { ingredients: ['banana', 'chocolate', 'milk'], result: 'Banana Split', icon: '🍨', rating: 'Good!' },
            { ingredients: ['strawberry', 'blueberry', 'milk', 'ice'], result: 'Berry Smoothie', icon: '🥤', rating: 'Good!' },
            { ingredients: ['egg', 'milk', 'chocolate'], result: 'Chocolate Pudding', icon: '🍮', rating: 'Good!' },
            
            // Special combinations
            { ingredients: ['truffle', 'pasta', 'cheese', 'butter'], result: 'Truffle Pasta', icon: '🍝', rating: 'Charizard Class' },
            { ingredients: ['lobster', 'butter', 'garlic', 'lemon'], result: 'Gourmet Lobster', icon: '🦞', rating: 'Charizard Class' },
            { ingredients: ['rice', 'egg', 'soy_sauce', 'salmon', 'avocado'], result: 'Deluxe Poke Bowl', icon: '🥗', rating: 'Charizard Class' },
            // Korean cuisine
            { ingredients: ['cabbage', 'gochugaru', 'garlic', 'fish_sauce'], result: 'Kimchi', icon: '🥬', rating: 'Great!' },
            { ingredients: ['rice', 'cabbage', 'gochugaru', 'sesame_oil', 'egg'], result: 'Bibimbap', icon: '🍲', rating: 'Charizard Class' },
            { ingredients: ['rice', 'seaweed', 'fish'], result: 'Kimbap', icon: '🍙', rating: 'Great!' },
            { ingredients: ['noodles', 'beef', 'egg', 'sesame_oil'], result: 'Japchae', icon: '🍜', rating: 'Great!' },
            { ingredients: ['beef', 'soy_sauce', 'garlic', 'sesame_oil', 'sesame_seeds'], result: 'Bulgogi', icon: '🥩', rating: 'Charizard Class' },
            // Russian cuisine
            { ingredients: ['beef', 'cabbage', 'potato', 'onion'], result: 'Borscht', icon: '🍲', rating: 'Great!' },
            { ingredients: ['potato', 'flour', 'onion'], result: 'Pelmeni', icon: '🥟', rating: 'Good!' },
            { ingredients: ['potato', 'onion', 'vodka'], result: 'Russian Potato Salad', icon: '🥗', rating: 'Great!' },
            { ingredients: ['beef', 'cabbage', 'potato', 'vodka'], result: 'Deluxe Borscht', icon: '🍲', rating: 'Charizard Class' },
            { ingredients: ['flour', 'egg', 'butter', 'caviar'], result: 'Blini with Caviar', icon: '🥞', rating: 'Charizard Class' },
            // Chinese cuisine
            { ingredients: ['pork', 'cabbage', 'garlic', 'soy_sauce'], result: 'Dumplings', icon: '🥟', rating: 'Great!' },
            { ingredients: ['chicken', 'broccoli', 'soy_sauce', 'garlic'], result: 'Chicken Stir Fry', icon: '🍲', rating: 'Good!' },
            { ingredients: ['rice', 'egg', 'peas', 'soy_sauce'], result: 'Fried Rice', icon: '🍚', rating: 'Good!' },
            { ingredients: ['noodles', 'beef', 'onion', 'soy_sauce', 'sesame_oil'], result: 'Beef Chow Mein', icon: '🍜', rating: 'Great!' },
            { ingredients: ['tofu', 'garlic', 'pepper', 'soy_sauce'], result: 'Mapo Tofu', icon: '🍲', rating: 'Great!' },
            { ingredients: ['duck', 'honey', 'soy_sauce', 'garlic'], result: 'Peking Duck', icon: '🦆', rating: 'Charizard Class' },
            // Canadian cuisine
            { ingredients: ['flour', 'egg', 'milk', 'maple_syrup'], result: 'Pancakes with Maple Syrup', icon: '🥞', rating: 'Great!' },
            { ingredients: ['potato', 'cheese', 'gravy'], result: 'Poutine', icon: '🍟', rating: 'Great!' },
            { ingredients: ['salmon', 'maple_syrup', 'lemon'], result: 'Maple Glazed Salmon', icon: '🐟', rating: 'Great!' },
            { ingredients: ['beef', 'potato', 'carrot', 'maple_syrup'], result: 'Canadian Beef Stew', icon: '🍲', rating: 'Good!' },
            { ingredients: ['flour', 'butter', 'maple_syrup', 'blueberry'], result: 'Blueberry Maple Tart', icon: '🥧', rating: 'Charizard Class' },
            // Italian cuisine
            { ingredients: ['tomato', 'basil', 'mozzarella', 'olive_oil'], result: 'Margherita Pizza', icon: '🍕', rating: 'Great!' },
            { ingredients: ['tomato', 'basil', 'mozzarella', 'olive_oil', 'salt'], result: 'Margherita Pizza', icon: '🍕', rating: 'Great!' },
            { ingredients: ['tomato', 'basil', 'mozzarella', 'olive_oil', 'salt', 'pepper'], result: 'Margherita Pizza', icon: '🍕', rating: 'Great!' },
            { ingredients: ['tomato', 'basil', 'mozzarella', 'olive_oil', 'salt', 'pepper', 'oregano'], result: 'Margherita Pizza', icon: '🍕', rating: 'Great!' },
            // Add these to your recipes array
            { ingredients: ['flour', 'tomato', 'cheese', 'olive_oil'], result: 'Margherita Pizza', icon: '🍕', rating: 'Great!' },
            { ingredients: ['flour', 'tomato', 'cheese', 'olive_oil', 'truffle'], result: 'Truffle Pizza', icon: '🍕', rating: 'Charizard Class' },
            { ingredients: ['pasta', 'tomato', 'olive_oil', 'garlic'], result: 'Pasta Pomodoro', icon: '🍝', rating: 'Great!' },
            { ingredients: ['pasta', 'egg', 'cheese', 'pork'], result: 'Carbonara', icon: '🍝', rating: 'Great!' },
            { ingredients: ['rice', 'mushroom', 'cheese', 'butter'], result: 'Mushroom Risotto', icon: '🍚', rating: 'Great!' }
        ];

        // Initialize inventory with some starter ingredients
        this.inventory = [];
        Object.values(this.ingredientCategories).forEach(category => {
            category.forEach(ingredient => {
                // Give more common ingredients and fewer rare ones
                let quantity = 0;
                switch(ingredient.rarity) {
                    case 'common': quantity = 5; break;
                    case 'uncommon': quantity = 3; break;
                    case 'rare': quantity = 1; break;
                    case 'legendary': quantity = 0; break; // Need to find these
                }
                this.inventory.push({ ...ingredient, quantity });
            });
        });

        // Give player some of each ingredient for testing
        this.inventory.forEach(item => {
            item.quantity = Math.max(item.quantity, 2);
        });

        this.selectedIngredients = [];
        this.cookingLevel = 1;
        this.cookingExperience = 0;

        // Setup game components
        this.setupWorld();
        this.setupLighting();
        this.setupControls();
        this.createCountryballs();
        this.setupCountryballMovement();
        this.setupGamePanels();
        this.setupMarketZone(); // Add market zone
        
        // Initialize multiplayer
        this.initMultiplayer();
        
        // Initialize player coins - changed from 20 to 75
        this.playerCoins = 75;
        this.updateCoinDisplay();
        
        // Create truffle spot first, then reference it
        this.createTruffleSpot(); 
        
        // Setup systems
        this.setupDialogueSystem();
        this.setupInteractionSystem();
        this.setupCookingSystem();
        
        // Start game loop
        this.animate();
        
        // Show controls message at start
        setTimeout(() => {
            this.showControlsMessage();
        }, 1000);
    }

    setupWorld() {
        // Ground - change to a more grassy color
        const groundGeometry = new THREE.PlaneGeometry(100, 100);
        const groundMaterial = new THREE.MeshStandardMaterial({ 
            color: 0x2e8b57,  // Changed to sea green for better grass look
            roughness: 0.8
        });
        const ground = new THREE.Mesh(groundGeometry, groundMaterial);
        ground.rotation.x = -Math.PI / 2;
        this.scene.add(ground);

        // Sky - make it less bright
        this.scene.background = new THREE.Color(0x4169E1);  // Changed to royal blue

        // Add tents in a semi-circle arrangement
        this.addTent(-8, 0, -5);
        this.addTent(-4, 0, -8);
        this.addTent(0, 0, -10);
        this.addTent(4, 0, -8);
        this.addTent(8, 0, -5);
        
        // Add campfire
        this.addCampfire(0, 0, 0);
        
        // Add trees
        this.addTrees();
    }

    addTrees() {
        const treeGeometry = new THREE.ConeGeometry(1, 2, 8);
        const treeMaterial = new THREE.MeshStandardMaterial({ color: 0x228B22 });
        const trunkGeometry = new THREE.CylinderGeometry(0.2, 0.2, 1);
        const trunkMaterial = new THREE.MeshStandardMaterial({ color: 0x8B4513 });

        for (let i = 0; i < 20; i++) {
            const tree = new THREE.Group();
            
            const leaves = new THREE.Mesh(treeGeometry, treeMaterial);
            leaves.position.y = 1.5;
            
            const trunk = new THREE.Mesh(trunkGeometry, trunkMaterial);
            trunk.position.y = 0.5;
            
            tree.add(leaves);
            tree.add(trunk);
            
            tree.position.x = Math.random() * 80 - 40;
            tree.position.z = Math.random() * 80 - 40;
            
            this.scene.add(tree);
        }
    }

    setupLighting() {
        // Make lighting brighter
        const ambientLight = new THREE.AmbientLight(0xffffff, 1.0); // Increased from 0.6
        this.scene.add(ambientLight);

        const sunLight = new THREE.DirectionalLight(0xffffff, 1.0); // Increased from 0.8
        sunLight.position.set(10, 20, 10);
        this.scene.add(sunLight);
    }

    createCountryballs() {
        this.countryballs = [];
        const countries = ['us', 'gb', 'de', 'fr', 'jp', 'cn', 'ca', 'kr', 'ru', 'it']; // Add 'it' for Italy
        
        // Define dialogue and quests for each countryball
        const countryballData = {
            'us': {
                name: 'USAball',
                dialogues: [
                    "Howdy partner! Freedom tastes delicious, doesn't it?",
                    "I'm craving a good ol' burger. Got any beef and bread?",
                    "You know what they say - everything tastes better with FREEDOM!"
                ],
                cookingTips: [
                    "Try adding some maple syrup to savory dishes. I learned that from my neighbor Canada!",
                    "Beef and potatoes make a classic American meal. Add some salt for extra flavor."
                ],
                quest: {
                    active: false,
                    description: "I'm hosting a freedom party! Could you make me a Gourmet Steak?",
                    requiredDish: "Gourmet Steak",
                    reward: { id: 'truffle', quantity: 1 },
                    completion: "YEEHAW! This steak tastes like LIBERTY! Here's a rare truffle I found."
                }
            },
            'gb': {
                name: 'UKball',
                dialogues: [
                    "Fancy a spot of tea after your meal?",
                    "British cuisine is quite refined, I'll have you know!",
                    "A proper meal should be served at precisely the right time."
                ],
                cookingTips: [
                    "Fish and chips is a classic. Try fish with potato and some salt.",
                    "Don't overcook your vegetables. A bit of crunch is quite nice."
                ],
                quest: {
                    active: false,
                    description: "I'm feeling a bit peckish. Could you prepare some Fish Chowder for me?",
                    requiredDish: "Fish Chowder",
                    reward: { id: 'caviar', quantity: 1 },
                    completion: "Splendid work! This is absolutely scrummy. Here's some caviar for your trouble."
                }
            },
            'de': {
                name: 'Germanyball',
                dialogues: [
                    "Guten Tag! German efficiency extends to cooking as well.",
                    "A good meal must be precise and well-structured.",
                    "Wunderbar! Your cooking skills are improving efficiently."
                ],
                cookingTips: [
                    "Potatoes are versatile and efficient ingredients. Use them wisely.",
                    "Precision in cooking times leads to optimal results."
                ],
                quest: {
                    active: false,
                    description: "I require a hearty meal. Could you make some Beef Stew? It must be efficient and filling.",
                    requiredDish: "Beef Stew",
                    reward: { id: 'sausage', quantity: 2 },
                    completion: "Sehr gut! This stew is perfectly engineered. Take these sausages as compensation."
                }
            },
            'fr': {
                name: 'Franceball',
                dialogues: [
                    "Bonjour! French cuisine is the finest in the world, non?",
                    "The secret to good cooking is passion and quality ingredients!",
                    "Magnifique! Your cooking technique is improving."
                ],
                cookingTips: [
                    "Butter makes everything better. Use it generously.",
                    "Fresh ingredients are the foundation of French cuisine."
                ],
                quest: {
                    active: false,
                    description: "I wish to taste your culinary skills. Could you prepare Truffle Pasta for me?",
                    requiredDish: "Truffle Pasta",
                    reward: { id: 'truffle', quantity: 1 },
                    completion: "C'est magnifique! You have potential. Here's a truffle from my collection."
                }
            },
            'jp': {
                name: 'Japanball',
                dialogues: [
                    "Konnichiwa! Japanese cuisine values balance and presentation.",
                    "The knife technique is very important in Japanese cooking.",
                    "Oishii! Your dishes are becoming more refined."
                ],
                cookingTips: [
                    "Rice is the foundation of many Japanese dishes. Master cooking it perfectly.",
                    "Fresh fish needs minimal seasoning. Let the natural flavors shine."
                ],
                quest: {
                    active: false,
                    description: "I would be honored if you could make Deluxe Salmon Sushi for me.",
                    requiredDish: "Deluxe Salmon Sushi",
                    reward: { id: 'wasabi', quantity: 2 },
                    completion: "Subarashii! Your sushi technique is impressive. Please accept this wasabi."
                }
            },
            'cn': {
                name: 'Chinaball',
                dialogues: [
                    "Ni hao! Chinese cuisine has 5000 years of history!",
                    "Balance of flavors is key - sweet, sour, bitter, spicy, and salty.",
                    "Wok cooking requires high heat and quick movements."
                ],
                cookingTips: [
                    "Garlic and ginger are the foundation of many Chinese dishes.",
                    "Don't be afraid of high heat when stir-frying."
                ],
                quest: {
                    active: false,
                    description: "I would like to taste your Peking Duck. Can you make this prestigious dish?",
                    requiredDish: "Peking Duck",
                    reward: { id: 'duck', quantity: 1 },
                    completion: "Very good quality! Your cooking brings honor. Here is premium duck for future dishes."
                }
            },
            'ca': {
                name: 'Canadaball',
                dialogues: [
                    "Hey there, eh! Canadian cuisine is all about comfort food.",
                    "Sorry, but maple syrup goes with everything!",
                    "The great outdoors gives you an appetite, eh?"
                ],
                cookingTips: [
                    "Maple syrup isn't just for pancakes - try it with salmon!",
                    "Poutine is our national treasure - potatoes, cheese, and gravy."
                ],
                quest: {
                    active: false,
                    description: "Sorry to bother you, but could you make some Pancakes with Maple Syrup?",
                    requiredDish: "Pancakes with Maple Syrup",
                    reward: { id: 'maple_syrup', quantity: 3 },
                    completion: "Sorry, but this is absolutely delicious! Here's some premium maple syrup from my personal reserve."
                }
            },
            'kr': {
                name: 'South Koreaball',
                dialogues: [
                    "Annyeong! Korean food is all about bold flavors and fermentation.",
                    "Kimchi is life! It goes with everything.",
                    "Sharing food brings people together. Let's eat!"
                ],
                cookingTips: [
                    "Gochugaru and gochujang are the secret to authentic Korean flavors.",
                    "Bibimbap is our master dish - rice with various toppings and egg."
                ],
                quest: {
                    active: false,
                    description: "Could you make Bibimbap? I miss the taste of home.",
                    requiredDish: "Bibimbap",
                    reward: { id: 'gochugaru', quantity: 3 },
                    completion: "Daebak! This tastes just like home. Take this premium Korean chili powder!"
                }
            },
            'ru': {
                name: 'Russiaball',
                dialogues: [
                    "Privet! Russian cuisine is hearty to survive cold winters.",
                    "A good meal should fill your soul, not just your stomach.",
                    "In Russia, food eats... no wait, that's not right."
                ],
                cookingTips: [
                    "Potatoes and cabbage are staples of Russian cooking.",
                    "A splash of vodka can enhance the flavor of many dishes."
                ],
                quest: {
                    active: false,
                    description: "I challenge you to make Deluxe Borscht with vodka. Can you handle it?",
                    requiredDish: "Deluxe Borscht",
                    reward: { id: 'vodka', quantity: 2 },
                    completion: "Excellent! This borscht is worthy of the Motherland. Take this premium vodka!"
                }
            },
            'it': {
                name: 'Italyball',
                dialogues: [
                    "Ciao! Italian cuisine is all about quality ingredients and simplicity.",
                    "Mamma mia! You need to cook with passion!",
                    "The secret to good pasta is in the sauce and al dente cooking.",
                    "In Italy, food brings family together. It's not just eating, it's sharing love!"
                ],
                cookingTips: [
                    "Always salt your pasta water - it should taste like the sea!",
                    "Olive oil is the foundation of Italian cooking. Use it generously.",
                    "Fresh basil should be torn, not cut, to preserve its aroma.",
                    "For authentic risotto, add the broth slowly and stir constantly."
                ],
                quest: {
                    active: false,
                    description: "Could you make me an authentic Margherita Pizza? I miss the taste of home.",
                    requiredDish: "Margherita Pizza",
                    reward: { id: 'olive_oil', quantity: 2 },
                    completion: "Bellissimo! This pizza reminds me of Napoli. Take this premium olive oil!"
                }
            }
        };
        
        // Create countryballs with enhanced interaction data
        countries.forEach((country, index) => {
            const ballGroup = new THREE.Group();
            
            // Create the complete sphere geometry
            const geometry = new THREE.SphereGeometry(1, 32, 32);
            
            // Load texture first, then create the ball
            new THREE.TextureLoader().load(
                `https://flagcdn.com/w160/${country}.png`,
                (texture) => {
                    // Basic texture settings
                    texture.wrapS = THREE.ClampToEdgeWrapping;
                    texture.wrapT = THREE.ClampToEdgeWrapping;
                    texture.repeat.set(1, 1);
                    texture.center.set(0.5, 0.5);

                    // Create the ball with the texture
                    const material = new THREE.MeshStandardMaterial({
                        map: texture,
                        side: THREE.DoubleSide,
                        roughness: 0.3,
                        metalness: 0.1
                    });

                    const ball = new THREE.Mesh(geometry, material);
                    
                    // Country-specific rotations and adjustments
                    switch(country) {
                        case 'us':
                            // USA flag - stars should be in top left
                            ball.rotation.y = 0;
                            ball.rotation.z = 0;
                            texture.rotation = 0;
                            texture.flipY = true;
                            break;
                        case 'de':
                            // German flag - black stripe on top
                            ball.rotation.y = 0;
                            ball.rotation.z = 0;
                            texture.rotation = 0;
                            texture.flipY = true;
                            break;
                        case 'fr':
                            // French flag - blue stripe on left (vertical orientation)
                            ball.rotation.y = -Math.PI/2;
                            texture.rotation = 0;
                            texture.flipY = true;
                            break;
                        case 'jp':
                            // Japan flag - centered red circle
                            ball.rotation.y = 0;
                            
                            // Create a white ball for Japan
                            const japanMaterial = new THREE.MeshStandardMaterial({
                                color: 0xffffff,
                                roughness: 0.3,
                                metalness: 0.1
                            });
                            
                            // Create a proper circle using CircleGeometry
                            const redCircleGeometry = new THREE.CircleGeometry(0.3, 32);
                            const redCircleMaterial = new THREE.MeshBasicMaterial({
                                color: 0xd30000,
                                side: THREE.DoubleSide
                            });
                            
                            // Front circle
                            const frontCircle = new THREE.Mesh(redCircleGeometry, redCircleMaterial);
                            frontCircle.position.z = 1.01;
                            
                            // Back circle
                            const backCircle = new THREE.Mesh(redCircleGeometry, redCircleMaterial);
                            backCircle.position.z = -1.01;
                            backCircle.rotation.y = Math.PI;
                            
                            ball.material = japanMaterial;
                            ball.add(frontCircle);
                            ball.add(backCircle);
                            break;
                        case 'gb':
                            // UK flag
                            ball.rotation.y = 0;
                            texture.rotation = 0;
                            texture.flipY = true;
                            break;
                        case 'cn':
                            // China flag - red with yellow stars
                            ball.rotation.y = 0;
                            texture.rotation = 0;
                            texture.flipY = true;
                            
                            // Add squinty eyes for China
                            const leftEyeSlant = this.createSlantedEye(-0.4);
                            const rightEyeSlant = this.createSlantedEye(0.4);
                            ball.add(leftEyeSlant);
                            ball.add(rightEyeSlant);
                            break;
                        case 'ca':
                            // For Canada, rotate the flag to the left from Canada's perspective
                            ball.rotation.y = -Math.PI/2; // Rotate 90 degrees to the right (which is left from Canada's view)
                            texture.rotation = 0;
                            texture.flipY = true;
                            
                            // Adjust texture to center the maple leaf
                            texture.offset.set(0, 0);
                            texture.repeat.set(1, 1);
                            break;
                        case 'kr':
                            // South Korea flag - use the texture approach but rotate it
                            ball.rotation.y = Math.PI/2; // Rotate to show the black trigrams on the left
                            texture.rotation = 0;
                            texture.flipY = true;
                            
                            // Adjust texture to ensure it's properly visible
                            texture.offset.set(0, 0);
                            texture.repeat.set(1, 1);
                            
                            // Add Korean eyes - properly centered
                            const leftEyeKR = this.createKoreanEye(-0.4);
                            const rightEyeKR = this.createKoreanEye(0.4);
                            
                            // Position the eyes properly on the front of the ball
                            leftEyeKR.position.set(-0.4, 0.3, 0.95);
                            rightEyeKR.position.set(0.4, 0.3, 0.95);
                            
                            ball.add(leftEyeKR);
                            ball.add(rightEyeKR);
                            break;
                        case 'ru':
                            // Russia flag - white on top, blue in middle, red on bottom
                            ball.rotation.y = 0;
                            texture.rotation = 0;
                            texture.flipY = true;
                            
                            // Add ushanka (Russian fur hat)
                            const ushanka = this.createUshanka();
                            ball.add(ushanka);
                            break;
                        case 'it':
                            // Italy flag - vertical stripes (green, white, red)
                            ball.rotation.y = -Math.PI/2; // Rotate like France to show vertical orientation
                            texture.rotation = 0;
                            texture.flipY = true;
                            
                            // Remove the problematic green box that was added before
                            // No need to add any custom elements as the flag texture will display properly
                            break;
                    }
                    
                    ballGroup.add(ball);

                    // Add eyes after the ball is created (except for countries with custom eyes)
                    if (country !== 'cn' && country !== 'kr') {
                        const leftEye = this.createEye(-0.4);
                        const rightEye = this.createEye(0.4);
                        ballGroup.add(leftEye);
                        ballGroup.add(rightEye);
                    }
                }
            );

            // Set initial position
            ballGroup.position.set(
                Math.random() * 30 - 15,
                1,
                Math.random() * 30 - 15
            );

            // Set up userData
            ballGroup.userData = {
                type: 'countryball',
                country: country,
                name: countryballData[country].name,
                dialogues: countryballData[country].dialogues,
                cookingTips: countryballData[country].cookingTips,
                quest: countryballData[country].quest,
                interactable: true
            };

            this.scene.add(ballGroup);
            this.countryballs.push(ballGroup);
        });
    }

    getCountryDialogues(country) {
        const dialogues = {
            'us': {
                greeting: "Hey there, partner! What brings you to these parts?",
                options: [
                    { text: "Just exploring the world!", response: "That's the spirit of freedom right there!" },
                    { text: "Looking to make new friends!", response: "Well, you've come to the right place!" },
                    { text: "I love your culture!", response: "Aw shucks, that's mighty kind of you!" }
                ]
            },
            'gb': {
                greeting: "Jolly good to see you! Care for some tea?",
                options: [
                    { text: "Yes, please!", response: "Splendid choice! Earl Grey coming right up!" },
                    { text: "I prefer coffee...", response: "Oh dear, how unfortunate..." },
                    { text: "Maybe later?", response: "Very well, do come back for tea time!" }
                ]
            },
            'cn': {
                greeting: "Ni hao! Welcome to our camp, honorable guest!",
                options: [
                    { text: "Your country has amazing history!", response: "Yes! 5,000 years of glorious civilization!" },
                    { text: "Can you teach me some Chinese?", response: "Of course! We start with 'xiexie' - it means 'thank you'." },
                    { text: "I love Chinese food!", response: "Ah, you have good taste! Much better than Western food!" }
                ]
            },
            'ca': {
                greeting: "Hey there, eh! Beautiful day for camping, isn't it?",
                options: [
                    { text: "It sure is!", response: "Nothing beats the great outdoors and some maple syrup, eh?" },
                    { text: "It's a bit cold...", response: "This? This is t-shirt weather where I'm from!" },
                    { text: "I love your accent!", response: "What accent? I don't have an accent, eh!" }
                ]
            },
            'kr': {
                greeting: "Annyeonghaseyo! Welcome to our camping trip!",
                options: [
                    { text: "I love K-pop!", response: "Ah, you have good taste in music! BTS is the best!" },
                    { text: "Your technology is amazing!", response: "Thank you! Samsung and technology are our pride!" },
                    { text: "Can you teach me some Korean?", response: "Of course! Start with 'Gamsahamnida' - it means thank you!" }
                ]
            },
            'ru': {
                greeting: "Privet, comrade! Come sit by fire, da?",
                options: [
                    { text: "It's very cold here...", response: "This? This is summer weather in Siberia!" },
                    { text: "I like your hat!", response: "Spasibo! Ushanka keeps head warm even in coldest winter!" },
                    { text: "Do you have any vodka?", response: "Ha! Is bear in woods? Of course I have vodka!" }
                ]
            }
        };
        return dialogues[country] || {
            greeting: "Hello friend!",
            options: [
                { text: "Hello!", response: "Nice to meet you!" },
                { text: "Goodbye!", response: "See you later!" }
            ]
        };
    }

    setupDialogueSystem() {
        console.log("Setting up dialogue system");
        const closeButton = document.getElementById('closeDialogue');
        if (closeButton) {
            closeButton.addEventListener('click', () => {
                this.hideDialogue();
            });
        } else {
            console.error("Close dialogue button not found!");
        }
    }

    showDialogue(object) {
        console.log("Showing dialogue for:", object.userData);
        
        const panel = document.getElementById('dialoguePanel');
        const nameEl = document.getElementById('dialogueName');
        const textEl = document.getElementById('dialogueText');
        const optionsEl = document.getElementById('dialogueOptions');
        
        if (!panel || !nameEl || !textEl || !optionsEl) {
            console.error("Dialogue elements not found in the DOM!");
            return;
        }
        
        // Set name
        nameEl.textContent = object.userData.name || 'Countryball';
        
        // Clear previous options
        optionsEl.innerHTML = '';
        
        // Show random dialogue
        let dialogueText = "Hello! I'm a countryball!";
        
        if (object.userData.dialogues && object.userData.dialogues.length > 0) {
            const randomIndex = Math.floor(Math.random() * object.userData.dialogues.length);
            dialogueText = object.userData.dialogues[randomIndex];
        } else {
            console.warn("No dialogues found for this countryball:", object.userData);
        }
        
        textEl.textContent = dialogueText;
        
        // Add general conversation option
        const chatOption = document.createElement('button');
        chatOption.className = 'dialogueOption';
        chatOption.textContent = "Chat";
        chatOption.addEventListener('click', () => {
            // Show a different random dialogue
            if (object.userData.dialogues && object.userData.dialogues.length > 0) {
                const newIndex = Math.floor(Math.random() * object.userData.dialogues.length);
                textEl.textContent = object.userData.dialogues[newIndex];
            }
        });
        optionsEl.appendChild(chatOption);
        
        // Add cooking tip option
        if (object.userData.cookingTips && object.userData.cookingTips.length > 0) {
            const tipOption = document.createElement('button');
            tipOption.className = 'dialogueOption';
            tipOption.textContent = "Ask for cooking tips";
            tipOption.addEventListener('click', () => {
                const randomTipIndex = Math.floor(Math.random() * object.userData.cookingTips.length);
                textEl.textContent = object.userData.cookingTips[randomTipIndex];
            });
            optionsEl.appendChild(tipOption);
        }
        
        // Add ask for ingredients option
        const ingredientOption = document.createElement('button');
        ingredientOption.className = 'dialogueOption';
        ingredientOption.textContent = "Ask for ingredients";
        ingredientOption.addEventListener('click', () => {
            this.giveRandomIngredient(object);
            textEl.textContent = "Here, take this ingredient. It might help with your cooking!";
        });
        optionsEl.appendChild(ingredientOption);
        
        // Add quest option if not active
        if (object.userData.quest && !object.userData.quest.active) {
            const questOption = document.createElement('button');
            questOption.className = 'dialogueOption questOption';
            questOption.textContent = "Ask if they need anything";
            questOption.addEventListener('click', () => {
                object.userData.quest.active = true;
                textEl.textContent = object.userData.quest.description;
                
                // Update options
                optionsEl.innerHTML = '';
                const acceptOption = document.createElement('button');
                acceptOption.className = 'dialogueOption questOption';
                acceptOption.textContent = "I'll make it for you";
                acceptOption.addEventListener('click', () => {
                    this.hideDialogue();
                });
                optionsEl.appendChild(acceptOption);
                
                // Add goodbye option
                this.addGoodbyeOption(optionsEl);
            });
            optionsEl.appendChild(questOption);
        }
        
        // Add quest completion option if active
        if (object.userData.quest && object.userData.quest.active) {
            const giveOption = document.createElement('button');
            giveOption.className = 'dialogueOption questOption';
            giveOption.textContent = `Give ${object.userData.quest.requiredDish}`;
            giveOption.addEventListener('click', () => {
                this.completeCookingQuest(object);
            });
            optionsEl.appendChild(giveOption);
        }
        
        // Add goodbye option
        this.addGoodbyeOption(optionsEl);
        
        // Show panel
        panel.style.display = 'block';
    }

    // Add this method to give random ingredients when asked
    giveRandomIngredient(object) {
        // Define country-specific ingredients
        const countryIngredients = {
            'us': ['beef', 'potato', 'bread'],
            'gb': ['fish', 'potato', 'salt'],
            'de': ['sausage', 'potato', 'cabbage'],
            'fr': ['butter', 'cheese', 'bread'],
            'jp': ['rice', 'fish', 'seaweed'],
            'cn': ['garlic', 'soy_sauce', 'rice'],
            'ca': ['maple_syrup', 'potato', 'gravy'],
            'kr': ['gochugaru', 'rice', 'cabbage'],
            'ru': ['vodka', 'potato', 'cabbage'],
            'it': ['pasta', 'tomato', 'olive_oil', 'cheese', 'garlic']
        };
        
        // Get ingredients for this country or use default
        const ingredients = countryIngredients[object.userData.country] || 
            ['potato', 'salt', 'egg', 'milk', 'rice'];
        
        // Select a random ingredient
        const randomIngredient = ingredients[Math.floor(Math.random() * ingredients.length)];
        
        // Find the ingredient in inventory
        const inventoryItem = this.inventory.find(item => item.id === randomIngredient);
        
        if (inventoryItem) {
            // Add to inventory
            inventoryItem.quantity += 1;
            
            // Show message
            this.showMessage(`Received 1 ${inventoryItem.name}!`);
            
            // Cooldown for this countryball
            object.userData.lastIngredientTime = Date.now();
        }
    }

    addGoodbyeOption(optionsEl) {
        const goodbyeOption = document.createElement('button');
        goodbyeOption.className = 'dialogueOption';
        goodbyeOption.textContent = "Goodbye";
        goodbyeOption.addEventListener('click', () => {
            this.hideDialogue();
        });
        optionsEl.appendChild(goodbyeOption);
    }

    hideDialogue() {
        const panel = document.getElementById('dialoguePanel');
        if (panel) {
            panel.style.display = 'none';
        }
        
        // Reset any interacting state
        if (this.countryballs) {
            this.countryballs.forEach(ball => {
                if (ball.userData && ball.userData.interacting) {
                    ball.userData.interacting = false;
                }
            });
        }
    }

    setupControls() {
        // Increase base movement speed
        this.moveSpeed = 0.15;
        
        // Add acceleration and deceleration parameters
        this.acceleration = 0.01;
        this.deceleration = 0.25;
        this.maxVelocity = 0.2;
        
        document.addEventListener('keydown', (event) => {
            switch (event.code) {
                case 'KeyW':
                case 'ArrowUp':
                    this.moveForward = true;
                    this.moveBackward = false;
                    break;
                case 'KeyS':
                case 'ArrowDown':
                    this.moveBackward = true;
                    this.moveForward = false;
                    break;
                case 'KeyA':
                case 'ArrowLeft':
                    // Rotate left
                    this.cameraAngle += this.rotationSpeed;
                    this.camera.rotation.y = this.cameraAngle;
                    break;
                case 'KeyD':
                case 'ArrowRight':
                    // Rotate right
                    this.cameraAngle -= this.rotationSpeed;
                    this.camera.rotation.y = this.cameraAngle;
                    break;
                case 'KeyE':
                case 'Space':
                    this.handleInteraction();
                    break;
            }
        });

        document.addEventListener('keyup', (event) => {
            switch (event.code) {
                case 'KeyW':
                case 'ArrowUp':
                    this.moveForward = false;
                    break;
                case 'KeyS':
                case 'ArrowDown':
                    this.moveBackward = false;
                    break;
                // No need for keyup handlers for A/D since they're instant rotations
            }
        });
        
        // Remove pointer lock since we're not using mouse look
        window.addEventListener('click', (event) => {
            this.handleClick(event);
        });
        
        // Add click handler for throwing toys
        this.renderer.domElement.addEventListener('click', (event) => {
            // Check if we have any throwable toys
            if (this.toyBalls && this.toyBalls.length > 0) {
                this.toyBalls.forEach(ball => {
                    if (ball.userData.throwable) {
                        // Calculate throw direction from camera
                        const throwDirection = new THREE.Vector3(0, 0, -1)
                            .applyQuaternion(this.camera.quaternion)
                            .normalize();
                        
                        // Set velocity
                        ball.userData.velocity = throwDirection.multiplyScalar(0.2);
                        ball.userData.bounceCount = 0;
                        
                        // Position in front of player
                        ball.position.copy(this.camera.position).add(
                            new THREE.Vector3(0, -0.5, 0) // Slightly below eye level
                        );
                        
                        // Only throw one ball at a time
                        ball.userData.throwable = false;
                        
                        // Make it throwable again after it stops
                        setTimeout(() => {
                            ball.userData.throwable = true;
                        }, 3000);
                        
                        return;
                    }
                });
            }
        });
    }

    handleClick(event) {
        this.mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
        this.mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
        
        this.raycaster.setFromCamera(this.mouse, this.camera);
        const intersects = this.raycaster.intersectObjects(this.countryballs, true);
        
        if (intersects.length > 0) {
            const object = intersects[0].object;
            
            // Check if it's a vendor
            if (object.userData.isVendor) {
                this.handleVendorInteraction(object);
                return;
            }
            
            // Find the parent group (countryball)
            let countryball = intersects[0].object;
            while (countryball.parent && !countryball.userData.dialogues) {
                countryball = countryball.parent;
            }
            if (countryball.userData.dialogues) {
                this.showDialogue(countryball);
            }
        } else {
            this.hideDialogue();
        }
    }

    updateMovement() {
        // Apply deceleration when no movement keys are pressed
        if (!this.moveForward && !this.moveBackward) {
            this.velocity.x *= (1 - this.deceleration);
            this.velocity.z *= (1 - this.deceleration);
            
            if (Math.abs(this.velocity.x) < 0.01) this.velocity.x = 0;
            if (Math.abs(this.velocity.z) < 0.01) this.velocity.z = 0;
        } else {
            // FIXED: W moves forward (negative Z) and S moves backward (positive Z)
            // The key issue was here - we need to flip the direction calculation
            this.direction.z = Number(this.moveBackward) - Number(this.moveForward);
            this.direction.normalize();
            
            // Apply movement in the direction the camera is facing
            const moveX = Math.sin(this.cameraAngle) * this.direction.z;
            const moveZ = Math.cos(this.cameraAngle) * this.direction.z;
            
            this.velocity.x += moveX * this.acceleration;
            this.velocity.z += moveZ * this.acceleration;
            
            // Limit maximum velocity
            const currentSpeed = Math.sqrt(this.velocity.x * this.velocity.x + this.velocity.z * this.velocity.z);
            if (currentSpeed > this.maxVelocity) {
                const scaleFactor = this.maxVelocity / currentSpeed;
                this.velocity.x *= scaleFactor;
                this.velocity.z *= scaleFactor;
            }
        }
        
        // Apply velocity to position
        this.camera.position.x += this.velocity.x;
        this.camera.position.z += this.velocity.z;
        
        // Enforce world boundaries
        this.camera.position.x = Math.max(this.worldBounds.minX, Math.min(this.worldBounds.maxX, this.camera.position.x));
        this.camera.position.z = Math.max(this.worldBounds.minZ, Math.min(this.worldBounds.maxZ, this.camera.position.z));
    }

    updateCountryballs(delta) {
        this.countryballs.forEach(ball => {
            // Skip if the ball is in a dialogue
            if (ball.userData.interacting) return;
            
            // Add missing properties to userData if they don't exist
            if (!ball.userData.targetPosition) {
                ball.userData.targetPosition = ball.position.clone();
                ball.userData.moveTimer = 0;
                ball.userData.state = 'wandering';
            }
            
            // Update movement
            ball.userData.moveTimer -= delta;
            
            if (ball.userData.moveTimer <= 0) {
                // Set new random target
                const angle = Math.random() * Math.PI * 2;
                const distance = 2 + Math.random() * 3;
                const x = ball.position.x + Math.cos(angle) * distance;
                const z = ball.position.z + Math.sin(angle) * distance;
                
                // Keep within world bounds
                const boundedX = Math.max(this.worldBounds.minX + 5, Math.min(this.worldBounds.maxX - 5, x));
                const boundedZ = Math.max(this.worldBounds.minZ + 5, Math.min(this.worldBounds.maxZ - 5, z));
                
                ball.userData.targetPosition.set(boundedX, ball.position.y, boundedZ);
                ball.userData.moveTimer = 3 + Math.random() * 5; // Random time between 3-8 seconds
            }
            
            // Move towards target
            const direction = new THREE.Vector3().subVectors(ball.userData.targetPosition, ball.position);
            const distance = direction.length();
            
            if (distance > 0.1) {
                direction.normalize();
                ball.position.add(direction.multiplyScalar(0.02));
                
                // Rotate to face movement direction
                ball.rotation.y = Math.atan2(direction.x, direction.z);
            }
        });
    }

    animate() {
        requestAnimationFrame(this.animate.bind(this));
        
        // Use a fixed delta time if clock is not available
        const delta = this.clock ? this.clock.getDelta() * 1000 : 16.67; // ~60fps
        
        // Update countryball movement
        if (this.updateCountryballMovement) {
            this.updateCountryballMovement(delta);
        }
        
        // Update toy physics
        if (this.updateToyPhysics) {
            this.updateToyPhysics(delta);
        }
        
        // Update multiplayer players
        this.updateMultiplayerPlayers(delta);
        
        this.updateMovement();
        this.renderer.render(this.scene, this.camera);
    }

    // Add new method for creating tent
    addTent(x, y, z) {
        // Create tent cone
        const tentConeGeometry = new THREE.ConeGeometry(2, 3, 8);
        const tentMaterial = new THREE.MeshStandardMaterial({ color: 0xf4a460 });
        const tentCone = new THREE.Mesh(tentConeGeometry, tentMaterial);
        
        // Position the tent properly - raise it up so it's not underground
        tentCone.position.set(x, y + 1.5, z); // Add 1.5 to y to raise it up
        this.scene.add(tentCone);
        
        // Create tent entrance (cylinder with a hole)
        const entranceGeometry = new THREE.CylinderGeometry(1.5, 1.5, 2, 8, 1, true, Math.PI/4, Math.PI/2);
        const entranceMaterial = new THREE.MeshStandardMaterial({ color: 0x8b4513, side: THREE.DoubleSide });
        const entrance = new THREE.Mesh(entranceGeometry, entranceMaterial);
        
        // Position entrance at the bottom of the tent
        entrance.position.set(x, y + 1, z); // Adjust y position to match the raised tent
        this.scene.add(entrance);
    }

    // Add new method for creating campfire
    addCampfire(x, y, z) {
        const fireGroup = new THREE.Group();
        
        // Logs
        const logGeometry = new THREE.CylinderGeometry(0.2, 0.2, 2);
        const logMaterial = new THREE.MeshStandardMaterial({ color: 0x8B4513 });
        
        for (let i = 0; i < 3; i++) {
            const log = new THREE.Mesh(logGeometry, logMaterial);
            log.rotation.z = (i * Math.PI) / 3;
            log.position.y = 0.2;
            fireGroup.add(log);
        }
        
        // Stones around fire
        const stoneGeometry = new THREE.SphereGeometry(0.3);
        const stoneMaterial = new THREE.MeshStandardMaterial({ color: 0x808080 });
        
        for (let i = 0; i < 8; i++) {
            const stone = new THREE.Mesh(stoneGeometry, stoneMaterial);
            const angle = (i * Math.PI * 2) / 8;
            stone.position.x = Math.cos(angle) * 1.5;
            stone.position.z = Math.sin(angle) * 1.5;
            fireGroup.add(stone);
        }
        
        fireGroup.position.set(x, y, z);
        this.scene.add(fireGroup);
    }

    // Add helper methods for creating eyes
    createEye(xPos) {
        const eyeGroup = new THREE.Group();
        
        const outlineGeometry = new THREE.CircleGeometry(0.17, 32);
        const outlineMaterial = new THREE.MeshBasicMaterial({
            color: 0x000000,
            side: THREE.DoubleSide
        });
        const outline = new THREE.Mesh(outlineGeometry, outlineMaterial);
        
        const eyeGeometry = new THREE.CircleGeometry(0.15, 32);
        const eyeMaterial = new THREE.MeshBasicMaterial({ 
            color: 0xffffff,
            side: THREE.DoubleSide
        });
        const eye = new THREE.Mesh(eyeGeometry, eyeMaterial);
        eye.position.z = 0.01;

        eyeGroup.add(outline);
        eyeGroup.add(eye);
        eyeGroup.position.set(xPos, 0.3, 0.95);
        return eyeGroup;
    }

    // Create better slanted eyes for China
    createSlantedEye(xPos) {
        const eyeGroup = new THREE.Group();
        
        // Create a better slanted eye shape
        const slantShape = new THREE.Shape();
        slantShape.moveTo(-0.15, 0);
        slantShape.quadraticCurveTo(0, 0.08, 0.15, 0); // More pronounced curve
        slantShape.quadraticCurveTo(0, -0.01, -0.15, 0); // Flatter bottom
        
        const slantGeometry = new THREE.ShapeGeometry(slantShape);
        const slantMaterial = new THREE.MeshBasicMaterial({
            color: 0x000000,
            side: THREE.DoubleSide
        });
        
        const slantedEye = new THREE.Mesh(slantGeometry, slantMaterial);
        eyeGroup.add(slantedEye);
        eyeGroup.position.set(xPos, 0.3, 0.95);
        eyeGroup.rotation.x = -0.2; // Less tilt
        
        return eyeGroup;
    }

    // Create Korean eyes (slightly different from Chinese eyes)
    createKoreanEye(xPos) {
        const eyeGroup = new THREE.Group();
        
        // Create a Korean eye shape (more curved)
        const slantShape = new THREE.Shape();
        slantShape.moveTo(-0.15, 0);
        slantShape.quadraticCurveTo(0, 0.1, 0.15, 0); // More curved
        slantShape.quadraticCurveTo(0, -0.02, -0.15, 0); // Flatter bottom
        
        const slantGeometry = new THREE.ShapeGeometry(slantShape);
        const slantMaterial = new THREE.MeshBasicMaterial({
            color: 0x000000,
            side: THREE.DoubleSide
        });
        
        const slantedEye = new THREE.Mesh(slantGeometry, slantMaterial);
        eyeGroup.add(slantedEye);
        eyeGroup.position.set(xPos, 0.3, 0.95);
        eyeGroup.rotation.x = -0.2;
        
        return eyeGroup;
    }

    // Create Russian ushanka hat
    createUshanka() {
        const hatGroup = new THREE.Group();
        
        // Main hat body
        const hatGeometry = new THREE.SphereGeometry(0.7, 32, 16, 0, Math.PI * 2, 0, Math.PI / 2);
        const hatMaterial = new THREE.MeshStandardMaterial({
            color: 0x654321, // Brown color
            roughness: 0.8
        });
        const hat = new THREE.Mesh(hatGeometry, hatMaterial);
        hat.position.y = 0.7;
        
        // Hat ear flaps
        const flapGeometry = new THREE.BoxGeometry(0.3, 0.4, 0.1);
        const leftFlap = new THREE.Mesh(flapGeometry, hatMaterial);
        leftFlap.position.set(-0.6, 0.4, 0);
        leftFlap.rotation.z = -0.3;
        
        const rightFlap = new THREE.Mesh(flapGeometry, hatMaterial);
        rightFlap.position.set(0.6, 0.4, 0);
        rightFlap.rotation.z = 0.3;
        
        // Soviet star (optional)
        const starGeometry = new THREE.CircleGeometry(0.15, 5);
        const starMaterial = new THREE.MeshBasicMaterial({
            color: 0xff0000,
            side: THREE.DoubleSide
        });
        const star = new THREE.Mesh(starGeometry, starMaterial);
        star.position.set(0, 0.6, 0.65);
        star.rotation.x = -0.2;
        
        hatGroup.add(hat);
        hatGroup.add(leftFlap);
        hatGroup.add(rightFlap);
        hatGroup.add(star);
        
        return hatGroup;
    }

    setupCookingSystem() {
        // Create cooking panel HTML
        const cookingPanel = document.createElement('div');
        cookingPanel.id = 'cookingPanel';
        cookingPanel.style.display = 'none';
        cookingPanel.innerHTML = `
            <div class="cookingHeader">
                <h2>Camping Cookpot</h2>
                <div class="cookingLevel">Cooking Level: <span id="cookingLevel">1</span></div>
                <button id="closeCooking">X</button>
            </div>
            <div class="cookingContent">
                <div class="ingredientsPanel">
                    <h3>Ingredients</h3>
                    <div class="categoryTabs">
                        <button class="categoryTab active" data-category="all">All</button>
                        <button class="categoryTab" data-category="meat">Meat</button>
                        <button class="categoryTab" data-category="vegetables">Veggies</button>
                        <button class="categoryTab" data-category="grains">Grains</button>
                        <button class="categoryTab" data-category="dairy">Dairy</button>
                        <button class="categoryTab" data-category="fruits">Fruits</button>
                        <button class="categoryTab" data-category="spices">Spices</button>
                        <button class="categoryTab" data-category="sauces">Sauces</button>
                        <button class="categoryTab" data-category="other">Other</button>
                    </div>
                    <div id="ingredientsContainer"></div>
                </div>
                <div class="cookingPot">
                    <h3>Cooking Pot</h3>
                    <div class="potVisual">
                        <div class="potImage">🍲</div>
                        <div id="selectedIngredientsContainer"></div>
                    </div>
                    <div class="cookingActions">
                        <button id="stirButton">Stir Pot</button>
                        <button id="cookButton">Cook!</button>
                    </div>
                    <div id="cookingResult"></div>
                </div>
            </div>
            <div id="tastingScreen" style="display: none;">
                <div class="tastingContent">
                    <!-- Content will be dynamically generated -->
                </div>
            </div>
        `;
        
        document.body.appendChild(cookingPanel);
        
        // Create the tasting screen (but don't show it yet)
        const tastingScreen = document.getElementById('tastingScreen');
        
        // Add CSS for cooking panel
        const style = document.createElement('style');
        style.textContent = `
            #cookingPanel {
                position: absolute;
                top: 50%;
                left: 50%;
                transform: translate(-50%, -50%);
                width: 900px;
                height: 600px;
                background-color: rgba(139, 69, 19, 0.95);
                border: 6px solid #654321;
                border-radius: 15px;
                padding: 20px;
                color: white;
                font-family: 'Arial Rounded MT Bold', Arial, sans-serif;
                z-index: 1000;
                box-shadow: 0 0 20px rgba(0,0,0,0.5);
            }
            
            .cookingHeader {
                display: flex;
                justify-content: space-between;
                align-items: center;
                margin-bottom: 20px;
                border-bottom: 2px solid rgba(255,255,255,0.3);
                padding-bottom: 10px;
            }
            
            .cookingHeader h2 {
                margin: 0;
                font-size: 32px;
                text-shadow: 2px 2px 4px rgba(0,0,0,0.5);
            }
            
            .cookingLevel {
                font-size: 18px;
                background-color: #228B22;
                padding: 5px 15px;
                border-radius: 20px;
                box-shadow: inset 0 0 10px rgba(0,0,0,0.3);
            }
            
            #closeCooking {
                background-color: #8B4513;
                color: white;
                border: 2px solid white;
                border-radius: 50%;
                width: 40px;
                height: 40px;
                cursor: pointer;
                font-size: 20px;
                box-shadow: 2px 2px 4px rgba(0,0,0,0.3);
                transition: all 0.2s;
            }
            
            #closeCooking:hover {
                transform: scale(1.1);
                background-color: #A0522D;
            }
            
            .cookingContent {
                display: flex;
                height: 85%;
                gap: 20px;
            }
            
            .ingredientsPanel, .cookingPot {
                flex: 1;
                padding: 15px;
                background-color: rgba(0, 0, 0, 0.2);
                border-radius: 12px;
                box-shadow: inset 0 0 10px rgba(0,0,0,0.3);
                display: flex;
                flex-direction: column;
            }
            
            .categoryTabs {
                display: flex;
                flex-wrap: wrap;
                gap: 5px;
                margin-bottom: 10px;
            }
            
            .categoryTab {
                background-color: #654321;
                color: white;
                border: none;
                border-radius: 15px;
                padding: 5px 10px;
                cursor: pointer;
                font-size: 14px;
                transition: all 0.2s;
            }
            
            .categoryTab:hover {
                background-color: #8B4513;
            }
            
            .categoryTab.active {
                background-color: #228B22;
                font-weight: bold;
            }
            
            #ingredientsContainer {
                overflow-y: auto;
                flex-grow: 1;
                display: grid;
                grid-template-columns: repeat(2, 1fr);
                gap: 10px;
                padding-right: 10px;
                max-height: 400px;
            }
            
            .ingredient {
                display: flex;
                align-items: center;
                background-color: #654321;
                padding: 10px;
                border-radius: 10px;
                cursor: pointer;
                transition: all 0.2s;
                box-shadow: 2px 2px 4px rgba(0,0,0,0.3);
            }
            
            .ingredient:hover {
                background-color: #8B4513;
                transform: translateY(-2px);
            }
            
            .ingredient .icon {
                font-size: 24px;
                margin-right: 10px;
                background-color: rgba(255,255,255,0.2);
                border-radius: 50%;
                width: 40px;
                height: 40px;
                display: flex;
                align-items: center;
                justify-content: center;
            }
            
            .ingredient .details {
                flex-grow: 1;
            }
            
            .ingredient .name {
                font-weight: bold;
                font-size: 16px;
            }
            
            .ingredient .rarity {
                font-size: 12px;
                opacity: 0.8;
            }
            
            .ingredient .quantity {
                background-color: rgba(0,0,0,0.3);
                border-radius: 15px;
                padding: 2px 8px;
                font-size: 14px;
            }
            
            .potVisual {
                flex-grow: 1;
                display: flex;
                flex-direction: column;
                align-items: center;
                justify-content: center;
                position: relative;
            }
            
            .potImage {
                font-size: 100px;
                margin-bottom: 20px;
                filter: drop-shadow(0 0 10px rgba(255,255,255,0.3));
            }
            
            #selectedIngredientsContainer {
                display: flex;
                flex-wrap: wrap;
                justify-content: center;
                gap: 10px;
                max-width: 300px;
            }
            
            .selectedIngredient {
                display: inline-block;
                background-color: #8B4513;
                border-radius: 50%;
                width: 50px;
                height: 50px;
                display: flex;
                align-items: center;
                justify-content: center;
                font-size: 30px;
                box-shadow: 2px 2px 4px rgba(0,0,0,0.3);
                position: relative;
                animation: float 3s infinite ease-in-out;
            }
            
            @keyframes float {
                0%, 100% { transform: translateY(0); }
                50% { transform: translateY(-10px); }
            }
            
            .selectedIngredient:nth-child(odd) {
                animation-delay: 0.5s;
            }
            
            .selectedIngredient:nth-child(3n) {
                animation-delay: 1s;
            }
            
            .cookingActions {
                display: flex;
                gap: 10px;
                margin-top: 20px;
            }
            
            #stirButton, #cookButton {
                flex: 1;
                background-color: #228B22;
                color: white;
                border: none;
                border-radius: 10px;
                padding: 12px 20px;
                cursor: pointer;
                font-size: 18px;
                font-weight: bold;
                box-shadow: 2px 2px 4px rgba(0,0,0,0.3);
                transition: all 0.2s;
            }
            
            #stirButton {
                background-color: #DAA520;
            }
            
            #stirButton:hover {
                background-color: #FFC125;
                transform: scale(1.05);
            }
            
            #cookButton:hover {
                background-color: #32CD32;
                transform: scale(1.05);
            }
            
            #cookingResult {
                text-align: center;
                margin-top: 20px;
                min-height: 100px;
                display: flex;
                flex-direction: column;
                align-items: center;
                justify-content: center;
            }
            
            .resultIcon {
                font-size: 60px;
                margin-bottom: 10px;
                filter: drop-shadow(0 0 10px rgba(255,255,255,0.5));
            }
            
            .resultName {
                font-size: 24px;
                font-weight: bold;
                margin-bottom: 5px;
            }
            
            .resultRating {
                font-size: 28px;
                font-weight: bold;
                color: gold;
                text-shadow: 2px 2px 4px rgba(0,0,0,0.5);
            }
            
            .common { color: #FFFFFF; }
            .uncommon { color: #00FF00; }
            .rare { color: #00BFFF; }
            .legendary { color: #FFD700; }
            
            .stirAnimation {
                animation: stir 1s ease-in-out;
            }
            
            @keyframes stir {
                0%, 100% { transform: rotate(0deg); }
                25% { transform: rotate(15deg); }
                75% { transform: rotate(-15deg); }
            }
            
            /* Tasting screen styles */
            #tastingScreen {
                position: absolute;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                background-color: rgba(0, 0, 0, 0.8);
                z-index: 1001;
                display: flex;
                align-items: center;
                justify-content: center;
            }
            
            .tastingContent {
                width: 80%;
                max-width: 800px;
                background-color: rgba(139, 69, 19, 0.95);
                border: 6px solid #654321;
                border-radius: 15px;
                padding: 30px;
                color: white;
                text-align: center;
                box-shadow: 0 0 30px rgba(255, 215, 0, 0.5);
            }
            
            .dishPresentation {
                margin-bottom: 30px;
            }
            
            #dishIcon {
                font-size: 120px;
                margin-bottom: 20px;
                filter: drop-shadow(0 0 15px rgba(255,255,255,0.7));
                animation: pulse 2s infinite;
            }
            
            @keyframes pulse {
                0% { transform: scale(1); }
                50% { transform: scale(1.1); }
                100% { transform: scale(1); }
            }
            
            #dishName {
                font-size: 36px;
                font-weight: bold;
                margin-bottom: 10px;
                text-shadow: 2px 2px 4px rgba(0,0,0,0.5);
            }
            
            .tastingAnimation {
                margin-bottom: 30px;
            }
            
            .characterEating {
                font-size: 80px;
                margin-bottom: 20px;
                animation: eating 3s forwards;
            }
            
            @keyframes eating {
                0% { transform: scale(1); }
                20% { transform: scale(1.1); content: "😋"; }
                40% { transform: scale(1.2); content: "😮"; }
                60% { transform: scale(1.1); content: "😋"; }
                80% { transform: scale(1.2); content: "😮"; }
                100% { transform: scale(1.1); content: "😋"; }
            }
            
            .tasteReaction {
                font-size: 24px;
                height: 30px;
                margin-bottom: 20px;
            }
            
            .ratingDisplay {
                margin-bottom: 30px;
            }
            
            .stars {
                font-size: 40px;
                margin-bottom: 10px;
            }
            
            .star {
                opacity: 0.3;
                transition: opacity 0.5s;
                filter: drop-shadow(0 0 5px gold);
            }
            
            .star.active {
                opacity: 1;
            }
            
            #ratingText {
                font-size: 32px;
                font-weight: bold;
                color: gold;
                text-shadow: 2px 2px 4px rgba(0,0,0,0.5);
            }
            
            #closeTasting {
                background-color: #228B22;
                color: white;
                border: none;
                border-radius: 10px;
                padding: 15px 30px;
                cursor: pointer;
                font-size: 20px;
                font-weight: bold;
                box-shadow: 2px 2px 4px rgba(0,0,0,0.3);
                transition: all 0.2s;
            }
            
            #closeTasting:hover {
                transform: scale(1.05);
                background-color: #32CD32;
            }
        `;
        document.head.appendChild(style);
        
        // Now add event listeners after the elements are in the DOM
        document.getElementById('closeCooking').addEventListener('click', () => {
            this.toggleCookingPanel(false);
        });
        
        document.getElementById('cookButton').addEventListener('click', () => {
            this.cook();
        });
        
        document.getElementById('stirButton').addEventListener('click', () => {
            this.stirPot();
        });
        
        // Category tabs
        document.querySelectorAll('.categoryTab').forEach(tab => {
            tab.addEventListener('click', (e) => {
                document.querySelectorAll('.categoryTab').forEach(t => t.classList.remove('active'));
                e.target.classList.add('active');
                this.updateIngredientsDisplay(e.target.dataset.category);
            });
        });
        
        // Add 'E' key listener to open cooking panel when near campfire
        document.addEventListener('keydown', (event) => {
            if (event.code === 'KeyE') {
                // Check if player is near campfire
                const distanceToCampfire = new THREE.Vector3(0, 0, 0)
                    .distanceTo(this.camera.position);
                
                if (distanceToCampfire < 5) {
                    this.toggleCookingPanel(true);
                }
            }
        });
    }

    toggleCookingPanel(show) {
        const panel = document.getElementById('cookingPanel');
        if (show) {
            panel.style.display = 'block';
            document.getElementById('cookingLevel').textContent = this.cookingLevel;
            this.updateIngredientsDisplay('all');
            this.updateSelectedIngredientsDisplay();
        } else {
            panel.style.display = 'none';
        }
    }

    updateIngredientsDisplay(category = 'all') {
        const container = document.getElementById('ingredientsContainer');
        container.innerHTML = '';
        
        let ingredientsToShow = [];
        
        if (category === 'all') {
            ingredientsToShow = this.ingredients;
        } else {
            ingredientsToShow = this.ingredientCategories[category] || [];
        }
        
        ingredientsToShow.forEach(ingredient => {
            const inventoryItem = this.inventory.find(item => item.id === ingredient.id);
            if (inventoryItem && inventoryItem.quantity > 0) {
                const ingredientEl = document.createElement('div');
                ingredientEl.className = 'ingredient';
                ingredientEl.innerHTML = `
                    <div class="icon">${ingredient.icon}</div>
                    <div class="details">
                        <div class="name">${ingredient.name}</div>
                        <div class="rarity ${ingredient.rarity}">${ingredient.rarity}</div>
                    </div>
                    <div class="quantity">x${inventoryItem.quantity}</div>
                `;
                
                ingredientEl.addEventListener('click', () => {
                    this.addIngredientToPot(ingredient.id);
                });
                
                container.appendChild(ingredientEl);
            }
        });
    }

    addIngredientToPot(ingredientId) {
        // Find the ingredient in inventory
        const inventoryItem = this.inventory.find(item => item.id === ingredientId);
        
        if (inventoryItem && inventoryItem.quantity > 0) {
            // Limit to 5 ingredients max
            if (this.selectedIngredients.length >= 5) {
                alert("Your pot is full! (Maximum 5 ingredients)");
                return;
            }
            
            // Add to selected ingredients
            this.selectedIngredients.push(ingredientId);
            
            // Reduce quantity in inventory
            inventoryItem.quantity--;
            
            // Update displays
            this.updateIngredientsDisplay(document.querySelector('.categoryTab.active').dataset.category);
            this.updateSelectedIngredientsDisplay();
        }
    }

    updateSelectedIngredientsDisplay() {
        const container = document.getElementById('selectedIngredientsContainer');
        container.innerHTML = '';
        
        this.selectedIngredients.forEach(ingredientId => {
            const ingredient = this.ingredients.find(i => i.id === ingredientId);
            const ingredientEl = document.createElement('div');
            ingredientEl.className = 'selectedIngredient';
            ingredientEl.textContent = ingredient.icon;
            
            // Random position offset for visual interest
            const randomDelay = Math.random() * 2;
            ingredientEl.style.animationDelay = `${randomDelay}s`;
            
            container.appendChild(ingredientEl);
        });
    }

    stirPot() {
        if (this.selectedIngredients.length === 0) {
            return;
        }
        
        const potImage = document.querySelector('.potImage');
        potImage.classList.add('stirAnimation');
        
        // Shuffle the ingredients for visual effect
        const container = document.getElementById('selectedIngredientsContainer');
        Array.from(container.children).forEach(child => {
            child.style.transform = `translate(${Math.random() * 20 - 10}px, ${Math.random() * 20 - 10}px)`;
        });
        
        setTimeout(() => {
            potImage.classList.remove('stirAnimation');
            this.updateSelectedIngredientsDisplay();
        }, 1000);
    }

    cook() {
        if (this.selectedIngredients.length === 0) {
            return;
        }
        
        // Sort ingredients to match recipe format
        const sortedIngredients = [...this.selectedIngredients].sort();
        
        // Find matching recipe
        const matchingRecipe = this.recipes.find(recipe => {
            const sortedRecipeIngredients = [...recipe.ingredients].sort();
            
            if (sortedIngredients.length !== sortedRecipeIngredients.length) {
                return false;
            }
            
            return sortedIngredients.every((ingredient, index) => 
                ingredient === sortedRecipeIngredients[index]);
        });
        
        // Calculate cooking quality based on ingredients and cooking level
        let quality = '';
        let experienceGain = 0;
        let starRating = 0;
        let dishName = '';
        let dishIcon = '';
        let cuisineType = '';
        
        if (matchingRecipe) {
            quality = matchingRecipe.rating;
            dishName = matchingRecipe.result;
            dishIcon = matchingRecipe.icon;
            
            // Determine cuisine type based on ingredients or recipe name
            if (dishName.includes('Sushi') || dishName.includes('Sashimi') || dishName.includes('Tamago')) {
                cuisineType = 'Japanese';
            } else if (dishName.includes('Curry')) {
                cuisineType = 'Indian';
            } else if (dishName.includes('Pasta') || dishName.includes('Pizza')) {
                cuisineType = 'Italian';
            } else if (dishName.includes('Taco') || dishName.includes('Burrito')) {
                cuisineType = 'Mexican';
            } else {
                cuisineType = 'International';
            }
            
            // Award experience and determine star rating based on recipe quality
            if (quality === 'Charizard Class') {
                experienceGain = 50;
                starRating = 5;
            } else if (quality === 'Great!') {
                experienceGain = 30;
                starRating = 4;
            } else if (quality === 'Good!') {
                experienceGain = 15;
                starRating = 3;
            } else {
                experienceGain = 10;
                starRating = 2;
            }
        } else {
            // Calculate a quality based on ingredient rarity and count
            let rarityScore = 0;
            this.selectedIngredients.forEach(id => {
                const ingredient = this.ingredients.find(i => i.id === id);
                switch(ingredient.rarity) {
                    case 'common': rarityScore += 1; break;
                    case 'uncommon': rarityScore += 2; break;
                    case 'rare': rarityScore += 3; break;
                    case 'legendary': rarityScore += 5; break;
                }
            });
            
            dishName = 'Mystery Dish';
            dishIcon = '🍲';
            cuisineType = 'Experimental';
            
            if (rarityScore >= 10) {
                quality = 'Good!';
                experienceGain = 10;
                starRating = 3;
            } else if (rarityScore >= 5) {
                quality = 'Not Bad!';
                experienceGain = 5;
                starRating = 2;
            } else {
                quality = 'Meh...';
                experienceGain = 2;
                starRating = 1;
            }
        }
        
        // Add cooking experience
        this.cookingExperience += experienceGain;
        
        // Level up if enough experience
        if (this.cookingExperience >= this.cookingLevel * 100) {
            this.cookingLevel++;
            document.getElementById('cookingLevel').textContent = this.cookingLevel;
        }
        
        // Reset selected ingredients
        this.selectedIngredients = [];
        this.updateSelectedIngredientsDisplay();
        
        // Show the tasting screen
        const tastingScreen = document.getElementById('tastingScreen');
        tastingScreen.style.display = 'flex';
        
        // Start the animation sequence with the dish presentation
        this.animateDishPresentation(dishName, dishIcon, quality, starRating, cuisineType);

        // Add this to the cook() method, right after calculating the quality
        let experiencePoints = 0;

        // Calculate experience points based on dish quality
        if (quality === 'Charizard Class') {
            experiencePoints = 50;
        } else if (quality === 'Great!') {
            experiencePoints = 30;
        } else if (quality === 'Good!') {
            experiencePoints = 15;
        } else {
            experiencePoints = 5;
        }

        // Apply cooking level multiplier (higher levels get more experience)
        const levelMultiplier = 1 + (this.cookingLevel * 0.1);
        experiencePoints = Math.round(experiencePoints * levelMultiplier);

        // Add cooking experience
        this.cookingExperience += experiencePoints;

        // Check for level up
        const oldLevel = this.cookingLevel;
        const expNeeded = this.cookingLevel * 100;

        if (this.cookingExperience >= expNeeded) {
            this.cookingLevel++;
            this.cookingExperience -= expNeeded;
            
            // Update level display
            document.getElementById('cookingLevel').textContent = this.cookingLevel;
            
            // Store level up info to show in the animation
            this.justLeveledUp = true;
        } else {
            this.justLeveledUp = false;
        }

        // Store experience info for the animation
        this.lastExpGained = experiencePoints;
        this.expNeeded = this.cookingLevel * 100;
        this.expPercentage = (this.cookingExperience / this.expNeeded) * 100;
    }

    showTastingAnimation(dishName, dishIcon, quality, starRating, cuisineType) {
        const tastingScreen = document.getElementById('tastingScreen');
        const dishIconEl = document.getElementById('dishIcon');
        const dishNameEl = document.getElementById('dishName');
        const ratingTextEl = document.getElementById('ratingText');
        const tasteReactionEl = document.querySelector('.tasteReaction');
        const stars = document.querySelectorAll('.star');
        
        // Set dish details
        dishIconEl.textContent = dishIcon;
        dishNameEl.textContent = dishName;
        
        // Reset stars
        stars.forEach(star => star.classList.remove('active'));
        
        // Show tasting screen
        tastingScreen.style.display = 'flex';
        
        // Create the animation sequence
        this.animateDishPresentation(dishName, dishIcon, quality, starRating, cuisineType);
    }

    // New method for the dish presentation and tasting animation sequence
    animateDishPresentation(dishName, dishIcon, quality, starRating, cuisineType) {
        const tastingContent = document.querySelector('.tastingContent');
        
        // Clear previous content
        tastingContent.innerHTML = `
            <div class="presentationStage">
                <div class="dishPresentation">
                    <div id="dishIcon">${dishIcon}</div>
                    <div id="dishName">${dishName}</div>
                </div>
                <button id="nextStage">Serve Dish</button>
            </div>
        `;
        
        // Add event listener for next stage button
        document.getElementById('nextStage').addEventListener('click', () => {
            this.animateCountryballsGathering(dishName, dishIcon, quality, starRating, cuisineType);
        });
        
        // Add CSS for the presentation stage
        const style = document.createElement('style');
        style.textContent = `
            .presentationStage {
                text-align: center;
            }
            
            .dishPresentation {
                margin-bottom: 30px;
            }
            
            #dishIcon {
                font-size: 120px;
                margin-bottom: 20px;
                filter: drop-shadow(0 0 15px rgba(255,255,255,0.7));
                animation: float 3s infinite ease-in-out;
            }
            
            #dishName {
                font-size: 36px;
                font-weight: bold;
                margin-bottom: 10px;
                text-shadow: 2px 2px 4px rgba(0,0,0,0.5);
            }
            
            .cuisineType {
                font-size: 24px;
                color: #FFD700;
                margin-bottom: 20px;
            }
            
            #nextStage {
                background-color: #228B22;
                color: white;
                border: none;
                border-radius: 10px;
                padding: 15px 30px;
                cursor: pointer;
                font-size: 20px;
                font-weight: bold;
                box-shadow: 2px 2px 4px rgba(0,0,0,0.3);
                transition: all 0.2s;
            }
            
            #nextStage:hover {
                transform: scale(1.05);
                background-color: #32CD32;
            }
            
            .countryballsGathering {
                display: flex;
                justify-content: center;
                margin: 30px 0;
                position: relative;
                height: 150px;
            }
            
            .countryball {
                width: 80px;
                height: 80px;
                border-radius: 50%;
                background-size: cover;
                position: absolute;
                bottom: 0;
                transform: scale(0);
                box-shadow: 2px 2px 10px rgba(0,0,0,0.3);
                animation: popIn 0.5s forwards;
            }
            
            @keyframes popIn {
                0% { transform: scale(0); }
                70% { transform: scale(1.1); }
                100% { transform: scale(1); }
            }
            
            .countryball.eating {
                animation: eating 1s infinite;
            }
            
            @keyframes eating {
                0%, 100% { transform: translateY(0); }
                50% { transform: translateY(-10px); }
            }
            
            .reactionBubbles {
                display: flex;
                justify-content: space-around;
                margin-top: 20px;
            }
            
            .reactionBubble {
                background-color: white;
                color: black;
                padding: 10px 15px;
                border-radius: 20px;
                font-weight: bold;
                position: relative;
                opacity: 0;
                transform: translateY(20px);
                animation: bubbleAppear 0.5s forwards;
            }
            
            .reactionBubble:after {
                content: '';
                position: absolute;
                bottom: -10px;
                left: 50%;
                transform: translateX(-50%);
                border-width: 10px 10px 0;
                border-style: solid;
                border-color: white transparent transparent;
            }
            
            @keyframes bubbleAppear {
                to { opacity: 1; transform: translateY(0); }
            }
        `;
        document.head.appendChild(style);
    }

    // Update the animateCountryballsGathering method to include all countryballs
    animateCountryballsGathering(dishName, dishIcon, quality, starRating, cuisineType) {
        const tastingContent = document.querySelector('.tastingContent');
        
        // Update content for the gathering stage
        tastingContent.innerHTML = `
            <div class="gatheringStage">
                <div class="dishServed">
                    <div id="dishIcon">${dishIcon}</div>
                    <div id="dishName">${dishName}</div>
                </div>
                <div class="countryballsGathering">
                    <!-- Countryballs will be added here dynamically -->
                </div>
                <div class="reactionBubbles">
                    <!-- Reaction bubbles will be added here dynamically -->
                </div>
                <button id="nextStage">See Rating</button>
            </div>
        `;
        
        // Add countryballs to the gathering
        const countryballsContainer = document.querySelector('.countryballsGathering');
        const reactionBubblesContainer = document.querySelector('.reactionBubbles');
        
        // Define positions for the countryballs in a semi-circle
        const positions = [
            { left: '5%', bottom: '0px', delay: 0 },
            { left: '15%', bottom: '20px', delay: 0.2 },
            { left: '25%', bottom: '30px', delay: 0.4 },
            { left: '35%', bottom: '40px', delay: 0.6 },
            { left: '45%', bottom: '45px', delay: 0.8 },
            { left: '55%', bottom: '45px', delay: 1.0 },
            { left: '65%', bottom: '40px', delay: 1.2 },
            { left: '75%', bottom: '30px', delay: 1.4 },
            { left: '85%', bottom: '20px', delay: 1.6 }
        ];
        
        // Define possible reactions based on star rating
        const positiveReactions = ["Yummy!", "Delicious!", "Amazing!", "So good!", "Wow!", "Tasty!", "Perfect!", "Excellent!", "Superb!"];
        const neutralReactions = ["Not bad", "Okay", "Decent", "Hmm...", "Interesting", "Edible", "Fine", "Acceptable"];
        const negativeReactions = ["Meh...", "Bland", "Needs work", "Ugh", "Disappointing", "Mediocre", "Could be better"];
        
        // Add all countryballs and their reactions
        const countries = ['us', 'gb', 'de', 'fr', 'jp', 'cn', 'ca', 'kr', 'ru'];
        countries.forEach((country, index) => {
            // Create countryball
            const countryball = document.createElement('div');
            countryball.className = 'countryball';
            countryball.style.backgroundImage = `url(https://flagcdn.com/w160/${country}.png)`;
            countryball.style.left = positions[index].left;
            countryball.style.bottom = positions[index].bottom;
            countryball.style.animationDelay = `${positions[index].delay}s`;
            
            // Add country-specific styles
            switch(country) {
                case 'us':
                    countryball.style.backgroundSize = '120% 120%';
                    countryball.style.backgroundPosition = 'center';
                    break;
                case 'jp':
                    // For Japan, use a white ball with red circle
                    countryball.style.backgroundColor = 'white';
                    countryball.style.backgroundImage = 'none';
                    countryball.innerHTML = '<div style="width: 40%; height: 40%; background-color: #d30000; border-radius: 50%; position: absolute; top: 30%; left: 30%;"></div>';
                    break;
                case 'cn':
                    // For China, add squinty eyes
                    countryball.innerHTML = '<div style="position: absolute; top: 30%; left: 20%; width: 20%; height: 5%; background-color: black; transform: rotate(20deg);"></div>' +
                                           '<div style="position: absolute; top: 30%; right: 20%; width: 20%; height: 5%; background-color: black; transform: rotate(-20deg);"></div>';
                    break;
                case 'kr':
                    // For Korea, ensure the flag is properly positioned
                    countryball.style.backgroundSize = '120% 120%';
                    countryball.style.backgroundPosition = 'center';
                    break;
                case 'ru':
                    // For Russia, add a ushanka hat
                    countryball.innerHTML = '<div style="position: absolute; top: -30%; left: 10%; width: 80%; height: 40%; background-color: #8B4513; border-radius: 50% 50% 0 0;"></div>' +
                                           '<div style="position: absolute; top: -15%; left: 0%; width: 30%; height: 30%; background-color: #8B4513; border-radius: 50%;"></div>' +
                                           '<div style="position: absolute; top: -15%; right: 0%; width: 30%; height: 30%; background-color: #8B4513; border-radius: 50%;"></div>' +
                                           '<div style="position: absolute; top: -25%; left: 40%; width: 20%; height: 20%; background-color: #FF0000; clip-path: polygon(50% 0%, 100% 38%, 82% 100%, 18% 100%, 0% 38%);"></div>';
                    break;
                case 'it':
                    // For Italy, add Italian flag elements
                    countryball.innerHTML = '<div style="position: absolute; top: -30%; left: 10%; width: 80%; height: 40%; background-color: #007A33; border-radius: 50% 50% 0 0;"></div>' +
                                            '<div style="position: absolute; top: -15%; left: 0%; width: 30%; height: 30%; background-color: #007A33; border-radius: 50%;"></div>' +
                                            '<div style="position: absolute; top: -15%; right: 0%; width: 30%; height: 30%; background-color: #007A33; border-radius: 50%;"></div>' +
                                            '<div style="position: absolute; top: -25%; left: 40%; width: 20%; height: 20%; background-color: #FFFFFF; clip-path: polygon(50% 0%, 100% 38%, 82% 100%, 18% 100%, 0% 38%);"></div>';
                    break;
            }
            
            countryballsContainer.appendChild(countryball);
            
            // Create reaction bubble with country flag indicator
            const reactionBubble = document.createElement('div');
            reactionBubble.className = 'reactionBubble';
            
            // Set reaction text based on star rating and country personality
            let reactionText = '';
            if (starRating >= 4) {
                reactionText = positiveReactions[Math.floor(Math.random() * positiveReactions.length)];
                
                // Country-specific positive reactions
                switch(country) {
                    case 'us': reactionText = "Freedom tastes amazing!"; break;
                    case 'gb': reactionText = "Quite splendid, indeed!"; break;
                    case 'de': reactionText = "Sehr gut!"; break;
                    case 'fr': reactionText = "Magnifique!"; break;
                    case 'jp': reactionText = "Oishi desu!"; break;
                    case 'cn': reactionText = "Very good quality!"; break;
                    case 'ca': reactionText = "Sorry, it's too delicious!"; break;
                    case 'kr': reactionText = "Daebak!"; break;
                    case 'ru': reactionText = "Better than vodka!"; break;
                    case 'it': reactionText = "Mamma mia!"; break;
                }
            } else if (starRating >= 2) {
                reactionText = neutralReactions[Math.floor(Math.random() * neutralReactions.length)];
                
                // Country-specific neutral reactions
                switch(country) {
                    case 'us': reactionText = "Not bad, pardner!"; break;
                    case 'gb': reactionText = "Acceptable, I suppose."; break;
                    case 'de': reactionText = "Es ist in Ordnung."; break;
                    case 'fr': reactionText = "C'est passable."; break;
                    case 'jp': reactionText = "Maa maa desu."; break;
                    case 'cn': reactionText = "Adequate quality."; break;
                    case 'ca': reactionText = "Sorry, it's just okay."; break;
                    case 'kr': reactionText = "Gwenchanayo."; break;
                    case 'ru': reactionText = "Not as good as babushka's."; break;
                    case 'it': reactionText = "Non troppo, grazie."; break;
                }
            } else {
                reactionText = negativeReactions[Math.floor(Math.random() * negativeReactions.length)];
                
                // Country-specific negative reactions
                switch(country) {
                    case 'us': reactionText = "This ain't it, chief!"; break;
                    case 'gb': reactionText = "Rather disappointing."; break;
                    case 'de': reactionText = "Nicht gut!"; break;
                    case 'fr': reactionText = "Terrible!"; break;
                    case 'jp': reactionText = "Mazui desu..."; break;
                    case 'cn': reactionText = "Poor quality!"; break;
                    case 'ca': reactionText = "Sorry, but this is bad."; break;
                    case 'kr': reactionText = "Aniyo..."; break;
                    case 'ru': reactionText = "Blyat! Is terrible!"; break;
                    case 'it': reactionText = "Non troppo, per favore."; break;
                }
            }
            
            // Add small flag icon to the reaction bubble
            reactionBubble.innerHTML = `
                <img src="https://flagcdn.com/16x12/${country}.png" style="margin-right: 5px; vertical-align: middle;">
                ${reactionText}
            `;
            
            reactionBubble.style.left = positions[index].left;
            reactionBubble.style.animationDelay = `${positions[index].delay + 1}s`;
            reactionBubblesContainer.appendChild(reactionBubble);
            
            // Start eating animation after a delay
            setTimeout(() => {
                countryball.classList.add('eating');
            }, (positions[index].delay + 0.5) * 1000);
        });
        
        // Add event listener for next stage button
        document.getElementById('nextStage').addEventListener('click', () => {
            this.animateRatingReveal(dishName, dishIcon, quality, starRating, cuisineType);
        });
        
        // Add CSS for improved gathering stage
        const style = document.createElement('style');
        style.textContent = `
            .gatheringStage {
                text-align: center;
                padding: 20px;
            }
            
            .dishServed {
                margin-bottom: 30px;
            }
            
            .countryballsGathering {
                display: flex;
                justify-content: center;
                margin: 30px 0;
                position: relative;
                height: 200px;
            }
            
            .countryball {
                width: 80px;
                height: 80px;
                border-radius: 50%;
                background-size: cover;
                position: absolute;
                transform: scale(0);
                box-shadow: 2px 2px 10px rgba(0,0,0,0.3);
                animation: popIn 0.5s forwards;
                z-index: 10;
            }
            
            .countryball:before {
                content: '';
                position: absolute;
                bottom: -5px;
                left: 50%;
                transform: translateX(-50%);
                width: 70%;
                height: 10px;
                background: radial-gradient(ellipse at center, rgba(0,0,0,0.3) 0%, rgba(0,0,0,0) 70%);
                border-radius: 50%;
            }
            
            @keyframes popIn {
                0% { transform: scale(0) translateY(50px); }
                70% { transform: scale(1.1) translateY(-10px); }
                100% { transform: scale(1) translateY(0); }
            }
            
            .countryball.eating {
                animation: eating 1s infinite;
            }
            
            @keyframes eating {
                0%, 100% { transform: translateY(0) rotate(0deg); }
                25% { transform: translateY(-10px) rotate(-5deg); }
                75% { transform: translateY(-5px) rotate(5deg); }
            }
            
            .reactionBubbles {
                display: flex;
                position: relative;
                height: 100px;
                margin-top: 20px;
            }
            
            .reactionBubble {
                background-color: white;
                color: black;
                padding: 10px 15px;
                border-radius: 20px;
                font-weight: bold;
                position: absolute;
                opacity: 0;
                transform: translateY(20px);
                animation: bubbleAppear 0.5s forwards;
                box-shadow: 0 2px 5px rgba(0,0,0,0.2);
                min-width: 100px;
                text-align: center;
            }
            
            .reactionBubble:after {
                content: '';
                position: absolute;
                bottom: -10px;
                left: 50%;
                transform: translateX(-50%);
                border-width: 10px 10px 0;
                border-style: solid;
                border-color: white transparent transparent;
            }
            
            @keyframes bubbleAppear {
                0% { opacity: 0; transform: translateY(20px); }
                70% { opacity: 1; transform: translateY(-5px); }
                100% { opacity: 1; transform: translateY(0); }
            }
            
            #nextStage {
                margin-top: 20px;
            }
        `;
        document.head.appendChild(style);
    }

    // New method for the rating reveal animation
    animateRatingReveal(dishName, dishIcon, quality, starRating, cuisineType) {
        const tastingContent = document.querySelector('.tastingContent');
        
        // Update content for the rating stage
        tastingContent.innerHTML = `
            <div class="ratingStage">
                <div class="dishResult">
                    <div id="dishIcon">${dishIcon}</div>
                    <div id="dishName">${dishName}</div>
                </div>
                <div class="ratingDisplay">
                    <div class="stars">
                        <span class="star">⭐</span>
                        <span class="star">⭐</span>
                        <span class="star">⭐</span>
                        <span class="star">⭐</span>
                        <span class="star">⭐</span>
                    </div>
                    <div id="ratingText"></div>
                </div>
                <div class="experienceGained">
                    <div class="expText">Cooking Experience: +${this.lastExpGained} points</div>
                    <div class="cookingLevelDisplay">Level ${this.cookingLevel}</div>
                    <div class="expBar">
                        <div class="expFill" style="width: 0%"></div>
                    </div>
                    <div class="expNumbers">${this.cookingExperience}/${this.expNeeded}</div>
                    ${this.justLeveledUp ? '<div class="levelUpMessage">Level Up!</div>' : ''}
                </div>
                <div class="cookingBenefits">
                    <h3>Cooking Level Benefits:</h3>
                    <ul>
                        <li>Level 2: 10% more experience from cooking</li>
                        <li>Level 3: Occasional bonus ingredients</li>
                        <li>Level 5: 10% chance for dish quality upgrade</li>
                        <li>Level 7: Reduced ingredient usage</li>
                        <li>Level 10: Master Chef - can create secret recipes</li>
                    </ul>
                </div>
                <button id="closeTasting">Continue</button>
            </div>
        `;
        
        // Add event listener for close button
        document.getElementById('closeTasting').addEventListener('click', () => {
            document.getElementById('tastingScreen').style.display = 'none';
        });
        
        // Get star elements
        const stars = document.querySelectorAll('.star');
        const ratingTextEl = document.getElementById('ratingText');
        
        // Reset stars
        stars.forEach(star => star.classList.remove('active'));
        
        // Activate stars one by one with delay
        for (let i = 0; i < starRating; i++) {
            setTimeout(() => {
                stars[i].classList.add('active');
                // Play star sound
                const starSound = new Audio('https://assets.mixkit.co/sfx/preview/mixkit-arcade-game-jump-coin-216.mp3');
                starSound.volume = 0.3;
                starSound.play();
            }, i * 500);
        }
        
        // Show final rating with delay
        setTimeout(() => {
            ratingTextEl.textContent = quality;
            ratingTextEl.style.animation = 'pulse 1s infinite';
            
            // Play final rating sound
            const ratingSound = new Audio('https://assets.mixkit.co/sfx/preview/mixkit-achievement-bell-600.mp3');
            ratingSound.volume = 0.5;
            ratingSound.play();
            
            // Animate experience bar
            const expFill = document.querySelector('.expFill');
            expFill.style.width = `${this.expPercentage}%`;
            
            // If leveled up, add special animation
            if (this.justLeveledUp) {
                const levelUpMessage = document.querySelector('.levelUpMessage');
                levelUpMessage.style.animation = 'pulse 1s infinite';
                
                // Play level up sound
                const levelUpSound = new Audio('https://assets.mixkit.co/sfx/preview/mixkit-magical-tune-achievement-260.mp3');
                levelUpSound.volume = 0.5;
                levelUpSound.play();
            }
        }, starRating * 500 + 500);
        
        // Add CSS for the rating stage
        const style = document.createElement('style');
        style.textContent = `
            .ratingStage {
                text-align: center;
            }
            
            .dishResult {
                margin-bottom: 20px;
            }
            
            .ratingDisplay {
                margin-bottom: 30px;
            }
            
            .stars {
                font-size: 40px;
                margin-bottom: 10px;
            }
            
            .star {
                opacity: 0.3;
                transition: opacity 0.5s;
                filter: drop-shadow(0 0 5px gold);
                margin: 0 5px;
            }
            
            .star.active {
                opacity: 1;
            }
            
            #ratingText {
                font-size: 32px;
                font-weight: bold;
                color: gold;
                text-shadow: 2px 2px 4px rgba(0,0,0,0.5);
                height: 40px;
            }
            
            .experienceGained {
                margin-bottom: 30px;
            }
            
            .expText {
                font-size: 20px;
                margin-bottom: 10px;
            }
            
            .cookingLevelDisplay {
                font-size: 24px;
                font-weight: bold;
                margin: 10px 0;
                color: #4CAF50;
            }
            
            .expNumbers {
                font-size: 14px;
                margin-top: 5px;
                color: #666;
            }
            
            .levelUpMessage {
                font-size: 28px;
                font-weight: bold;
                margin: 10px 0;
                color: #4CAF50;
            }
            
            .expBar {
                width: 80%;
                height: 20px;
                background-color: rgba(0,0,0,0.3);
                border-radius: 10px;
                margin: 0 auto;
                overflow: hidden;
            }
            
            .expFill {
                height: 100%;
                width: 0;
                background: linear-gradient(90deg, #32CD32, #ADFF2F);
                transition: width 2s ease-in-out;
            }
            
            @keyframes pulse {
                0%, 100% { transform: scale(1); }
                50% { transform: scale(1.1); }
            }
        `;
        document.head.appendChild(style);
    }

    // Add this method to the CountryballGame class
    createTruffleSpot() {
        // Create a small mound where truffles can be found
        const truffleMoundGeometry = new THREE.SphereGeometry(0.5, 16, 16);
        truffleMoundGeometry.scale(1, 0.3, 1);
        const truffleMoundMaterial = new THREE.MeshStandardMaterial({ 
            color: 0x5D4037, // Brown color
            roughness: 0.9
        });
        
        const truffleMound = new THREE.Mesh(truffleMoundGeometry, truffleMoundMaterial);
        
        // Position the truffle mound in a hidden spot in the forest
        truffleMound.position.set(15, 0.15, 15);
        this.scene.add(truffleMound);
        
        // Add a small sign nearby
        const signGeometry = new THREE.BoxGeometry(0.5, 0.8, 0.05);
        const signMaterial = new THREE.MeshStandardMaterial({ color: 0x8D6E63 });
        const sign = new THREE.Mesh(signGeometry, signMaterial);
        sign.position.set(15.5, 0.4, 15.5);
        sign.rotation.y = Math.PI / 4;
        this.scene.add(sign);
        
        // Make the truffle mound interactive
        truffleMound.userData = {
            type: 'truffle',
            interactable: true,
            message: "You found a rare truffle! It's been added to your ingredients.",
            action: () => {
                // Find truffle in inventory
                const truffleItem = this.inventory.find(item => item.id === 'truffle');
                if (truffleItem) {
                    truffleItem.quantity += 1;
                    this.showMessage("You found a rare truffle! It's been added to your ingredients.");
                    
                    // Play a special sound for finding a legendary ingredient
                    const truffleSound = new Audio('https://assets.mixkit.co/sfx/preview/mixkit-magical-coin-win-1936.mp3');
                    truffleSound.volume = 0.5;
                    truffleSound.play();
                }
            }
        };
        
        // Add to interactable objects
        this.interactableObjects.push(truffleMound);
    }

    // Add method to complete cooking quests
    completeCookingQuest(object) {
        const textEl = document.getElementById('dialogueText');
        const optionsEl = document.getElementById('dialogueOptions');
        
        // Check if player has the required dish
        const requiredDish = object.userData.quest.requiredDish;
        const cookingResult = document.getElementById('cookingResult');
        
        if (cookingResult && cookingResult.textContent.includes(requiredDish)) {
            // Quest completed
            textEl.textContent = object.userData.quest.completion;
            
            // Give reward
            const reward = object.userData.quest.reward;
            const rewardItem = this.inventory.find(item => item.id === reward.id);
            if (rewardItem) {
                rewardItem.quantity += reward.quantity;
            }
            
            // Reset quest
            object.userData.quest.active = false;
            
            // Clear cooking result
            cookingResult.textContent = '';
            
            // Update options
            optionsEl.innerHTML = '';
            const thankOption = document.createElement('button');
            thankOption.className = 'dialogueOption';
            thankOption.textContent = "You're welcome!";
            thankOption.addEventListener('click', () => {
                this.hideDialogue();
            });
            optionsEl.appendChild(thankOption);
            
            // Play reward sound
            const rewardSound = new Audio('https://assets.mixkit.co/sfx/preview/mixkit-winning-chimes-2015.mp3');
            rewardSound.volume = 0.5;
            rewardSound.play();
        } else {
            // Player doesn't have the dish
            textEl.textContent = `I don't see any ${requiredDish}. Please cook it first!`;
            
            // Update options
            optionsEl.innerHTML = '';
            const okOption = document.createElement('button');
            okOption.className = 'dialogueOption';
            okOption.textContent = "I'll go make it";
            okOption.addEventListener('click', () => {
                this.hideDialogue();
            });
            optionsEl.appendChild(okOption);
        }
    }

    // Add this to the constructor after setting up the dialogue system
    setupInteractionSystem() {
        // Set up raycaster for interactions
        this.raycaster = new THREE.Raycaster();
        this.mouse = new THREE.Vector2();
        
        // Add click event listener
        window.addEventListener('click', (event) => {
            // Calculate mouse position in normalized device coordinates
            this.mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
            this.mouse.y = - (event.clientY / window.innerHeight) * 2 + 1;
            
            // Update the raycaster
            this.raycaster.setFromCamera(this.mouse, this.camera);
            
            // Check for intersections with interactable objects
            const intersects = this.raycaster.intersectObjects(this.interactableObjects, true);
            
            if (intersects.length > 0) {
                // Find the first interactable object
                let interactableObject = null;
                
                for (let i = 0; i < intersects.length; i++) {
                    // Get the object or its parent if it's part of a group
                    let object = intersects[i].object;
                    
                    // If the object is part of a group, get the group
                    while (object.parent && !object.userData.interactable) {
                        object = object.parent;
                    }
                    
                    if (object.userData.interactable) {
                        interactableObject = object;
                        break;
                    }
                }
                
                if (interactableObject) {
                    // Handle interaction based on object type
                    if (interactableObject.userData.type === 'countryball') {
                        this.showDialogue(interactableObject);
                        interactableObject.userData.interacting = true;
                    } else if (interactableObject.userData.type === 'truffle') {
                        interactableObject.userData.action();
                    }
                }
            }
        });
    }

    // Add this method to your CountryballGame class
    testDialogue() {
        console.log("Testing dialogue system");
        
        const panel = document.getElementById('dialoguePanel');
        const nameEl = document.getElementById('dialogueName');
        const textEl = document.getElementById('dialogueText');
        const optionsEl = document.getElementById('dialogueOptions');
        
        // Set test values
        nameEl.textContent = "Test Countryball";
        textEl.textContent = "This is a test dialogue message!";
        
        // Clear and add a test option
        optionsEl.innerHTML = '';
        const testOption = document.createElement('button');
        testOption.className = 'dialogueOption';
        testOption.textContent = "Test Response";
        testOption.addEventListener('click', () => {
            panel.style.display = 'none';
        });
        optionsEl.appendChild(testOption);
        
        // Show panel
        panel.style.display = 'block';
    }

    // Add this method to show messages to the player
    showMessage(message) {
        // Check if message container exists, create if not
        let messageContainer = document.getElementById('messageContainer');
        
        if (!messageContainer) {
            messageContainer = document.createElement('div');
            messageContainer.id = 'messageContainer';
            messageContainer.style.position = 'fixed';
            messageContainer.style.top = '100px';
            messageContainer.style.left = '50%';
            messageContainer.style.transform = 'translateX(-50%)';
            messageContainer.style.backgroundColor = 'rgba(0, 0, 0, 0.7)';
            messageContainer.style.color = 'white';
            messageContainer.style.padding = '10px 20px';
            messageContainer.style.borderRadius = '5px';
            messageContainer.style.zIndex = '1000';
            messageContainer.style.fontFamily = 'Arial, sans-serif';
            messageContainer.style.fontSize = '18px';
            messageContainer.style.textAlign = 'center';
            document.body.appendChild(messageContainer);
        }
        
        // Set message
        messageContainer.textContent = message;
        messageContainer.style.display = 'block';
        
        // Hide after 3 seconds
        setTimeout(() => {
            messageContainer.style.display = 'none';
        }, 3000);
    }

    // Add Italy to the food rating system
    updateCountryballReaction(country, starRating) {
        let reactionText = "";
        
        if (starRating >= 4) {
            // Excellent reactions
            switch(country) {
                case 'us': reactionText = "FREEDOM TASTES GOOD!"; break;
                case 'gb': reactionText = "Absolutely smashing!"; break;
                case 'de': reactionText = "Wunderbar!"; break;
                case 'fr': reactionText = "Magnifique!"; break;
                case 'jp': reactionText = "Oishii desu!"; break;
                case 'cn': reactionText = "Hǎochī!"; break;
                case 'ca': reactionText = "Sorry, but this is amazing!"; break;
                case 'kr': reactionText = "Daebak!"; break;
                case 'ru': reactionText = "Better than vodka!"; break;
                case 'it': reactionText = "Mamma mia! Bellissimo!"; break;
            }
        } else if (starRating >= 2) {
            // Good reactions
            switch(country) {
                case 'us': reactionText = "Not bad, partner!"; break;
                case 'gb': reactionText = "Quite decent."; break;
                case 'de': reactionText = "Acceptable."; break;
                case 'fr': reactionText = "Pas mal."; break;
                case 'jp': reactionText = "Maa maa desu."; break;
                case 'cn': reactionText = "Hái kěyǐ."; break;
                case 'ca': reactionText = "Pretty good, eh?"; break;
                case 'kr': reactionText = "Gwenchanayo."; break;
                case 'ru': reactionText = "Not as good as babushka's."; break;
                case 'it': reactionText = "Non male, grazie."; break;
            }
        } else {
            // Bad reactions
            switch(country) {
                case 'us': reactionText = "This ain't freedom food!"; break;
                case 'gb': reactionText = "Rather dreadful."; break;
                case 'de': reactionText = "Nicht gut."; break;
                case 'fr': reactionText = "Terrible!"; break;
                case 'jp': reactionText = "Mazui desu..."; break;
                case 'cn': reactionText = "Bù hǎo!"; break;
                case 'ca': reactionText = "Sorry, but this isn't great."; break;
                case 'kr': reactionText = "Aniyo..."; break;
                case 'ru': reactionText = "Blyat! Is terrible!"; break;
                case 'it': reactionText = "Mamma mia! Che disastro!"; break;
            }
        }
        
        return reactionText;
    }

    // Add this method to make countryballs move around
    setupCountryballMovement() {
        // Set up movement for each countryball
        this.countryballs.forEach(ball => {
            // Add movement properties to userData
            ball.userData.movementTarget = new THREE.Vector3(
                Math.random() * 30 - 15,
                ball.position.y,
                Math.random() * 30 - 15
            );
            ball.userData.movementSpeed = 0.005 + Math.random() * 0.005; // Slower speed
            ball.userData.idleTime = 0;
            ball.userData.maxIdleTime = Math.random() * 10000 + 5000; // Longer idle time
            ball.userData.isMoving = true;
            ball.userData.currentRotation = 0;
            ball.userData.targetRotation = 0;
        });
        
        // Update countryball movement in animation loop
        this.updateCountryballMovement = (delta) => {
            this.countryballs.forEach(ball => {
                try {
                    // If in dialogue, make the ball look at the player
                    if (ball.userData.interacting) {
                        // Get direction to player (camera)
                        const directionToPlayer = new THREE.Vector3().subVectors(
                            this.camera.position, 
                            ball.position
                        ).normalize();
                        
                        // Calculate rotation to face player
                        const targetRotation = Math.atan2(directionToPlayer.x, directionToPlayer.z);
                        
                        // Smoothly rotate to face player
                        ball.userData.currentRotation = this.lerpAngle(
                            ball.userData.currentRotation,
                            targetRotation,
                            0.1
                        );
                        
                        ball.rotation.y = ball.userData.currentRotation;
                        return;
                    }
                    
                    // Check if we need a new target
                    ball.userData.idleTime += delta;
                    if (ball.userData.idleTime > ball.userData.maxIdleTime) {
                        // Set new random position within bounds
                        const x = Math.random() * 30 - 15;
                        const z = Math.random() * 30 - 15;
                        ball.userData.movementTarget.set(x, ball.position.y, z);
                        ball.userData.idleTime = 0;
                        ball.userData.maxIdleTime = Math.random() * 10000 + 5000;
                        ball.userData.isMoving = true;
                    }
                    
                    // Calculate distance to target
                    const distanceToTarget = ball.position.distanceTo(ball.userData.movementTarget);
                    
                    // If we're close enough to the target, stop moving
                    if (distanceToTarget < 0.5) {
                        ball.userData.isMoving = false;
                        return;
                    }
                    
                    // Move toward target if we're still moving
                    if (ball.userData.isMoving) {
                        const direction = new THREE.Vector3().subVectors(
                            ball.userData.movementTarget, 
                            ball.position
                        ).normalize();
                        
                        // Calculate target rotation
                        ball.userData.targetRotation = Math.atan2(direction.x, direction.z);
                        
                        // Smoothly rotate toward movement direction
                        ball.userData.currentRotation = this.lerpAngle(
                            ball.userData.currentRotation,
                            ball.userData.targetRotation,
                            0.05
                        );
                        
                        ball.rotation.y = ball.userData.currentRotation;
                        
                        // Move in the direction we're facing
                        ball.position.x += direction.x * ball.userData.movementSpeed * delta;
                        ball.position.z += direction.z * ball.userData.movementSpeed * delta;
                    }
                } catch (e) {
                    console.error("Error moving countryball:", e);
                }
            });
        };
    }

    // Helper method for smooth angle interpolation
    lerpAngle(start, end, t) {
        // Ensure angles are between -PI and PI
        const normalize = (angle) => {
            while (angle > Math.PI) angle -= Math.PI * 2;
            while (angle < -Math.PI) angle += Math.PI * 2;
            return angle;
        };
        
        let delta = normalize(end - start);
        
        // Choose the shortest path
        if (delta > Math.PI) delta -= Math.PI * 2;
        if (delta < -Math.PI) delta += Math.PI * 2;
        
        return normalize(start + delta * t);
    }

    // Add these methods to your CountryballGame class

    // Create UI panels for country calling and toys
    setupGamePanels() {
        // Create country call panel
        this.createCountryCallPanel();
        
        // Create toy panel
        this.createToyPanel();
    }

    // Create a panel to call specific countryballs
    createCountryCallPanel() {
        const panel = document.createElement('div');
        panel.id = 'countryCallPanel';
        panel.style.position = 'fixed';
        panel.style.bottom = '20px';
        panel.style.left = '20px';
        panel.style.backgroundColor = 'rgba(0, 0, 0, 0.7)';
        panel.style.padding = '10px';
        panel.style.borderRadius = '5px';
        panel.style.zIndex = '100';
        
        const title = document.createElement('div');
        title.textContent = 'Call Country';
        title.style.color = 'white';
        title.style.fontWeight = 'bold';
        title.style.marginBottom = '10px';
        title.style.textAlign = 'center';
        panel.appendChild(title);
        
        // Create buttons for each country
        const countries = ['us', 'gb', 'de', 'fr', 'jp', 'cn', 'ca', 'kr', 'ru', 'it'];
        const countryNames = {
            'us': 'USA', 'gb': 'UK', 'de': 'Germany', 'fr': 'France', 
            'jp': 'Japan', 'cn': 'China', 'ca': 'Canada', 'kr': 'Korea', 
            'ru': 'Russia', 'it': 'Italy'
        };
        
        const buttonContainer = document.createElement('div');
        buttonContainer.style.display = 'grid';
        buttonContainer.style.gridTemplateColumns = 'repeat(2, 1fr)';
        buttonContainer.style.gap = '5px';
        
        countries.forEach(country => {
            const button = document.createElement('button');
            button.textContent = countryNames[country];
            button.style.padding = '5px';
            button.style.cursor = 'pointer';
            button.style.backgroundColor = '#4CAF50';
            button.style.border = 'none';
            button.style.borderRadius = '3px';
            button.style.color = 'white';
            
            button.addEventListener('click', () => {
                this.callCountryball(country);
            });
            
            buttonContainer.appendChild(button);
        });
        
        panel.appendChild(buttonContainer);
        document.body.appendChild(panel);
    }

    // Create a panel for toys
    createToyPanel() {
        const panel = document.createElement('div');
        panel.id = 'toyPanel';
        panel.style.position = 'fixed';
        panel.style.bottom = '20px';
        panel.style.right = '20px';
        panel.style.backgroundColor = 'rgba(0, 0, 0, 0.7)';
        panel.style.padding = '10px';
        panel.style.borderRadius = '5px';
        panel.style.zIndex = '100';
        
        const title = document.createElement('div');
        title.textContent = 'Toys';
        title.style.color = 'white';
        title.style.fontWeight = 'bold';
        title.style.marginBottom = '10px';
        title.style.textAlign = 'center';
        panel.appendChild(title);
        
        // Create button for Poland ball toy
        const polandButton = document.createElement('button');
        polandButton.textContent = 'Poland Ball';
        polandButton.style.padding = '8px';
        polandButton.style.cursor = 'pointer';
        polandButton.style.backgroundColor = '#E91E63';
        polandButton.style.border = 'none';
        polandButton.style.borderRadius = '3px';
        polandButton.style.color = 'white';
        polandButton.style.width = '100%';
        polandButton.style.marginBottom = '5px';
        
        polandButton.addEventListener('click', () => {
            this.spawnPolandBallToy();
        });
        
        panel.appendChild(polandButton);
        
        // Add mystery toy button
        const mysteryButton = document.createElement('button');
        mysteryButton.textContent = 'Mystery Toy';
        mysteryButton.style.padding = '8px';
        mysteryButton.style.cursor = 'pointer';
        mysteryButton.style.backgroundColor = '#9C27B0';
        mysteryButton.style.border = 'none';
        mysteryButton.style.borderRadius = '3px';
        mysteryButton.style.color = 'white';
        mysteryButton.style.width = '100%';
        mysteryButton.style.marginBottom = '5px';
        
        mysteryButton.addEventListener('click', () => {
            this.spawnMysteryToy();
        });
        
        panel.appendChild(mysteryButton);
        
        // Add "Put Toy Away" button
        const putAwayButton = document.createElement('button');
        putAwayButton.textContent = 'Put Toy Away';
        putAwayButton.style.padding = '8px';
        putAwayButton.style.cursor = 'pointer';
        putAwayButton.style.backgroundColor = '#607D8B';
        putAwayButton.style.border = 'none';
        putAwayButton.style.borderRadius = '3px';
        putAwayButton.style.color = 'white';
        putAwayButton.style.width = '100%';
        
        putAwayButton.addEventListener('click', () => {
            this.putToyAway();
        });
        
        panel.appendChild(putAwayButton);
        document.body.appendChild(panel);
    }

    // Method to call a specific countryball to come to the player
    callCountryball(country) {
        // Find the countryball with the matching country code
        const countryball = this.countryballs.find(ball => ball.userData.country === country);
        
        if (countryball) {
            // Set the target to be near the player
            const playerPosition = new THREE.Vector3(
                this.camera.position.x,
                0,
                this.camera.position.z
            );
            
            // Calculate a position 2 units away from the player
            const angle = Math.random() * Math.PI * 2;
            const distance = 2;
            const targetX = playerPosition.x + Math.cos(angle) * distance;
            const targetZ = playerPosition.z + Math.sin(angle) * distance;
            
            // Update the countryball's movement target
            countryball.userData.movementTarget.set(targetX, countryball.position.y, targetZ);
            countryball.userData.isMoving = true;
            
            // Make the countryball move faster when called
            countryball.userData.movementSpeed = 0.02;
            
            // Show a message
            this.showMessage(`${countryball.userData.name} is coming!`);
        } else {
            console.error(`Countryball for ${country} not found`);
        }
    }

    // Method to spawn a Poland ball toy for playing catch
    spawnPolandBallToy() {
        // Create Poland ball geometry
        const geometry = new THREE.SphereGeometry(0.3, 32, 32);
        
        // Create Poland ball material (red on top, white on bottom)
        const materials = [
            new THREE.MeshStandardMaterial({ color: 0xFFFFFF }), // White
            new THREE.MeshStandardMaterial({ color: 0xDC143C })  // Red
        ];
        
        // Apply materials to different parts of the sphere
        const polandBall = new THREE.Mesh(geometry, materials[0]); // Start with white
        
        // Add a red half
        const redHalf = new THREE.Mesh(geometry, materials[1]);
        redHalf.scale.set(1.01, 0.5, 1.01); // Slightly larger to avoid z-fighting
        redHalf.position.y = 0.15; // Position to cover top half
        polandBall.add(redHalf);
        
        // Add eyes
        const eyeGeometry = new THREE.CircleGeometry(0.05, 32);
        const eyeMaterial = new THREE.MeshBasicMaterial({ color: 0x000000 });
        
        const leftEye = new THREE.Mesh(eyeGeometry, eyeMaterial);
        leftEye.position.set(-0.1, 0.15, 0.28);
        leftEye.lookAt(0, 0, 1);
        
        const rightEye = new THREE.Mesh(eyeGeometry, eyeMaterial);
        rightEye.position.set(0.1, 0.15, 0.28);
        rightEye.lookAt(0, 0, 1);
        
        polandBall.add(leftEye);
        polandBall.add(rightEye);
        
        // Position in front of the player
        const playerDirection = new THREE.Vector3(0, 0, -1).applyQuaternion(this.camera.quaternion);
        const spawnPosition = new THREE.Vector3().copy(this.camera.position).add(
            playerDirection.multiplyScalar(2)
        );
        spawnPosition.y = 1; // Place at a good height
        
        polandBall.position.copy(spawnPosition);
        
        // Add physics properties
        polandBall.userData = {
            type: 'toy',
            velocity: new THREE.Vector3(0, 0, 0),
            gravity: 0.005,
            bounceCount: 0,
            maxBounces: 5,
            throwable: true
        };
        
        // Add to scene and interactable objects
        this.scene.add(polandBall);
        this.interactableObjects.push(polandBall);
        this.toyBalls = this.toyBalls || [];
        this.toyBalls.push(polandBall);
        
        // Show message
        this.showMessage("Poland ball toy spawned! Click to throw.");
        
        // Set up toy physics if not already done
        if (!this.toyPhysicsActive) {
            this.setupToyPhysics();
            this.toyPhysicsActive = true;
        }
    }

    // Set up physics for toy balls
    setupToyPhysics() {
        // Add update method to animation loop
        this.updateToyPhysics = (delta) => {
            if (!this.toyBalls || this.toyBalls.length === 0) return;
            
            this.toyBalls.forEach(ball => {
                if (!ball.userData.isHeld) {
                    // Apply gravity
                    ball.userData.velocity.y -= ball.userData.gravity * delta;
                    
                    // Update position
                    ball.position.x += ball.userData.velocity.x * delta;
                    ball.position.y += ball.userData.velocity.y * delta;
                    ball.position.z += ball.userData.velocity.z * delta;
                    
                    // Rotate the ball based on movement
                    const speed = ball.userData.velocity.length();
                    if (speed > 0.01) {
                        const axis = new THREE.Vector3(
                            -ball.userData.velocity.z,
                            0,
                            ball.userData.velocity.x
                        ).normalize();
                        
                        ball.rotateOnAxis(axis, speed * 0.1);
                    } else {
                        // Ball is stationary - make countryballs attracted to it
                        this.attractCountryballsToToy(ball);
                    }
                    
                    // Check for ground collision
                    if (ball.position.y < 0.3) { // Ball radius is 0.3
                        ball.position.y = 0.3;
                        
                        // Bounce with energy loss
                        if (Math.abs(ball.userData.velocity.y) > 0.01 && ball.userData.bounceCount < ball.userData.maxBounces) {
                            ball.userData.velocity.y = -ball.userData.velocity.y * 0.7; // 70% energy retention
                            ball.userData.velocity.x *= 0.9; // Friction
                            ball.userData.velocity.z *= 0.9; // Friction
                            ball.userData.bounceCount++;
                        } else {
                            // Stop the ball
                            ball.userData.velocity.set(0, 0, 0);
                            ball.userData.bounceCount = 0;
                        }
                    }
                    
                    // Check for countryball collisions
                    this.countryballs.forEach(countryball => {
                        const distance = ball.position.distanceTo(countryball.position);
                        if (distance < 1.3) { // Ball radius + countryball radius
                            // Countryballs can "catch" the ball
                            if (Math.random() < 0.3 && !countryball.userData.hasBall) {
                                // Countryball catches the ball
                                this.showMessage(`${countryball.userData.name} caught the ball!`);
                                
                                // Remove the ball from the scene
                                this.scene.remove(ball);
                                this.toyBalls = this.toyBalls.filter(b => b !== ball);
                                
                                // Countryball will throw it back after a delay
                                countryball.userData.hasBall = true;
                                
                                // Decide whether to throw to player or just carry it
                                if (Math.random() < 0.5) {
                                    setTimeout(() => {
                                        // Throw the ball back toward the player
                                        this.throwBallFromCountryball(countryball);
                                        countryball.userData.hasBall = false;
                                    }, 2000);
                                } else {
                                    // Carry the ball to the player
                                    this.showMessage(`${countryball.userData.name} is bringing the ball to you!`);
                                    this.bringToyToPlayer(countryball);
                                }
                            } else {
                                // Ball bounces off countryball
                                const normal = new THREE.Vector3().subVectors(
                                    ball.position,
                                    countryball.position
                                ).normalize();
                                
                                // Reflect velocity
                                const dot = ball.userData.velocity.dot(normal);
                                ball.userData.velocity.sub(
                                    normal.multiplyScalar(2 * dot)
                                );
                                
                                // Add some energy to make it more fun
                                ball.userData.velocity.multiplyScalar(1.2);
                                
                                // Move ball outside collision
                                ball.position.add(normal.multiplyScalar(1.3 - distance));
                            }
                        }
                    });
                    
                    // Check for player proximity to return the ball
                    const distanceToPlayer = ball.position.distanceTo(this.camera.position);
                    if (distanceToPlayer < 2 && ball.userData.velocity.length() < 0.01) {
                        // Ball is close to player and not moving - allow pickup
                        ball.userData.canPickup = true;
                    }
                }
            });
        };
    }

    // Make countryballs attracted to stationary toys
    attractCountryballsToToy(toy) {
        // Only attract countryballs that aren't busy
        this.countryballs.forEach(countryball => {
            // Skip if already has a ball or is interacting
            if (countryball.userData.hasBall || countryball.userData.interacting) return;
            
            // Calculate distance to toy
            const distance = countryball.position.distanceTo(toy.position);
            
            // If within attraction range but not too close
            if (distance < 15 && distance > 1.5 && Math.random() < 0.01) {
                // Set the toy as the movement target
                countryball.userData.movementTarget.copy(toy.position);
                countryball.userData.isMoving = true;
                countryball.userData.movementSpeed = 0.01; // Slower approach
                
                // Mark as attracted to toy
                countryball.userData.attractedToToy = toy;
            }
        });
    }

    // Have a countryball bring the toy to the player
    bringToyToPlayer(countryball) {
        // Set the player as the movement target
        const playerPosition = new THREE.Vector3(
            this.camera.position.x,
            0,
            this.camera.position.z
        );
        
        countryball.userData.movementTarget.copy(playerPosition);
        countryball.userData.isMoving = true;
        countryball.userData.movementSpeed = 0.015;
        
        // Check if the countryball has reached the player
        const checkInterval = setInterval(() => {
            if (!countryball) {
                clearInterval(checkInterval);
                return;
            }
            
            const distanceToPlayer = countryball.position.distanceTo(playerPosition);
            
            if (distanceToPlayer < 2) {
                // Countryball has reached the player - give back the toy
                this.showMessage(`${countryball.userData.name} returns the ball to you!`);
                this.spawnPolandBallToy();
                countryball.userData.hasBall = false;
                clearInterval(checkInterval);
            }
        }, 500);
        
        // Clear interval after 30 seconds as a safety measure
        setTimeout(() => {
            clearInterval(checkInterval);
            if (countryball && countryball.userData.hasBall) {
                countryball.userData.hasBall = false;
            }
        }, 30000);
    }

    // Method to spawn a mystery toy
    spawnMysteryToy() {
        // List of possible mystery toys
        const mysteryToys = [
            { name: 'UNBall', color1: 0x418FDE, color2: 0xFFFFFF, special: 'peace' },
            { name: 'EUBall', color1: 0x003399, color2: 0xFFCC00, special: 'unity' },
            { name: 'WorldBall', color1: 0x0077BE, color2: 0x7CFC00, special: 'global' },
            { name: 'RainbowBall', color1: 0xFF0000, color2: 0x00FF00, special: 'rainbow' },
            { name: 'MusicBall', color1: 0x9400D3, color2: 0xFFD700, special: 'music' }
        ];
        
        // Choose a random mystery toy
        const randomToy = mysteryToys[Math.floor(Math.random() * mysteryToys.length)];
        
        // Create the mystery ball geometry
        const geometry = new THREE.SphereGeometry(0.3, 32, 32);
        
        // Create materials
        const materials = [
            new THREE.MeshStandardMaterial({ color: randomToy.color1 }),
            new THREE.MeshStandardMaterial({ color: randomToy.color2 })
        ];
        
        // Create the ball with the first color
        const mysteryBall = new THREE.Mesh(geometry, materials[0]);
        
        // Add the second color pattern based on the special type
        if (randomToy.special === 'rainbow') {
            // Create rainbow effect with multiple colored segments
            const colors = [0xFF0000, 0xFF7F00, 0xFFFF00, 0x00FF00, 0x0000FF, 0x4B0082, 0x9400D3];
            const segmentHeight = 0.6 / colors.length;
            
            colors.forEach((color, index) => {
                const segmentMaterial = new THREE.MeshStandardMaterial({ color });
                const segment = new THREE.Mesh(geometry, segmentMaterial);
                segment.scale.set(1.01, 0.15, 1.01);
                segment.position.y = 0.3 - (index * segmentHeight);
                mysteryBall.add(segment);
            });
        } else if (randomToy.special === 'music') {
            // Create music note patterns
            const noteMaterial = new THREE.MeshStandardMaterial({ color: randomToy.color2 });
            
            // Add music notes around the ball
            for (let i = 0; i < 8; i++) {
                const noteGeometry = new THREE.SphereGeometry(0.05, 16, 16);
                const note = new THREE.Mesh(noteGeometry, noteMaterial);
                
                const angle = (i / 8) * Math.PI * 2;
                note.position.set(
                    Math.cos(angle) * 0.3,
                    0.1,
                    Math.sin(angle) * 0.3
                );
                
                // Add stem to note
                const stemGeometry = new THREE.BoxGeometry(0.02, 0.15, 0.02);
                const stem = new THREE.Mesh(stemGeometry, noteMaterial);
                stem.position.y = 0.08;
                note.add(stem);
                
                mysteryBall.add(note);
            }
        } else {
            // Add second color as a pattern
            const pattern = new THREE.Mesh(geometry, materials[1]);
            
            switch(randomToy.special) {
                case 'peace':
                    // UN-style pattern
                    pattern.scale.set(1.01, 0.2, 1.01);
                    pattern.position.y = 0;
                    break;
                case 'unity':
                    // EU-style pattern (stars)
                    pattern.scale.set(0.2, 0.2, 0.2);
                    for (let i = 0; i < 12; i++) {
                        const star = pattern.clone();
                        const angle = (i / 12) * Math.PI * 2;
                        star.position.set(
                            Math.cos(angle) * 0.25,
                            0,
                            Math.sin(angle) * 0.25
                        );
                        mysteryBall.add(star);
                    }
                    break;
                case 'global':
                    // World map pattern
                    pattern.scale.set(1.01, 1.01, 1.01);
                    
                    // Create continent-like shapes
                    const continents = [
                        { x: 0.1, y: 0.1, z: 0.3, scale: 0.15 },
                        { x: -0.2, y: 0, z: 0.25, scale: 0.2 },
                        { x: 0.15, y: -0.1, z: 0.25, scale: 0.12 },
                        { x: -0.1, y: -0.15, z: 0.25, scale: 0.1 },
                        { x: 0, y: 0.2, z: 0.25, scale: 0.18 }
                    ];
                    
                    continents.forEach(continent => {
                        const continentGeometry = new THREE.SphereGeometry(continent.scale, 8, 8);
                        const continentMesh = new THREE.Mesh(continentGeometry, materials[1]);
                        continentMesh.position.set(continent.x, continent.y, continent.z);
                        mysteryBall.add(continentMesh);
                    });
                    break;
                default:
                    // Default pattern
                    pattern.scale.set(0.5, 0.5, 0.5);
                    pattern.position.y = 0.15;
                    mysteryBall.add(pattern);
            }
            
            if (randomToy.special !== 'unity' && randomToy.special !== 'global') {
                mysteryBall.add(pattern);
            }
        }
        
        // Add eyes
        const eyeGeometry = new THREE.CircleGeometry(0.05, 32);
        const eyeMaterial = new THREE.MeshBasicMaterial({ color: 0x000000 });
        
        const leftEye = new THREE.Mesh(eyeGeometry, eyeMaterial);
        leftEye.position.set(-0.1, 0.15, 0.28);
        leftEye.lookAt(0, 0, 1);
        
        const rightEye = new THREE.Mesh(eyeGeometry, eyeMaterial);
        rightEye.position.set(0.1, 0.15, 0.28);
        rightEye.lookAt(0, 0, 1);
        
        mysteryBall.add(leftEye);
        mysteryBall.add(rightEye);
        
        // Position in front of the player
        const playerDirection = new THREE.Vector3(0, 0, -1).applyQuaternion(this.camera.quaternion);
        const spawnPosition = new THREE.Vector3().copy(this.camera.position).add(
            playerDirection.multiplyScalar(2)
        );
        spawnPosition.y = 1; // Place at a good height
        
        mysteryBall.position.copy(spawnPosition);
        
        // Add physics properties with special effects
        mysteryBall.userData = {
            type: 'toy',
            name: randomToy.name,
            special: randomToy.special,
            velocity: new THREE.Vector3(0, 0, 0),
            gravity: 0.005,
            bounceCount: 0,
            maxBounces: 5,
            throwable: true
        };
        
        // Add special effects based on toy type
        switch(randomToy.special) {
            case 'peace':
                // UN Ball calms countryballs
                mysteryBall.userData.peacefulEffect = true;
                break;
            case 'unity':
                // EU Ball makes countryballs follow it in a group
                mysteryBall.userData.unityEffect = true;
                break;
            case 'global':
                // World Ball makes countryballs share ingredients
                mysteryBall.userData.globalEffect = true;
                break;
            case 'rainbow':
                // Rainbow Ball makes countryballs happy and dance
                mysteryBall.userData.rainbowEffect = true;
                break;
            case 'music':
                // Music Ball makes countryballs sing and dance
                mysteryBall.userData.musicEffect = true;
                
                // Add sound effect when thrown
                mysteryBall.userData.onThrow = () => {
                    this.playRandomNote();
                };
                
                // Add sound effect when bouncing
                mysteryBall.userData.onBounce = () => {
                    this.playRandomNote();
                };
                break;
        }
        
        // Add to scene and interactable objects
        this.scene.add(mysteryBall);
        this.interactableObjects.push(mysteryBall);
        this.toyBalls = this.toyBalls || [];
        this.toyBalls.push(mysteryBall);
        
        // Show message
        this.showMessage(`Mystery ${randomToy.name} spawned! What will it do?`);
        
        // Set up toy physics if not already done
        if (!this.toyPhysicsActive) {
            this.setupToyPhysics();
            this.toyPhysicsActive = true;
        }
    }

    // Helper method for music ball
    playRandomNote() {
        // Create audio context if it doesn't exist
        if (!this.audioContext) {
            this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
        }
        
        // Notes in a pentatonic scale (sounds pleasant in any order)
        const notes = [523.25, 587.33, 659.25, 783.99, 880.00];
        const randomNote = notes[Math.floor(Math.random() * notes.length)];
        
        // Create oscillator
        const oscillator = this.audioContext.createOscillator();
        const gainNode = this.audioContext.createGain();
        
        // Set up oscillator
        oscillator.type = 'sine';
        oscillator.frequency.value = randomNote;
        
        // Set up gain (volume)
        gainNode.gain.value = 0.2;
        gainNode.gain.exponentialRampToValueAtTime(0.001, this.audioContext.currentTime + 0.5);
        
        // Connect nodes
        oscillator.connect(gainNode);
        gainNode.connect(this.audioContext.destination);
        
        // Play sound
        oscillator.start();
        oscillator.stop(this.audioContext.currentTime + 0.5);
    }

    // Method for countryballs to throw the ball back
    throwBallFromCountryball(countryball) {
        // Create a new Poland ball
        const geometry = new THREE.SphereGeometry(0.3, 32, 32);
        const materials = [
            new THREE.MeshStandardMaterial({ color: 0xFFFFFF }),
            new THREE.MeshStandardMaterial({ color: 0xDC143C })
        ];
        
        const polandBall = new THREE.Mesh(geometry, materials[0]);
        
        // Add red half
        const redHalf = new THREE.Mesh(geometry, materials[1]);
        redHalf.scale.set(1.01, 0.5, 1.01);
        redHalf.position.y = 0.15;
        polandBall.add(redHalf);
        
        // Add eyes
        const eyeGeometry = new THREE.CircleGeometry(0.05, 32);
        const eyeMaterial = new THREE.MeshBasicMaterial({ color: 0x000000 });
        
        const leftEye = new THREE.Mesh(eyeGeometry, eyeMaterial);
        leftEye.position.set(-0.1, 0.15, 0.28);
        leftEye.lookAt(0, 0, 1);
        
        const rightEye = new THREE.Mesh(eyeGeometry, eyeMaterial);
        rightEye.position.set(0.1, 0.15, 0.28);
        rightEye.lookAt(0, 0, 1);
        
        polandBall.add(leftEye);
        polandBall.add(rightEye);
        
        // Position slightly above the countryball
        polandBall.position.set(
            countryball.position.x,
            countryball.position.y + 1.5,
            countryball.position.z
        );
        
        // Calculate direction to player
        const directionToPlayer = new THREE.Vector3().subVectors(
            this.camera.position,
            countryball.position
        ).normalize();
        
        // Add some upward arc
        directionToPlayer.y += 0.5;
        directionToPlayer.normalize();
        
        // Set velocity
        polandBall.userData = {
            type: 'toy',
            velocity: directionToPlayer.multiplyScalar(0.15),
            gravity: 0.005,
            bounceCount: 0,
            maxBounces: 5,
            throwable: true
        };
        
        // Add to scene and arrays
        this.scene.add(polandBall);
        this.interactableObjects.push(polandBall);
        this.toyBalls = this.toyBalls || [];
        this.toyBalls.push(polandBall);
        
        // Show message
        this.showMessage(`${countryball.userData.name} throws the ball back!`);
    }

    // Method to put away the nearest toy or all toys
    putToyAway() {
        if (!this.toyBalls || this.toyBalls.length === 0) {
            this.showMessage("No toys to put away!");
            return;
        }
        
        // Find the nearest toy to the player
        let nearestToy = null;
        let nearestDistance = Infinity;
        
        this.toyBalls.forEach(toy => {
            const distance = toy.position.distanceTo(this.camera.position);
            if (distance < nearestDistance) {
                nearestDistance = distance;
                nearestToy = toy;
            }
        });
        
        // If the nearest toy is close enough, put it away
        if (nearestToy && nearestDistance < 10) {
            // Create a simple animation of the toy being put away
            const animateToyAway = () => {
                // Shrink the toy
                nearestToy.scale.multiplyScalar(0.9);
                
                // Move it slightly toward the player
                const directionToPlayer = new THREE.Vector3().subVectors(
                    this.camera.position,
                    nearestToy.position
                ).normalize();
                
                nearestToy.position.add(directionToPlayer.multiplyScalar(0.1));
                
                // If it's small enough, remove it
                if (nearestToy.scale.x < 0.1) {
                    // Remove from scene and arrays
                    this.scene.remove(nearestToy);
                    this.interactableObjects = this.interactableObjects.filter(obj => obj !== nearestToy);
                    this.toyBalls = this.toyBalls.filter(toy => toy !== nearestToy);
                    
                    this.showMessage("Toy put away!");
                    return;
                }
                
                // Continue animation
                requestAnimationFrame(animateToyAway);
            };
            
            // Start the animation
            animateToyAway();
        } else {
            // If no toy is close enough, put away all toys with a message
            this.showMessage("Putting away all toys...");
            
            // Remove all toys
            this.toyBalls.forEach(toy => {
                this.scene.remove(toy);
            });
            
            // Update arrays
            this.interactableObjects = this.interactableObjects.filter(obj => !this.toyBalls.includes(obj));
            this.toyBalls = [];
        }
    }

    // Add these methods to your CountryballGame class for multiplayer support

    // Initialize multiplayer functionality
    initMultiplayer() {
        // Create multiplayer UI
        this.createMultiplayerUI();
        
        // Initialize player data
        this.playerId = null;
        this.players = {};
        this.isMultiplayer = false;
        this.isHost = false;
        
        // Initialize WebSocket connection when joining a game
        this.socket = null;
    }

    // Create UI for multiplayer options
    createMultiplayerUI() {
        const panel = document.createElement('div');
        panel.id = 'multiplayerPanel';
        panel.style.position = 'fixed';
        panel.style.top = '20px';
        panel.style.right = '20px';
        panel.style.backgroundColor = 'rgba(0, 0, 0, 0.7)';
        panel.style.padding = '10px';
        panel.style.borderRadius = '5px';
        panel.style.zIndex = '100';
        
        const title = document.createElement('div');
        title.textContent = 'Multiplayer';
        title.style.color = 'white';
        title.style.fontWeight = 'bold';
        title.style.marginBottom = '10px';
        title.style.textAlign = 'center';
        panel.appendChild(title);
        
        // Host Game button
        const hostButton = document.createElement('button');
        hostButton.textContent = 'Host Game';
        hostButton.style.padding = '8px';
        hostButton.style.cursor = 'pointer';
        hostButton.style.backgroundColor = '#4CAF50';
        hostButton.style.border = 'none';
        hostButton.style.borderRadius = '3px';
        hostButton.style.color = 'white';
        hostButton.style.width = '100%';
        hostButton.style.marginBottom = '5px';
        
        hostButton.addEventListener('click', () => {
            this.hostGame();
        });
        
        panel.appendChild(hostButton);
        
        // Join Game section
        const joinContainer = document.createElement('div');
        joinContainer.style.marginBottom = '5px';
        
        const gameCodeInput = document.createElement('input');
        gameCodeInput.type = 'text';
        gameCodeInput.placeholder = 'Game Code';
        gameCodeInput.style.padding = '8px';
        gameCodeInput.style.width = '100%';
        gameCodeInput.style.boxSizing = 'border-box';
        gameCodeInput.style.marginBottom = '5px';
        
        const joinButton = document.createElement('button');
        joinButton.textContent = 'Join Game';
        joinButton.style.padding = '8px';
        joinButton.style.cursor = 'pointer';
        joinButton.style.backgroundColor = '#2196F3';
        joinButton.style.border = 'none';
        joinButton.style.borderRadius = '3px';
        joinButton.style.color = 'white';
        joinButton.style.width = '100%';
        
        joinButton.addEventListener('click', () => {
            const gameCode = gameCodeInput.value.trim();
            if (gameCode) {
                this.joinGame(gameCode);
            } else {
                this.showMessage('Please enter a game code');
            }
        });
        
        joinContainer.appendChild(gameCodeInput);
        joinContainer.appendChild(joinButton);
        panel.appendChild(joinContainer);
        
        // Leave Game button (initially hidden)
        const leaveButton = document.createElement('button');
        leaveButton.textContent = 'Leave Game';
        leaveButton.style.padding = '8px';
        leaveButton.style.cursor = 'pointer';
        leaveButton.style.backgroundColor = '#f44336';
        leaveButton.style.border = 'none';
        leaveButton.style.borderRadius = '3px';
        leaveButton.style.color = 'white';
        leaveButton.style.width = '100%';
        leaveButton.style.display = 'none';
        
        leaveButton.addEventListener('click', () => {
            this.leaveGame();
        });
        
        panel.appendChild(leaveButton);
        
        // Game code display (initially hidden)
        const gameCodeDisplay = document.createElement('div');
        gameCodeDisplay.style.color = 'white';
        gameCodeDisplay.style.textAlign = 'center';
        gameCodeDisplay.style.marginTop = '10px';
        gameCodeDisplay.style.display = 'none';
        panel.appendChild(gameCodeDisplay);
        
        // Player list (initially hidden)
        const playerList = document.createElement('div');
        playerList.style.color = 'white';
        playerList.style.marginTop = '10px';
        playerList.style.maxHeight = '100px';
        playerList.style.overflowY = 'auto';
        playerList.style.display = 'none';
        panel.appendChild(playerList);
        
        document.body.appendChild(panel);
        
        // Store references to UI elements
        this.multiplayerUI = {
            panel,
            hostButton,
            joinContainer,
            leaveButton,
            gameCodeDisplay,
            playerList,
            gameCodeInput
        };
    }

    // Host a new multiplayer game
    hostGame() {
        if (this.isMultiplayer) {
            this.showMessage('Already in a multiplayer game');
            return;
        }
        
        // Generate a random game code
        const gameCode = Math.random().toString(36).substring(2, 8).toUpperCase();
        
        // Connect to WebSocket server
        this.connectToServer(gameCode, true);
        
        // Update UI
        this.showMessage(`Hosting game with code: ${gameCode}`);
        this.updateMultiplayerUI(true, gameCode);
    }

    // Join an existing multiplayer game
    joinGame(gameCode) {
        if (this.isMultiplayer) {
            this.showMessage('Already in a multiplayer game');
            return;
        }
        
        // Connect to WebSocket server
        this.connectToServer(gameCode, false);
        
        // Update UI
        this.showMessage(`Joining game with code: ${gameCode}`);
        this.updateMultiplayerUI(true, gameCode);
    }

    // Leave the current multiplayer game
    leaveGame() {
        if (!this.isMultiplayer) {
            return;
        }
        
        // Close WebSocket connection
        if (this.socket) {
            this.socket.close();
            this.socket = null;
        }
        
        // Remove other players from the scene
        this.removeOtherPlayers();
        
        // Reset multiplayer state
        this.isMultiplayer = false;
        this.isHost = false;
        this.playerId = null;
        this.players = {};
        
        // Update UI
        this.showMessage('Left multiplayer game');
        this.updateMultiplayerUI(false);
    }

    // Connect to WebSocket server
    connectToServer(gameCode, isHost) {
        // Use a WebSocket server URL (you'll need to set up a server)
        const serverUrl = 'wss://your-websocket-server.com';
        
        try {
            // For development/testing, we'll simulate WebSocket with a mock implementation
            if (location.hostname === 'localhost' || location.hostname === '127.0.0.1') {
                this.setupMockWebSocket(gameCode, isHost);
                return;
            }
            
            this.socket = new WebSocket(serverUrl);
            
            this.socket.onopen = () => {
                // Send join message with game code
                this.socket.send(JSON.stringify({
                    type: 'join',
                    gameCode: gameCode,
                    isHost: isHost
                }));
                
                this.isMultiplayer = true;
                this.isHost = isHost;
            };
            
            this.socket.onmessage = (event) => {
                this.handleServerMessage(JSON.parse(event.data));
            };
            
            this.socket.onclose = () => {
                if (this.isMultiplayer) {
                    this.showMessage('Disconnected from server');
                    this.leaveGame();
                }
            };
            
            this.socket.onerror = (error) => {
                console.error('WebSocket error:', error);
                this.showMessage('Error connecting to server');
                this.leaveGame();
            };
        } catch (error) {
            console.error('Failed to connect to WebSocket server:', error);
            this.showMessage('Failed to connect to server');
        }
    }

    // For development/testing: mock WebSocket implementation
    setupMockWebSocket(gameCode, isHost) {
        // Create a mock socket object
        this.socket = {
            send: (data) => {
                console.log('Mock WebSocket sending:', data);
                // Simulate server response after a short delay
                setTimeout(() => {
                    const message = JSON.parse(data);
                    
                    if (message.type === 'join') {
                        // Simulate server assigning a player ID
                        this.handleServerMessage({
                            type: 'joined',
                            playerId: 'player_' + Math.random().toString(36).substring(2, 9),
                            gameCode: gameCode,
                            isHost: isHost
                        });
                        
                        // If not host, simulate another player already in the game
                        if (!isHost) {
                            this.handleServerMessage({
                                type: 'playerJoined',
                                playerId: 'host_' + Math.random().toString(36).substring(2, 9),
                                position: { x: 5, y: 0, z: 5 },
                                rotation: 0
                            });
                        }
                    }
                    else if (message.type === 'position') {
                        // No need to simulate anything for position updates in mock mode
                    }
                }, 500);
            },
            close: () => {
                console.log('Mock WebSocket closed');
            }
        };
        
        this.isMultiplayer = true;
        this.isHost = isHost;
    }

    // Handle messages from the server
    handleServerMessage(message) {
        switch (message.type) {
            case 'joined':
                // Successfully joined the game
                this.playerId = message.playerId;
                this.showMessage(`Connected to game as ${message.isHost ? 'host' : 'player'}`);
                break;
                
            case 'playerJoined':
                // Another player joined the game
                if (message.playerId !== this.playerId) {
                    this.addOtherPlayer(message.playerId, message.position, message.rotation);
                    this.showMessage('A new player has joined');
                    this.updatePlayerList();
                }
                break;
                
            case 'playerLeft':
                // A player left the game
                if (message.playerId !== this.playerId) {
                    this.removePlayer(message.playerId);
                    this.showMessage('A player has left');
                    this.updatePlayerList();
                }
                break;
                
            case 'playerPosition':
                // Update another player's position
                if (message.playerId !== this.playerId && this.players[message.playerId]) {
                    this.updatePlayerPosition(
                        message.playerId, 
                        message.position, 
                        message.rotation
                    );
                }
                break;
                
            case 'gameState':
                // Full game state update (received when joining)
                this.syncGameState(message.state);
                break;
                
            case 'error':
                // Error message from server
                this.showMessage(`Error: ${message.message}`);
                break;
        }
    }

    // Add another player to the scene
    addOtherPlayer(playerId, position, rotation) {
        // Create a player avatar (using a simple countryball)
        const geometry = new THREE.SphereGeometry(0.5, 32, 32);
        const material = new THREE.MeshBasicMaterial({ color: this.getPlayerColor(playerId) });
        const playerMesh = new THREE.Mesh(geometry, material);
        
        // Position the player
        playerMesh.position.set(
            position.x || 0,
            position.y || this.playerHeight,
            position.z || 0
        );
        
        // Add eyes to make it look like a countryball
        const eyeGeometry = new THREE.CircleGeometry(0.1, 32);
        const eyeMaterial = new THREE.MeshBasicMaterial({ color: 0x000000 });
        
        const leftEye = new THREE.Mesh(eyeGeometry, eyeMaterial);
        leftEye.position.set(-0.2, 0.1, 0.4);
        leftEye.lookAt(0, 0, 1);
        
        const rightEye = new THREE.Mesh(eyeGeometry, eyeMaterial);
        rightEye.position.set(0.2, 0.1, 0.4);
        rightEye.lookAt(0, 0, 1);
        
        playerMesh.add(leftEye);
        playerMesh.add(rightEye);
        
        // Set rotation
        playerMesh.rotation.y = rotation || 0;
        
        // Add to scene
        this.scene.add(playerMesh);
        
        // Store player data
        this.players[playerId] = {
            mesh: playerMesh,
            position: new THREE.Vector3(position.x || 0, position.y || this.playerHeight, position.z || 0),
            rotation: rotation || 0
        };
        
        // Update player list in UI
        this.updatePlayerList();
    }

    // Remove a player from the scene
    removePlayer(playerId) {
        if (this.players[playerId]) {
            this.scene.remove(this.players[playerId].mesh);
            delete this.players[playerId];
        }
    }

    // Remove all other players from the scene
    removeOtherPlayers() {
        Object.keys(this.players).forEach(playerId => {
            this.scene.remove(this.players[playerId].mesh);
        });
        this.players = {};
    }

    // Update another player's position and rotation
    updatePlayerPosition(playerId, position, rotation) {
        const player = this.players[playerId];
        if (player) {
            // Update position with smooth interpolation
            player.targetPosition = new THREE.Vector3(position.x, position.y, position.z);
            player.targetRotation = rotation;
            
            // If this is the first update, set position immediately
            if (!player.lastUpdateTime) {
                player.mesh.position.copy(player.targetPosition);
                player.mesh.rotation.y = player.targetRotation;
            }
            
            player.lastUpdateTime = Date.now();
        }
    }

    // Get a consistent color for a player based on their ID
    getPlayerColor(playerId) {
        // Simple hash function to generate a color from player ID
        let hash = 0;
        for (let i = 0; i < playerId.length; i++) {
            hash = playerId.charCodeAt(i) + ((hash << 5) - hash);
        }
        
        // Convert to RGB color
        const r = (hash & 0xFF0000) >> 16;
        const g = (hash & 0x00FF00) >> 8;
        const b = hash & 0x0000FF;
        
        return (r << 16) | (g << 8) | b;
    }

    // Update the multiplayer UI based on connection state
    updateMultiplayerUI(isConnected, gameCode = null) {
        if (isConnected) {
            // Show connected UI
            this.multiplayerUI.hostButton.style.display = 'none';
            this.multiplayerUI.joinContainer.style.display = 'none';
            this.multiplayerUI.leaveButton.style.display = 'block';
            this.multiplayerUI.playerList.style.display = 'block';
            
            if (gameCode) {
                this.multiplayerUI.gameCodeDisplay.textContent = `Game Code: ${gameCode}`;
                this.multiplayerUI.gameCodeDisplay.style.display = 'block';
            }
        } else {
            // Show disconnected UI
            this.multiplayerUI.hostButton.style.display = 'block';
            this.multiplayerUI.joinContainer.style.display = 'block';
            this.multiplayerUI.leaveButton.style.display = 'none';
            this.multiplayerUI.gameCodeDisplay.style.display = 'none';
            this.multiplayerUI.playerList.style.display = 'none';
            this.multiplayerUI.gameCodeInput.value = '';
        }
        
        // Update player list
        this.updatePlayerList();
    }

    // Update the player list in the UI
    updatePlayerList() {
        if (!this.isMultiplayer) return;
        
        const playerList = this.multiplayerUI.playerList;
        playerList.innerHTML = '<div style="font-weight: bold; margin-bottom: 5px;">Players:</div>';
        
        // Add current player
        const playerItem = document.createElement('div');
        playerItem.textContent = `You${this.isHost ? ' (Host)' : ''}`;
        playerList.appendChild(playerItem);
        
        // Add other players
        Object.keys(this.players).forEach(playerId => {
            const playerItem = document.createElement('div');
            playerItem.textContent = `Player ${playerId.substring(0, 5)}`;
            playerList.appendChild(playerItem);
        });
    }

    // Send player position to server
    sendPlayerPosition() {
        if (!this.isMultiplayer || !this.socket) return;
        
        // Only send updates at a reasonable rate (10 times per second)
        const now = Date.now();
        if (!this.lastPositionUpdate || now - this.lastPositionUpdate > 100) {
            this.socket.send(JSON.stringify({
                type: 'position',
                position: {
                    x: this.camera.position.x,
                    y: this.camera.position.y,
                    z: this.camera.position.z
                },
                rotation: this.cameraAngle
            }));
            
            this.lastPositionUpdate = now;
        }
    }

    // Synchronize game state with server data
    syncGameState(state) {
        // Add all players from the state
        if (state.players) {
            Object.keys(state.players).forEach(playerId => {
                if (playerId !== this.playerId) {
                    const player = state.players[playerId];
                    this.addOtherPlayer(playerId, player.position, player.rotation);
                }
            });
        }
        
        // Sync other game state as needed
        // (countryballs, toys, etc.)
    }

    // Update player interpolation in animation loop
    updateMultiplayerPlayers(delta) {
        if (!this.isMultiplayer) return;
        
        // Interpolate other players' positions
        Object.keys(this.players).forEach(playerId => {
            const player = this.players[playerId];
            if (player.targetPosition && player.lastUpdateTime) {
                // Calculate interpolation factor
                const timeSinceUpdate = Date.now() - player.lastUpdateTime;
                const interpolationFactor = Math.min(timeSinceUpdate / 100, 1);
                
                // Interpolate position
                player.mesh.position.lerp(player.targetPosition, interpolationFactor);
                
                // Interpolate rotation
                if (player.targetRotation !== undefined) {
                    const rotationDiff = player.targetRotation - player.mesh.rotation.y;
                    // Handle rotation wrapping
                    if (rotationDiff > Math.PI) player.mesh.rotation.y += 2 * Math.PI;
                    if (rotationDiff < -Math.PI) player.mesh.rotation.y -= 2 * Math.PI;
                    
                    player.mesh.rotation.y += (player.targetRotation - player.mesh.rotation.y) * interpolationFactor;
                }
            }
        });
        
        // Send our position to the server
        this.sendPlayerPosition();
    }

    // Add this method to the CountryballGame class
    setupMarketZone() {
        // Create the market area - using grass color instead of white platform
        const marketFloor = new THREE.Mesh(
            new THREE.PlaneGeometry(30, 30),
            new THREE.MeshStandardMaterial({ color: 0x88CC88 }) // Green grass color
        );
        marketFloor.rotation.x = -Math.PI / 2;
        marketFloor.position.set(20, 0, 20); // Position in a corner of the map
        this.scene.add(marketFloor);
        
        // Add market sign
        this.createMarketSign(20, 0, 5);
        
        // Create market stalls in a semi-circle arrangement
        const radius = 10;
        const centerX = 20;
        const centerZ = 20;
        
        // Define countries for stalls with their specialty dishes - only include countries in the game
        const stallCountries = [
            { country: 'us', name: 'USA', specialty: 'Burger & Fries', price: 5 },
            { country: 'it', name: 'Italy', specialty: 'Pizza Margherita', price: 6 },
            { country: 'jp', name: 'Japan', specialty: 'Sushi Platter', price: 8 },
            { country: 'fr', name: 'France', specialty: 'Croissant', price: 3 },
            { country: 'cn', name: 'China', specialty: 'Dim Sum', price: 7 },
            { country: 'kr', name: 'Korea', specialty: 'Bibimbap', price: 7 },
            { country: 'ru', name: 'Russia', specialty: 'Borscht', price: 6 },
            { country: 'ca', name: 'Canada', specialty: 'Poutine', price: 5 }
        ];
        
        // Create each stall
        const stallCount = stallCountries.length;
        for (let i = 0; i < stallCount; i++) {
            const angle = (Math.PI * 1.5) - (i / stallCount * Math.PI);
            const x = centerX + Math.cos(angle) * radius;
            const z = centerZ + Math.sin(angle) * radius;
            
            // Create the stall
            this.createMarketStall(x, z, angle + Math.PI, stallCountries[i]);
        }
        
        // Add some decorative elements
        this.addMarketDecorations(centerX, centerZ);
    }

    // Create a market stall with vendor
    createMarketStall(x, z, rotation, countryInfo) {
        const stallGroup = new THREE.Group();
        
        // Stall base/counter
        const counter = new THREE.Mesh(
            new THREE.BoxGeometry(4, 1, 2),
            new THREE.MeshStandardMaterial({ color: 0x8B4513 })
        );
        counter.position.y = 0.5;
        stallGroup.add(counter);
        
        // Stall roof
        const roof = new THREE.Mesh(
            new THREE.ConeGeometry(3, 1.5, 4),
            new THREE.MeshStandardMaterial({ color: 0xA52A2A })
        );
        roof.position.y = 3;
        roof.rotation.y = Math.PI / 4;
        stallGroup.add(roof);
        
        // Add a large flag on top of the stall
        this.addStallFlag(stallGroup, countryInfo.country, 0, 4, 0);
        
        // Create vendor countryball - use the same method as regular countryballs
        const vendor = this.createCountryball(countryInfo.country, 0.7);
        vendor.position.set(0, 1.5, -0.5);
        vendor.userData.isVendor = true;
        vendor.userData.specialty = countryInfo.specialty;
        vendor.userData.price = countryInfo.price;
        vendor.userData.vendorName = countryInfo.name;
        vendor.userData.country = countryInfo.country;
        
        // Add ingredients this vendor sells
        vendor.userData.ingredients = this.getCountryIngredients(countryInfo.country);
        
        stallGroup.add(vendor);
        
        // Add large floating text with country name
        const textGeometry = new THREE.PlaneGeometry(3, 0.8);
        const textCanvas = document.createElement('canvas');
        textCanvas.width = 300;
        textCanvas.height = 80;
        const textCtx = textCanvas.getContext('2d');
        
        // Draw text background with country color
        textCtx.fillStyle = this.getCountryFlagColor(countryInfo.country);
        textCtx.fillRect(0, 0, 300, 80);
        
        // Add border
        textCtx.strokeStyle = '#000000';
        textCtx.lineWidth = 4;
        textCtx.strokeRect(2, 2, 296, 76);
        
        // Draw text with shadow for better visibility
        textCtx.shadowColor = 'rgba(0, 0, 0, 0.7)';
        textCtx.shadowBlur = 6;
        textCtx.shadowOffsetX = 2;
        textCtx.shadowOffsetY = 2;
        textCtx.fillStyle = '#FFFFFF';
        textCtx.font = 'bold 40px Arial';
        textCtx.textAlign = 'center';
        textCtx.textBaseline = 'middle';
        textCtx.fillText(countryInfo.name, 150, 40);
        
        const textTexture = new THREE.CanvasTexture(textCanvas);
        const textMaterial = new THREE.MeshBasicMaterial({ 
            map: textTexture,
            transparent: true
        });
        const text = new THREE.Mesh(textGeometry, textMaterial);
        text.position.set(0, 2.5, 0);
        text.rotation.y = Math.PI;
        stallGroup.add(text);
        
        // Add "PRESS E TO INTERACT" floating text
        const hintGeometry = new THREE.PlaneGeometry(2.5, 0.6);
        const hintCanvas = document.createElement('canvas');
        hintCanvas.width = 250;
        hintCanvas.height = 60;
        const hintCtx = hintCanvas.getContext('2d');
        
        // Draw hint background
        hintCtx.fillStyle = 'rgba(0, 0, 0, 0.8)';
        hintCtx.fillRect(0, 0, 250, 60);
        
        // Draw hint text
        hintCtx.fillStyle = '#FFFFFF';
        hintCtx.font = 'bold 24px Arial';
        hintCtx.textAlign = 'center';
        hintCtx.textBaseline = 'middle';
        hintCtx.fillText('PRESS E TO INTERACT', 125, 30);
        
        const hintTexture = new THREE.CanvasTexture(hintCanvas);
        const hintMaterial = new THREE.MeshBasicMaterial({ 
            map: hintTexture,
            transparent: true
        });
        const hint = new THREE.Mesh(hintGeometry, hintMaterial);
        hint.position.set(0, 1.8, 0);
        hint.rotation.y = Math.PI;
        stallGroup.add(hint);
        
        // Add food display
        const foodDisplay = this.createFoodDisplay(countryInfo.specialty);
        foodDisplay.position.set(0, 1.1, 0.5);
        stallGroup.add(foodDisplay);
        
        // Position and rotate the entire stall
        stallGroup.position.set(x, 0, z);
        stallGroup.rotation.y = rotation;
        this.scene.add(stallGroup);
        
        // Make vendor interactive
        this.interactableObjects.push(vendor);
    }

    // Create a food display based on specialty
    createFoodDisplay(specialty) {
        const displayGroup = new THREE.Group();
        
        // Create a plate
        const plate = new THREE.Mesh(
            new THREE.CylinderGeometry(0.5, 0.4, 0.1, 16),
            new THREE.MeshStandardMaterial({ color: 0xFFFFFF })
        );
        displayGroup.add(plate);
        
        // Add food based on specialty
        let foodGeometry, foodMaterial;
        
        switch(specialty) {
            case 'Burger & Fries':
                // Burger
                foodGeometry = new THREE.CylinderGeometry(0.4, 0.4, 0.3, 16);
                foodMaterial = new THREE.MeshStandardMaterial({ color: 0xCD853F });
                break;
            case 'Pizza Margherita':
                // Pizza
                foodGeometry = new THREE.CylinderGeometry(0.4, 0.4, 0.05, 16);
                foodMaterial = new THREE.MeshStandardMaterial({ color: 0xFFD700 });
                break;
            case 'Sushi Platter':
                // Sushi
                foodGeometry = new THREE.BoxGeometry(0.6, 0.15, 0.3);
                foodMaterial = new THREE.MeshStandardMaterial({ color: 0xFFFFFF });
                break;
            case 'Tacos':
                // Taco
                foodGeometry = new THREE.CylinderGeometry(0.3, 0.3, 0.2, 16, 1, true, 0, Math.PI);
                foodMaterial = new THREE.MeshStandardMaterial({ color: 0xDAA520 });
                break;
            case 'Croissant':
                // Croissant (simplified as a curved shape)
                foodGeometry = new THREE.TorusGeometry(0.2, 0.1, 8, 12, Math.PI);
                foodMaterial = new THREE.MeshStandardMaterial({ color: 0xF4A460 });
                break;
            default:
                // Generic food item
                foodGeometry = new THREE.SphereGeometry(0.3, 16, 16);
                foodMaterial = new THREE.MeshStandardMaterial({ color: 0xF5DEB3 });
        }
        
        const food = new THREE.Mesh(foodGeometry, foodMaterial);
        food.position.y = 0.1;
        displayGroup.add(food);
        
        return displayGroup;
    }

    // Create the market sign
    createMarketSign(x, y, z) {
        const signGroup = new THREE.Group();
        
        // Lower the sign posts
        const post1 = new THREE.Mesh(
            new THREE.CylinderGeometry(0.2, 0.2, 4),
            new THREE.MeshStandardMaterial({ color: 0x8B4513 })
        );
        post1.position.set(-3, 2, 0);
        signGroup.add(post1);
        
        const post2 = new THREE.Mesh(
            new THREE.CylinderGeometry(0.2, 0.2, 4),
            new THREE.MeshStandardMaterial({ color: 0x8B4513 })
        );
        post2.position.set(3, 2, 0);
        signGroup.add(post2);
        
        // Lower the sign board
        const board = new THREE.Mesh(
            new THREE.BoxGeometry(7, 2, 0.3),
            new THREE.MeshStandardMaterial({ color: 0xA0522D })
        );
        board.position.y = 3.5;
        signGroup.add(board);
        
        // Make text more visible
        const textGeometry = new THREE.PlaneGeometry(6.5, 1.8);
        const textCanvas = document.createElement('canvas');
        textCanvas.width = 650;
        textCanvas.height = 180;
        const textCtx = textCanvas.getContext('2d');
        
        // Draw text background
        textCtx.fillStyle = '#A0522D';
        textCtx.fillRect(0, 0, 650, 180);
        
        // Draw text with thicker outline for better visibility
        textCtx.strokeStyle = '#000000';
        textCtx.lineWidth = 10;
        textCtx.fillStyle = '#FFFFFF';
        textCtx.font = 'bold 80px Arial';
        textCtx.textAlign = 'center';
        textCtx.textBaseline = 'middle';
        textCtx.strokeText('WORLD MARKET', 325, 90);
        textCtx.fillText('WORLD MARKET', 325, 90);
        
        const textTexture = new THREE.CanvasTexture(textCanvas);
        const textMaterial = new THREE.MeshBasicMaterial({ map: textTexture });
        const text = new THREE.Mesh(textGeometry, textMaterial);
        text.position.set(0, 3.5, 0.16);
        signGroup.add(text);
        
        // Position the sign lower
        signGroup.position.set(x, 0, z); // y=0 instead of y=4
        signGroup.rotation.y = Math.PI / 4;
        this.scene.add(signGroup);
    }

    // Add decorative elements to the market
    addMarketDecorations(centerX, centerZ) {
        // Add some plants/trees
        for (let i = 0; i < 6; i++) {
            const angle = i * Math.PI / 3;
            const x = centerX + Math.cos(angle) * 14;
            const z = centerZ + Math.sin(angle) * 14;
            
            // Tree trunk
            const trunk = new THREE.Mesh(
                new THREE.CylinderGeometry(0.3, 0.4, 2, 8),
                new THREE.MeshStandardMaterial({ color: 0x8B4513 })
            );
            trunk.position.set(x, 1, z);
            this.scene.add(trunk);
            
            // Tree foliage
            const foliage = new THREE.Mesh(
                new THREE.SphereGeometry(1.2, 8, 8),
                new THREE.MeshStandardMaterial({ color: 0x228B22 })
            );
            foliage.position.set(x, 2.5, z);
            this.scene.add(foliage);
        }
        
        // Add benches
        for (let i = 0; i < 4; i++) {
            const angle = (i * Math.PI / 2) + (Math.PI / 4);
            const x = centerX + Math.cos(angle) * 6;
            const z = centerZ + Math.sin(angle) * 6;
            
            this.createBench(x, z, angle);
        }
    }

    // Create a bench
    createBench(x, z, rotation) {
        const benchGroup = new THREE.Group();
        
        // Bench seat
        const seat = new THREE.Mesh(
            new THREE.BoxGeometry(2, 0.1, 0.6),
            new THREE.MeshStandardMaterial({ color: 0x8B4513 })
        );
        seat.position.y = 0.5;
        benchGroup.add(seat);
        
        // Bench legs
        for (let i = 0; i < 4; i++) {
            const legX = (i % 2 === 0 ? 0.8 : -0.8);
            const legZ = (i < 2 ? 0.2 : -0.2);
            
            const leg = new THREE.Mesh(
                new THREE.BoxGeometry(0.1, 0.5, 0.1),
                new THREE.MeshStandardMaterial({ color: 0x8B4513 })
            );
            leg.position.set(legX, 0.25, legZ);
            benchGroup.add(leg);
        }
        
        // Position and rotate the bench
        benchGroup.position.set(x, 0, z);
        benchGroup.rotation.y = rotation;
        this.scene.add(benchGroup);
    }

    // Handle vendor interactions
    handleVendorInteraction(vendor) {
        if (vendor.userData.isVendor) {
            // Create a shopping panel for buying ingredients
            this.showShoppingPanel(vendor);
        }
    }

    // Create a shopping panel for buying ingredients
    showShoppingPanel(vendor) {
        // Remove existing panel if it exists
        if (this.shoppingPanel) {
            document.body.removeChild(this.shoppingPanel);
        }
        
        // Create shopping panel
        this.shoppingPanel = document.createElement('div');
        this.shoppingPanel.style.position = 'fixed';
        this.shoppingPanel.style.top = '50%';
        this.shoppingPanel.style.left = '50%';
        this.shoppingPanel.style.transform = 'translate(-50%, -50%)';
        this.shoppingPanel.style.backgroundColor = 'rgba(0, 0, 0, 0.85)';
        this.shoppingPanel.style.color = 'white';
        this.shoppingPanel.style.padding = '20px';
        this.shoppingPanel.style.borderRadius = '10px';
        this.shoppingPanel.style.zIndex = '1000';
        this.shoppingPanel.style.width = '500px';
        this.shoppingPanel.style.maxHeight = '80vh';
        this.shoppingPanel.style.overflowY = 'auto';
        
        // Add country name and flag as header
        const header = document.createElement('div');
        header.style.display = 'flex';
        header.style.alignItems = 'center';
        header.style.marginBottom = '15px';
        header.style.padding = '10px';
        header.style.backgroundColor = this.getCountryFlagColor(vendor.userData.country);
        header.style.borderRadius = '5px';
        
        // Add country flag
        const flagImg = document.createElement('div');
        flagImg.style.width = '60px';
        flagImg.style.height = '40px';
        flagImg.style.marginRight = '15px';
        flagImg.style.backgroundSize = 'cover';
        flagImg.style.backgroundPosition = 'center';
        flagImg.style.backgroundImage = `url('https://flagcdn.com/w80/${vendor.userData.country.toLowerCase()}.png')`;
        header.appendChild(flagImg);
        
        // Add country name
        const countryName = document.createElement('h2');
        countryName.textContent = vendor.userData.vendorName + ' Market';
        countryName.style.margin = '0';
        countryName.style.fontSize = '24px';
        header.appendChild(countryName);
        
        this.shoppingPanel.appendChild(header);
        
        // Add description
        const description = document.createElement('p');
        description.textContent = `Welcome to the ${vendor.userData.vendorName} market! We offer the finest ingredients for your cooking needs.`;
        description.style.marginBottom = '20px';
        this.shoppingPanel.appendChild(description);
        
        // Create ingredient grid
        const ingredientGrid = document.createElement('div');
        ingredientGrid.style.display = 'grid';
        ingredientGrid.style.gridTemplateColumns = 'repeat(2, 1fr)';
        ingredientGrid.style.gap = '10px';
        
        // Add ingredients from this vendor
        const ingredients = this.getCountryIngredients(vendor.userData.country);
        let hasIngredients = false;
        
        ingredients.forEach(ingredientId => {
            // Find ingredient details from the game's ingredient list
            const ingredient = this.ingredients.find(i => i.id === ingredientId);
            if (!ingredient) return;
            
            hasIngredients = true;
            
            // Create ingredient card
            const card = document.createElement('div');
            card.style.display = 'flex';
            card.style.alignItems = 'center';
            card.style.padding = '10px';
            card.style.backgroundColor = 'rgba(255, 255, 255, 0.1)';
            card.style.borderRadius = '5px';
            card.style.cursor = 'pointer';
            
            // Highlight on hover
            card.onmouseover = () => {
                card.style.backgroundColor = 'rgba(255, 255, 255, 0.2)';
            };
            card.onmouseout = () => {
                card.style.backgroundColor = 'rgba(255, 255, 255, 0.1)';
            };
            
            // Add icon
            const icon = document.createElement('div');
            icon.textContent = ingredient.icon;
            icon.style.fontSize = '30px';
            icon.style.marginRight = '10px';
            icon.style.width = '40px';
            icon.style.textAlign = 'center';
            card.appendChild(icon);
            
            // Add info
            const info = document.createElement('div');
            info.style.flex = '1';
            
            const name = document.createElement('div');
            name.textContent = ingredient.name;
            name.style.fontWeight = 'bold';
            info.appendChild(name);
            
            // Set price based on rarity
            let price = 5; // default
            switch(ingredient.rarity) {
                case 'common': price = 5; break;
                case 'uncommon': price = 10; break;
                case 'rare': price = 20; break;
                case 'legendary': price = 50; break;
            }
            
            const priceTag = document.createElement('div');
            priceTag.textContent = `${price} coins`;
            priceTag.style.fontSize = '14px';
            priceTag.style.color = '#FFD700';
            info.appendChild(priceTag);
            
            card.appendChild(info);
            
            // Add buy button
            const buyButton = document.createElement('button');
            buyButton.textContent = 'Buy';
            buyButton.style.padding = '5px 10px';
            buyButton.style.backgroundColor = '#4CAF50';
            buyButton.style.border = 'none';
            buyButton.style.borderRadius = '3px';
            buyButton.style.color = 'white';
            buyButton.style.cursor = 'pointer';
            
            buyButton.onclick = () => {
                this.buyIngredient(ingredient, price);
            };
            
            card.appendChild(buyButton);
            ingredientGrid.appendChild(card);
        });
        
        if (!hasIngredients) {
            const noIngredients = document.createElement('p');
            noIngredients.textContent = "Sorry, we're out of ingredients today!";
            noIngredients.style.textAlign = 'center';
            noIngredients.style.gridColumn = '1 / span 2';
            noIngredients.style.padding = '20px';
            ingredientGrid.appendChild(noIngredients);
        }
        
        this.shoppingPanel.appendChild(ingredientGrid);
        
        // Add close button
        const closeButton = document.createElement('button');
        closeButton.textContent = 'Close';
        closeButton.style.display = 'block';
        closeButton.style.margin = '20px auto 0';
        closeButton.style.padding = '8px 20px';
        closeButton.style.backgroundColor = '#f44336';
        closeButton.style.border = 'none';
        closeButton.style.borderRadius = '4px';
        closeButton.style.color = 'white';
        closeButton.style.cursor = 'pointer';
        
        closeButton.onclick = () => {
            document.body.removeChild(this.shoppingPanel);
            this.shoppingPanel = null;
        };
        
        this.shoppingPanel.appendChild(closeButton);
        
        // Add to document
        document.body.appendChild(this.shoppingPanel);
    }

    // Buy an ingredient
    buyIngredient(ingredient, price) {
        if (this.playerCoins >= price) {
            // Deduct coins
            this.playerCoins -= price;
            this.updateCoinDisplay();
            
            // Add to inventory
            if (!this.inventory) {
                this.inventory = {};
            }
            
            if (!this.inventory[ingredient.id]) {
                this.inventory[ingredient.id] = 0;
            }
            
            this.inventory[ingredient.id]++;
            
            // Show success message
            this.showMessage(`Bought ${ingredient.icon} ${ingredient.name}! You now have ${this.inventory[ingredient.id]}.`);
            
            // Update inventory display if it exists
            if (this.updateInventoryDisplay) {
                this.updateInventoryDisplay();
            }
        } else {
            // Show error message
            this.showMessage("Not enough coins!");
        }
    }

    // Update the addStallFlag method to use real flag images
    addStallFlag(stallGroup, countryCode, x, y, z) {
        const flagGeometry = new THREE.PlaneGeometry(2, 1.2);
        
        // Use a real flag image from a flag CDN
        const flagTexture = new THREE.TextureLoader().load(`https://flagcdn.com/w160/${countryCode.toLowerCase()}.png`);
        const flagMaterial = new THREE.MeshBasicMaterial({ 
            map: flagTexture,
            side: THREE.DoubleSide
        });
        
        const flag = new THREE.Mesh(flagGeometry, flagMaterial);
        
        // Add flagpole
        const poleGeometry = new THREE.CylinderGeometry(0.05, 0.05, 2);
        const poleMaterial = new THREE.MeshStandardMaterial({ color: 0x888888 });
        const pole = new THREE.Mesh(poleGeometry, poleMaterial);
        pole.position.set(x, y - 0.5, z);
        stallGroup.add(pole);
        
        // Position flag on pole
        flag.position.set(x + 1, y, z);
        flag.rotation.y = Math.PI / 2;
        stallGroup.add(flag);
    }

    // Get ingredients based on country
    getCountryIngredients(country) {
        // Define country-specific ingredients
        const countryIngredients = {
            'us': ['beef', 'potato', 'cheese', 'corn', 'maple_syrup'],
            'it': ['pasta', 'tomato', 'olive_oil', 'garlic', 'cheese'],
            'jp': ['fish', 'salmon', 'rice', 'seaweed', 'wasabi', 'soy_sauce'],
            'mx': ['corn', 'tomato', 'pepper', 'avocado', 'lime'],
            'fr': ['cheese', 'butter', 'bread', 'truffle', 'garlic'],
            'cn': ['rice', 'soy_sauce', 'ginger', 'tofu', 'sesame_oil'],
            'in': ['curry', 'rice', 'garlic', 'onion', 'pepper'],
            'kr': ['rice', 'gochugaru', 'sesame_oil', 'cabbage', 'garlic']
        };
        
        // Return ingredients for this country or a default set
        return countryIngredients[country] || ['potato', 'onion', 'salt', 'pepper', 'egg'];
    }

    // Update the handleVendorInteraction method to show a shopping panel
    handleVendorInteraction(vendor) {
        if (vendor.userData.isVendor) {
            // Create a shopping panel for buying ingredients
            this.showShoppingPanel(vendor);
        }
    }

    // Show a message explaining the controls
    showControlsMessage() {
        const message = document.createElement('div');
        message.style.position = 'fixed';
        message.style.top = '50%';
        message.style.left = '50%';
        message.style.transform = 'translate(-50%, -50%)';
        message.style.backgroundColor = 'rgba(0, 0, 0, 0.8)';
        message.style.color = 'white';
        message.style.padding = '20px';
        message.style.borderRadius = '10px';
        message.style.zIndex = '1000';
        message.style.maxWidth = '400px';
        message.style.textAlign = 'center';
        
        message.innerHTML = `
            <h2>Controls</h2>
            <p><b>W</b> - Move Forward</p>
            <p><b>S</b> - Move Backward</p>
            <p><b>A/D</b> - Rotate Left/Right</p>
            <p><b>E</b> - Interact with vendors</p>
            <p><b>Click</b> - Interact with countryballs</p>
            <button id="closeControls" style="padding: 8px 15px; background-color: #4CAF50; border: none; border-radius: 4px; color: white; cursor: pointer; margin-top: 10px;">Got it!</button>
        `;
        
        document.body.appendChild(message);
        
        document.getElementById('closeControls').addEventListener('click', () => {
            document.body.removeChild(message);
        });
    }

    // Create a countryball with specific country code and size
    createCountryball(countryCode, size = 1) {
        // Create the basic sphere for the countryball
        const geometry = new THREE.SphereGeometry(size, 32, 32);
        
        // Create a material based on country code
        let material;
        
        // Define colors for different countries
        const countryColors = {
            'us': 0xFFFFFF, // USA - white base
            'it': 0x009246, // Italy - green
            'jp': 0xFFFFFF, // Japan - white
            'mx': 0xFFFFFF, // Mexico - white
            'fr': 0x0055A4, // France - blue
            'cn': 0xDE2910, // China - red
            'in': 0xFF9933, // India - saffron
            'kr': 0xFFFFFF  // Korea - white
        };
        
        // Use country color or default to light gray
        const baseColor = countryColors[countryCode] || 0xCCCCCC;
        material = new THREE.MeshStandardMaterial({ color: baseColor });
        
        // Create the countryball
        const countryball = new THREE.Mesh(geometry, material);
        
        // Add eyes
        const eyeGeometry = new THREE.CircleGeometry(size * 0.15, 32);
        const eyeMaterial = new THREE.MeshBasicMaterial({ color: 0x000000 });
        
        const leftEye = new THREE.Mesh(eyeGeometry, eyeMaterial);
        leftEye.position.set(-size * 0.3, size * 0.1, size * 0.85);
        leftEye.lookAt(0, 0, size * 2);
        
        const rightEye = new THREE.Mesh(eyeGeometry, eyeMaterial);
        rightEye.position.set(size * 0.3, size * 0.1, size * 0.85);
        rightEye.lookAt(0, 0, size * 2);
        
        countryball.add(leftEye);
        countryball.add(rightEye);
        
        // Set countryball data
        countryball.userData = {
            type: 'countryball',
            country: countryCode,
            name: this.getCountryName(countryCode),
            interacting: false,
            idleTime: 0,
            maxIdleTime: Math.random() * 10000 + 5000,
            isMoving: false,
            movementTarget: new THREE.Vector3(),
            movementSpeed: 0.01 + Math.random() * 0.01,
            currentRotation: 0,
            targetRotation: 0
        };
        
        return countryball;
    }

    // Get country name from country code
    getCountryName(countryCode) {
        const countryNames = {
            'us': 'USA',
            'it': 'Italy',
            'jp': 'Japan',
            'mx': 'Mexico',
            'fr': 'France',
            'cn': 'China',
            'in': 'India',
            'kr': 'Korea',
            // Add more as needed
        };
        
        return countryNames[countryCode] || 'Unknown Country';
    }

    // Helper function to get a representative color for country flags
    getCountryFlagColor(countryCode) {
        const flagColors = {
            'us': '#0052B4', // Blue from US flag
            'it': '#009246', // Green from Italian flag
            'jp': '#BC002D', // Red from Japanese flag
            'mx': '#006847', // Green from Mexican flag
            'fr': '#0055A4', // Blue from French flag
            'cn': '#DE2910', // Red from Chinese flag
            'in': '#FF9933', // Saffron from Indian flag
            'kr': '#0047A0'  // Blue from Korean flag
        };
        
        return flagColors[countryCode] || '#CCCCCC';
    }

    // Update coin display
    updateCoinDisplay() {
        if (!this.coinDisplay) {
            // Create coin display if it doesn't exist
            this.coinDisplay = document.createElement('div');
            this.coinDisplay.style.position = 'fixed';
            this.coinDisplay.style.top = '20px';
            this.coinDisplay.style.left = '20px';
            this.coinDisplay.style.backgroundColor = 'rgba(0, 0, 0, 0.7)';
            this.coinDisplay.style.color = 'white';
            this.coinDisplay.style.padding = '10px';
            this.coinDisplay.style.borderRadius = '5px';
            this.coinDisplay.style.zIndex = '100';
            document.body.appendChild(this.coinDisplay);
        }
        
        this.coinDisplay.textContent = `Coins: ${this.playerCoins}`;
        this.coinDisplay.style.display = 'block';
    }

    // Update the handleInteraction method to make all stalls interactive
    handleInteraction() {
        // Cast a ray from the camera
        const raycaster = new THREE.Raycaster();
        const direction = new THREE.Vector3(0, 0, -1);
        direction.applyQuaternion(this.camera.quaternion);
        raycaster.set(this.camera.position, direction);
        
        // Check for intersections with interactable objects
        const intersects = raycaster.intersectObjects(this.scene.children, true);
        
        if (intersects.length > 0) {
            // Find the parent object (vendor or stall)
            let object = intersects[0].object;
            let vendor = null;
            
            // Check if we hit a vendor directly
            if (object.userData && object.userData.isVendor) {
                vendor = object;
            } else {
                // Check if we hit a stall component
                let parent = object.parent;
                while (parent) {
                    // Look for vendor in children
                    if (parent.children) {
                        for (let child of parent.children) {
                            if (child.userData && child.userData.isVendor) {
                                vendor = child;
                                break;
                            }
                        }
                    }
                    if (vendor) break;
                    parent = parent.parent;
                }
            }
            
            // If we found a vendor, interact with it
            if (vendor && vendor.userData.isVendor) {
                this.handleVendorInteraction(vendor);
                return true;
            }
        }
        
        return false;
    }
}

// Start the game when the window loads
window.onload = () => {
    const game = new CountryballGame();
}; 