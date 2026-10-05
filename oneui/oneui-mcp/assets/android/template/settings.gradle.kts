pluginManagement {
    repositories {
        // token-generator plugin (com.jds.tokens, selectionFile API) is published here
        mavenLocal()
        google {
            content {
                includeGroupByRegex("com\\.android.*")
                includeGroupByRegex("com\\.google.*")
                includeGroupByRegex("androidx.*")
            }
        }
        mavenCentral()
        gradlePluginPortal()
        // JDS artifactory — hosts the token-generator plugin marker (com.jds.tokens)
        maven {
            url = uri("http://devopsartifact.jio.com/artifactory/jpf-ds_android__mvn/")
            isAllowInsecureProtocol = true
            credentials {
                username = (settings.providers.gradleProperty("JdsArtifactoryUsername")
                    .orElse(settings.providers.environmentVariable("JDS_ARTIFACTORY_USERNAME"))
                    .orElse(settings.providers.provider { "" })).get()
                password = (settings.providers.gradleProperty("JdsArtifactoryPassword")
                    .orElse(settings.providers.environmentVariable("JDS_ARTIFACTORY_PASSWORD"))
                    .orElse(settings.providers.provider { "" })).get()
            }
        }
    }
}
plugins {
    id("org.gradle.toolchains.foojay-resolver-convention") version "1.0.0"
}
dependencyResolutionManagement {
    repositoriesMode.set(RepositoriesMode.FAIL_ON_PROJECT_REPOS)
    repositories {
        // Current com.jds:foundation/components 4.0.0-alpha-03 live here (new architecture)
        mavenLocal()
        google()
        mavenCentral()
        maven {
            url = uri("http://devopsartifact.jio.com/artifactory/jpf-ds_android__mvn/")
            isAllowInsecureProtocol = true
            credentials {
                username = (settings.providers.gradleProperty("JdsArtifactoryUsername")
                    .orElse(settings.providers.environmentVariable("JDS_ARTIFACTORY_USERNAME"))
                    .orElse(settings.providers.provider { "" })).get()
                password = (settings.providers.gradleProperty("JdsArtifactoryPassword")
                    .orElse(settings.providers.environmentVariable("JDS_ARTIFACTORY_PASSWORD"))
                    .orElse(settings.providers.provider { "" })).get()
            }
        }
        // Azure feed hosts com.jio.ds:* (core-icons-kmp, product-logo-icons-kmp) pulled
        // in transitively by com.jds:components. Credentials from ~/.gradle/gradle.properties
        // (JioDSUsername/JioDSPassword) or AZURE_DEVOPS_* env vars.
        maven {
            val azureUser = settings.providers.gradleProperty("JioDSUsername")
                .orElse(settings.providers.environmentVariable("AZURE_DEVOPS_USERNAME"))
                .orElse(settings.providers.environmentVariable("JioDSUsername"))
                .orElse(settings.providers.provider { "AzureDevOps" })
            val azurePass = settings.providers.gradleProperty("JioDSPassword")
                .orElse(settings.providers.gradleProperty("AZURE_DEVOPS_TOKEN"))
                .orElse(settings.providers.environmentVariable("AZURE_DEVOPS_TOKEN"))
                .orElse(settings.providers.environmentVariable("JioDSPassword"))
                .orElse(settings.providers.provider { "" })
            name = "JIO-DS-ANDROID"
            url = uri("https://jio-dsp.pkgs.visualstudio.com/_packaging/JIO-DS-ANDROID/maven/v1")
            credentials {
                username = azureUser.get()
                password = azurePass.get()
            }
            authentication { create<BasicAuthentication>("basic") }
        }
    }
}

rootProject.name = "Jds External App"
include(":app")
