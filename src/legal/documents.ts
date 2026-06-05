export type LegalParagraph = string | { type: 'list'; items: string[] };

export type LegalSection = {
  id: string;
  title: string;
  paragraphs: LegalParagraph[];
};

export type LegalDocument = {
  id: 'notices' | 'privacy' | 'terms' | 'cookies' | 'ai';
  shortTitle: string;
  title: string;
  effectiveDate: string;
  intro: string;
  sections: LegalSection[];
};

const EFFECTIVE_DATE = '1er janvier 2026';
const PRODUCT_NAME = 'PolyChat AI';
const PRODUCT_URL = 'PolyChat AI';
const HOSTING_PROVIDER = 'Vercel Inc.';
const HOSTING_ADDRESS = '340 S Lemon Ave #4133, Walnut, CA 91789, États-Unis';
const THIRD_PARTY_AI = 'OpenRouter';
const THIRD_PARTY_AI_URL = 'https://openrouter.ai';
const CONTACT_EMAIL = '[ADRESSE EMAIL À COMPLÉTER]';
const CNIL_URL = 'https://www.cnil.fr/fr/plaintes';
const EDPB_URL = 'https://edpb.europa.eu/about-edpb/about-edpb/members_fr';

const EDITOR_NAME = '[VOTRE NOM ET PRÉNOM À COMPLÉTER]';
const EDITOR_STATUS = 'Particulier – projet personnel';
const EDITOR_ADDRESS = '[VOTRE ADRESSE POSTALE À COMPLÉTER]';
const PUBLISHER_NAME = EDITOR_NAME;
const HOSTING_COUNTRY = 'États-Unis (siège), réseau CDN mondial';

export const LEGAL_DOCUMENTS: Record<LegalDocument['id'], LegalDocument> = {
  notices: {
    id: 'notices',
    shortTitle: 'Mentions légales',
    title: 'Mentions légales',
    effectiveDate: EFFECTIVE_DATE,
    intro: `Les présentes mentions légales sont édictées dans le cadre de la loi n° 2004-575 du 21 juin 2004 pour la confiance dans l'économie numérique (LCEN) et de l'article 6-III. Elles définissent l'identité de l'éditeur, l'hébergeur et les conditions d'utilisation du site ${PRODUCT_NAME}.`,
    sections: [
      {
        id: 'editeur',
        title: '1. Éditeur du site',
        paragraphs: [
          `Le site ${PRODUCT_NAME} est édité par :`,
          {
            type: 'list',
            items: [
              `Nom : ${EDITOR_NAME}`,
              `Statut : ${EDITOR_STATUS}`,
              `Adresse : ${EDITOR_ADDRESS}`,
              `Email de contact : ${CONTACT_EMAIL}`,
            ],
          },
          `Le directeur de la publication est ${PUBLISHER_NAME}, en sa qualité d'éditeur.`,
        ],
      },
      {
        id: 'hebergeur',
        title: '2. Hébergeur',
        paragraphs: [
          `Le site est hébergé par ${HOSTING_PROVIDER}, dont le siège social est situé : ${HOSTING_ADDRESS}.`,
          `Les données traitées par ${PRODUCT_NAME} transitent par les serveurs de cet hébergeur, situés en ${HOSTING_COUNTRY}.`,
        ],
      },
      {
        id: 'propriete-intellectuelle',
        title: '3. Propriété intellectuelle',
        paragraphs: [
          `L'ensemble des éléments du site ${PRODUCT_NAME} (textes, marques, logos, code source, design, mise en page, base de données) est protégé par les lois en vigueur sur la propriété intellectuelle et demeure la propriété exclusive de l'éditeur ou de ses ayants droit.`,
          `Toute reproduction, représentation, modification, diffusion, totale ou partielle, sans autorisation écrite préalable, est interdite et constituerait une contrefaçon sanctionnée par les articles L.335-2 et suivants du Code de la propriété intellectuelle.`,
          `Les marques, logos et noms de modèles d'intelligence artificielle accessibles via le service restent la propriété de leurs titulaires respectifs (OpenRouter, Google, Anthropic, OpenAI, Meta, etc.).`,
        ],
      },
      {
        id: 'responsabilite',
        title: '4. Limitation de responsabilité',
        paragraphs: [
          `${PRODUCT_NAME} est fourni « en l'état » et « selon disponibilité », sans garantie d'aucune sorte, expresse ou implicite.`,
          `L'éditeur s'efforce d'assurer l'exactitude des informations et le bon fonctionnement du service, mais ne saurait garantir l'absence d'interruptions, d'erreurs ou de virus.`,
          `Les réponses générées par les modèles d'intelligence artificielle sont fournies à titre informatif et ne constituent en aucun cas un conseil professionnel (juridique, médical, financier, etc.). L'utilisateur reste seul responsable de l'usage qu'il en fait.`,
          `L'éditeur ne peut être tenu responsable de l'usage fait par l'utilisateur de sa propre clé API OpenRouter, ni des coûts facturés par ce tiers à l'utilisateur.`,
        ],
      },
      {
        id: 'liens',
        title: '5. Liens hypertextes',
        paragraphs: [
          `Le site peut contenir des liens vers des sites tiers (notamment openrouter.ai). L'éditeur n'exerce aucun contrôle sur ces sites et décline toute responsabilité quant à leur contenu, leurs pratiques ou leur disponibilité.`,
        ],
      },
      {
        id: 'droit applicable',
        title: '6. Droit applicable et juridiction',
        paragraphs: [
          `Les présentes mentions légales sont régies par le droit français. En cas de litige et après tentative de recherche d'une solution amiable, les tribunaux français seront seuls compétents pour connaître de ce litige.`,
        ],
      },
      {
        id: 'contact',
        title: '7. Contact',
        paragraphs: [
          `Pour toute question relative à ces mentions légales ou au site, vous pouvez écrire à : ${CONTACT_EMAIL}.`,
        ],
      },
    ],
  },

  privacy: {
    id: 'privacy',
    shortTitle: 'Politique de confidentialité',
    title: 'Politique de confidentialité',
    effectiveDate: EFFECTIVE_DATE,
    intro: `La présente politique décrit la manière dont ${PRODUCT_NAME} collecte, utilise et protège les informations des utilisateurs, dans le respect du Règlement (UE) 2016/679 dit « RGPD » et de la loi française n° 78-17 du 6 janvier 1978 modifiée. Elle s'applique au site ${PRODUCT_URL}.`,
    sections: [
      {
        id: 'responsable',
        title: '1. Responsable du traitement',
        paragraphs: [
          `Le responsable du traitement est ${EDITOR_NAME} (${EDITOR_STATUS}), joignable à : ${CONTACT_EMAIL}.`,
          `Aucun délégué à la protection des données (DPO) n'a été désigné, le traitement n'étant pas soumis à cette obligation au regard des volumes et de la nature des données traitées.`,
        ],
      },
      {
        id: 'donnees-collectees',
        title: '2. Données collectées',
        paragraphs: [
          `${PRODUCT_NAME} fonctionne en mode « client pur » (single-page application) : aucune donnée n'est envoyée sur un serveur qui vous appartient, à l'exception des échanges avec les sous-traitants techniques décrits ci-après. Les données restent dans votre navigateur.`,
          'Les catégories de données traitées sont les suivantes :',
          {
            type: 'list',
            items: [
              `Données que vous saisissez : la clé API OpenRouter, le prompt système éventuel, le contenu de vos messages, les titres de conversation.`,
              `Données de paramétrage : modèle sélectionné, température, longueur maximale de réponse, thème visuel.`,
              `Données stockées localement (localStorage du navigateur) : historique de conversation (jusqu'à suppression manuelle ou vidage du stockage du navigateur), préférences d'interface.`,
              `Données techniques transmises à des tiers : adresse IP, agent utilisateur (User-Agent), langue, fuseau horaire — communiquées à OpenRouter et, si vous y consentez, à Google Fonts, lors de chaque requête HTTPS.`,
            ],
          },
          `${PRODUCT_NAME} ne traite pas de données sensibles (santé, biométrie, opinions, etc.) au sens de l'article 9 du RGPD.`,
        ],
      },
      {
        id: 'finalites',
        title: '3. Finalités et bases légales',
        paragraphs: [
          'Les traitements mis en œuvre poursuivent les finalités suivantes :',
          {
            type: 'list',
            items: [
              `Fourniture du service de conversation avec des modèles d'IA — base légale : exécution du contrat (article 6.1.b RGPD), l'utilisation du service impliquant l'envoi de vos messages à OpenRouter.`,
              `Conservation locale de votre historique — base légale : consentement (article 6.1.a RGPD), que vous pouvez retirer à tout moment en supprimant l'historique ou les données de votre navigateur.`,
              `Amélioration du service — base légale : intérêt légitime (article 6.1.f RGPD), limité à la mémoire strictement nécessaire à votre session.`,
              `Réponse à vos demandes — base légale : mesures précontractuelles ou contractuelles.`,
            ],
          },
        ],
      },
      {
        id: 'sous-traitants',
        title: '4. Sous-traitants et destinataires',
        paragraphs: [
          'Les tiers susceptibles de recevoir des données sont les suivants :',
          {
            type: 'list',
            items: [
              `${THIRD_PARTY_AI} (${THIRD_PARTY_AI_URL}) : reçoit le contenu de vos messages et de vos prompts système pour les transmettre aux modèles d'IA que vous sélectionnez. Les conditions d'utilisation et la politique de confidentialité d'OpenRouter s'appliquent. OpenRouter agit en sous-traitant au sens du RGPD.`,
              `Vercel Inc. (hébergeur de l'application) : reçoit les requêtes HTTPS standards (adresse IP, en-têtes HTTP, journaux de connexion) à des fins de fourniture de l'hébergement et de sécurité.`,
              `Google Fonts (Google LLC), sous réserve de votre consentement : reçoit votre adresse IP et votre User-Agent lors du chargement des polices de caractères. Sans consentement, les polices système sont utilisées à la place.`,
            ],
          },
          `${PRODUCT_NAME} ne vend ni ne loue aucune donnée à caractère personnel. Aucun transfert de données à des courtiers de données ou à des partenaires marketing n'est effectué.`,
        ],
      },
      {
        id: 'transferts-hors-ue',
        title: '5. Transferts hors Union européenne',
        paragraphs: [
          `${PRODUCT_NAME} est hébergé par ${HOSTING_PROVIDER}, dont les serveurs peuvent se trouver hors de l'Espace économique européen (${HOSTING_COUNTRY}). Les données transitent également par OpenRouter, dont l'infrastructure est principalement située aux États-Unis.`,
          `Ces transferts sont encadrés par les clauses contractuelles types (Standard Contractual Clauses) adoptées par la Commission européenne (décision 2021/914) et, le cas échéant, par les décisions d'adéquation en vigueur. Vous pouvez obtenir une copie de ces garanties sur demande à ${CONTACT_EMAIL}.`,
        ],
      },
      {
        id: 'conservation',
        title: '6. Durée de conservation',
        paragraphs: [
          'Les données sont conservées selon les règles suivantes :',
          {
            type: 'list',
            items: [
              `Clé API, préférences, historique de conversation : conservés localement dans votre navigateur tant que vous ne les supprimez pas (via le bouton « Supprimer l'historique » des paramètres ou en effaçant les données du site dans votre navigateur).`,
              `Journaux de connexion du serveur (Vercel) : conservés pour la durée prévue par notre hébergeur dans ses conditions générales.`,
              `Journaux de requêtes OpenRouter : régis par la politique de conservation d'OpenRouter, consultable sur leur site.`,
            ],
          },
          `À la suppression, les données sont effacées de votre navigateur immédiatement. Aucune copie de sauvegarde n'est conservée par ${PRODUCT_NAME}.`,
        ],
      },
      {
        id: 'droits',
        title: '7. Vos droits',
        paragraphs: [
          `Conformément au RGPD, vous disposez à tout moment des droits suivants :`,
          {
            type: 'list',
            items: [
              `Droit d'accès à vos données.`,
              `Droit de rectification de vos données inexactes.`,
              `Droit à l'effacement (« droit à l'oubli »).`,
              `Droit à la limitation du traitement.`,
              `Droit à la portabilité : vous pouvez à tout moment exporter l'intégralité de vos conversations au format JSON depuis les paramètres.`,
              `Droit d'opposition au traitement fondé sur l'intérêt légitime.`,
              `Droit de retirer votre consentement à tout moment, sans rétroactivité.`,
              `Droit d'introduire une réclamation auprès de la CNIL (${CNIL_URL}) ou de l'autorité de contrôle de votre lieu de résidence (liste : ${EDPB_URL}).`,
            ],
          },
          `Pour exercer ces droits, écrivez à ${CONTACT_EMAIL}. Une réponse vous sera apportée dans un délai d'un mois à compter de la réception de la demande, conformément à l'article 12.3 du RGPD.`,
          `Compte tenu du fait que ${PRODUCT_NAME} ne conserve aucune donnée en back-office, la plupart de ces droits peuvent être exercés directement depuis votre navigateur (export, suppression, modification).`,
        ],
      },
      {
        id: 'cookies',
        title: '8. Cookies et traceurs',
        paragraphs: [
          `${PRODUCT_NAME} n'utilise aucun cookie de mesure d'audience, publicitaire ou de traçage.`,
          `Seul le stockage local (localStorage) est utilisé pour mémoriser vos préférences et votre historique. Ces données ne sont jamais lues par un tiers.`,
          `Si vous consentez au chargement de Google Fonts, votre navigateur effectuera une requête vers fonts.googleapis.com, ce qui communiquera votre adresse IP à Google. Vous pouvez retirer ce consentement à tout moment depuis les paramètres.`,
        ],
      },
      {
        id: 'securite',
        title: '9. Sécurité',
        paragraphs: [
          `Les échanges avec OpenRouter et l'hébergeur sont chiffrés en transit (HTTPS / TLS).`,
          `La clé API que vous saisissez est stockée localement après une simple obfuscation (XOR) ; cette mesure n'est pas un chiffrement au sens cryptographique et ne protège pas contre un accès physique à votre appareil. Elle vise à empêcher une lecture accidentelle par un site tiers consultant votre stockage local.`,
          `Il vous appartient de ne pas utiliser ${PRODUCT_NAME} sur un appareil partagé et de vider le stockage de votre navigateur avant de prêter ou céder votre appareil.`,
          `Aucun système n'étant parfaitement sûr, l'éditeur ne peut garantir une sécurité absolue.`,
        ],
      },
      {
        id: 'mineurs',
        title: '10. Utilisation par des mineurs',
        paragraphs: [
          `${PRODUCT_NAME} n'est pas destiné aux enfants de moins de 16 ans. Si vous êtes parent ou tuteur et que vous constatez qu'un mineur nous a communiqué des données, écrivez à ${CONTACT_EMAIL} afin que nous puissions vous indiquer comment les supprimer.`,
        ],
      },
      {
        id: 'modifications',
        title: '11. Modifications de la politique',
        paragraphs: [
          `L'éditeur se réserve le droit de modifier la présente politique pour refléter les évolutions du service ou de la réglementation. En cas de changement substantiel, les utilisateurs en seront informés par un message visible dans l'interface.`,
        ],
      },
      {
        id: 'contact',
        title: '12. Contact',
        paragraphs: [
          `Pour toute question relative à la protection de vos données : ${CONTACT_EMAIL}.`,
        ],
      },
    ],
  },

  terms: {
    id: 'terms',
    shortTitle: "Conditions générales d'utilisation",
    title: "Conditions générales d'utilisation (CGU)",
    effectiveDate: EFFECTIVE_DATE,
    intro: `Les présentes conditions générales d'utilisation (ci-après « CGU ») régissent l'accès et l'utilisation du service ${PRODUCT_NAME}. En accédant au service, vous acceptez sans réserve les présentes CGU.`,
    sections: [
      {
        id: 'objet',
        title: '1. Objet',
        paragraphs: [
          `${PRODUCT_NAME} est une application web gratuite qui sert d'interface cliente au service tiers OpenRouter. L'application permet à l'utilisateur de formuler des requêtes (« prompts ») à destination de modèles d'intelligence artificielle et d'en afficher les réponses.`,
          `${PRODUCT_NAME} ne fournit pas elle-même de modèles d'IA et n'héberge pas d'inférence : elle agit exclusivement comme interface utilisateur.`,
        ],
      },
      {
        id: 'acces',
        title: '2. Accès au service',
        paragraphs: [
          `Le service est fourni gratuitement, sans création de compte, sans serveur dorsal, sans limitation de durée autre que celles imposées par OpenRouter (notamment limites de débit et quotas de la clé API).`,
          `L'accès requiert une clé API OpenRouter valide, fournie par l'utilisateur et stockée localement dans son navigateur. L'obtention et le coût de cette clé relèvent exclusivement de l'utilisateur et d'OpenRouter.`,
        ],
      },
      {
        id: 'obligations',
        title: '3. Obligations de l\'utilisateur',
        paragraphs: [
          `Vous vous engagez à utiliser ${PRODUCT_NAME} dans le respect des lois applicables, des droits des tiers, et des conditions d'utilisation d'OpenRouter. Il est notamment interdit de :`,
          {
            type: 'list',
            items: [
              `soumettre du contenu illicite, diffamatoire, discriminatoire, violent, pédopornographique, ou portant atteinte à des droits de propriété intellectuelle ;`,
              `tenter de porter atteinte au service, de le décompiler, de le réutiliser à des fins commerciales non autorisées ;`,
              `utiliser le service pour générer du contenu destiné à tromper des tiers (usurpation d'identité, deepfakes malveillants, désinformation à grande échelle) ;`,
              `soumettre des données personnelles de tiers sans base légale ;`,
            ],
          },
          `Vous êtes seul responsable des prompts que vous saisissez et de l'usage que vous faites des réponses générées.`,
        ],
      },
      {
        id: 'cle-api',
        title: '4. Clé API et facturation',
        paragraphs: [
          `La clé API que vous saisissez est utilisée pour authentifier vos requêtes auprès d'OpenRouter. ${PRODUCT_NAME} n'accède pas à votre clé à d'autres fins et ne la transmet à aucun autre service.`,
          `Les coûts éventuellement facturés par OpenRouter (modèles payants, dépassement de quotas) restent à votre charge exclusive. ${PRODUCT_NAME} n'effectue aucune facturation et ne perçoit aucune commission.`,
          `En cas de compromission suspectée de votre clé, révoquez-la immédiatement depuis votre tableau de bord OpenRouter.`,
        ],
      },
      {
        id: 'propriete',
        title: '5. Propriété intellectuelle',
        paragraphs: [
          `Les éléments du service ${PRODUCT_NAME} (code, design, marque, contenu éditorial) restent la propriété de l'éditeur.`,
          `Aucun droit de propriété ne vous est cédé sur les modèles d'IA interrogés ; leurs conditions d'utilisation (notamment OpenRouter, OpenAI, Anthropic, Google, Meta) s'appliquent à leurs réponses respectives.`,
          `Vous restez propriétaire du contenu que vous saisissez et des réponses que vous générez, sous réserve des conditions imposées par les fournisseurs de modèles.`,
        ],
      },
      {
        id: 'responsabilite',
        title: '6. Limitation de responsabilité',
        paragraphs: [
          `Le service est fourni « en l'état », sans garantie d'aucune sorte. L'éditeur ne garantit ni l'exactitude, ni l'exhaustivité, ni l'adéquation à un usage particulier des réponses générées par les modèles d'IA.`,
          `L'éditeur ne peut être tenu responsable :`,
          {
            type: 'list',
            items: [
              `des dommages indirects, accessoires ou consécutifs résultant de l'utilisation du service ;`,
              `du contenu généré par les modèles d'IA, qui reflète les biais et limites propres à ces technologies ;`,
              `d'une indisponibilité temporaire, d'un bug ou d'une perte de données stockées localement (vider le cache du navigateur efface l'historique) ;`,
              `du comportement d'OpenRouter ou de tout autre sous-traitant.`,
            ],
          },
          `Vous reconnaissez utiliser le service à vos propres risques.`,
        ],
      },
      {
        id: 'suspension',
        title: '7. Suspension et résiliation',
        paragraphs: [
          `L'éditeur se réserve la faculté d'interrompre, de modifier ou de cesser le service à tout moment, sans préavis ni indemnité, notamment pour des raisons de maintenance, de sécurité ou de force majeure.`,
          `Vous pouvez cesser d'utiliser le service à tout moment et effacer l'intégralité de vos données locales depuis les paramètres.`,
        ],
      },
      {
        id: 'evolution',
        title: '8. Évolution des CGU',
        paragraphs: [
          `L'éditeur peut modifier les présentes CGU. Toute modification substantielle sera portée à votre connaissance par un message visible dans l'interface. La poursuite de l'utilisation vaut acceptation des CGU modifiées.`,
        ],
      },
      {
        id: 'divers',
        title: '9. Dispositions finales',
        paragraphs: [
          `Si l'une des clauses des présentes CGU est jugée nulle ou inapplicable, les autres clauses restent pleinement en vigueur.`,
          `Les présentes CGU sont régies par le droit français. Tout litige sera soumis à la compétence des tribunaux français, après tentative de résolution amiable.`,
          `Pour toute question : ${CONTACT_EMAIL}.`,
        ],
      },
    ],
  },

  cookies: {
    id: 'cookies',
    shortTitle: 'Politique relative aux cookies et au stockage',
    title: 'Politique relative aux cookies et au stockage local',
    effectiveDate: EFFECTIVE_DATE,
    intro: `${PRODUCT_NAME} n'utilise aucun cookie au sens de la directive 2002/58/CE et de l'article 82 de la loi n° 78-17. La présente page décrit néanmoins les technologies de stockage utilisées et vos choix.`,
    sections: [
      {
        id: 'inventaire',
        title: '1. Technologies utilisées',
        paragraphs: [
          'Le service utilise uniquement les technologies suivantes :',
          {
            type: 'list',
            items: [
              `localStorage (clé « polychat-settings ») : stockage local de la clé API, des préférences d'affichage (thème, modèle par défaut, température, longueur de réponse, prompt système).`,
              `localStorage (clé « polychat_history ») : historique de vos conversations, jusqu'à suppression explicite ou vidage du stockage du navigateur.`,
              `Aucun cookie HTTP (tiers ou internes).`,
              `Aucun identifiant publicitaire, aucun pixel de tracking, aucun SDK analytique.`,
            ],
          },
          `Conformément aux recommandations de la CNIL, le localStorage n'est pas soumis au consentement préalable lorsqu'il est strictement nécessaire au fonctionnement du service, ce qui est le cas ici.`,
        ],
      },
      {
        id: 'google-fonts',
        title: '2. Chargement conditionnel de Google Fonts',
        paragraphs: [
          `Par défaut, l'application utilise des polices système installées sur votre appareil. Si vous y consentez, des polices de caractères (Fraunces, IBM Plex Sans, JetBrains Mono) sont chargées depuis le service Google Fonts de Google LLC.`,
          `Ce chargement implique une connexion aux serveurs de Google et la communication de votre adresse IP et de votre User-Agent. Google peut, en tant que responsable de traitement autonome, traiter ces données à des fins qui lui sont propres, notamment pour améliorer ses services et vous proposer des publicités personnalisées si vous êtes connecté à un compte Google.`,
          `Vous pouvez accepter ou refuser ce chargement depuis la bannière affichée lors de votre première visite. Vous pouvez modifier votre choix à tout moment depuis les paramètres.`,
        ],
      },
      {
        id: 'gestion',
        title: '3. Gérer vos préférences',
        paragraphs: [
          `Pour révoquer ou modifier vos choix :`,
          {
            type: 'list',
            items: [
              `Ouvrez les paramètres de l'application, section « Confidentialité et consentements ».`,
              `Pour supprimer l'intégralité des données locales, utilisez le bouton « Supprimer l'historique » ou videz le stockage du site depuis les paramètres de votre navigateur.`,
              `Pour bloquer tout chargement futur depuis Google Fonts, désactivez la case « Charger les polices Google Fonts » dans les paramètres.`,
            ],
          },
        ],
      },
      {
        id: 'duree',
        title: '4. Durée de vie',
        paragraphs: [
          `Les entrées en localStorage persistent tant que vous ne les supprimez pas. Elles ne sont pas renouvelées automatiquement et expirent uniquement par action de votre part (suppression manuelle, vidage du stockage, désinstallation du navigateur).`,
        ],
      },
      {
        id: 'contact',
        title: '5. Contact',
        paragraphs: [
          `Pour toute question : ${CONTACT_EMAIL}.`,
        ],
      },
    ],
  },

  ai: {
    id: 'ai',
    shortTitle: 'Avertissement sur les contenus générés par IA',
    title: 'Avertissement sur les contenus générés par IA',
    effectiveDate: EFFECTIVE_DATE,
    intro: `${PRODUCT_NAME} sert d'interface à des modèles d'intelligence artificielle générative fournis par des tiers (OpenRouter, OpenAI, Anthropic, Google, Meta, Mistral, etc.). Le présent avertissement décrit les limites de ces contenus.`,
    sections: [
      {
        id: 'fiabilite',
        title: '1. Absence de garantie d\'exactitude',
        paragraphs: [
          `Les modèles d'IA générative peuvent produire des réponses factuellement inexactes, trompeuses, obsolètes, contradictoires, ou inventées (« hallucinations »). Aucune réponse ne doit être tenue pour vraie, exhaustive ou actuelle sans vérification indépendante par vos soins.`,
        ],
      },
      {
        id: 'conseils',
        title: '2. Pas de conseil professionnel',
        paragraphs: [
          `Les réponses ne constituent en aucun cas un avis juridique, médical, financier, comptable, fiscal, technique ou d'ingénierie. Pour toute décision engageant vos droits, votre santé, votre patrimoine ou votre activité, consultez un professionnel qualifié.`,
        ],
      },
      {
        id: 'biais',
        title: '3. Biais et contenus sensibles',
        paragraphs: [
          `Les modèles d'IA peuvent reproduire des biais présents dans leurs données d'entraînement. Ils peuvent également générer des contenus offensants, discriminatoires ou nuisibles si vous les y incitez. ${PRODUCT_NAME} ne modère pas les réponses de modèles tiers et décline toute responsabilité à cet égard.`,
        ],
      },
      {
        id: 'propriete-intellectuelle',
        title: '4. Propriété intellectuelle des sorties',
        paragraphs: [
          `Vous êtes responsable de l'usage que vous faites des réponses. Certaines réponses peuvent reproduire, par coïncidence, du contenu protégé par des droits d'auteur. Il vous appartient de vérifier l'originalité et la licéité de tout contenu avant publication ou exploitation commerciale.`,
        ],
      },
      {
        id: 'donnees-personnelles',
        title: '5. Données à caractère personnel',
        paragraphs: [
          `N'incluez pas dans vos prompts de données personnelles sensibles (numéro de sécurité sociale, coordonnées bancaires, mots de passe, données de santé) ni de secrets industriels. Les messages sont transmis à OpenRouter et aux fournisseurs de modèles ; leur traitement par ces tiers est régi par leurs propres politiques.`,
        ],
      },
      {
        id: 'enfants',
        title: '6. Protection des mineurs',
        paragraphs: [
          `${PRODUCT_NAME} n'est pas conçu pour les mineurs de moins de 16 ans. Les parents et éducateurs sont invités à surveiller l'usage fait par les enfants des outils d'IA générative.`,
        ],
      },
      {
        id: 'evolution',
        title: '7. Évolution des modèles',
        paragraphs: [
          `Les modèles interrogés via OpenRouter sont susceptibles d'évoluer sans préavis. Les réponses obtenues à deux instants différents pour un même prompt peuvent donc varier. ${PRODUCT_NAME} ne garantit pas la disponibilité continue d'un modèle particulier.`,
        ],
      },
      {
        id: 'contact',
        title: '8. Contact',
        paragraphs: [
          `Pour signaler un problème : ${CONTACT_EMAIL}.`,
        ],
      },
    ],
  },
};

export const LEGAL_DOCUMENT_IDS: LegalDocument['id'][] = [
  'notices',
  'privacy',
  'terms',
  'cookies',
  'ai',
];
