import org.jetbrains.kotlin.gradle.dsl.JvmTarget

plugins {
    alias(libs.plugins.android.application)
    alias(libs.plugins.kotlin.android)
    alias(libs.plugins.kotlin.compose)
    alias(libs.plugins.v4.token.generator)
}

designTokens {
    selectionFile.set(layout.projectDirectory.file("jds-themes.json"))
}

android {
    namespace = "com.jio.ds.jdsexternalapp"
    compileSdk {
        version = release(36) {
            minorApiLevel = 1
        }
    }

    defaultConfig {
        applicationId = "com.jio.ds.jdsexternalapp"
        minSdk = 24
        targetSdk = 36
        versionCode = 1
        versionName = "1.0"

        testInstrumentationRunner = "androidx.test.runner.AndroidJUnitRunner"
    }

    buildTypes {
        release {
            isMinifyEnabled = false
        }
    }
    compileOptions {
        sourceCompatibility = JavaVersion.VERSION_11
        targetCompatibility = JavaVersion.VERSION_11
    }
    buildFeatures {
        compose = true
    }

    // The token-generator plugin auto-wires generated Kotlin only for KMP modules
    // (plugins.withId("org.jetbrains.kotlin.multiplatform")). This is a plain Android
    // app, so register the generateDesignTokens output as a main source root ourselves.
    sourceSets.getByName("main").java.srcDir(
        layout.buildDirectory.dir("generated/designTokens/kotlin"),
    )
}

// Ensure token generation runs before Kotlin compilation (the srcDir above carries no
// implicit task dependency).
tasks.withType<org.jetbrains.kotlin.gradle.tasks.KotlinCompile>().configureEach {
    dependsOn("generateDesignTokens")
}

kotlin {
    compilerOptions {
        jvmTarget.set(JvmTarget.JVM_11)
    }
}

dependencies {
//    JDS Dependencies
    implementation(libs.v4.component)
    // Generated ThemeTokens / registerAppThemes() reference foundation token types
    implementation(libs.v4.foundation)

    implementation(platform(libs.androidx.compose.bom))
    implementation(libs.androidx.activity.compose)
    implementation(libs.androidx.compose.ui)
    implementation(libs.androidx.compose.ui.graphics)
    implementation(libs.androidx.compose.ui.tooling.preview)
    implementation(libs.androidx.core.ktx)
    implementation(libs.androidx.lifecycle.runtime.ktx)
    testImplementation(libs.junit)
    androidTestImplementation(platform(libs.androidx.compose.bom))
    androidTestImplementation(libs.androidx.compose.ui.test.junit4)
    androidTestImplementation(libs.androidx.espresso.core)
    androidTestImplementation(libs.androidx.junit)
    debugImplementation(libs.androidx.compose.ui.test.manifest)
    debugImplementation(libs.androidx.compose.ui.tooling)
}