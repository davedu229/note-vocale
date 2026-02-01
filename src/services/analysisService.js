// Meeting Analysis Service
// Analyzes transcripts for meeting-specific insights

import { GoogleGenerativeAI } from "@google/generative-ai";

const API_KEY = "AIzaSyDUysueajpMBpIYargJyxa5SRQhTn6kueo";
let model = null;

const getModel = () => {
    if (!model) {
        const genAI = new GoogleGenerativeAI(API_KEY);
        model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });
    }
    return model;
};

export const analyzeMeeting = async (transcript) => {
    const aiModel = getModel();

    const prompt = `Tu es un expert en analyse de réunions professionnelles.

Analyse cette transcription et fournis un JSON **valide et parsable** avec cette structure exacte:

{
  "participants": [
    { "id": "A", "label": "Participant A", "speakingPercent": 50, "keyPoints": ["point 1"] }
  ],
  "topics": [
    { "title": "Sujet", "summary": "Résumé court", "importance": "high|medium|low" }
  ],
  "decisions": [
    { "text": "Décision prise", "importance": "high|medium|low" }
  ],
  "actionItems": [
    { "task": "Tâche à faire", "assignee": "Participant A", "priority": "high|medium|low" }
  ],
  "overallMood": "positif|neutre|tendu",
  "duration": "estimation de durée",
  "summary": "Résumé exécutif de la réunion en 2-3 phrases"
}

RÈGLES:
- Réponds UNIQUEMENT avec le JSON, sans markdown ni commentaires
- Si un élément n'est pas détecté, utilise un tableau vide []
- Les pourcentages de parole doivent totaliser 100%
- Estime le nombre de participants d'après les changements de ton/style

TRANSCRIPTION À ANALYSER:
"""
${transcript}
"""`;

    try {
        const result = await aiModel.generateContent(prompt);
        const text = result.response.text();

        // Clean the response (remove potential markdown code blocks)
        let cleanedText = text.trim();
        if (cleanedText.startsWith('```json')) {
            cleanedText = cleanedText.slice(7);
        }
        if (cleanedText.startsWith('```')) {
            cleanedText = cleanedText.slice(3);
        }
        if (cleanedText.endsWith('```')) {
            cleanedText = cleanedText.slice(0, -3);
        }

        const analysis = JSON.parse(cleanedText.trim());
        return { success: true, data: analysis };
    } catch (error) {
        console.error("Meeting analysis error:", error);
        return {
            success: false,
            error: error.message,
            data: null
        };
    }
};

export const analyzeConversation = async (transcript) => {
    const aiModel = getModel();

    const prompt = `Tu es un expert en analyse de conversations et de communication.

Analyse cette transcription de conversation et fournis un JSON **valide et parsable**:

{
  "sentiment": {
    "overall": "positif|neutre|négatif",
    "score": 75,
    "evolution": ["positif", "neutre", "positif"]
  },
  "keyArguments": [
    { "speaker": "A", "argument": "Point principal", "strength": "fort|moyen|faible" }
  ],
  "agreements": ["Point d'accord 1"],
  "disagreements": ["Point de désaccord 1"],
  "questions": [
    { "question": "Question posée", "answered": true, "answer": "Réponse donnée" }
  ],
  "tone": "formel|détendu|tendu|amical",
  "insights": ["Observation 1", "Observation 2"],
  "summary": "Résumé de la conversation en 2-3 phrases"
}

RÈGLES:
- Réponds UNIQUEMENT avec le JSON valide
- Score de sentiment: 0 (très négatif) à 100 (très positif)
- Si un élément n'est pas détecté, utilise un tableau vide []

TRANSCRIPTION:
"""
${transcript}
"""`;

    try {
        const result = await aiModel.generateContent(prompt);
        let text = result.response.text().trim();

        if (text.startsWith('```json')) text = text.slice(7);
        if (text.startsWith('```')) text = text.slice(3);
        if (text.endsWith('```')) text = text.slice(0, -3);

        const analysis = JSON.parse(text.trim());
        return { success: true, data: analysis };
    } catch (error) {
        console.error("Conversation analysis error:", error);
        return { success: false, error: error.message, data: null };
    }
};

export const generateAdvancedSummary = async (transcript, mode = 'executive') => {
    const aiModel = getModel();

    const modePrompts = {
        ultrashort: "Résume en UNE SEULE phrase percutante (style tweet, max 280 caractères).",
        executive: "Fournis un résumé exécutif avec 3-5 bullet points des informations essentielles.",
        detailed: "Fournis un résumé détaillé en plusieurs paragraphes structurés avec sous-titres.",
        timeline: "Fournis un résumé chronologique avec les moments clés et timestamps estimés.",
        qa: "Transforme le contenu en format Questions/Réponses pour faciliter l'apprentissage.",
        actionable: "Fournis uniquement les actions concrètes à entreprendre suite à cet enregistrement."
    };

    const prompt = `${modePrompts[mode] || modePrompts.executive}

Utilise un formatage Markdown riche:
- **Gras** pour les points importants
- Emojis pertinents (📌 💡 ✅ 🎯 ⚠️)
- Listes à puces organisées
- Citations si pertinent

TRANSCRIPTION:
"""
${transcript}
"""`;

    try {
        const result = await aiModel.generateContent(prompt);
        return { success: true, data: result.response.text() };
    } catch (error) {
        console.error("Summary error:", error);
        return { success: false, error: error.message, data: null };
    }
};

export const analyzeBrainstorm = async (transcript) => {
    const aiModel = getModel();

    const prompt = `Tu es un expert en analyse de séances de brainstorming, monologues créatifs et réflexions introspectives.

Analyse cette transcription et fournis un JSON **valide et parsable** avec cette structure:

{
  "summary": "Résumé de la session en 2-3 phrases",
  "main_theme": "Le thème ou sujet central de la réflexion",
  "creativity_score": 7,
  "ideas": [
    { "text": "Idée exprimée", "potential": "high|medium|low" }
  ],
  "connections": [
    "Lien identifié entre deux concepts ou idées"
  ],
  "categories": [
    { "name": "Nom de la catégorie", "type": "idee|probleme|solution|question|reflexion", "count": 3 }
  ],
  "questions": [
    "Question soulevée pendant la réflexion"
  ],
  "insights": [
    "Moment de clarté ou réalisation importante"
  ],
  "next_steps": [
    "Action ou étape suivante suggérée"
  ],
  "emotional_journey": "neutre|exploratoire|frustré|enthousiaste|confus|illuminé"
}

RÈGLES D'ANALYSE:
- Identifie les idées émergentes, même si elles sont incomplètes
- Détecte les moments d'hésitation ou de blocage comme des questions implicites
- Note les connexions entre différentes idées
- Score de créativité: 1-10 basé sur l'originalité et la diversité des idées
- Pour les monologues introspectifs, focus sur les insights personnels et émotionnels
- Réponds UNIQUEMENT avec le JSON valide

TRANSCRIPTION:
"""
${transcript}
"""`;

    try {
        const result = await aiModel.generateContent(prompt);
        let text = result.response.text().trim();

        if (text.startsWith('```json')) text = text.slice(7);
        if (text.startsWith('```')) text = text.slice(3);
        if (text.endsWith('```')) text = text.slice(0, -3);

        const analysis = JSON.parse(text.trim());
        return { success: true, data: analysis };
    } catch (error) {
        console.error("Brainstorm analysis error:", error);
        return { success: false, error: error.message, data: null };
    }
};
