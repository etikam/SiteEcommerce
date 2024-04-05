from django.contrib import admin
from .models import *
# Register your models here.

class AdminCategory(admin.ModelAdmin):
    list_display = ("nom","date_ajout")
    prepopulated_fields = {'slug': ('nom',)}

class AdminCarouselHero(admin.ModelAdmin):
    list_display = ("nom","image","categorie")
class AdminProduit(admin.ModelAdmin):
    list_display = ("titre","prix","categorie","description","image","date_ajout")
    prepopulated_fields = {'slug': ('titre',)}
    list_filter =("prix","categorie","date_ajout")
    search_fields=("titre","categorie__nom")

class AdminCommande(admin.ModelAdmin):
    list_display = ("nom","prenom","montant","telephone","email","adresse","date_commande","pays","ville","livrer")
    list_filter = ("nom","montant","telephone","adresse","date_commande","pays","ville","livrer")
    search_fields = ("pays","nom","prenom","ville")
    
class AdminProduitCommander(admin.ModelAdmin):
    list_display = ("titre","quantite","pu","commande")
    
    

admin.site.register(Categorie,AdminCategory)
admin.site.register(produit_commander,AdminProduitCommander)
admin.site.register(Commande,AdminCommande)
admin.site.register(Produit,AdminProduit)
admin.site.register(CarouselHero,AdminCarouselHero)

