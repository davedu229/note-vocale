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
const getModel = () => {
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
