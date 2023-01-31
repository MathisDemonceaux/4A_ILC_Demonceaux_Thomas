# Projet CI/CD : API REST de transactions bancaires

Par Mathis DEMONCEAUX et Gauthier THOMAS, en spécialité ILC.

Ce projet a pour but de mettre en place un pipeline de CI/CD pour un projet d'API REST en utilisant les outils suivants :
- GitHub
- GitHub Actions
- Node.js (Express)
- Swagger

 ## Choix sujet et choix du langage

Pour ce projet nous avons décidés de prendre le premier sujet qui nous a été proposé car nous n'avions pas d'autres sujet de prédilection. Nous avons fait ce projet à l'aide de Node.js car un Gauthier avait déjà de solides bases dans ce langage.

## Choix de l'algorithme de hachage

Nous avons décider d'utiliser SHA-256 pour plusieurs raisons :

- C'est l'un des algorithme de hachage le plus utilisé
- Il est considéré comme l'un des algorithmes de hachage le plus sécurisé
- Cet algorithme est très fiable et à été utilisé dans beaucoup d'applications
- Il est également de très bonnes performances en terme de vitesse de calcul

## Installation de l'API

Pour installer le projet, il suffit de cloner le dépôt GitHub et d'installer les dépendances avec la commande suivante :

```bash
npm install
```

Pour lancer le serveur, il suffit de lancer la commande suivante :

```bash
npm start
```

## Utilisation de l'API

L'API s'utilise avec des requêtes HTTP, à l'adresse suivante : http://localhost:3000/

Les routes de l'API sont documentées dans le fichier swagger.yaml, qui est utilisé par Swagger pour générer la documentation de l'API.

## Statuts des workflows

![Node.js Application Build](https://github.com/MathisDemonceaux/4A_ILC_Demonceaux_Thomas/actions/workflows/node-setup.yml/badge.svg)

![Docker Image Build](https://github.com/MathisDemonceaux/4A_ILC_Demonceaux_Thomas/actions/workflows/docker-image.yml/badge.svg)

![Push Docker to GCR](https://github.com/MathisDemonceaux/4A_ILC_Demonceaux_Thomas/actions/workflows/Docker_push_GCR.yaml/badge.svg)