Dans ce répertoire nous avons fait plusieurs GITHUB actions :  
#Pour le TP :    
node-setup.yml qui correspond à la première github actions demandés dans le sujet celle-ci build notre applicaation JS. 
  
docker-image.yml qui correspond à la deuxième github actions celle-ci est déclenchée manuellement pour utiliser le fichier Dockerfile pour créer une image. 
  
Docker_push_GCR.yaml qui correspond à la troisième github actions celleci s'exécute à cchaque changement de tag SEMVER et posse l'image sur le docker
  
#Lors des différents cours :  
  
hello-world.yml cette github action s'effectue à chaque push et celle ci fait un curl sur ce site web http://wttr.in/Moon 
