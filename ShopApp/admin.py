from django.contrib import admin
from .models import Categorie, Produit, CarouselHero
# Register your models here.

class AdminCategory(admin.ModelAdmin):
    list_display = ("nom","date_ajout")
    prepopulated_fields = {'slug': ('nom',)}

class AdminCarouselHero(admin.ModelAdmin):
    list_display = ("nom","image","categorie")
class AdminProduit(admin.ModelAdmin):
    list_display = ("titre","prix","categorie","description","image","date_ajout")
    prepopulated_fields = {'slug': ('titre',)}
    
    
admin.site.register(Categorie,AdminCategory)
admin.site.register(Produit,AdminProduit)
admin.site.register(CarouselHero,AdminCarouselHero)

