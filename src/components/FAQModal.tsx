import { useEffect, useMemo, useRef, useState } from 'react';
import { X, HelpCircle, Search, ChevronDown, ExternalLink, BookOpen } from 'lucide-react';
import type { LegalDocument } from '../legal/documents';
import { CURRENT_LEGAL_VERSION } from '../hooks/useLegal';

type FAQCategoryId =
  | 'start'
  | 'features'
  | 'models'
  | 'privacy'
  | 'storage'
  | 'compare'
  | 'tech'
  | 'community';

interface FAQCategory {
  id: FAQCategoryId;
  label: string;
  blurb: string;
}

type LearnMoreAction =
  | { kind: 'open-privacy' }
  | { kind: 'open-legal'; id: LegalDocument['id'] }
  | { kind: 'open-settings' }
  | { kind: 'external'; href: string };

interface FAQItem {
  id: string;
  category: FAQCategoryId;
  question: string;
  answer: string;
  learnMore?: { label: string; action: LearnMoreAction };
}

const CATEGORIES: FAQCategory[] = [
  {
    id: 'start',
    label: 'Premiers pas',
    blurb: "Installation, clé API, navigateurs supportés.",
  },
  {
    id: 'features',
    label: 'Fonctionnalités',
    blurb: "Multi-fenêtres, streaming, recherche, historique.",
  },
  {
    id: 'models',
    label: 'Modèles & réglage',
    blurb: 'Catalogue, température, jetons, prompt système.',
  },
  {
    id: 'privacy',
    label: 'Confidentialité & RGPD',
    blurb: 'Stockage local, obfuscation, consentements, polices.',
  },
  {
    id: 'storage',
    label: 'Données & export',
    blurb: 'Portabilité, effacement, cache navigateur.',
  },
  {
    id: 'compare',
    label: 'Comparaison',
    blurb: 'Face à ChatGPT, Claude.ai, autres clients OpenRouter.',
  },
  {
    id: 'tech',
    label: 'Technique',
    blurb: 'Stack, dépendances, erreurs fréquentes.',
  },
  {
    id: 'community',
    label: 'Communauté',
    blurb: 'Licence, contribution, support.',
  },
];

const ITEMS: FAQItem[] = [
  // 1. Premiers pas
  {
    id: 'q-what',
    category: 'start',
    question: "Qu'est-ce que PolyChat AI ?",
    answer:
      "PolyChat AI est une interface web open source qui donne accès à plus de 100 modèles d'intelligence artificielle — GPT-4o, Claude 3.5, Gemini 1.5, Llama 3, Mistral — depuis une seule application. L'application, construite avec React 19 et TypeScript, communique avec les modèles via l'API OpenRouter et stocke vos conversations localement dans votre navigateur. Le code est publié sous licence MIT sur GitHub.",
    learnMore: { label: 'Voir le code source', action: { kind: 'external', href: 'https://github.com/Teeflo/PolyChat-AI' } },
  },
  {
    id: 'q-start',
    category: 'start',
    question: 'Comment démarrer avec PolyChat AI ?',
    answer:
      "Trois étapes suffisent : (1) créez un compte gratuit sur openrouter.ai et générez une clé d'API ; (2) ouvrez polychat-ai.vercel.app et collez votre clé dans la fenêtre Paramètres (icône engrenage, en haut à droite) ; (3) choisissez un modèle dans la liste déroulante et envoyez votre premier message. Aucune installation n'est requise : tout fonctionne dans le navigateur.",
  },
  {
    id: 'q-account',
    category: 'start',
    question: 'Faut-il créer un compte sur PolyChat AI ?',
    answer:
      "Non. PolyChat AI ne propose ni inscription, ni compte utilisateur, ni adresse e-mail. La seule donnée d'identification dont vous avez besoin est une clé d'API OpenRouter, que vous collez directement dans les paramètres. L'application reste anonyme et ne collecte rien sur ses utilisateurs ; rien n'est télémétré.",
  },
  {
    id: 'q-apikey',
    category: 'start',
    question: "Comment obtenir une clé d'API OpenRouter ?",
    answer:
      "Rendez-vous sur openrouter.ai, créez un compte (e-mail ou OAuth Google/Discord/GitHub), puis ouvrez la page Keys de votre espace personnel. Cliquez sur Create Key, donnez-lui un nom, copiez la valeur (elle commence par sk-or-) et collez-la dans les Paramètres de PolyChat AI. Ajoutez ensuite un crédit (≥ 5 $) pour activer les modèles payants ; certains modèles open source restent gratuits.",
  },
  {
    id: 'q-browsers',
    category: 'start',
    question: 'Sur quels appareils et navigateurs fonctionne PolyChat AI ?',
    answer:
      "PolyChat AI fonctionne sur tout appareil disposant d'un navigateur moderne : Chrome 119+, Firefox 122+, Safari 17.4+, Edge 119+. L'interface est responsive (desktop, tablette, mobile) et s'adapte à toutes les tailles d'écran. Aucune application native n'est distribuée, mais l'application peut être installée comme PWA via le menu du navigateur (« Installer l'application »).",
  },

  // 2. Fonctionnalités
  {
    id: 'q-parallel',
    category: 'features',
    question: 'Comment comparer plusieurs modèles en parallèle ?',
    answer:
      "Dans la barre d'outils d'une conversation, cliquez sur le sélecteur de colonnes (1, 2 ou 3) pour afficher jusqu'à 3 fenêtres simultanément. Chaque fenêtre possède son propre menu déroulant de modèle : attribuez GPT-4o à la première, Claude à la seconde, Gemini à la troisième. Tant qu'aucun message n'a été envoyé, votre saisie est diffusée en parallèle aux trois colonnes, et leurs réponses apparaissent en streaming côte à côte.",
  },
  {
    id: 'q-resume',
    category: 'features',
    question: 'Puis-je reprendre une conversation plus tard ?',
    answer:
      "Oui. Toutes vos conversations sont sauvegardées automatiquement dans le localStorage de votre navigateur après chaque message. Vous les retrouvez dans la barre latérale gauche, regroupées par date (Aujourd'hui, Hier, date explicite). Cliquez sur un titre pour reprendre exactement là où vous vous étiez arrêté(e), avec l'historique complet des échanges et le modèle utilisé.",
  },
  {
    id: 'q-rename',
    category: 'features',
    question: 'Comment renommer ou supprimer une conversation ?',
    answer:
      "Survolez une conversation dans la barre latérale : une icône crayon (renommer) et une icône corbeille (supprimer) apparaissent à droite. Le renommage modifie le titre affiché ; le titre d'origine est généré automatiquement à partir des 60 premiers caractères du premier message utilisateur. La suppression retire définitivement la conversation après confirmation. Ces actions sont locales et immédiates.",
  },
  {
    id: 'q-stream',
    category: 'features',
    question: 'Le streaming des réponses est-il pris en charge ?',
    answer:
      "Oui. PolyChat AI utilise le streaming Server-Sent Events (SSE) d'OpenRouter. Les tokens apparaissent mot par mot au fur et à mesure que le modèle les génère, avec un curseur clignotant. Vous pouvez interrompre la génération à tout moment avec le bouton Stop (carré) de la colonne. Une fois interrompue, la réponse partielle est conservée et le bouton Régénérer devient disponible.",
  },
  {
    id: 'q-search',
    category: 'features',
    question: 'Comment fonctionne la recherche dans la barre latérale ?',
    answer:
      "Le champ de recherche en haut de la barre latérale filtre vos conversations en temps réel. La recherche porte sur le titre de la conversation, pas sur le contenu des messages (le contenu reste dans votre navigateur, jamais indexé côté serveur). Effacez le champ pour revenir à la liste complète, toujours regroupée par date.",
  },

  // 3. Modèles & réglage
  {
    id: 'q-models',
    category: 'models',
    question: 'Quels modèles d’IA sont disponibles ?',
    answer:
      "PolyChat AI donne accès au catalogue complet d'OpenRouter : plus de 100 modèles à jour, incluant OpenAI (GPT-4o, GPT-4 Turbo, o1, o3-mini), Anthropic (Claude 3.5 Sonnet, Claude 3 Opus, Claude 3 Haiku), Google (Gemini 1.5 Pro, Gemini 1.5 Flash, Gemma 2), Meta (Llama 3.1 405B, Llama 3.3 70B), Mistral (Large, Codestral), DeepSeek (V3, R1), Qwen, Cohere et de nombreux modèles open source.",
  },
  {
    id: 'q-switch',
    category: 'models',
    question: 'Comment changer de modèle en cours de conversation ?',
    answer:
      "Cliquez sur le sélecteur de modèle en haut d'une colonne pour basculer vers un autre modèle. Le changement s'applique aux messages suivants ; les échanges précédents restent visibles mais ont été générés par l'ancien modèle (un badge discret l'indique). Pour repartir d'une page blanche avec un nouveau modèle, créez simplement une nouvelle conversation via le bouton « Nouvelle conversation ».",
  },
  {
    id: 'q-temperature',
    category: 'models',
    question: 'Que signifient température et jetons maximum ?',
    answer:
      "La température (entre 0 et 2) contrôle le degré de créativité du modèle : 0 produit des réponses déterministes et focalisées, 1 un équilibre, 2 des réponses plus variées et créatives. Le nombre maximal de jetons (max_tokens) plafonne la longueur de la réponse (par ex. 1024 ≈ 750 mots en français). Les deux réglages se trouvent dans la fenêtre Paramètres et s'appliquent à toutes les nouvelles conversations.",
  },
  {
    id: 'q-system',
    category: 'models',
    question: 'Qu’est-ce que le prompt système ?',
    answer:
      "Le prompt système est une instruction envoyée au modèle avant chaque échange, mais invisible dans la conversation affichée. Il sert à définir le ton, le rôle ou les contraintes (par ex. « Tu es un expert en cuisine française. Réponds de manière concise, sans notes de bas de page »). Vous le définissez une seule fois dans les Paramètres ; il s'applique à toutes les nouvelles conversations et à toutes les colonnes.",
  },

  // 4. Confidentialité & RGPD
  {
    id: 'q-private',
    category: 'privacy',
    question: 'Mes conversations sont-elles privées ?',
    answer:
      "Oui. L'historique de vos conversations est stocké exclusivement dans le localStorage de votre navigateur. Aucun serveur PolyChat AI ne reçoit ni ne lit vos messages. En revanche, vos messages transitent par OpenRouter (hébergé aux États-Unis) puis par le fournisseur du modèle choisi (OpenAI, Anthropic, Google…) selon leurs propres politiques de confidentialité. Consultez notre Politique de confidentialité pour le détail des flux.",
    learnMore: { label: 'Politique de confidentialité', action: { kind: 'open-legal', id: 'privacy' } },
  },
  {
    id: 'q-key',
    category: 'privacy',
    question: 'Ma clé d’API est-elle sécurisée ?',
    answer:
      "Votre clé d'API OpenRouter est stockée localement dans votre navigateur. Elle est obfusquée (XOR + base64) avant écriture pour limiter le risque d'extraction triviale via la console. Important : cette obfuscation n'est pas un chiffrement fort. Pour une sécurité maximale, utilisez une clé à crédits limités et révoquez-la sur openrouter.ai après usage intensif. Le code d'obfuscation est public sur GitHub pour audit.",
  },
  {
    id: 'q-consent',
    category: 'privacy',
    question: 'Pourquoi ce bandeau de consentement au premier chargement ?',
    answer:
      "PolyChat AI applique le RGPD et les recommandations CNIL. Avant la première utilisation, vous devez accepter explicitement les documents juridiques (mentions légales, politique de confidentialité, CGU, politique cookies, avertissement IA). La version acceptée est enregistrée avec un horodatage. Vous pouvez retirer votre consentement à tout moment depuis la fenêtre Confidentialité ; elle réapparaîtra à la prochaine visite.",
    learnMore: { label: 'Gérer mes consentements', action: { kind: 'open-privacy' } },
  },
  {
    id: 'q-fonts',
    category: 'privacy',
    question: 'Les Google Fonts sont-ils obligatoires ?',
    answer:
      "Non. Par défaut, l'application utilise les polices système de votre appareil (sérif, sans-serif, monospace natives), ce qui n'entraîne aucune requête réseau supplémentaire. Si vous activez Google Fonts dans Confidentialité → Polices, les fontes Fraunces, IBM Plex Sans et JetBrains Mono sont chargées depuis Google LLC, ce qui implique une requête externe et la transmission de votre adresse IP. Le choix reste le vôtre.",
    learnMore: { label: 'Réglages de polices', action: { kind: 'open-privacy' } },
  },

  // 5. Données & export
  {
    id: 'q-storage',
    category: 'storage',
    question: 'Où sont stockées mes conversations ?',
    answer:
      "Toutes vos conversations, vos paramètres, votre clé d'API et vos consentements sont stockés dans le localStorage de votre navigateur, sous trois clés distinctes : polychat-settings, polychat_history et polychat-legal. Aucune base de données serveur, aucun cookie tiers, aucun service d'analytics. Videz le localStorage ou utilisez le mode navigation privée pour repartir d'un état vierge.",
  },
  {
    id: 'q-export',
    category: 'storage',
    question: 'Puis-je exporter mes données ?',
    answer:
      "Oui. Ouvrez la fenêtre Confidentialité (bouton « Confidentialité » du pied de page), puis cliquez sur « Exporter mes données ». Un fichier polychat-export-AAAA-MM-JJ.json est téléchargé. Il contient l'intégralité de vos conversations, vos paramètres (clé d'API obfusquée), vos consentements et leurs horodatages. Vous pouvez l'archiver, le migrer vers un autre outil ou l'utiliser comme sauvegarde.",
    learnMore: { label: 'Exporter mes données', action: { kind: 'open-privacy' } },
  },
  {
    id: 'q-delete',
    category: 'storage',
    question: 'Comment supprimer définitivement mes données ?',
    answer:
      "Deux options. (1) Ciblée : dans la barre latérale, survolez une conversation et cliquez sur la corbeille. (2) Globale : dans Confidentialité → « Supprimer toutes mes données », confirmez. Toutes les clés localStorage sont effacées, la page se recharge et vous repartez d'un état vierge. Les consentements juridiques seront redemandés au prochain chargement. Action irréversible.",
    learnMore: { label: 'Supprimer toutes mes données', action: { kind: 'open-privacy' } },
  },
  {
    id: 'q-cache',
    category: 'storage',
    question: 'Que se passe-t-il si je vide le cache du navigateur ?',
    answer:
      "Vider le cache du navigateur (images, fichiers mis en cache) n'efface pas le localStorage. En revanche, vider les « données de site » ou utiliser les options « Cookies et données de site » efface le localStorage, donc vos conversations, vos paramètres et vos consentements. Pensez à exporter vos données au préalable si vous souhaitez les conserver ; un mode navigation privée est recommandé pour une session jetable.",
  },

  // 6. Comparaison
  {
    id: 'q-vs-chatgpt',
    category: 'compare',
    question: 'Quelle est la différence avec ChatGPT ?',
    answer:
      "ChatGPT est un service propriétaire d'OpenAI qui ne donne accès qu'aux modèles OpenAI, dans une interface unique et un abonnement mensuel (ChatGPT Plus à 23 $/mois). PolyChat AI est une interface libre (MIT) qui agrège plus de 100 modèles de tous les fournisseurs (OpenAI, Anthropic, Google, Meta, Mistral…) en paiement à l'usage réel via OpenRouter, avec comparaison multi-modèles en parallèle sur une même question.",
  },
  {
    id: 'q-vs-openrouter',
    category: 'compare',
    question: 'Pourquoi passer par OpenRouter ?',
    answer:
      "OpenRouter est une passerelle unifiée qui facture à l'usage réel, sans abonnement, et unifie l'API : un seul format d'appel, une seule facturation, un seul tableau de bord pour 100+ fournisseurs. Vous gérez vos crédits et vos clés au même endroit, vous payez uniquement ce que vous consommez, et vous pouvez basculer d'un modèle à l'autre sans changer d'interface. C'est le moyen le plus flexible d'expérimenter.",
  },
  {
    id: 'q-vs-claude',
    category: 'compare',
    question: 'Et face à claude.ai ou gemini.google.com ?',
    answer:
      "Les interfaces officielles (claude.ai, gemini.google.com, chat.openai.com) ne donnent accès qu'à un seul fournisseur à la fois et conservent vos conversations sur leurs serveurs. PolyChat AI mutualise tous ces fournisseurs derrière une seule URL, garde l'historique en local et permet la comparaison côte à côte. L'inconvénient : vous payez à l'usage réel au lieu d'un forfait, et devez gérer votre clé d'API.",
  },

  // 7. Technique
  {
    id: 'q-errors',
    category: 'tech',
    question: 'Pourquoi ma requête échoue-t-elle ?',
    answer:
      "Les causes les plus fréquentes : (1) clé d'API absente, expirée ou invalide — vérifiez dans Paramètres ; (2) crédit OpenRouter épuisé — rechargez sur openrouter.ai ; (3) modèle momentanément indisponible ou rate-limit atteint — réessayez ou changez de modèle ; (4) bloqueur publicitaire ou VPN trop restrictif — désactivez-le pour openrouter.ai. Le message d'erreur exact est affiché sous la zone de saisie.",
  },
  {
    id: 'q-stack',
    category: 'tech',
    question: 'Quelles technologies sont utilisées ?',
    answer:
      "PolyChat AI est construit avec React 19, TypeScript strict, Vite 7, Zustand (avec persistance localStorage), react-markdown + remark-gfm pour le rendu Markdown, lucide-react pour les icônes, et un CSS écrit à la main avec variables de thème. Aucune dépendance Tailwind ni framework UI externe. Le bundle final est inférieur à 200 Ko gzippé et la première peinture est inférieure à 100 ms sur connexion 4G.",
  },
  {
    id: 'q-pwa',
    category: 'tech',
    question: 'Puis-je installer PolyChat AI comme une application ?',
    answer:
      "Oui, comme PWA. Sur Chrome ou Edge, cliquez sur l'icône « installer » à droite de la barre d'adresse. Sur Safari macOS, choisissez Fichier → Ajouter au Dock. Sur iOS/Android, « Ajouter à l'écran d'accueil » depuis le menu du navigateur. L'application se lance alors en mode standalone, sans barre d'adresse, avec un manifeste et une icône dédiés.",
  },
  {
    id: 'q-bug',
    category: 'tech',
    question: 'Comment signaler un bug ou proposer une fonctionnalité ?',
    answer:
      "Ouvrez un ticket sur le dépôt GitHub github.com/Teeflo/PolyChat-AI dans la section Issues. Pour un bug, décrivez les étapes de reproduction, le navigateur, le modèle utilisé et joignez si possible une capture d'écran. Pour une fonctionnalité, expliquez le besoin, l'API envisagée et le bénéfice utilisateur. Les pull requests sont les bienvenues, après lecture du guide de contribution.",
    learnMore: { label: 'Ouvrir un ticket', action: { kind: 'external', href: 'https://github.com/Teeflo/PolyChat-AI/issues' } },
  },

  // 8. Communauté
  {
    id: 'q-contribute',
    category: 'community',
    question: 'Puis-je contribuer au projet ?',
    answer:
      "Oui, c'est un projet open source. Vous pouvez contribuer de plusieurs manières : signaler un bug, proposer une fonctionnalité, améliorer la documentation, traduire l'interface (français ↔ anglais), soumettre une pull request pour corriger un défaut ou ajouter une fonctionnalité. Toute contribution est créditée dans le fichier CONTRIBUTORS.md et le CHANGELOG du projet.",
    learnMore: { label: 'Guide de contribution', action: { kind: 'external', href: 'https://github.com/Teeflo/PolyChat-AI/blob/main/CONTRIBUTING.md' } },
  },
  {
    id: 'q-license',
    category: 'community',
    question: 'Sous quelle licence le code est-il publié ?',
    answer:
      "PolyChat AI est publié sous licence MIT. Vous êtes libre de l'utiliser, le copier, le modifier, le fusionner, le publier, le distribuer, le sous-licencier et/ou le vendre, à condition de conserver la notice de copyright et la licence dans toutes les copies. La licence MIT est permissive et compatible avec la plupart des autres licences open source, y compris GPL et Apache 2.0.",
  },
  {
    id: 'q-version',
    category: 'community',
    question: 'Comment suivre les évolutions du produit ?',
    answer:
      "Les versions publiées sont listées sur la page Releases de GitHub (numérotation SemVer). Le CHANGELOG.md détaille les changements notables. Pour les questions juridiques, la version courante est affichée en bas de chaque document légal et au bas de la fenêtre Confidentialité. Lorsqu'un changement substantiel modifie vos droits, la constante CURRENT_LEGAL_VERSION est bumpée et le bandeau de consentement réapparaît.",
  },
];

interface FAQModalProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenLegal: (id: LegalDocument['id']) => void;
  onOpenPrivacy: () => void;
  onOpenSettings: () => void;
}

export function FAQModal({
  isOpen,
  onClose,
  onOpenLegal,
  onOpenPrivacy,
  onOpenSettings,
}: FAQModalProps) {
  const overlayRef = useRef<HTMLDivElement>(null);
  const modalRef = useRef<HTMLDivElement>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const searchRef = useRef<HTMLInputElement>(null);
  const previousFocusRef = useRef<HTMLElement | null>(null);
  const bodyRef = useRef<HTMLDivElement>(null);
  const [search, setSearch] = useState('');
  const [activeCategory, setActiveCategory] = useState<FAQCategoryId | 'all'>('all');

  useEffect(() => {
    if (!isOpen) {
      setSearch('');
      setActiveCategory('all');
      return;
    }

    previousFocusRef.current = document.activeElement as HTMLElement | null;

    const focusTimer = window.setTimeout(() => {
      searchRef.current?.focus();
    }, 50);

    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === 'Escape') onClose();
    }

    document.addEventListener('keydown', handleKeyDown);
    return () => {
      window.clearTimeout(focusTimer);
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = originalOverflow;
      previousFocusRef.current?.focus?.();
    };
  }, [isOpen, onClose]);

  const filteredItems = useMemo(() => {
    const q = search.trim().toLowerCase();
    return ITEMS.filter((item) => {
      const matchesCategory =
        activeCategory === 'all' || item.category === activeCategory;
      if (!matchesCategory) return false;
      if (q.length === 0) return true;
      return (
        item.question.toLowerCase().includes(q) ||
        item.answer.toLowerCase().includes(q)
      );
    });
  }, [search, activeCategory]);

  const itemsByCategory = useMemo(() => {
    const map = new Map<FAQCategoryId, FAQItem[]>();
    for (const cat of CATEGORIES) map.set(cat.id, []);
    for (const item of filteredItems) {
      const list = map.get(item.category);
      if (list) list.push(item);
    }
    return map;
  }, [filteredItems]);

  if (!isOpen) return null;

  const titleId = 'faq-modal-title';
  const totalAnswered = filteredItems.length;
  const totalAll = ITEMS.length;

  function handleLearnMore(item: FAQItem) {
    if (!item.learnMore) return;
    const action = item.learnMore.action;
    if (action.kind === 'open-privacy') {
      onClose();
      onOpenPrivacy();
    } else if (action.kind === 'open-legal') {
      onClose();
      onOpenLegal(action.id);
    } else if (action.kind === 'open-settings') {
      onClose();
      onOpenSettings();
    } else if (action.kind === 'external') {
      window.open(action.href, '_blank', 'noopener,noreferrer');
    }
  }

  function jumpToCategory(cat: FAQCategoryId) {
    setActiveCategory(cat);
    requestAnimationFrame(() => {
      const el = bodyRef.current?.querySelector<HTMLElement>(
        `[data-category="${cat}"]`
      );
      if (el && bodyRef.current) {
        const top = el.offsetTop - 16;
        bodyRef.current.scrollTo({ top, behavior: 'smooth' });
      }
    });
  }

  return (
    <div
      className="modal-overlay"
      ref={overlayRef}
      onClick={(e) => {
        if (e.target === overlayRef.current) onClose();
      }}
    >
      <div
        className="modal modal-faq"
        ref={modalRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
      >
        <div className="modal-header">
          <div>
            <span className="modal-eyebrow">Foire aux questions</span>
            <h2 id={titleId} className="modal-title">
              Vos <em>questions.</em>
            </h2>
            <p className="modal-faq-meta">
              {totalAll} réponses · version juridique {CURRENT_LEGAL_VERSION}
            </p>
          </div>
          <button
            ref={closeButtonRef}
            className="modal-close"
            onClick={onClose}
            aria-label="Fermer la fenêtre Questions fréquentes"
            title="Fermer (Échap)"
          >
            <X size={18} aria-hidden="true" />
          </button>
        </div>

        <div className="modal-faq-toolbar">
          <label className="modal-faq-search">
            <span className="modal-faq-search-icon" aria-hidden="true">
              <Search size={14} />
            </span>
            <span className="visually-hidden">Filtrer les questions</span>
            <input
              ref={searchRef}
              type="search"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Filtrer : « streaming », « RGPD », « modèle »…"
              className="modal-faq-search-input"
              aria-label="Filtrer les questions par mot-clé"
            />
          </label>
          <nav className="modal-faq-toc" aria-label="Catégories de questions">
            <button
              type="button"
              className={`modal-faq-toc-btn ${
                activeCategory === 'all' ? 'active' : ''
              }`}
              onClick={() => setActiveCategory('all')}
              aria-pressed={activeCategory === 'all'}
            >
              Tout
            </button>
            {CATEGORIES.map((cat) => {
              const count = itemsByCategory.get(cat.id)?.length ?? 0;
              const disabled = count === 0 && search.length > 0;
              return (
                <button
                  key={cat.id}
                  type="button"
                  className={`modal-faq-toc-btn ${
                    activeCategory === cat.id ? 'active' : ''
                  }`}
                  onClick={() => jumpToCategory(cat.id)}
                  aria-pressed={activeCategory === cat.id}
                  disabled={disabled}
                  title={cat.blurb}
                >
                  {cat.label}
                  {search && (
                    <span className="modal-faq-toc-count" aria-hidden="true">
                      {count}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>
        </div>

        <div className="modal-body modal-faq-body" ref={bodyRef}>
          {totalAnswered === 0 ? (
            <div className="modal-faq-empty" role="status">
              <HelpCircle size={28} aria-hidden="true" />
              <p>Aucune question ne correspond à votre recherche.</p>
              <button
                type="button"
                className="form-input form-button"
                onClick={() => {
                  setSearch('');
                  setActiveCategory('all');
                }}
              >
                Réinitialiser le filtre
              </button>
            </div>
          ) : (
            CATEGORIES.map((cat) => {
              const items = itemsByCategory.get(cat.id) ?? [];
              if (items.length === 0) return null;
              return (
                <section
                  key={cat.id}
                  className="modal-faq-section"
                  data-category={cat.id}
                  aria-labelledby={`faq-cat-${cat.id}`}
                >
                  <header className="modal-faq-section-head">
                    <h3 id={`faq-cat-${cat.id}`} className="modal-faq-section-title">
                      {cat.label}
                    </h3>
                    <p className="modal-faq-section-blurb">{cat.blurb}</p>
                    <span className="modal-faq-section-count" aria-hidden="true">
                      {items.length} question{items.length > 1 ? 's' : ''}
                    </span>
                  </header>
                  <ul className="modal-faq-list">
                    {items.map((item) => (
                      <li key={item.id} className="modal-faq-item">
                        <details className="modal-faq-details">
                          <summary className="modal-faq-summary">
                            <span className="modal-faq-q">{item.question}</span>
                            <span
                              className="modal-faq-chevron"
                              aria-hidden="true"
                            >
                              <ChevronDown size={16} />
                            </span>
                          </summary>
                          <div className="modal-faq-answer">
                            <p>{item.answer}</p>
                            {item.learnMore && (
                              <button
                                type="button"
                                className="modal-faq-learnmore"
                                onClick={() => handleLearnMore(item)}
                              >
                                {item.learnMore.action.kind === 'external' ? (
                                  <ExternalLink size={12} aria-hidden="true" />
                                ) : (
                                  <BookOpen size={12} aria-hidden="true" />
                                )}
                                <span>{item.learnMore.label}</span>
                              </button>
                            )}
                          </div>
                        </details>
                      </li>
                    ))}
                  </ul>
                </section>
              );
            })
          )}

          <footer className="modal-faq-footer">
            <p>
              Question sans réponse ? Ouvrez un ticket sur GitHub ou consultez les
              documents juridiques ci-dessous.
            </p>
            <div className="modal-faq-footer-links">
              <button
                type="button"
                className="legal-footer-link"
                onClick={() => {
                  onClose();
                  onOpenLegal('notices');
                }}
              >
                Mentions légales
              </button>
              <span className="legal-footer-sep" aria-hidden="true">
                ·
              </span>
              <button
                type="button"
                className="legal-footer-link"
                onClick={() => {
                  onClose();
                  onOpenLegal('privacy');
                }}
              >
                Confidentialité
              </button>
              <span className="legal-footer-sep" aria-hidden="true">
                ·
              </span>
              <button
                type="button"
                className="legal-footer-link"
                onClick={() => {
                  onClose();
                  onOpenLegal('terms');
                }}
              >
                CGU
              </button>
              <span className="legal-footer-sep" aria-hidden="true">
                ·
              </span>
              <button
                type="button"
                className="legal-footer-link"
                onClick={() => {
                  onClose();
                  onOpenLegal('ai');
                }}
              >
                Avertissement IA
              </button>
            </div>
          </footer>
        </div>
      </div>
    </div>
  );
}
