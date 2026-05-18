#!/usr/bin/env python3
"""FORGIA Ω — Parametric Matching Engine
Matches structural analysis results to parametric library definitions.

Usage:
    python parametric_match.py match <json_analysis_file>
    python parametric_match.py match_b64 <base64_json>
    python parametric_match.py check
"""

import sys
import json
import math
import base64

# Library knowledge base (mirrors PARAMETRIC_LIBRARY from libraryStore.ts)
# Each entry: defId, nameIt, category, keywords, dimension_hints, param_mapping
LIBRARY = [
    # Cancelli & Recinzioni
    {"id": "cancello-singolo", "nameIt": "Cancello Singolo", "category": "cancelli-recinzioni",
     "keywords": ["cancello", "singolo", "ingresso", "pedonale", "porta"],
     "params": ["larghezza", "altezza", "spessore", "spaziatura"]},
    {"id": "cancello-doppio", "nameIt": "Cancello Doppio", "category": "cancelli-recinzioni",
     "keywords": ["cancello", "doppio", "carraio", "ingresso", "apertura"],
     "params": ["larghezza", "altezza", "spessore", "spaziatura"]},
    {"id": "griglia", "nameIt": "Griglia", "category": "cancelli-recinzioni",
     "keywords": ["griglia", "recinzione", "pannello", "rete", "maglia"],
     "params": ["larghezza", "altezza", "spessore", "maglia"]},
    {"id": "pannello-recinzione", "nameIt": "Pannello Recinzione", "category": "cancelli-recinzioni",
     "keywords": ["pannello", "recinzione", "fence", "barriera"],
     "params": ["larghezza", "altezza", "spessore", "profondita"]},
    {"id": "cancello-pedonale", "nameIt": "Cancello Pedonale", "category": "cancelli-recinzioni",
     "keywords": ["cancello", "pedonale", "passo", "portone"],
     "params": ["larghezza", "altezza", "spessore", "spaziatura"]},
    {"id": "cancello-scorrevole", "nameIt": "Cancello Scorrevole", "category": "cancelli-recinzioni",
     "keywords": ["scorrevole", "sliding", "guide"],
     "params": ["larghezza", "altezza", "spessore", "guide"]},
    {"id": "cancello-a-libro", "nameIt": "Cancello a Libro", "category": "cancelli-recinzioni",
     "keywords": ["libro", "bi-fold", "pieghevole"],
     "params": ["larghezza", "altezza", "spessore", "pannelli"]},
    {"id": "cancello-industriale", "nameIt": "Cancello Industriale", "category": "cancelli-recinzioni",
     "keywords": ["industriale", "capannone", "magazzino", "rinforzi"],
     "params": ["larghezza", "altezza", "spessore", "rinforzi"]},
    {"id": "recinzione-alta", "nameIt": "Recinzione Alta", "category": "cancelli-recinzioni",
     "keywords": ["recinzione", "alta", "filo", "rete"],
     "params": ["larghezza", "altezza", "spessore", "filo"]},
    # Arredo Urbano
    {"id": "ringhiera", "nameIt": "Ringhiera", "category": "arredo-urbano",
     "keywords": ["ringhiera", "balcone", "parapetto", "terrazza", "barre"],
     "params": ["larghezza", "altezza", "spessore", "barre"]},
    {"id": "ringhiera-cavo", "nameIt": "Ringhiera Cavo", "category": "arredo-urbano",
     "keywords": ["ringhiera", "cavo", "cable", "tensione"],
     "params": ["larghezza", "altezza", "spessore", "cavi"]},
    {"id": "corrimano", "nameIt": "Corrimano", "category": "arredo-urbano",
     "keywords": ["corrimano", "mano", "scala", "passamano"],
     "params": ["larghezza", "altezza", "spessore", "supporti"]},
    {"id": "balaustra", "nameIt": "Balaustra", "category": "arredo-urbano",
     "keywords": ["balaustra", "colonne", "pali", "pilastri"],
     "params": ["larghezza", "altezza", "spessore", "colonne"]},
    {"id": "arco", "nameIt": "Arco", "category": "arredo-urbano",
     "keywords": ["arco", "curva", "semicerchio", "portale"],
     "params": ["larghezza", "altezza", "spessore", "raggio"]},
    {"id": "parapetto", "nameIt": "Parapetto", "category": "arredo-urbano",
     "keywords": ["parapetto", "balcone", "terrazza", "protezione"],
     "params": ["larghezza", "altezza", "spessore", "pannelli"]},
    {"id": "ringhiera-vetro", "nameIt": "Ringhiera Vetro", "category": "arredo-urbano",
     "keywords": ["ringhiera", "vetro", "trasparente", "moderno"],
     "params": ["larghezza", "altezza", "spessore", "pannelli"]},
    # Scale & Ringhiere
    {"id": "scala-a-chiocciola", "nameIt": "Scala a Chiocciola", "category": "scale-e-ringhiere",
     "keywords": ["chiocciola", "spirale", "helix", "circular"],
     "params": ["diametro", "altezza", "spessore", "rampe"]},
    {"id": "scala-dritta", "nameIt": "Scala Dritta", "category": "scale-e-ringhiere",
     "keywords": ["scala", "dritta", "lineare", "retta"],
     "params": ["larghezza", "altezza", "spessore", "rampe"]},
    {"id": "scala-esterna", "nameIt": "Scala Esterna", "category": "scale-e-ringhiere",
     "keywords": ["scala", "esterna", "fuoco", "emergenza"],
     "params": ["larghezza", "altezza", "spessore", "profondita"]},
    {"id": "ringhiera-scale", "nameIt": "Ringhiera Scale", "category": "scale-e-ringhiere",
     "keywords": ["ringhiera", "scala", "pannelli", "protezione"],
     "params": ["larghezza", "altezza", "spessore", "pannelli"]},
    # Strutture Metalliche
    {"id": "tettoia", "nameIt": "Tettoia", "category": "strutture-metalliche",
     "keywords": ["tettoia", "copertura", "canopy", "pensilina", "ombra"],
     "params": ["larghezza", "altezza", "spessore", "profondita"]},
    {"id": "capriata", "nameIt": "Capriata", "category": "strutture-metalliche",
     "keywords": ["capriata", "truss", "trave", "tetto"],
     "params": ["larghezza", "altezza", "spessore", "profondita"]},
    {"id": "colonna", "nameIt": "Colonna", "category": "strutture-metalliche",
     "keywords": ["colonna", "pilastro", "sostegno", "verticale"],
     "params": ["diametro", "altezza", "spessore", "base"]},
    {"id": "trave", "nameIt": "Trave", "category": "strutture-metalliche",
     "keywords": ["trave", "beam", "orizzontale", "solai"],
     "params": ["larghezza", "altezza", "spessore", "profondita"]},
    {"id": "pensilina", "nameIt": "Pensilina", "category": "strutture-metalliche",
     "keywords": ["pensilina", "fermata", "riparo", "bus"],
     "params": ["larghezza", "altezza", "spessore", "profondita"]},
    # Chiusure & Coperture
    {"id": "porta-ferro", "nameIt": "Porta Ferro", "category": "chiusure-e-coperture",
     "keywords": ["porta", "ingresso", "accesso", "sicurezza"],
     "params": ["larghezza", "altezza", "spessore", "dettaglio"]},
    {"id": "finestra-ferro", "nameIt": "Finestra Ferro", "category": "chiusure-e-coperture",
     "keywords": ["finestra", "inferriata", "griglia", "grata"],
     "params": ["larghezza", "altezza", "spessore", "griglia"]},
    {"id": "grata-sicurezza", "nameIt": "Grata Sicurezza", "category": "chiusure-e-coperture",
     "keywords": ["grata", "sicurezza", "negozio", "protezione"],
     "params": ["larghezza", "altezza", "spessore", "maglia"]},
    {"id": "chiusura-scorrevole", "nameIt": "Chiusura Scorrevole", "category": "chiusure-e-coperture",
     "keywords": ["chiusura", "scorrevole", "porta", "finestra"],
     "params": ["larghezza", "altezza", "spessore", "guide"]},
    {"id": "tettoia-chiusa", "nameIt": "Tettoia Chiusa", "category": "chiusure-e-coperture",
     "keywords": ["tettoia", "chiusa", "garage", "box"],
     "params": ["larghezza", "altezza", "spessore", "profondita"]},
    # Illuminazione
    {"id": "lampione", "nameIt": "Lampione", "category": "illuminazione",
     "keywords": ["lampione", "luce", "strada", "illuminazione"],
     "params": ["diametro", "altezza", "spessore", "bracci"]},
    {"id": "lanterna", "nameIt": "Lanterna", "category": "illuminazione",
     "keywords": ["lanterna", "lampada", "giardino", "esterno"],
     "params": ["diametro", "altezza", "spessore", "bracci"]},
    {"id": "candelabro", "nameIt": "Candelabro", "category": "illuminazione",
     "keywords": ["candelabro", "lampadario", "sospeso", "elegante"],
     "params": ["diametro", "altezza", "spessore", "bracci"]},
    {"id": "applique", "nameIt": "Applique", "category": "illuminazione",
     "keywords": ["applique", "parete", "muro", "fiore"],
     "params": ["larghezza", "altezza", "spessore", "profondita"]},
    {"id": "torcia-giardino", "nameIt": "Torcia Giardino", "category": "illuminazione",
     "keywords": ["torcia", "fiamma", "giardino", "fiaccola"],
     "params": ["diametro", "altezza", "spessore", "base"]},
    # Elementi Decorativi
    {"id": "rosone", "nameIt": "Rosone", "category": "elementi-decorativi",
     "keywords": ["rosone", "rosoncino", "rosetta", "mandala", "cerchio"],
     "params": ["diametro", "spessore", "dettaglio", "profondita"]},
    {"id": "pannello-decorativo", "nameIt": "Pannello Decorativo", "category": "elementi-decorativi",
     "keywords": ["pannello", "decorativo", "parete", "murale"],
     "params": ["larghezza", "altezza", "spessore", "dettaglio"]},
    {"id": "spirale-decorativa", "nameIt": "Spirale Decorativa", "category": "elementi-decorativi",
     "keywords": ["spirale", "scroll", "voluta", "serpentino"],
     "params": ["altezza", "diametro", "spessore", "dettaglio"]},
    {"id": "fiore-ferro", "nameIt": "Fiore Ferro", "category": "elementi-decorativi",
     "keywords": ["fiore", "fiorellino", "petali", "rosa"],
     "params": ["diametro", "spessore", "dettaglio", "profondita"]},
    {"id": "albero-ferro", "nameIt": "Albero Ferro", "category": "elementi-decorativi",
     "keywords": ["albero", "rami", "natura", "pianta"],
     "params": ["altezza", "diametro", "spessore", "dettaglio"]},
    # Giardino
    {"id": "pergola", "nameIt": "Pergola", "category": "giardino",
     "keywords": ["pergola", "gazebo", "ombra", "vite", "colonne"],
     "params": ["larghezza", "altezza", "spessore", "colonne"]},
    {"id": "gazebo", "nameIt": "Gazebo", "category": "giardino",
     "keywords": ["gazebo", "padiglione", "giardino", "tetto"],
     "params": ["larghezza", "altezza", "spessore", "profondita"]},
    {"id": "grigliato-giardino", "nameIt": "Grigliato Giardino", "category": "giardino",
     "keywords": ["grigliato", "traliccio", "rampicante", "fiori"],
     "params": ["larghezza", "altezza", "spessore", "maglia"]},
    {"id": "fioriera", "nameIt": "Fioriera", "category": "giardino",
     "keywords": ["fioriera", "vaso", "piante", "vaschetta"],
     "params": ["larghezza", "altezza", "spessore", "profondita"]},
    {"id": "divisorio-giardino", "nameIt": "Divisorio Giardino", "category": "giardino",
     "keywords": ["divisorio", "separè", "schermo", "privacy"],
     "params": ["larghezza", "altezza", "spessore", "pannelli"]},
    {"id": "supporto-vasi", "nameIt": "Supporto Vasi", "category": "giardino",
     "keywords": ["supporto", "vasi", "porta", "mensola"],
     "params": ["larghezza", "altezza", "spessore", "ripiani"]},
    # Simboli & Monogrammi
    {"id": "lettera-ferro", "nameIt": "Lettera Ferro", "category": "simboli-monogrammi",
     "keywords": ["lettera", "carattere", "iniziale", "segno"],
     "params": ["larghezza", "altezza", "spessore", "profondita"]},
    {"id": "insegna-negozio", "nameIt": "Insegna Negozio", "category": "simboli-monogrammi",
     "keywords": ["insegna", "negozio", "pubblicita", "banner"],
     "params": ["larghezza", "altezza", "spessore", "profondita"]},
    {"id": "logo-personalizzato", "nameIt": "Logo Personalizzato", "category": "simboli-monogrammi",
     "keywords": ["logo", "marchio", "brand", "simbolo"],
     "params": ["larghezza", "altezza", "spessore", "dettaglio"]},
    {"id": "stemma-araldico", "nameIt": "Stemma Araldico", "category": "simboli-monogrammi",
     "keywords": ["stemma", "araldico", "crest", "famiglia"],
     "params": ["larghezza", "altezza", "spessore", "dettaglio"]},
    {"id": "supporto-insegna", "nameIt": "Supporto Insegna", "category": "simboli-monogrammi",
     "keywords": ["supporto", "bracket", "mensola", "proiezione"],
     "params": ["lunghezza", "altezza", "spessore", "profondita"]},
    {"id": "numero-ferro", "nameIt": "Numero Ferro", "category": "simboli-monogrammi",
     "keywords": ["numero", "civico", "indirizzo", "digitale"],
     "params": ["larghezza", "altezza", "spessore", "profondita"]},
    # Arredo Interni
    {"id": "tavolo-ferro", "nameIt": "Tavolo Ferro", "category": "arredo-interni",
     "keywords": ["tavolo", "scrivania", "bancone", "piano"],
     "params": ["larghezza", "altezza", "spessore", "profondita"]},
    {"id": "consolle", "nameIt": "Consolle", "category": "arredo-interni",
     "keywords": ["consolle", "ingresso", "appoggio", "mobile"],
     "params": ["larghezza", "altezza", "spessore", "profondita"]},
    {"id": "mensola", "nameIt": "Mensola", "category": "arredo-interni",
     "keywords": ["mensola", "scaffale", "ripiano", "parete"],
     "params": ["larghezza", "altezza", "spessore", "profondita"]},
    {"id": "portariviste", "nameIt": "Portariviste", "category": "arredo-interni",
     "keywords": ["portariviste", "riviste", "giornali", "contenitore"],
     "params": ["larghezza", "altezza", "spessore", "profondita"]},
    {"id": "seduta-ferro", "nameIt": "Seduta Ferro", "category": "arredo-interni",
     "keywords": ["seduta", "sedia", "panchina", "sgabello"],
     "params": ["larghezza", "altezza", "spessore", "profondita"]},
]

# Default parameter values for mapping
DEFAULT_PARAMS = {
    "cancello-singolo": {"larghezza": 120, "altezza": 200, "spessore": 4, "spaziatura": 12},
    "cancello-doppio": {"larghezza": 240, "altezza": 200, "spessore": 4, "spaziatura": 12},
    "griglia": {"larghezza": 100, "altezza": 80, "spessore": 3, "maglia": 10},
    "pannello-recinzione": {"larghezza": 200, "altezza": 120, "spessore": 3, "profondita": 25},
    "cancello-pedonale": {"larghezza": 90, "altezza": 180, "spessore": 3, "spaziatura": 10},
    "cancello-scorrevole": {"larghezza": 300, "altezza": 200, "spessore": 4, "guide": 10},
    "cancello-a-libro": {"larghezza": 180, "altezza": 200, "spessore": 4, "pannelli": 4},
    "cancello-industriale": {"larghezza": 400, "altezza": 250, "spessore": 6, "rinforzi": 4},
    "recinzione-alta": {"larghezza": 250, "altezza": 200, "spessore": 4, "filo": 3},
    "ringhiera": {"larghezza": 150, "altezza": 90, "spessore": 2.5, "barre": 5},
    "ringhiera-cavo": {"larghezza": 150, "altezza": 90, "spessore": 2.5, "cavi": 4},
    "corrimano": {"larghezza": 200, "altezza": 90, "spessore": 3, "supporti": 3},
    "balaustra": {"larghezza": 120, "altezza": 100, "spessore": 3, "colonne": 4},
    "arco": {"larghezza": 200, "altezza": 250, "spessore": 5, "raggio": 100},
    "parapetto": {"larghezza": 100, "altezza": 110, "spessore": 2, "pannelli": 3},
    "ringhiera-vetro": {"larghezza": 150, "altezza": 90, "spessore": 3, "pannelli": 3},
    "scala-a-chiocciola": {"diametro": 150, "altezza": 280, "spessore": 5, "rampe": 12},
    "scala-dritta": {"larghezza": 100, "altezza": 280, "spessore": 4, "rampe": 12},
    "scala-esterna": {"larghezza": 120, "altezza": 300, "spessore": 5, "profondita": 100},
    "ringhiera-scale": {"larghezza": 150, "altezza": 90, "spessore": 3, "pannelli": 3},
    "tettoia": {"larghezza": 300, "altezza": 250, "spessore": 4, "profondita": 200},
    "capriata": {"larghezza": 500, "altezza": 100, "spessore": 5, "profondita": 50},
    "colonna": {"diametro": 20, "altezza": 300, "spessore": 5, "base": 40},
    "trave": {"larghezza": 400, "altezza": 30, "spessore": 8, "profondita": 20},
    "pensilina": {"larghezza": 400, "altezza": 250, "spessore": 5, "profondita": 150},
    "porta-ferro": {"larghezza": 90, "altezza": 200, "spessore": 4, "dettaglio": 4},
    "finestra-ferro": {"larghezza": 100, "altezza": 120, "spessore": 3, "griglia": 4},
    "grata-sicurezza": {"larghezza": 120, "altezza": 150, "spessore": 4, "maglia": 8},
    "chiusura-scorrevole": {"larghezza": 250, "altezza": 200, "spessore": 4, "guide": 15},
    "tettoia-chiusa": {"larghezza": 300, "altezza": 250, "spessore": 4, "profondita": 200},
    "lampione": {"diametro": 15, "altezza": 300, "spessore": 4, "bracci": 1},
    "lanterna": {"diametro": 30, "altezza": 50, "spessore": 2.5, "bracci": 4},
    "candelabro": {"diametro": 40, "altezza": 150, "spessore": 4, "bracci": 5},
    "applique": {"larghezza": 25, "altezza": 30, "spessore": 3, "profondita": 20},
    "torcia-giardino": {"diametro": 10, "altezza": 120, "spessore": 3, "base": 25},
    "rosone": {"diametro": 80, "spessore": 3, "dettaglio": 6, "profondita": 5},
    "pannello-decorativo": {"larghezza": 100, "altezza": 100, "spessore": 3, "dettaglio": 5},
    "spirale-decorativa": {"altezza": 150, "diametro": 40, "spessore": 4, "dettaglio": 5},
    "fiore-ferro": {"diametro": 30, "spessore": 3, "dettaglio": 4, "profondita": 5},
    "albero-ferro": {"altezza": 200, "diametro": 60, "spessore": 4, "dettaglio": 6},
    "pergola": {"larghezza": 300, "altezza": 220, "spessore": 4, "colonne": 4},
    "gazebo": {"larghezza": 300, "altezza": 280, "spessore": 5, "profondita": 300},
    "grigliato-giardino": {"larghezza": 200, "altezza": 200, "spessore": 2.5, "maglia": 15},
    "fioriera": {"larghezza": 80, "altezza": 50, "spessore": 2.5, "profondita": 40},
    "divisorio-giardino": {"larghezza": 150, "altezza": 180, "spessore": 3, "pannelli": 3},
    "supporto-vasi": {"larghezza": 60, "altezza": 80, "spessore": 2.5, "ripiani": 3},
    "lettera-ferro": {"larghezza": 50, "altezza": 70, "spessore": 4, "profondita": 8},
    "insegna-negozio": {"larghezza": 120, "altezza": 40, "spessore": 3, "profondita": 15},
    "logo-personalizzato": {"larghezza": 80, "altezza": 80, "spessore": 3, "dettaglio": 5},
    "stemma-araldico": {"larghezza": 60, "altezza": 70, "spessore": 4, "dettaglio": 6},
    "supporto-insegna": {"lunghezza": 60, "altezza": 40, "spessore": 3, "profondita": 30},
    "numero-ferro": {"larghezza": 40, "altezza": 60, "spessore": 4, "profondita": 8},
    "tavolo-ferro": {"larghezza": 150, "altezza": 75, "spessore": 4, "profondita": 80},
    "consolle": {"larghezza": 120, "altezza": 85, "spessore": 3, "profondita": 35},
    "mensola": {"larghezza": 80, "altezza": 25, "spessore": 3, "profondita": 25},
    "portariviste": {"larghezza": 40, "altezza": 60, "spessore": 2.5, "profondita": 25},
    "seduta-ferro": {"larghezza": 50, "altezza": 45, "spessore": 3, "profondita": 50},
}

# Category mapping from structural analysis
CATEGORY_MAP = {
    "cancelli-recinzioni": ["cancello", "recinzione", "barriera", "ingresso", "sbarra", "porta", "gate", "fence"],
    "arredo-urbano": ["ringhiera", "corrimano", "balaustra", "arco", "parapetto", "balcone", "terrazza"],
    "scale-e-ringhiere": ["scala", "scale", "chiocciola", "elicoidale", "dritta", "esterna", "gradini"],
    "strutture-metalliche": ["tettoia", "capriata", "colonna", "trave", "pensilina", "struttura", "tetto", "sostegno"],
    "chiusure-e-coperture": ["porta", "finestra", "grata", "chiusura", "copertura", "garage", "box"],
    "illuminazione": ["lampione", "lanterna", "candelabro", "applique", "torcia", "luce", "illuminazione"],
    "elementi-decorativi": ["rosone", "pannello decorativo", "spirale", "fiore", "albero", "decorazione", "ornamentale"],
    "giardino": ["pergola", "gazebo", "grigliato", "fioriera", "divisorio", "supporto", "vasi", "giardino"],
    "simboli-monogrammi": ["lettera", "insegna", "logo", "stemma", "numero", "monogramma", "segno"],
    "arredo-interni": ["tavolo", "consolle", "mensola", "portariviste", "seduta", "sedia", "mobile"],
}

# Pattern → param mapping hints
PATTERN_PARAM_MAP = {
    "griglia rettangolare": {"spaziatura": 12, "maglia": 10, "griglia": 4},
    "barre verticali": {"barre": 5, "spaziatura": 12, "colonne": 4},
    "barre orizzontali": {"spaziatura": 12, "pannelli": 3},
    "elementi diagonali": {"rinforzi": 4, "bracci": 4},
    "irregolare / decorativo": {"dettaglio": 5},
}


def score_match(analysis: dict, item: dict) -> float:
    """Score how well a library item matches the analysis."""
    score = 0.0
    tipo = analysis.get("tipo_struttura", "").lower()
    pattern = analysis.get("pattern_geometrico", "").lower()
    elementi = [e.lower() for e in analysis.get("elementi_identificati", [])]
    dims = analysis.get("dimensioni_stimate", {})
    larg = dims.get("larghezza", 100)
    alt = dims.get("altezza", 100)

    # Keyword matching on tipo_struttura
    for kw in item["keywords"]:
        if kw in tipo:
            score += 3.0
    # Keyword matching on elements
    for el in elementi:
        for kw in item["keywords"]:
            if kw in el:
                score += 1.5
    # Keyword matching on pattern
    for kw in item["keywords"]:
        if kw in pattern:
            score += 1.0

    # Category mapping bonus
    for cat, cat_keywords in CATEGORY_MAP.items():
        if item["category"] == cat:
            for ck in cat_keywords:
                if ck in tipo:
                    score += 2.0
                for el in elementi:
                    if ck in el:
                        score += 1.0

    # Dimension compatibility: prefer items whose defaults are close
    defaults = DEFAULT_PARAMS.get(item["id"], {})
    if "larghezza" in defaults and "larghezza" in defaults:
        default_w = defaults.get("larghezza", larg)
        ratio = min(larg, default_w) / max(larg, default_w) if max(larg, default_w) > 0 else 1
        score += ratio * 2.0
    if "altezza" in defaults:
        default_h = defaults.get("altezza", alt)
        ratio = min(alt, default_h) / max(alt, default_h) if max(alt, default_h) > 0 else 1
        score += ratio * 2.0

    # Pattern param bonus
    for pat, pat_params in PATTERN_PARAM_MAP.items():
        if pat in pattern:
            for pk in pat_params:
                if pk in item["params"]:
                    score += 1.0

    # Normalize slightly by number of keywords to avoid bias toward verbose items
    score /= max(1, len(item["keywords"]) * 0.2 + 1)

    return round(score, 3)


def build_params(item_id: str, dims: dict, pattern: str, elementi: list) -> dict:
    """Build suggested parameters from analysis data."""
    params = dict(DEFAULT_PARAMS.get(item_id, {}))

    # Override with scan dimensions
    larg = dims.get("larghezza")
    alt = dims.get("altezza")
    prof = dims.get("profondita")
    if larg is not None and "larghezza" in params:
        params["larghezza"] = round(larg)
    if alt is not None and "altezza" in params:
        params["altezza"] = round(alt)
    if prof is not None and "profondita" in params:
        params["profondita"] = round(prof)
    # Map diametro if structure is circular/round
    if "diametro" in params and larg and alt:
        params["diametro"] = round(min(larg, alt))

    # Pattern-based param adjustments
    if "griglia" in pattern or "griglia" in item_id:
        if "maglia" in params:
            params["maglia"] = max(5, min(30, round(larg / 10) if larg else 10))
    if "barre" in pattern or any("barre" in e.lower() for e in elementi):
        if "barre" in params:
            params["barre"] = max(2, min(15, round(larg / 20) if larg else 5))
        if "spaziatura" in params:
            params["spaziatura"] = max(5, min(30, round(larg / params.get("barre", 5)) if larg else 12))
    if "cavi" in pattern or any("cavo" in e.lower() for e in elementi):
        if "cavi" in params:
            params["cavi"] = max(1, min(8, round(larg / 25) if larg else 4))
    if any("rinforzi" in e.lower() for e in elementi):
        if "rinforzi" in params:
            params["rinforzi"] = max(2, min(10, round(larg / 60) if larg else 4))
    if "colonne" in pattern or any("colonne" in e.lower() for e in elementi):
        if "colonne" in params:
            params["colonne"] = max(2, min(8, round(larg / 40) if larg else 4))
    if any("pannelli" in e.lower() for e in elementi):
        if "pannelli" in params:
            params["pannelli"] = max(1, min(8, round(larg / 40) if larg else 3))

    return params


def match_library(analysis: dict) -> dict:
    """Find best matching library items for the given analysis."""
    scores = []
    for item in LIBRARY:
        s = score_match(analysis, item)
        if s > 0.5:
            scores.append({"item": item, "score": s})

    # Sort by score descending
    scores.sort(key=lambda x: x["score"], reverse=True)

    # Take top 3
    top = scores[:3]

    matches = []
    for entry in top:
        item = entry["item"]
        dims = analysis.get("dimensioni_stimate", {})
        pattern = analysis.get("pattern_geometrico", "").lower()
        elementi = analysis.get("elementi_identificati", [])
        params = build_params(item["id"], dims, pattern, elementi)
        matches.append({
            "defId": item["id"],
            "nameIt": item["nameIt"],
            "category": item["category"],
            "score": entry["score"],
            "confidence": round(min(0.95, entry["score"] / 8), 2),
            "suggestedParams": params,
            "paramKeys": item["params"],
        })

    return {
        "status": "success",
        "matches": matches,
        "bestMatch": matches[0] if matches else None,
    }


def main():
    if len(sys.argv) < 2:
        print(json.dumps({"error": "No command provided"}), flush=True)
        sys.exit(1)

    cmd = sys.argv[1]

    if cmd == "check":
        print(json.dumps({"ok": True, "library_size": len(LIBRARY)}), flush=True)
        sys.exit(0)

    elif cmd == "match":
        if len(sys.argv) < 3:
            print(json.dumps({"error": "Usage: match <json_file>"}), flush=True)
            sys.exit(1)
        try:
            with open(sys.argv[2], "r", encoding="utf-8") as f:
                analysis = json.load(f)
            result = match_library(analysis)
            print(json.dumps(result), flush=True)
            sys.exit(0)
        except Exception as e:
            print(json.dumps({"status": "error", "error": str(e)}), flush=True)
            sys.exit(1)

    elif cmd == "match_b64":
        if len(sys.argv) < 3:
            print(json.dumps({"error": "Usage: match_b64 <base64_json>"}), flush=True)
            sys.exit(1)
        try:
            decoded = base64.b64decode(sys.argv[2]).decode("utf-8")
            analysis = json.loads(decoded)
            result = match_library(analysis)
            print(json.dumps(result), flush=True)
            sys.exit(0)
        except Exception as e:
            print(json.dumps({"status": "error", "error": str(e)}), flush=True)
            sys.exit(1)

    else:
        print(json.dumps({"error": f"Unknown command: {cmd}"}), flush=True)
        sys.exit(1)

if __name__ == "__main__":
    main()
