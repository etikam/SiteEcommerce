from django.shortcuts import render
from .models import * 
import json

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



def cart(request):
    if request.method == 'POST':
        # Récupérer les données du panier envoyées par la requête POST
        panier_data = request.POST.get('panier', None)

        # Vérifier si des données de panier ont été envoyées
        if panier_data:
            # Convertir les données du panier au format JSON en objet Python
            panier = json.loads(panier_data)

            # Récupérer les produits du panier depuis la base de données
            produits = Produit.objects.filter(id__in=panier.keys())

            # Calculer la somme des prix des produits dans le panier
            total_prix = sum(produit.prix * panier[str(produit.id)] for produit in produits)

            # Envoyer les données calculées à un template pour affichage
            context = {
                'produits': produits,
                'total_prix': total_prix
            }
            return render(request, 'cart.html', context)

    else:
        return render(request,"404.html")
   