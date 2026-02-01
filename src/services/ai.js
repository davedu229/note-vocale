import { GoogleGenerativeAI } from "@google/generative-ai";

// Initialize Gemini API - Clé directement intégrée pour simplicité
const API_KEY = "AIzaSyDGzLf6dYdjyPXySCu6Hq7yVQeESi9XkHY";

// let genAI = null;
// let model = null;

const initializeAI = (modelName = "gemini-1.5-flash") => {
    try {
        console.log("Initializing Gemini with model:", modelName);
        console.log("API Key present:", !!API_KEY);

        if (!API_KEY) {
            console.error("VITE_GEMINI_API_KEY is not set!");
            return null;
        }

        const genAI = new GoogleGenerativeAI(API_KEY);
        const model = genAI.getGenerativeModel({ model: modelName });
        return model;
    } catch (error) {
        console.error("Failed to initialize Gemini AI:", error);
        return null;
    }
};

export const testConnection = async () => {
    try {
        const aiModel = initializeAI("gemini-1.5-flash");
        if (!aiModel) throw new Error("Initialization failed");

        console.log("Testing connection...");
        const result = await aiModel.generateContent("Hello");
        const response = await result.response;
        const text = response.text();
        console.log("Connection successful:", text);
        return { success: true, message: "Connexion réussie: " + text };
    } catch (error) {
        console.error("Connection Test Failed:", error);
        // Fallback test
        try {
            console.log("Retrying with gemini-pro...");
            const aiModel = initializeAI("gemini-pro");
            const result = await aiModel.generateContent("Hello");
            const response = await result.response;
            return { success: true, message: "Connexion réussie (Fallback gemini-pro): " + response.text() };
        } catch (error) {
            return { success: false, message: error.message || "Erreur de connexion" };
        }
    }
};

export const generateSummary = async (transcript) => {
    if (!transcript || transcript.length < 10) {
        return "📝 *Transcription trop courte pour générer un résumé.*";
    }

    const aiModel = initializeAI();
    if (!aiModel) {
        return "⚠️ **Erreur**: Impossible d'initialiser l'IA.";
    }

    try {
        const prompt = `Tu es un assistant de prise de notes expert. Analyse cette transcription vocale et génère un résumé **richement formaté** en Markdown.

## Instructions de formatage :
- Utilise des **titres** (## ou ###) pour structurer
- Utilise des **listes à puces** (- ou •) pour les points clés
- Mets en **gras** les mots importants
- Utilise l'*italique* pour les nuances
- Ajoute des emojis pertinents (📌 💡 ⚠️ ✅ 📝 🎯 💬 📊 🔑 ⏰)
- Utilise > pour les citations si pertinent

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

        const result = await aiModel.generateContent(prompt);
        const response = result.response;
        const text = response.text();

        if (!text) {
            throw new Error("Empty response from AI");
        }

        return text;
    } catch (error) {
        console.error("AI Summary Error:", error);

        if (error.message?.includes("API_KEY")) {
            return "⚠️ **Erreur**: Clé API invalide ou expirée.";
        }
        if (error.message?.includes("quota")) {
            return "⚠️ **Erreur**: Quota API dépassé. Réessayez plus tard.";
        }

        return `⚠️ **Erreur**: ${error.message || "Erreur inconnue"}`;
    }
};

export const chatWithAi = async (message, contextNotes = []) => {
    if (!message?.trim()) {
        return "Veuillez entrer un message.";
    }

    const aiModel = initializeAI();
    if (!aiModel) {
        return "⚠️ **Erreur**: Impossible d'initialiser l'IA.";
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

        const result = await aiModel.generateContent(fullPrompt);
        const response = result.response;
        const text = response.text();

        if (!text) {
            throw new Error("Empty response from AI");
        }

        return text;
    } catch (error) {
        console.error("Chat Error:", error);

        if (error.message?.includes("API_KEY")) {
            return "⚠️ **Erreur**: Clé API invalide.";
        }
        if (error.message?.includes("quota")) {
            return "⚠️ **Erreur**: Quota API dépassé.";
        }

        return `⚠️ **Erreur**: ${error.message || "Erreur inconnue"}`;
    }
};
