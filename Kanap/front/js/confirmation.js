// la fonction main récupère l'id de commande passé en paramètre
// et l'injecte dans sur la page
function main(){
    let url = new URL(window.location.href);
    let id = url.searchParams.get("id");
    const orderId = document.getElementById("orderId");
    orderId.innerText = id;
}
main();