import React from 'react';
import { ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const PrivacyPage = () => {
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

            <h1 className="text-2xl font-bold text-white mb-6">Politique de confidentialité</h1>

            <div className="prose prose-invert prose-sm max-w-none">
                <p className="text-white/60 text-sm leading-relaxed mb-4">
                    Dernière mise à jour : Février 2026
                </p>

                <section className="mb-6">
                    <h2 className="text-lg font-semibold text-white mb-3">1. Données collectées</h2>
                    <p className="text-white/60 text-sm leading-relaxed mb-2">
                        Nous collectons les données suivantes :
                    </p>
                    <ul className="list-disc list-inside text-white/60 text-sm space-y-1">
                        <li><strong className="text-white/80">Enregistrements audio :</strong> Stockés localement sur votre appareil</li>
                        <li><strong className="text-white/80">Transcriptions :</strong> Générées et stockées localement</li>
                        <li><strong className="text-white/80">Données d'usage :</strong> Statistiques anonymisées pour améliorer le service</li>
                    </ul>
                </section>

                <section className="mb-6">
                    <h2 className="text-lg font-semibold text-white mb-3">2. Utilisation des données</h2>
                    <p className="text-white/60 text-sm leading-relaxed">
                        Vos données sont utilisées uniquement pour fournir le service de transcription
                        et d'analyse. Nous n'utilisons pas vos données à des fins publicitaires.
                    </p>
                </section>

                <section className="mb-6">
                    <h2 className="text-lg font-semibold text-white mb-3">3. Stockage et sécurité</h2>
                    <p className="text-white/60 text-sm leading-relaxed">
                        Toutes vos notes et transcriptions sont stockées localement sur votre appareil.
                        Les analyses IA sont traitées via des API sécurisées et ne sont pas conservées
                        sur nos serveurs.
                    </p>
                </section>

                <section className="mb-6">
                    <h2 className="text-lg font-semibold text-white mb-3">4. Services tiers</h2>
                    <p className="text-white/60 text-sm leading-relaxed">
                        Nous utilisons Google Gemini AI pour générer les résumés et analyses.
                        Le texte de vos transcriptions est envoyé à ce service mais n'est pas
                        stocké de manière permanente.
                    </p>
                </section>

                <section className="mb-6">
                    <h2 className="text-lg font-semibold text-white mb-3">5. Vos droits</h2>
                    <p className="text-white/60 text-sm leading-relaxed mb-2">
                        Conformément au RGPD, vous avez le droit :
                    </p>
                    <ul className="list-disc list-inside text-white/60 text-sm space-y-1">
                        <li>D'accéder à vos données</li>
                        <li>De les rectifier ou supprimer</li>
                        <li>De vous opposer à leur traitement</li>
                        <li>À la portabilité de vos données</li>
                    </ul>
                </section>

                <section className="mb-6">
                    <h2 className="text-lg font-semibold text-white mb-3">6. Suppression des données</h2>
                    <p className="text-white/60 text-sm leading-relaxed">
                        Vous pouvez supprimer toutes vos données en désinstallant l'application.
                        Toutes les notes stockées localement seront effacées.
                    </p>
                </section>

                <section className="mb-6">
                    <h2 className="text-lg font-semibold text-white mb-3">7. Contact DPO</h2>
                    <p className="text-white/60 text-sm leading-relaxed">
                        Pour exercer vos droits ou pour toute question relative à vos données :
                        <a href="mailto:privacy@voicenotes.app" className="text-primary-light hover:underline ml-1">privacy@voicenotes.app</a>
                    </p>
                </section>
            </div>
        </div>
    );
};

export default PrivacyPage;
