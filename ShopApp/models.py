from django.db import models

# Create your models here.

class Categorie(models.Model):
    nom = models.CharField(max_length=100)
    date_ajout = models.DateField(auto_now=True)
    slug = models.SlugField()
    class Meta:
        ordering =('-date_ajout',)
    
    def __str__(self):
        return self.nom
    

class Produit(models.Model):
    titre = models.CharField(max_length=100)
    prix = models.FloatField()
    description = models.TextField()
    categorie = models.ForeignKey(Categorie, on_delete=models.CASCADE, related_name="categorie")
    image = models.ImageField(upload_to="image_produits", blank=True)
    date_ajout = models.DateField(auto_now=True)
    slug = models.SlugField()


class CarouselHero(models.Model):
    nom = models.CharField(max_length=50, null=True)
    image = models.ImageField(upload_to="carouselHero")
    categorie = models.ForeignKey(Categorie , on_delete=models.CASCADE)


