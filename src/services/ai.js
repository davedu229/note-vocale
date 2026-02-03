import { GoogleGenerativeAI } from "@google/generative-ai";

// ============================================
// Configuration
// ============================================
const DEFAULT_API_KEY = "AIzaSyBZLcU04a1q-IuFZFyivfm9t_Zi8WyxLdU";
const STORAGE_KEY = "voice_notes_gemini_api_key";
const MODEL_NAME = "gemini-2.0-flash"; // Current stable model (Jan 2025+)

// ============================================
// API Key Management
// ============================================
export const getStoredApiKey = () => {
    try {
        return localStorage.getItem(STORAGE_KEY) || DEFAULT_API_KEY;
    } catch {
        return DEFAULT_API_KEY;
    }
};

export const setStoredApiKey = (key) => {
    try {
        if (key && key.trim()) {
            localStorage.setItem(STORAGE_KEY, key.trim());
        } else {
            localStorage.removeItem(STORAGE_KEY);
        }
    } catch (e) {
        console.error("Failed to save API key:", e);
    }
};

// ============================================
// AI Model Initialization
// ============================================
export const getModel = () => {
    const apiKey = getStoredApiKey();

    if (!apiKey) {
        console.error("No API key available");
        return null;
    }

    try {
        const genAI = new GoogleGenerativeAI(apiKey);
        return genAI.getGenerativeModel({ model: MODEL_NAME });
    } catch (error) {
        console.error("Failed to create model:", error);
        return null;
    }
};

// ============================================
// Test Connection
// ============================================
export const testConnection = async () => {
    try {
        const model = getModel();
        if (!model) {
            return { success: false, message: "Impossible de créer le modèle. Vérifiez votre clé API." };
        }

        const result = await model.generateContent("Dis 'Bonjour' en une phrase.");
        const response = await result.response;
        const text = response.text();

        return {
            success: true,
            message: `✅ Connexion réussie!\n\nRéponse: ${text.substring(0, 100)}`
        };
    } catch (error) {
        console.error("Test connection error:", error);

        // Parse error for user-friendly message
        let message = error.message || "Erreur inconnue";

        if (message.includes("API_KEY")) {
            message = "❌ Clé API invalide ou expirée.";
        } else if (message.includes("404")) {
            message = "❌ Modèle non trouvé. Le modèle peut avoir été mis à jour.";
        } else if (message.includes("quota")) {
            message = "❌ Quota dépassé. Attendez ou utilisez une autre clé.";
        } else if (message.includes("fetch")) {
            message = "❌ Erreur réseau. Vérifiez votre connexion internet.";
        }

        return { success: false, message };
    }
};

// ============================================
// Generate Summary
// ============================================
export const generateSummary = async (transcript) => {
    if (!transcript || transcript.trim().length < 10) {
        return "📝 *Transcription trop courte pour générer un résumé.*";
    }

    const model = getModel();
    if (!model) {
        return "⚠️ **Erreur**: Impossible d'initialiser l'IA. Configurez votre clé API dans les Paramètres.";
    }

    try {
        const prompt = `Tu es un assistant de prise de notes expert. Analyse cette transcription vocale et génère un résumé **richement formaté** en Markdown.

## Instructions de formatage :
- Utilise des **titres** (## ou ###) pour structurer
- Utilise des **listes à puces** (- ou •) pour les points clés
- Mets en **gras** les mots importants
- Utilise l'*italique* pour les nuances
- Ajoute des emojis pertinents (📌 💡 ⚠️ ✅ 📝 🎯 💬 📊 🔑 ⏰)

## Structure attendue :

### 🎯 Résumé
Un paragraphe de 2-3 phrases résumant l'essentiel.

### 📌 Points Clés
- Point 1
- Point 2
- etc.

### 💡 Idées / Actions (si applicable)
- Action ou idée à retenir

---

**Transcription à analyser :**
"${transcript}"

Génère uniquement le résumé formaté, sans commentaires additionnels.`;

        const result = await model.generateContent(prompt);
        const response = result.response;
        const text = response.text();

        if (!text) {
            throw new Error("Réponse vide de l'IA");
        }

        return text;
    } catch (error) {
        console.error("Summary generation error:", error);
        return `⚠️ **Erreur**: ${error.message || "Erreur lors de la génération du résumé"}`;
    }
};

// ============================================
// Chat with AI
// ============================================
export const chatWithAi = async (message, contextNotes = []) => {
    if (!message?.trim()) {
        return "Veuillez entrer un message.";
    }

    const model = getModel();
    if (!model) {
        return "⚠️ **Erreur**: Impossible d'initialiser l'IA. Configurez votre clé API dans les Paramètres.";
    }

    try {
        let systemContext = `Tu es un assistant intelligent et amical. Tu aides l'utilisateur à comprendre et exploiter ses notes vocales.

## Instructions :
- Réponds de manière **claire et structurée** en français
- Utilise le **Markdown** pour formater tes réponses (gras, italique, listes, emojis)
- Sois concis mais complet
- Utilise des emojis pertinents (💡 ✅ 📌 🎯 💬)

`;

        if (contextNotes.length > 0) {
            systemContext += "## 📚 Notes de l'utilisateur (contexte) :\n\n";
            contextNotes.forEach((note, index) => {
                systemContext += `### Note ${index + 1} — ${note.date}\n`;
                systemContext += note.summary || note.text || "Note vide";
                systemContext += "\n\n---\n\n";
            });
        } else {
            systemContext += "*(Aucune note sélectionnée pour le contexte)*\n\n";
        }

        const fullPrompt = `${systemContext}## 💬 Question de l'utilisateur :\n${message}`;

        const result = await model.generateContent(fullPrompt);
        const response = result.response;
        const text = response.text();

        if (!text) {
            throw new Error("Réponse vide de l'IA");
        }

        return text;
    } catch (error) {
        console.error("Chat error:", error);
        return `⚠️ **Erreur**: ${error.message || "Erreur lors de la réponse"}`;
    }
};

// ============================================
// Magic Actions - Transform Note Content
// ============================================
const TRANSFORM_PROMPTS = {
    tweet: {
        emoji: "🐦",
        label: "Tweet",
        prompt: `Transforme ce contenu en un tweet viral (max 280 caractères).
- Sois percutant et engageant
- Utilise 1-2 emojis pertinents
- Ajoute des hashtags si pertinent (max 2)
- Garde l'essence du message

Contenu à transformer:
"{content}"

Génère UNIQUEMENT le tweet, rien d'autre.`
    },
    email: {
        emoji: "📧",
        label: "Email Pro",
        prompt: `Transforme ce contenu en un email professionnel bien structuré.

## Format attendu:
**Objet:** [Sujet clair]

Bonjour,

[Corps de l'email - 2-3 paragraphes max]

Cordialement,
[Signature]

---
Contenu source:
"{content}"

Génère UNIQUEMENT l'email formaté.`
    },
    tasks: {
        emoji: "✅",
        label: "To-Do List",
        prompt: `Extrait les tâches et actions de ce contenu sous forme de liste de tâches.

## Format:
- [ ] Tâche 1
- [ ] Tâche 2
- [ ] etc.

Ajoute des dates/priorités si mentionnées dans le contenu.

Contenu à analyser:
"{content}"

Génère UNIQUEMENT la liste de tâches.`
    },
    simplified: {
        emoji: "🧒",
        label: "Simplifié",
        prompt: `Réécris ce contenu de manière ultra simple, comme si tu l'expliquais à un enfant de 10 ans.

- Utilise des mots simples
- Fais des phrases courtes
- Ajoute des analogies si utile
- Garde les points essentiels

Contenu à simplifier:
"{content}"

Génère UNIQUEMENT la version simplifiée.`
    },
    linkedin: {
        emoji: "💼",
        label: "Post LinkedIn",
        prompt: `Transforme ce contenu en un post LinkedIn engageant.

## Format:
- Accroche forte (1 ligne)
- Corps du post (3-5 lignes avec sauts de ligne)
- Call-to-action ou question pour engagement
- 3-5 hashtags pertinents

Contenu source:
"{content}"

Génère UNIQUEMENT le post LinkedIn.`
    },
    summary: {
        emoji: "📝",
        label: "Résumé Court",
        prompt: `Résume ce contenu en 2-3 phrases maximum.

- Capture l'essentiel uniquement
- Sois direct et concis
- Pas de listes, juste du texte fluide

Contenu à résumer:
"{content}"

Génère UNIQUEMENT le résumé court.`
    }
};

export const getTransformOptions = () => {
    return Object.entries(TRANSFORM_PROMPTS).map(([key, value]) => ({
        key,
        emoji: value.emoji,
        label: value.label
    }));
};

export const transformNote = async (content, format) => {
    if (!content?.trim()) {
        return "⚠️ Contenu vide, impossible de transformer.";
    }

    const config = TRANSFORM_PROMPTS[format];
    if (!config) {
        return `⚠️ Format "${format}" non reconnu.`;
    }

    const model = getModel();
    if (!model) {
        return "⚠️ **Erreur**: Impossible d'initialiser l'IA. Configurez votre clé API dans les Paramètres.";
    }

    try {
        const prompt = config.prompt.replace("{content}", content);
        const result = await model.generateContent(prompt);
        const response = result.response;
        const text = response.text();

        if (!text) {
            throw new Error("Réponse vide de l'IA");
        }

        return text;
    } catch (error) {
        console.error("Transform error:", error);
        return `⚠️ **Erreur**: ${error.message || "Erreur lors de la transformation"}`;
    }
};
