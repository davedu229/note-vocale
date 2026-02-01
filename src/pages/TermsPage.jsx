import React from 'react';
import { ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const TermsPage = () => {
    const navigate = useNavigate();

    return (
        <div className="pb-20">
            <button
                onClick={() => navigate(-1)}
                className="flex items-center gap-2 text-white/50 hover:text-white mb-6 transition-colors"
            >
                <ArrowLeft size={18} />
                <span className="text-sm">Retour</span>
            </button>

            <h1 className="text-2xl font-bold text-white mb-6">Conditions d'utilisation</h1>

            <div className="prose prose-invert prose-sm max-w-none">
                <p className="text-white/60 text-sm leading-relaxed mb-4">
                    Dernière mise à jour : Février 2026
                </p>

                <section className="mb-6">
                    <h2 className="text-lg font-semibold text-white mb-3">1. Acceptation des conditions</h2>
                    <p className="text-white/60 text-sm leading-relaxed">
                        En utilisant Voice Notes AI, vous acceptez les présentes conditions d'utilisation.
                        Si vous n'acceptez pas ces conditions, veuillez ne pas utiliser l'application.
                    </p>
                </section>

                <section className="mb-6">
                    <h2 className="text-lg font-semibold text-white mb-3">2. Description du service</h2>
                    <p className="text-white/60 text-sm leading-relaxed">
                        Voice Notes AI est une application de prise de notes vocales avec transcription
                        automatique et analyse par intelligence artificielle. Le service inclut :
                    </p>
                    <ul className="list-disc list-inside text-white/60 text-sm mt-2 space-y-1">
                        <li>Enregistrement et transcription vocale</li>
                        <li>Résumés automatiques par IA</li>
                        <li>Analyses avancées (réunions, conversations, brainstorming)</li>
                        <li>Chat contextuel avec vos notes</li>
                    </ul>
                </section>

                <section className="mb-6">
                    <h2 className="text-lg font-semibold text-white mb-3">3. Abonnements et paiements</h2>
                    <p className="text-white/60 text-sm leading-relaxed">
                        L'abonnement Premium se renouvelle automatiquement chaque mois sauf annulation.
                        Vous pouvez annuler à tout moment via les paramètres de votre compte Apple.
                        Le remboursement suit les politiques de l'App Store.
                    </p>
                </section>

                <section className="mb-6">
                    <h2 className="text-lg font-semibold text-white mb-3">4. Utilisation acceptable</h2>
                    <p className="text-white/60 text-sm leading-relaxed">
                        Vous vous engagez à ne pas utiliser le service pour des activités illégales,
                        nuisibles ou qui violent les droits d'autrui.
                    </p>
                </section>

                <section className="mb-6">
                    <h2 className="text-lg font-semibold text-white mb-3">5. Propriété intellectuelle</h2>
                    <p className="text-white/60 text-sm leading-relaxed">
                        Vous conservez la propriété de vos enregistrements et notes. Nous nous réservons
                        les droits sur l'application, son design et sa technologie.
                    </p>
                </section>

                <section className="mb-6">
                    <h2 className="text-lg font-semibold text-white mb-3">6. Limitation de responsabilité</h2>
                    <p className="text-white/60 text-sm leading-relaxed">
                        Le service est fourni "tel quel". Nous ne garantissons pas l'exactitude des
                        transcriptions ou analyses générées par l'IA.
                    </p>
                </section>

                <section className="mb-6">
                    <h2 className="text-lg font-semibold text-white mb-3">7. Contact</h2>
                    <p className="text-white/60 text-sm leading-relaxed">
                        Pour toute question : <a href="mailto:support@voicenotes.app" className="text-primary-light hover:underline">support@voicenotes.app</a>
                    </p>
                </section>
            </div>
        </div>
    );
};

export default TermsPage;
