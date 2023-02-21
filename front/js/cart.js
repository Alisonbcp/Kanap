// Récupération du localStorage
let getStorage = JSON.parse(localStorage.getItem("products"));

// Définir le total de la quantité et du prix à 0 par défaut et on additionne tout le panier
let totalProductsPrice = 0;
let totalProductsQuantity = 0;

// Configuration des regexp
let emailRegExp = new RegExp('^[A-Za-z0-9.-_]+[@]{1}[A-Za-z0-9.-_]+[.]{1}[a-z]{2,}$');
let caractRegExp = new RegExp("^[A-Za-zàâäéèêëïîôöùûüç'-]+$");
let cityRegExp = new RegExp("^[A-Za-zàâäéèêëïîôöùûüç '-]+$");
let addressRegExp = new RegExp("^[0-9]{1,3}(?:(?:[,. ]){1}[-A-Za-zàâäéèêëïîôöùûüç]+)+");

// bouton commander et lancement de la fonction de contrôle du formulaire
const btn_commander = document.getElementById("order");
btn_commander.addEventListener("click", (event) => submitForm(event));


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
    for (let button of deleteButtons) {
        button.addEventListener("click", removeProduct);
    }

    for (let input of quantityInputs) {
        input.addEventListener("change", editQuantityProduct);
    }
    // On se sert de la boucle pour additionner le total de quantité et prix des articles qu'on affiche
    totalProductsQuantity += productLocalStorage.quantity;
    totalProductsPrice += productLocalStorage.quantity * productAPI.price;

    let showTotalQuantity = document.querySelector("#totalQuantity");
    let showTotalPrice = document.querySelector("#totalPrice");

    showTotalQuantity.textContent = totalProductsQuantity;
    showTotalPrice.textContent = totalProductsPrice;
}

// Un boucle pour afficher les produits dans le panier
function addProduct() {
    if (getStorage == null || getStorage.length == 0) {
        let errorMessage = document.querySelector("#cart__items");
        errorMessage.style.textAlign = "center";
        errorMessage.style.marginBottom = "135px";
        errorMessage.textContent = ("Votre panier est vide");
    } else {
        for (let product of getStorage) {
            getProduct(product);
        }
    }
}

// On retire le produit du localStorage en fonction de son ID et sa couleur
function removeProduct(click) {
    let targetProduct = click.target.closest("article");
    getStorage = getStorage.filter(product => product._id !== targetProduct.dataset.id && product.colors !== targetProduct.dataset.color);
    localStorage.setItem("products", JSON.stringify(getStorage));

    alert("Le produit a été supprimé");
    window.location.reload();
}

// On modifie la quantité du produit et on le remplace dans le localStorage
function editQuantityProduct(click) {
    let targetProduct = click.target.closest("article");
    let quantityProduct = click.target.closest(".itemQuantity");

    //On mets la quantité à 1 par défaut si on essaye de mettre en dessous
    if (quantityProduct.value < 1) {
        quantityProduct.value = 1;
    } else {
        // On cherche un produit par son ID/couleur dans le localStorage et on récupère sa quantité pour la remplacer par celle présente dans l'input
        let foundProduct = getStorage.find(product => product.id == targetProduct.dataset.id && product.colors == targetProduct.dataset.color);
        let newQuantity = parseInt(quantityProduct.value);
        foundProduct.quantity = newQuantity;
        localStorage.setItem("product", JSON.stringify(getStorage));
    }
}

//On vérifie que regexp est valide pour les textes
function validInput(inputText) {
    let inputErrorMessage = input.Text.nextElementSibling;

    if (textRegExp.test(inputText.value)) {
        inputErrorMessage.textContent = '';
        return true;
    } else {
        inputErrorMessage.textContent = 'Veuillez entrer un texte valide';
        return false;
    }
};

//validation du prénom
function validFirstName(inputFirstName) {
    let firstNameErrorMsg = document.querySelector("#firstNameErrorMsg");

    if (caractRegExp.test(inputFirstName.value)) {
        firstNameErrorMsg.innerHTML = '';
        return true
    } else {
        firstNameErrorMsg.innerHTML = 'Veuillez saisir un prénom sans espace ex: Mon-prénom ou Prénom.';
        return false
    }
};

//validation du nom
function validLastName(inputLastName) {
    let lastNameErrorMsg = document.querySelector("#lastNameErrorMsg");

    if (caractRegExp.test(inputLastName.value)) {
        lastNameErrorMsg.innerHTML = '';
        return true
    } else {
        lastNameErrorMsg.innerHTML = 'Veuillez saisir un nom sans espace ex: Mon-nom ou Nom.';
        return false
    }
};

//validation de l'adresse
function validAddress(inputAddress) {
    let addressErrorMsg = document.querySelector("#addressErrorMsg");

    if (addressRegExp.test(inputAddress.value)) {
        addressErrorMsg.innerHTML = '';
        return true
    } else {
        addressErrorMsg.innerHTML = 'Veuillez saisir une adresse comportant un numéro ex: 45 rue des kanaps.';
        return false
    }
};

//validation de la ville
function validCity(inputCity) {
    let cityErrorMsg = document.querySelector("#cityErrorMsg");

    if (cityRegExp.test(inputCity.value)) {
        cityErrorMsg.innerHTML = '';
        return true
    } else {
        cityErrorMsg.innerHTML = "Veuillez saisir le nom d'une ville sans chiffres ni caractères spéciaux.";
        return false

    }
};

//validation de l'email
function validEmail(inputEmail) {
    let emailErrorMsg = document.querySelector("#emailErrorMsg");

    if (emailRegExp.test(inputEmail.value)) {
        emailErrorMsg.innerHTML = '';
        return true
    } else {
        emailErrorMsg.innerHTML = "Veuillez saisir une adresse email valide exemple : votreadresse@kanapmail.fr .";
        return false
    }
};

//Envoi des informations client au localStorage après validation
function submitForm(click) {
    click.preventDefault();

    //Récupération des coordonnées du formulaire client
    let inputName = document.getElementById('firstName');
    let inputLastName = document.getElementById('lastName');
    let inputAdress = document.getElementById('address');
    let inputCity = document.getElementById('city');
    let inputMail = document.getElementById('email');

    // récupération de la validité des informations.
    let resFirstName = validFirstName(inputName);
    let resLastName = validLastName(inputLastName);
    let resAdress = validAddress(inputAdress);
    let resCity = validCity(inputCity);
    let resMail = validEmail(inputMail);

    // si toutes les validations sont à true la requète au serveur peut être effectuée
    if (localStorage == "") {
        alert("Votre panier ne contient aucun article")
    } else if (resFirstName && resLastName && resAdress && resCity && resMail && localStorage != "") {

        // Tableau pour stocker uniquement les ID des produits
        let productID = [];
        for (let i = 0; i < getStorage.length; i++) {
            productID.push(getStorage[i].id);
        }

        // Objet pour stocker les informations du formulaire et ID produits
        const orderObject = {
            contact: {
                firstName: inputName.value,
                lastName: inputLastName.value,
                address: inputAdress.value,
                city: inputCity.value,
                email: inputMail.value,
            },
            products: productID,
        }

        // Les options pour la méthode POST de fetch
        const fetchOptions = {
            method: 'POST',
            body: JSON.stringify(orderObject),
            headers: {
                "Content-Type": "application/json"
            }
        };
        // On récupère les options et le tableau avec le contact et les ID
        fetch("http://localhost:3000/api/products/order", fetchOptions)
            .then((response) => response.json())
            .then((data) => {
                localStorage.clear();
                document.location.href = `./confirmation.html?orderId=${data.orderId}`;
            })
            .catch((err) => {
                alert("Aucune information trouvé à partir de l'API" + err.message);
            });
    } else {
        alert("Le formulaire est incomplet ou incorrect");
    }
};
// On lance les fonctions
addProduct();
