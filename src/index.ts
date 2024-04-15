import {v4 as uuidv4} from 'uuid';

class User {
    public get age(): string {
        return this._age;
    }
    public set age(value: string) {
        this._age = value;
    }
    public get name(): string {
        return this._name;
    }
    public set name(value: string) {
        this._name = value;
    }
    public get id(): string {
        return this._id;
    }
    public get cart(): Item[] {
        return this._cart;
    }
    public set cart(value: Item[]) {
        this._cart = value;
    }


    private readonly _id: string;
    private _cart: Item[];
    constructor (
        private _name: string,
        private _age: string
    ) {
        this._id = uuidv4();
        this._cart = [];
    }

    public addToCart(item:Item):void{
        this._cart.push(item);
        this.createCart();
    }

    public removeOne(item:Item):void{
        let removed:boolean = false;
        let i:number = 0;
        while (i < this.cart.length && !removed) {
            if (this.cart[i].id == item.id) {
                this.cart.splice(i,1);
                removed = true;
            } else {
                i++;
            }
        }
    }

    public removeAll(item:Item):void{
        let i:number = 0;
        while (i < this.cart.length) {
            if (this.cart[i].id == item.id) {
                this.cart.splice(i,1);
            } else {
                i++;
            }
        }
    }

    public cartTotal():number {
        let total:number = 0;
        for (let i of this.cart) {
            total += i.price;
        }
        return Math.round(total * 100) / 100;
    }

    public countItem(item:Item):number {
        let count = 0;
        this.cart.forEach((i) => (i === item && count++));
        return count;
    }

    public createCart() {
        let navCart:HTMLElement = <HTMLElement>document.getElementById('nav-cart')
        navCart.innerHTML = `View Cart: ${this.cart.length}`

        this._cart = this._cart.sort((a:Item, b:Item) => {
            return a.description.length - b.description.length
        })
        let cartSet = new Set(this.cart);
        let cartDiv = <HTMLDivElement>document.getElementById('cart-div')
        cartDiv.innerHTML = 'The Current Cart:'; //reset the cart
        if (this.cart.length === 0) {
            cartDiv.innerHTML = 'The Current Cart is empty :(';
        } else {
            for (let i of cartSet) {
                let quantity = this.countItem(i);
                let cartCard = this.cartItemCard(i, quantity);
                cartDiv?.append(cartCard)
            }
        }
        let total:HTMLElement = document.createElement('h4');
        total.innerHTML = `Current Total: $${this.cartTotal()}`
        cartDiv?.append(total);
    }

    private cartItemCard(item:Item, quantity:number):HTMLDivElement {
        let mainDiv: HTMLDivElement = document.createElement('div');
        let title: HTMLElement = document.createElement('h4');
        let subheading: HTMLElement = document.createElement('p');
        let removeOne: HTMLButtonElement = document.createElement('button');
        let removeAll: HTMLButtonElement = document.createElement('button');
        title.innerHTML = item.name;
        subheading.innerHTML = `# in cart: ${quantity} | Price: $${Math.round(quantity*item.price*100)/100}`;
        removeOne.innerHTML = `Remove 1`;
        removeAll.innerHTML = `Remove All`;
        removeOne.addEventListener('click', () => {
            this.removeOne(item);
            this.createCart();
        });
        removeAll.addEventListener('click', () => {
            this.removeAll(item);
            this.createCart();
        })
        mainDiv.append(title, subheading, removeOne, removeAll)
        return mainDiv
    }

    static loginUser(): User|undefined {
        let inputName:string|null|undefined = (<HTMLInputElement>document.getElementById('name-input')).value;
        let inputAge:string|null|undefined = (<HTMLInputElement>document.getElementById('age-input')).value;
        if (inputName && inputAge) {
            return new User(inputName, inputAge);
        } else {
            return undefined;
        }
    }
}

class Item {
    readonly id:string;
    constructor (
        public name: string,
        public price: number,
        public description: string
    ){
        this.id = uuidv4()
    }
}

// Class shop will hold our items
// Along with a reference to the current user
// So that clicking Add to cart actually adds to the current user's cart

class Shop {
    static myUser:User|undefined;
    public items = new Set<Item>();
    constructor(user:User|undefined) {
        Shop.myUser = user;
    }

    public addToShop(item:Item):void {
        this.items.add(item)
    }

    public showShop():void {
        let shopDiv = <HTMLDivElement>document.getElementById('shop-div')
        shopDiv.innerHTML = ''; //reset the cart
        for (let i of this.items) {
            let shopItem = this.shopItemCard(i)
            shopDiv?.append(shopItem)
        }
    }

    public shopItemCard(item:Item):HTMLDivElement {
        let mainDiv: HTMLDivElement = document.createElement('div');
        mainDiv.classList.add('shop-item');
        mainDiv.style.border = 'dashed black 1px'
        let title: HTMLElement = document.createElement('h4');
        title.classList.add('shop-item-title');
        let description: HTMLElement = document.createElement('p');
        title.classList.add('shop-item-description');
        let addButton: HTMLButtonElement = document.createElement('button');
        title.classList.add('shop-item-button');
        title.innerHTML = `${item.name} --------- $${item.price}`;
        description.innerHTML = `About this item: ${item.description}`;
        addButton.innerHTML = `Add to cart`;
        addButton.addEventListener('click', () => {
            Shop.myUser?.addToCart(item);
        })
        mainDiv.append(title, description, addButton)
        return mainDiv
    }

}

////// TESTING CODE //////
// Allow for login
let loginButton:HTMLButtonElement = <HTMLButtonElement>document.getElementById('login-button');

// Get main divs
let loginDiv = <HTMLDivElement>document.getElementById('login-div');
let shopDiv = <HTMLDivElement>document.getElementById('shop-div');
let cartDiv = <HTMLDivElement>document.getElementById('cart-div');
let mainDivs = [loginDiv, shopDiv, cartDiv]


// Setup the navigation bar
let loginNav = <HTMLElement>document.getElementById('nav-login')
loginNav.addEventListener('click', () => {
    for (let div of mainDivs) {
        div.style.display = 'none';
    }
    loginDiv.style.display = 'block';
})
let shopNav = <HTMLElement>document.getElementById('nav-shop')
shopNav.addEventListener('click', () => {
    for (let div of mainDivs) {
        div.style.display = 'none';
    }
    shopDiv.style.display = 'block';
})
let cartNav = <HTMLElement>document.getElementById('nav-cart')
cartNav.addEventListener('click', () => {
    for (let div of mainDivs) {
        div.style.display = 'none';
    }
    cartDiv.style.display = 'block';
})



// Create the items to be displayed:
let i1 = new Item('Code Compiler', 200.00, 'A tool that transforms source code into executable code')
let i2 = new Item('Bug Exterminator', 150.00, 'A magical tool that automatically fixes all bugs in your code')
let i3 = new Item('Idea Generator', 500.00, 'A device that generates innovative programming project ideas')
let i4 = new Item('Syntax Corrector', 100.00, 'A tool that automatically corrects syntax errors in your code')
let i5 = new Item('Logic Enhancer', 300.00, 'A tool that optimizes the logic of your algorithms')
let i6 = new Item('Efficiency Booster', 250.00, 'A tool that improves the efficiency of your code')
let i7 = new Item('Code Formatter', 50.00, 'A tool that automatically formats your code according to best practices')
let i8 = new Item('Comment Writer', 75.00, 'A tool that automatically writes meaningful comments for your code')
let i9 = new Item('Code Translator', 350.00, 'A tool that translates your code into any programming language')
let i10 = new Item('Deadline Extender', 400.00, 'A magical tool that extends your project deadlines')

const itemList = [i1, i2, i3, i4, i5, i6, i7, i8, i9, i10]




let shop:Shop;
let user:User|undefined;
loginButton.addEventListener('click', () => {
    user = User.loginUser()
    if (!user) {
        console.log("ERROR: input a valid name and age");
        (<HTMLInputElement>document.getElementById('name-input')).value = '';
        (<HTMLInputElement>document.getElementById('age-input')).value = '';
        (<HTMLInputElement>document.getElementById('name-input')).placeholder = 'ERROR: Input valid Name';
        (<HTMLInputElement>document.getElementById('age-input')).placeholder = 'ERROR: Input valid Age';
    } else {
        for (let div of mainDivs) {
            div.style.display = 'none';
        }
        shopDiv.style.display = 'block';
        shop = new Shop(User.loginUser())
        for (let item of itemList) {
            shop.addToShop(item);
        }
        shop.showShop();
        Shop.myUser?.createCart();
        (<HTMLInputElement>document.getElementById('name-input')).value = '';
        (<HTMLInputElement>document.getElementById('age-input')).value = '';
    }
})





