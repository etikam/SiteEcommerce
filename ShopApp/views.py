from django.shortcuts import render
from .models import * 

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