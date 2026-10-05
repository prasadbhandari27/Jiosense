package com.jio.ds.jdsexternalapp

import android.os.Bundle
import androidx.activity.ComponentActivity
import androidx.activity.compose.setContent
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.Spacer
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.width
import androidx.compose.foundation.rememberScrollState
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.foundation.verticalScroll
import androidx.compose.material3.Scaffold
import androidx.compose.runtime.Composable
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.setValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.text.input.ImeAction
import androidx.compose.ui.text.input.KeyboardType
import androidx.compose.ui.text.input.PasswordVisualTransformation
import androidx.compose.ui.text.input.VisualTransformation
import com.jds.components.badge.JdsBadge
import com.jds.components.badge.JdsBadgeAttention
import com.jds.components.badge.JdsBadgeAttributes
import com.jds.components.badge.JdsBadgeSize
import com.jds.components.button.JdsButton
import com.jds.components.button.JdsButtonAttention
import com.jds.components.button.JdsButtonAttributes
import com.jds.components.button.JdsButtonSize
import com.jds.components.checkboxfield.JdsCheckboxField
import com.jds.components.checkboxfield.JdsCheckboxFieldAttributes
import com.jds.components.componentTokensFor
import com.jds.components.divider.JdsDivider
import com.jds.components.divider.JdsDividerAttributes
import com.jds.components.divider.JdsDividerTextContent
import com.jds.components.icon.JdsIconAttributes
import com.jds.components.iconbutton.JdsIconButtonAttention
import com.jds.components.iconbutton.JdsIconButtonAttributes
import com.jds.components.input.JdsInputAttributes
import com.jds.components.inputfield.JdsInputField
import com.jds.components.inputfield.JdsInputFieldAttributes
import com.jds.components.materials.materialsFor
import com.jds.components.text.JdsText
import com.jds.components.text.JdsTextAttention
import com.jds.components.text.JdsTextAttributes
import com.jds.components.text.JdsTextSize
import com.jds.components.text.JdsTextVariant
import com.jds.components.text.JdsTextWeight
import com.jds.foundation.generated.registerAppThemes
import com.jds.foundation.theme.FoundationTheme
import com.jds.foundation.theme.Surface
import com.jds.foundation.token.Appearance
import com.jds.foundation.token.DimToken
import com.jds.foundation.token.JdsBrand
import com.jds.foundation.token.ShapeToken
import com.jds.foundation.token.SurfaceType

class MainActivity : ComponentActivity() {
    val brand = JdsBrand.Jio
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        registerAppThemes()
        setContent {
            FoundationTheme(
                brand = brand,
                themeName = "JioMart",
                componentTokens = componentTokensFor(brand),
                brandMaterials = materialsFor(brand),
            ) {
                Surface(
                    type = SurfaceType.Minimal,
                    appearance = Appearance.Primary
                ) {
                    Scaffold(modifier = Modifier.fillMaxSize()) { innerPadding ->
                        InitialJdsRender(Modifier.padding(innerPadding))
                    }
                }
            }
        }
    }
}

@Composable
fun InitialJdsRender(modifier: Modifier) {
    var email by remember { mutableStateOf("") }
    var password by remember { mutableStateOf("") }
    var rememberMe by remember { mutableStateOf(true) }
    var isPasswordVisible by remember { mutableStateOf(false) }
    var isLoading by remember { mutableStateOf(false) }

    Surface(
        appearance = Appearance.Neutral,
        type = SurfaceType.Ghost,
        shape = RoundedCornerShape(FoundationTheme.shape(ShapeToken.Shape6)),
        modifier = Modifier.fillMaxSize()
    ) {
        Surface(
            appearance = Appearance.Primary,
            type = SurfaceType.Minimal,
            shape = RoundedCornerShape(FoundationTheme.shape(ShapeToken.Shape6)),
            modifier = Modifier.fillMaxSize()
        ) {
            Column(
                modifier = modifier
                    .padding(FoundationTheme.dimension(DimToken.Dim6))
                    .verticalScroll(rememberScrollState()),
                verticalArrangement = Arrangement.spacedBy(FoundationTheme.dimension(DimToken.Dim5))
            ) {
                // Header section
                Column(
                    verticalArrangement = Arrangement.spacedBy(FoundationTheme.dimension(DimToken.Dim2))
                ) {
                    JdsBadge(
                        attributes = JdsBadgeAttributes(
                            label = "JIO DESIGN SYSTEM",
                            attention = JdsBadgeAttention.Medium,
                            size = JdsBadgeSize.S,
                            start = JdsIconAttributes.icon("ic_jds_star")
                        )
                    )

                    JdsText(
                        attributes = JdsTextAttributes(
                            text = "Welcome back",
                            variant = JdsTextVariant.Headline,
                            size = JdsTextSize.L,
                            weight = JdsTextWeight.High
                        )
                    )

                    JdsText(
                        attributes = JdsTextAttributes(
                            text = "Please enter your credentials to access your account",
                            variant = JdsTextVariant.Body,
                            size = JdsTextSize.M,
                            attention = JdsTextAttention.Medium
                        )
                    )
                }

                // Input fields
                Column(
                    verticalArrangement = Arrangement.spacedBy(FoundationTheme.dimension(DimToken.Dim4))
                ) {
                    JdsInputField(
                        attributes = JdsInputFieldAttributes(
                            label = "Email Address",
                            input = JdsInputAttributes(
                                value = email,
                                onValueChange = { email = it },
                                placeholder = "name@example.com",
                                start = JdsIconAttributes.icon("ic_jds_user"),
                                keyboardType = KeyboardType.Email,
                                imeAction = ImeAction.Next
                            )
                        )
                    )

                    JdsInputField(
                        attributes = JdsInputFieldAttributes(
                            label = "Password",
                            input = JdsInputAttributes(
                                value = password,
                                onValueChange = { password = it },
                                placeholder = "Enter your password",
                                start = JdsIconAttributes.icon("ic_jds_lock"),
                                end = JdsIconButtonAttributes(
                                    onClick = { isPasswordVisible = !isPasswordVisible },
                                    icon = JdsIconAttributes.icon(
                                        if (isPasswordVisible) "ic_jds_visible_off" else "ic_jds_visible"
                                    ),
                                    contentDescription = if (isPasswordVisible) "Hide password" else "Show password",
                                    attention = JdsIconButtonAttention.Low,
                                    contained = false
                                ),
                                keyboardType = KeyboardType.Password,
                                imeAction = ImeAction.Done,
                                visualTransformation = if (isPasswordVisible) {
                                    VisualTransformation.None
                                } else {
                                    PasswordVisualTransformation()
                                }
                            )
                        )
                    )

                    // Options Row: Remember Me & Forgot Password
                    Row(
                        modifier = Modifier.fillMaxWidth(),
                        horizontalArrangement = Arrangement.SpaceBetween,
                        verticalAlignment = Alignment.CenterVertically
                    ) {
                        JdsCheckboxField(
                            attributes = JdsCheckboxFieldAttributes(
                                label = "Remember me",
                                checked = rememberMe,
                                onCheckedChange = { rememberMe = it }
                            )
                        )

                        JdsButton(
                            attributes = JdsButtonAttributes(
                                onClick = { /* Forgot password action */ },
                                text = "Forgot password?",
                                attention = JdsButtonAttention.Low,
                                contained = false,
                                size = JdsButtonSize.S
                            )
                        )
                    }
                }

                // Primary Login Button
                JdsButton(
                    attributes = JdsButtonAttributes(
                        onClick = { /* Primary login action */ },
                        text = "Sign In",
                        attention = JdsButtonAttention.High,
                        fullWidth = true,
                        loading = isLoading,
                        size = JdsButtonSize.L
                    )
                )

                // Divider
                JdsDivider(
                    attributes = JdsDividerAttributes(
                        content = JdsDividerTextContent(
                            JdsTextAttributes(
                                text = "OR SIGN IN WITH",
                                size = JdsTextSize.Xs,
                                attention = JdsTextAttention.Medium
                            )
                        )
                    )
                )

                // OTP Login Button
                JdsButton(
                    attributes = JdsButtonAttributes(
                        onClick = { /* OTP Login action */ },
                        text = "Sign in with OTP",
                        attention = JdsButtonAttention.Medium,
                        fullWidth = true,
                        size = JdsButtonSize.M,
                        start = JdsIconAttributes.icon("ic_jds_mail")
                    )
                )

                // Footer text
                Row(
                    modifier = Modifier.fillMaxWidth(),
                    horizontalArrangement = Arrangement.Center,
                    verticalAlignment = Alignment.CenterVertically
                ) {
                    JdsText(
                        attributes = JdsTextAttributes(
                            text = "Don't have an account?",
                            size = JdsTextSize.S,
                            attention = JdsTextAttention.Medium
                        )
                    )
                    Spacer(modifier = Modifier.width(FoundationTheme.dimension(DimToken.Dim1)))
                    JdsButton(
                        attributes = JdsButtonAttributes(
                            onClick = { /* Sign up action */ },
                            text = "Sign Up",
                            attention = JdsButtonAttention.Low,
                            contained = false,
                            size = JdsButtonSize.S
                        )
                    )
                }
            }
        }
    }
}