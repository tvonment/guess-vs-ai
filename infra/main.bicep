// Guess vs AI — Azure AI Foundry model deployments (and optionally the
// project-based Foundry account itself).
//
// Existing account (the usual case):
//   az deployment group create -g <resource-group> -f infra/main.bicep \
//     -p accountName=guess-vs-ai-resource
//
// Fresh project-based Foundry account:
//   az deployment group create -g <resource-group> -f infra/main.bicep \
//     -p accountName=<name> createAccount=true
//
// Outputs map 1:1 to the app's env vars:
//   endpoint          -> AZURE_AI_FOUNDRY_ENDPOINT
//   aiGameModel       -> AI_GAME_MODEL
//   aiValidationModel -> AI_VALIDATION_MODEL

@description('Name of the Azure AI Foundry (Cognitive Services) account.')
param accountName string = 'guess-vs-ai-resource'

@description('Create the Foundry account + project (true) or deploy models into the existing account (false).')
param createAccount bool = false

@description('Location for newly created resources (existing accounts keep theirs).')
param location string = resourceGroup().location

@description('Foundry project name (only used when createAccount is true).')
param projectName string = 'guess-vs-ai'

@description('OpenAI model for gameplay calls (questions, word selection, summaries).')
param gameModelName string = 'gpt-5.4'

@description('Model version for the gameplay deployment. Empty deploys the current default version.')
param gameModelVersion string = ''

@description('Deployment name for gameplay — the value of the app\'s AI_GAME_MODEL env var.')
param gameDeploymentName string = 'gpt-5.4'

@description('Capacity (thousands of tokens-per-minute) for the gameplay deployment.')
param gameCapacity int = 50

@description('OpenAI model for evaluation/validation calls (win check, category check, question answering, learn fact).')
param validationModelName string = 'gpt-5-mini'

@description('Model version for the validation deployment. Empty deploys the current default version.')
param validationModelVersion string = ''

@description('Deployment name for validation — the value of the app\'s AI_VALIDATION_MODEL env var.')
param validationDeploymentName string = 'gpt-5-mini'

@description('Capacity (thousands of tokens-per-minute) for the validation deployment.')
param validationCapacity int = 50

// New-style, project-based Foundry account (kind AIServices with project
// management) — only when createAccount is true.
resource newAccount 'Microsoft.CognitiveServices/accounts@2025-04-01-preview' = if (createAccount) {
  name: accountName
  location: location
  kind: 'AIServices'
  sku: {
    name: 'S0'
  }
  identity: {
    type: 'SystemAssigned'
  }
  properties: {
    customSubDomainName: accountName
    allowProjectManagement: true
    publicNetworkAccess: 'Enabled'
  }
}

resource newProject 'Microsoft.CognitiveServices/accounts/projects@2025-04-01-preview' = if (createAccount) {
  parent: newAccount
  name: projectName
  location: location
  identity: {
    type: 'SystemAssigned'
  }
  properties: {}
}

resource account 'Microsoft.CognitiveServices/accounts@2025-04-01-preview' existing = {
  name: accountName
}

resource gameDeployment 'Microsoft.CognitiveServices/accounts/deployments@2025-04-01-preview' = {
  parent: account
  name: gameDeploymentName
  sku: {
    name: 'GlobalStandard'
    capacity: gameCapacity
  }
  properties: {
    model: {
      format: 'OpenAI'
      name: gameModelName
      version: empty(gameModelVersion) ? null : gameModelVersion
    }
    versionUpgradeOption: 'OnceNewDefaultVersionAvailable'
  }
  dependsOn: [
    newAccount
  ]
}

resource validationDeployment 'Microsoft.CognitiveServices/accounts/deployments@2025-04-01-preview' = {
  parent: account
  name: validationDeploymentName
  sku: {
    name: 'GlobalStandard'
    capacity: validationCapacity
  }
  properties: {
    model: {
      format: 'OpenAI'
      name: validationModelName
      version: empty(validationModelVersion) ? null : validationModelVersion
    }
    versionUpgradeOption: 'OnceNewDefaultVersionAvailable'
  }
  // Cognitive Services mutates only one deployment at a time per account.
  dependsOn: [
    gameDeployment
  ]
}

output endpoint string = account.properties.endpoint
output aiGameModel string = gameDeployment.name
output aiValidationModel string = validationDeployment.name
