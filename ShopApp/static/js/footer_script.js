$(document).ready(function() {
    // Tronquer la description de chaque produit à 20 caractères
    //CODE POUR TRONQUER LA DESCRIPTON DES ARTICLE SUR LES CARD
    $('.product-description').each(function() {
        var description = $(this).text();
        if (description.length > 20) {
            $(this).text(description.substring(0, 20) + '...');
        }
    });


    // Gestionnaire d'événements pour le clic sur l'icône de panier
    $('#panier-link').click(function() {
        $('#modal-panier').modal('show'); // Ouvre le modal
    });

    $('.close').click(function() {
        $('#modal-panier').modal('hide'); // Ferme le modal
    });     

    $('#close_fermer').click(function() {
        $('#modal-panier').modal('hide'); // Ferme le modal
    });

// cHARGEMENT DU PANIER PAR LES PRODUIT DU LOCALSTORAGE
    afficherProduitsDuPanierDansModal();
    
    $(document).on('click','.ajout', function(){
        var panier = localStorage.getItem("panier") ? JSON.parse(localStorage.getItem("panier")) : {};
        var id_produit = this.id.toString();
        var valeur = document.getElementById("valeur").value;
        var total = sommePrix();

        valeur = parseInt(valeur);
        var p = parseInt("{{produit.prix}}");
        var produitInfo = {
            nom: "{{ produit.titre }}",
            image: "{{ produit.image.url }}",
            prix: p,
            quantite: valeur,  
            p_total: p * valeur // Calcul du prix total du produit
        };
        
        if (panier[id_produit] !== undefined) {
            panier[id_produit].quantite += valeur;
            panier[id_produit].p_total += produitInfo.p_total; // Mettre à jour le prix total du produit
        } else {
            panier[id_produit] = produitInfo;
        }

        // Ajout du prix total du produit au total actuel
        total += produitInfo.p_total;
        

        localStorage.setItem("panier", JSON.stringify(panier));
        localStorage.setItem("total", total.toFixed(2)); // Stockage du total dans le localStorage avec deux décimales
        var nb_article = document.getElementById("nb_article");
        nb_article.innerHTML = Object.keys(panier).length;

        
        afficherProduitsDuPanierDansModal();
        
        // Mise à jour du total dans la facture
        
    });


});


function sommePrix() {
    var panier = localStorage.getItem("panier") ? JSON.parse(localStorage.getItem("panier")) : {};
    var somme = 0;
    for (var key in panier) {
        if (panier.hasOwnProperty(key)) {
            somme += panier[key].p_total;
        }
    }
    return somme;
}

function afficherProduitsDuPanierDansModal() {
   
    var panier = localStorage.getItem("panier") ? JSON.parse(localStorage.getItem("panier")) : {};
    var total = localStorage.getItem("total") ? parseFloat(localStorage.getItem("total")) : 0.00; // Initialisation du total

    // Afficher le nombre d'articles dans le badge de l'icône du panier
    var nb_article = document.getElementById("nb_article"); //recuperation de la badge numérique du panier
    nb_article.innerHTML = Object.keys(panier).length;


    //REMPLISSAGE DU TABLEAU DU PANIER
    var tbody = $('#modal-panier').find('tbody'); //TROUVER LE BODY DU TABLEAU DU PANIER
    tbody.empty(); // Vide le contenu actuel du tableau avant de l'actualiser
    
    // Itération sur le panier dans le localStorage
    for (var key in panier) {
        if (panier.hasOwnProperty(key)) {
            var produit = panier[key];
            var id_unique = 'ligne_produit_' + key; // Créer un ID unique pour chaque ligne

            // Construction de la ligne du tableau avec les informations du produit
            var nouvelleLigne = '<tr id="' + id_unique + '">' +
                '<th scope="row">' +
                '<div class="d-flex align-items-center">' +
                '<img src="' + produit.image + '" class="img-fluid me-5 rounded-circle" style="width: 80px; height: 80px;" alt="">' +
                '</div>' +
                '</th>' +
                '<td>' +
                '<p class="mb-0 mt-4">' + produit.nom + '</p>' +
                '</td>' +
                '<td>' +
                '<p class="mb-0 mt-4">' + produit.prix + '</p>' +
                '</td>' +
                '<td>' +
                '<div class="input-group quantity mt-4" style="width: 100px;">' +
                '<input type="text" class="form-control form-control-sm text-center border-0" readonly value="' + produit.quantite + '">' +
                '</div>' +
                '</td>' +
                '<td>' +
                '<p class="mb-0 mt-4">' + produit.prix * produit.quantite + '</p>' +
                '</td>' +
                '<td>' +
                '<button class="btn btn-md rounded-circle bg-light border mt-4 btn-supprimer-produit" data-id="' + key + '">' +
                '<i class="fa fa-times text-danger"></i>' +
                '</button>' +
                '</td>' +
                '</tr>';

            // Ajout de la nouvelle ligne au tableau
            tbody.append(nouvelleLigne);
        }
    }


    // Ajout des gestionnaires d'événements pour les boutons de suppression de produit
    $('.btn-supprimer-produit').click(function() {
        var id_produit = $(this).data('id');
        var id_ligne = 'ligne_produit_' + id_produit; // Récupérer l'ID unique de la ligne
        // Supprimer la ligne correspondSante du tableau
        $('#' + id_ligne).remove();
        // Supprimer le produit correspondant de panier
        total -= panier[id_produit].p_total; // Réduire le total du prix du produit supprimé
        delete panier[id_produit];
        // Mettre à jour le panier dans le stockage local
        localStorage.setItem("panier", JSON.stringify(panier));
        localStorage.setItem("total", total.toFixed(2)); // Stockage du nouveau total dans le localStorage avec deux décimales
        // Actualiser le nombre d'articles dans le badge de l'icône du panier
       
        if(Object.keys(panier).length == 0){
            console.log("je detruit le panier");
            localStorage.removeItem('panier');
            console.log("je detruit le total")
            localStorage.removeItem('total');
            $('#nb_article').text(0);
        }else{
            $('#nb_article').text(Object.keys(panier).length);
            $('#total').text(total.toFixed(2));
        }
        // Actualiser le total dans la facture
        var nombreArticles = Object.keys(panier).length;

        $('#nombre_articles').html(nombreArticles);
        $('#prix_total').html(total.toFixed(2));
        
    });
            
    var nombreArticles = Object.keys(panier).length;

    $('#nombre_articles').html(nombreArticles);
    $('#prix_total').html(total.toFixed(2));
}




//CODE POUR LA PAGE D'INFO COMMANDE

function afficherProduitsDuPanierDansModalEtExterne() {
    console.log("J'appelle la fonction pour afficher le dans la page");
    var panier = localStorage.getItem("panier") ? JSON.parse(localStorage.getItem("panier")) : {};
    var nb_article = document.getElementById("nb_article");
    if (nb_article) {
        nb_article.innerHTML = Object.keys(panier).length;
    }

    // Afficher le nombre d'articles dans le badge de l'icône du panier
    $('#nb_article').text(Object.keys(panier).length);

    // Tableau externe où afficher le contenu du panier
    var tbodyExterne = $('#panier_externe').find('tbody');
    tbodyExterne.empty(); // Vide le contenu actuel du tableau externe

    // Itération sur le panier dans le localStorage
    for (var key in panier) {
        if (panier.hasOwnProperty(key)) {
            var produit = panier[key];
            var id_unique = 'ligne_produit_' + key; // Créer un ID unique pour chaque ligne

            // Construction de la ligne du tableau avec les informations du produit
            var nouvelleLigne = '<tr id="' + id_unique + '">' +
                '<th scope="row">' +
                '<div class="d-flex align-items-center">' +
                '<img src="' + produit.image + '" class="img-fluid me-5 rounded-circle" style="width: 80px; height: 80px;" alt="">' +
                '</div>' +
                '</th>' +
                '<td>' +
                '<p class="mb-0 mt-4">' + produit.nom + '</p>' +
                '</td>' +
                '<td>' +
                '<p class="mb-0 mt-4">' + produit.prix + '</p>' +
                '</td>' +
                '<td>' +
                '<div class="input-group quantity mt-4" style="width: 100px;">' +
                '<input type="text" class="form-control form-control-sm text-center border-0" readonly value="' + produit.quantite + '">' +
                '</div>' +
                '</td>' +
                '<td>' +
                '<p class="mb-0 mt-4">' + produit.prix * produit.quantite + '</p>' +
                '</td>' +
               
                '</tr>';

            // Ajout de la nouvelle ligne au tableau externe
            tbodyExterne.append(nouvelleLigne);
        }
    }

    // Ajout des gestionnaires d'événements pour les boutons de suppression de produit
    $('.btn-supprimer-produit').click(function() {
        var id_produit = $(this).data('id');
        var id_ligne = 'ligne_produit_' + id_produit; // Récupérer l'ID unique de la ligne 
        $('#' + id_ligne).remove();
        delete panier[id_produit];
        localStorage.setItem("panier", JSON.stringify(panier));
        $('#nb_article').text(Object.keys(panier).length);
    });
}
function calculerMontantTotal() {
    var panier = localStorage.getItem("panier") ? JSON.parse(localStorage.getItem("panier")) : {};
    var montantTotal = 0;
    
    // Itération sur le panier pour calculer le montant total
    for (var key in panier) {
        if (panier.hasOwnProperty(key)) {
            var produit = panier[key];
            montantTotal += produit.prix * produit.quantite;
        }
    }
    
    return montantTotal;
}

// Mettez à jour le champ de texte montant avec le montant total calculé
function mettreAJourMontantTotal() {
    var montantTotal = calculerMontantTotal();
    document.getElementById("montant").value = montantTotal.toFixed(2); // Afficher le montant avec 2 décimales
}

// Appelez cette fonction lorsque vous souhaitez afficher le montant total
mettreAJourMontantTotal();

afficherProduitsDuPanierDansModalEtExterne();


$('form').submit(function() {
    var panier = localStorage.getItem("panier") ? localStorage.getItem("panier") : {};
    $('#panier_input').val(panier);
    return true; // Soumettre le formulaire après la mise à jour du champ panier
});