"use client";
// Import des modules et des styles nécessaires
import React, { useEffect, useRef, useState } from "react";
import Chart from "chart.js/auto";

// Définition du composant fonctionnel
const Page = () => {
  // Référence à l'élément canvas pour le graphique
  const chartRef = useRef<HTMLCanvasElement>(null);
  // State pour stocker l'instance du graphique
  const [myChart, setMyChart] = useState<Chart | null>(null);

  // Effet pour dessiner ou mettre à jour le graphique
  useEffect(() => {
    // Définition des valeurs X
    const xValues = [100, 200, 300, 400, 500, 600, 700, 800, 900, 1000];
    // Données fictives
    const fakeData = {
      dataset1: [860, 1140, 1060, 1060, 1070, 1110, 1330, 2210, 7830, 2478],
      dataset2: [1600, 1700, 1700, 1900, 2000, 2700, 4000, 5000, 6000, 7000],
      dataset3: [300, 700, 2000, 5000, 6000, 4000, 2000, 1000, 200, 100],
    };

    // Vérification de l'existence de la référence
    if (chartRef && chartRef.current) {
      // Destruction du graphique existant s'il y en a un
      if (myChart) {
        myChart.destroy();
      }

      // Création du nouveau graphique
      const newChart = new Chart(chartRef.current, {
        type: "line",
        data: {
          labels: xValues,
          datasets: [
            {
              data: fakeData.dataset1,
              borderColor: "red",
              fill: false,
            },
            {
              data: fakeData.dataset2,
              borderColor: "green",
              fill: false,
            },
            {
              data: fakeData.dataset3,
              borderColor: "blue",
              fill: false,
            },
          ],
        },
        options: {
          legend: { display: false },
        },
      });
      // Mise à jour du state avec le nouveau graphique
      setMyChart(newChart);
    }

    // Fonction de nettoyage
    return () => {
      if (myChart) {
        myChart.destroy();
      }
    };
  }, []); // Ce tableau vide signifie que cet effet ne s'exécute qu'une seule fois, équivalent à componentDidMount

  // Rendu du composant
  return (
    <div>
      {/* Canvas pour le graphique */}
      <canvas ref={chartRef} style={{ width: "100%", maxWidth: "600px" }} />
      {/* Liste des tâches (commentée pour le moment) */}
      <h1>Listes des tâches</h1>
      <ul>{/* Contenu de la liste des tâches */}</ul>
    </div>
  );
};

// Export du composant
export default Page;
