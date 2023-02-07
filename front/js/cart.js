// Récupération du localStorage
let getStorage = JSON.parse(localStorage.getItem("products"));

// Définir le total de la quantité et du prix à 0 par défaut et on additionne tout le panier
let totalProductsPrice = 0;
let totalProductsQuantity = 0;

// Récupération des infos de l'API par rapport à l'ID du produit dans le localStorage
function getProduct(productLocalStorage) {
    fetch(`http://localhost:3000/api/products/${productLocalStorage.id}`)
    .then((response) => {
        return response.json();
    })
    .then((productAPI) => {
        showProduct(productLocalStorage, productAPI);
    })
    .catch((error) => {
        let errorMessage = document.querySelector("#cart__items");
        errorMessage.style.textAlign = "center";
        errorMessage.style.marginBottom = "135px";
        errorMessage.textContent = ("Aucune information trouvé à partir de l'API")
    });
}

// Le code et les variables qui seront affichés dans le panier

function showProduct(productLocalStorage, productAPI) {
    let productCartItems = document.querySelector("#cart__items");
    let deleteButtons = document.getElementsByClassName("deleteItem");
    let quantityInputs = document.getElementsByClassName("itemQuantity");

    let productArticle = document.createElement("article");
    productCartItems.appendChild(productArticle);
    productArticle.className = "cart__item";
    productArticle.setAttribute('data-id', productLocalStorage.id);
    productArticle.setAttribute('data-color', productLocalStorage.colors);

    let productDivImg = document.createElement("div");
    productArticle.appendChild(productDivImg);
    productDivImg.className = "cart__item__img";
    
    let productImg = document.createElement("img");
    productDivImg.appendChild(productImg);
    productImg.src = productAPI.imageUrl;
    productImg.alt = productAPI.altTxt;

    let productContent = document.createElement("div");
    productArticle.appendChild(productContent);
    productContent.className = "cart__item__content";

    let productContentDesc = document.createElement("div");
    productContent.appendChild(productContentDesc);
    productContentDesc.className = "cart__item__content__description";

    let productName = document.createElement("h2");
    productContentDesc.appendChild(productName);
    productName.textContent = productAPI.name;

    let productColor = document.createElement("p");
    productContentDesc.appendChild(productColor);
    productColor.textContent = productLocalStorage.colors;

    let productPrice = document.createElement("p");
    productContentDesc.appendChild(productPrice);
    productPrice.textContent = productAPI.price + ' €';

    let productContentSettings = document.createElement("div");
    productContent.appendChild(productContentSettings);
    productContentSettings.className = "cart__item__content__settings";

    let productContentQuantity = document.createElement("div");
    productContentSettings.appendChild(productContentQuantity);
    productContentQuantity.className = "cart__item__content__settings__quantity";

    let productQuantity = document.createElement("p");
    productContentQuantity.appendChild(productQuantity);
    productQuantity.textContent = 'Qté : ';

    let productQuantityInput = document.createElement("input");
    productContentQuantity.appendChild(productQuantityInput);
    productQuantityInput.value = productLocalStorage.quantity;
    productQuantityInput.className = "ItemQuantity";
    productQuantityInput.setAttribute("type", "number");
    productQuantityInput.setAttribute("min", "1");
    productQuantityInput.setAttribute("max", "100");
    productQuantityInput.setAttribute("name", "itemQuantity");

    let productContentDelete = document.createElement("div");
    productContentSettings.appendChild(productContentDelete);
    productContentDelete.className = "cart__item__content__settings__delete";

    let productDelete = document.createElement("p");
    productContentDelete.appendChild(productDelete);
    productDelete.className = "deleteItem";
    productDelete.textContent = 'Supprimer';

    // On appelle les fonctions lors du clic ou changement de l'input





    // On se sert de la boucle pour additionner le total de quantité et prix des articles qu'on affiche






}