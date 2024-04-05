from django.shortcuts import render
from .models import * 
from django.utils import timezone
import json
from django.core.paginator import Paginator

# Create your views here.

def accueil(request):
    carousels = CarouselHero.objects.all()
    produit = Produit.objects.all().order_by("date_ajout")
    categories= Categorie.objects.all()
    
    context= {
        'carousels':carousels,
        'produits':produit,
        'categories':categories,
    }
    
    
    return render(request,"accueil/index.html",context)




def products(request):
    context = {
            "nom":"KAMANO"
        }
    return render(request,"produits/partition/index.html",context)


def detail_produit(request,slug):
    produit = Produit.objects.get(slug=slug)
    related_produits = Produit.objects.filter(categorie=produit.categorie).exclude(id=produit.id)
    toutes_categorie = Categorie.objects.all()
     
    context = {
        "produit":produit,
        "related_produit":related_produits,
        "categories":toutes_categorie,
    }   
    return render(request,"details/index.html",context)


def passer_commande(request):
    if request.method == "POST":
        # Capturer les données du formulaire
        prenom = request.POST.get("prenom")
        nom = request.POST.get("nom")
        telephone = request.POST.get("telephone")
        email = request.POST.get("email")
        adresse = request.POST.get("adresse")
        ville = request.POST.get("ville")
        pays = request.POST.get("pays")
        montant = float(request.POST.get("montant"))
    
        autre_details = request.POST.get("autre_info")

        # Capturer les données du panier depuis le localStorage
        panier = json.loads(request.POST.get("panier"))
        # Créer une instance de Commande et sauvegarder dans la base de données
        commande = Commande.objects.create(
            prenom=prenom,
            nom=nom,
            telephone=telephone,
            email=email,
            adresse=adresse,
            ville=ville,
            pays=pays,
            montant=montant,
            date_commande=timezone.now(),
            autre_details=autre_details
        )
        
        # Enregistrer chaque produit commandé dans la base de données
        for produit_id, produit_info in panier.items():
            produit_commander.objects.create(
                titre=produit_info['nom'],
                quantite=produit_info['quantite'],
                pu=produit_info['prix'],
                commande=commande
            )

        # Rediriger vers la page de succès de la commande
        return render(request, "commande_succes.html")
    else:
        return render(request, "info_to_commande.html")
   

def boutique(request):
    produits_list = Produit.objects.all().order_by("date_ajout")
    paginator = Paginator(produits_list, 10)  # 10 produits par page pour le systeme de pagination
    page_number = request.GET.get('page')
    produits = paginator.get_page(page_number)
    categories = Categorie.objects.all()

    context = {
        'produits': produits,
        'categories': categories
    }
    return render(request, "boutique/index.html", context)