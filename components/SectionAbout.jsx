// components/MyNewSection.js ou pages/index.js
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"; // Chemin vers les composants Shadcn

export default function MyNewSection() {
     return (
          <section className="p-8 bg-gray-50"> {/* Conteneur principal avec padding et fond clair */}
               <div className="text-center mb-8"> {/* Petite phrase centrée en haut */}
                    <p className="text-gray-600 text-lg font-medium">
                         Voici une petite phrase descriptive qui introduit les cartes ci-dessous.
                    </p>
               </div>

               <div className="grid grid-cols-1 md:grid-cols-3 gap-6"> {/* Grille pour les cartes : 1 colonne sur mobile, 3 sur desktop */}
                    <Card className="shadow-md hover:shadow-lg transition-shadow"> {/* Première carte */}
                         <CardHeader>
                              <CardTitle>Carte 1</CardTitle>
                         </CardHeader>
                         <CardContent>
                              <p>Ceci est le contenu de la première carte. Ajoutez du texte ou des images ici.</p>
                         </CardContent>
                    </Card>

                    <Card className="shadow-md hover:shadow-lg transition-shadow"> {/* Deuxième carte */}
                         <CardHeader>
                              <CardTitle>Carte 2</CardTitle>
                         </CardHeader>
                         <CardContent>
                              <p>Ceci est le contenu de la deuxième carte. Personnalisez-le selon vos besoins.</p>
                         </CardContent>
                    </Card>

                    <Card className="shadow-md hover:shadow-lg transition-shadow"> {/* Troisième carte */}
                         <CardHeader>
                              <CardTitle>Carte 3</CardTitle>
                         </CardHeader>
                         <CardContent>
                              <p>Ceci est le contenu de la troisième carte. Ajoutez des interactions si nécessaire.</p>
                         </CardContent>
                    </Card>
               </div>
          </section>
     );
}