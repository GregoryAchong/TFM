# TFM

## Contract: reputation-draft
> crear el archivo .env , asignar el valor de PRIVATE KEY de metamask
```
SEPOLIA_PROJECT_ID=https://moonbase-alpha.public.blastapi.io
DEPLOYER_PRIVATE_KEY=
```
> build y deploy
```
npm install
npx hardhat clean
npx hardhat compile
npx hardhat run scripts/deploy.js --network moonbase
```

## UI: reputation-ui-draft
> build y desplegar en el navegador con un server como Live Server
> Tener configurado pluggin de Metamask en el navegador y conectado a Sepolia
```
npm install

```
http://127.0.0.1:5500/src/index.html

> ejemplo

![Draft UI](/images/picture.jpg)
