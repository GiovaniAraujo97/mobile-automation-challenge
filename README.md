# Mobile Automation Challenge

Automação de testes mobile do [WebdriverIO Native Demo App](https://github.com/webdriverio/native-demo-app), usando WebdriverIO, Appium, Mocha, Chai e Allure. O projeto contém dez testes, Page Objects, dados JSON, captura de screenshots em falhas e pipeline GitLab CI para Android e iOS.

## Requisitos locais

- Node.js 20.19.0 ou superior e npm (mínimo exigido pelo Appium 3.8 e suas dependências)
- Git
- Java 17 ou superior, necessário pelo Appium/Android tooling e para gerar o HTML Allure
- Android: Android Studio, Android SDK, `adb` e um AVD inicializado. O UiAutomator2 já está nas dependências do projeto e é instalado por `npm ci`.
- iOS: macOS, Xcode, Command Line Tools, um simulador inicializado e driver XCUITest do Appium. O app demo não pode ser instalado em iPhone físico.

Os dez cenários Android foram executados em um emulador local e passaram. A execução iOS e a pipeline hospedada no GitLab ainda dependem de um Mac e dos runners configurados para o projeto. O BrowserStack é opcional e não está habilitado.

## Instalação

Na raiz deste projeto:

```powershell
npm ci
npm run apps:download
```

O script baixa os binários oficiais da release 2.2.0 para `apps/`: APK para Android e pacote `.zip` do app para simulador iOS. Os binários são ignorados pelo Git e baixados novamente no CI.

O driver Android UiAutomator2 é instalado junto com as dependências. Para iOS, instale o XCUITest no macOS:

```bash
npx appium driver install xcuitest
```

## Executar no Android

1. No PowerShell, configure o caminho do Android SDK. Repita estas variáveis em cada terminal usado para Appium ou WebdriverIO:

```powershell
$env:ANDROID_HOME = "$env:LOCALAPPDATA\Android\Sdk"
$env:ANDROID_SDK_ROOT = $env:ANDROID_HOME
$env:Path = "$env:ANDROID_HOME\platform-tools;$env:ANDROID_HOME\emulator;$env:Path"
```

2. Abra um emulador no Android Studio e confirme com `adb devices`.
3. Inicie o servidor Appium no primeiro terminal:

```bash
npx appium --address 127.0.0.1 --port 4723
```

4. Em outro terminal, configure as mesmas variáveis do SDK e execute os testes:

```bash
npm run test:android
```

## Executar no iOS

Em macOS, inicialize um simulador pelo Xcode e rode `xcrun simctl list devices booted`. Inicie o Appium e execute:

```bash
npx appium --address 127.0.0.1 --port 4723
npm run test:ios
```

A plataforma, o dispositivo, a versão do SO, o servidor Appium e o caminho do aplicativo são configuráveis por variáveis de ambiente. Consulte `.env.example`; não versione credenciais nem arquivos `.env`.

## Cenários automatizados

1. Exibe Home e elementos principais.
2. Navega entre Home, Login e Forms.
3. Valida email e senha no login usando casos parametrizados por JSON.
4. Faz login com entradas válidas e valida o alerta de sucesso. O app demo simula a operação localmente, sem serviço de autenticação.
5. Alterna para Sign up e valida o campo de confirmação de senha.
6. Rejeita senhas diferentes no cadastro.
7. Conclui cadastro com dados válidos e valida o alerta.
8. Preenche o formulário e valida o texto refletido.
9. Alterna o switch e valida o estado textual.
10. Abre e fecha o alerta do botão ativo.

Os seletores preferem os IDs de acessibilidade providos pelo próprio app demo. `pages/` contém os Page Objects; `data/login-invalid-cases.json` parametriza os dados inválidos.

## Status de validação

- Android: 10 cenários aprovados no emulador local com `npm run test:android`.
- iOS: configuração presente; execução ainda não validada, pois requer macOS e Xcode.
- GitHub Actions: workflow Android executa em push, pull request e manualmente; resultados, relatório Allure, screenshots e log do Appium são publicados como artefatos por 14 dias.
- GitLab CI: configuração Android e iOS disponível em `.gitlab-ci.yml`; a execução depende de runners próprios com as tags `mobile-android` e `mobile-macos`.
- BrowserStack: integração opcional não configurada; requer conta e credenciais próprias.

## Evidências e Allure

Cada falha salva um PNG em `artifacts/screenshots/` e anexa a imagem ao resultado Allure. O reporter inclui plataforma, dispositivo, versão do app e URL do Appium como informações de ambiente. Os resultados brutos são escritos em `allure-results/`.

Instale o Allure Commandline uma vez:

```bash
npm install --global allure-commandline
```

Gere e abra o relatório HTML:

```bash
npm run report:allure
allure open allure-report
```

## CI/CD

No GitHub, `.github/workflows/android.yml` executa os testes Android em push para `main`, pull request para `main` e também pode ser iniciada manualmente pela aba **Actions**. A workflow prepara um emulador, inicia o Appium, roda os dez cenários e publica os resultados e o relatório Allure como artefatos por 14 dias.

`.gitlab-ci.yml` também mantém a configuração GitLab para Android e iOS, publicando o relatório Allure, screenshots e log do Appium como artefatos por 14 dias.

O projeto precisa de runners GitLab próprios com estas tags:

- `mobile-android`: runner Linux com Android SDK/`adb`, emulador configurado/inicializado e Java.
- `mobile-macos`: runner macOS com Xcode, simulador bootado e Java.

O BrowserStack é opcional no desafio e não está habilitado porque exige conta e credenciais próprias. Android físico também pode ser usado configurando `ANDROID_DEVICE_NAME` e a conexão do dispositivo via `adb`.

## Estrutura

```text
mobile-automation-challenge
├── .gitlab-ci.yml
├── data/login-invalid-cases.json
├── pages
│   ├── BasePage.js
│   ├── FormsPage.js
│   ├── HomePage.js
│   └── LoginPage.js
├── scripts/download-apps.mjs
├── test/specs/native-demo.e2e.spec.js
├── wdio.conf.js
├── package.json
└── README.md
```
