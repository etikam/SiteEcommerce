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


class Commande(models.Model):
    prenom = models.CharField(max_length=50)
    nom = models.CharField(max_length=50)
    telephone = models.CharField(max_length=50)
    email = models.CharField(max_length=50, null=True, blank=True)
    adresse = models.CharField(max_length=50)
    ville = models.CharField(max_length=50)
    pays = models.CharField(max_length=50)
    livrer = models.BooleanField(default=False)
    montant = models.FloatField()
    date_commande = models.DateField(auto_now=False, auto_now_add=False)
    autre_details = models.TextField(null=True, blank=True) #champ pour recueillir d'autre informations suplementaires que le client pourrait donner
    def __str__(self):
        return f"{self.nom}/{self.prenom}"
    

class produit_commander(models.Model):
    titre = models.CharField(max_length=50)
    quantite = models.IntegerField()
    pu = models.FloatField()
    commande = models.ForeignKey(Commande,on_delete=models.CASCADE)
    
    def prix_total(self):
        return self.pu*self.quantite


    