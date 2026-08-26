# Abastecimento de Veículos 

Aplicação web responsiva desenvolvida para registrar e acompanhar o histórico de abastecimentos de um veículo, calculando automaticamente o preço médio por litro e o consumo médio em km/L.

## 📌 Sobre o projeto

O projeto **Abastecimento de Veículos** foi desenvolvido como parte de um desafio de programação, com o objetivo de criar uma aplicação capaz de armazenar um histórico de abastecimentos e analisar o consumo do veículo.

O sistema utiliza os dados de litros abastecidos, valor pago e quilometragem para realizar os cálculos.

O preço por litro é calculado utilizando a seguinte fórmula:

**Preço por litro = valor pago ÷ litros**

O consumo do veículo é calculado considerando o abastecimento anterior:

**Consumo = (quilometragem atual − quilometragem anterior) ÷ litros**

Exemplo:

* Quilometragem anterior: 50.000 km
* Quilometragem atual: 50.400 km
* Litros abastecidos: 35 L
* Consumo: `(50.400 − 50.000) ÷ 35 = 11,43 km/L`

Os registros são armazenados localmente no navegador utilizando **localStorage**.

## 🚀 Funcionalidades

* Cadastro de abastecimentos
* Registro da data
* Registro do tipo de combustível
* Registro da quantidade de litros
* Registro do valor pago
* Registro da quilometragem do veículo
* Cálculo automático do preço por litro
* Cálculo do consumo do veículo em km/L
* Cálculo do preço médio por litro
* Cálculo do consumo médio do veículo
* Exclusão de abastecimentos
* Edição dos registros através de um modal
* Persistência dos dados com `localStorage`
* Gráfico comparativo dos abastecimentos
* Tema escuro
* Interface responsiva para diferentes tamanhos de tela

## 🛠️ Tecnologias utilizadas

* HTML5
* CSS3
* JavaScript
* LocalStorage
* Chart.js

## 🧮 Cálculos

O preço por litro é calculado utilizando:

**Preço por litro = valor pago ÷ litros**

Onde:

* **valor pago** = valor total do abastecimento
* **litros** = quantidade de combustível abastecida

O consumo do veículo é calculado utilizando:

**Consumo = (quilometragem atual − quilometragem anterior) ÷ litros**

Onde:

* **quilometragem atual** = quilometragem registrada no abastecimento atual
* **quilometragem anterior** = quilometragem registrada no abastecimento anterior
* **litros** = quantidade abastecida no abastecimento atual

O primeiro abastecimento não possui consumo em km/L, pois ainda não existe um abastecimento anterior para realizar o cálculo.

## 💾 Persistência de dados

Os registros são armazenados no navegador através do **LocalStorage**.

Isso permite que os abastecimentos continuem disponíveis mesmo depois de fechar e abrir novamente o navegador.

## 📊 Gráfico

A aplicação utiliza a biblioteca **Chart.js** para apresentar um gráfico comparativo dos abastecimentos, permitindo visualizar informações como o preço por litro e o consumo do veículo.

## ▶️ Como executar

1. Clone ou baixe este repositório.
2. Abra a pasta do projeto.
3. Abra o arquivo `index.html` no navegador.

Não é necessário instalar servidor ou banco de dados.

## 📱 Responsividade

A interface foi desenvolvida para funcionar em:

* Computadores
* Notebooks
* Celulares
* Tablets
