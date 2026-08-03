/**
 * Impronta condivisa delle sagome tavolo (S4 giro 4, FIX-4D).
 *
 * PERCHÉ un modulo a parte: `TableShape` (editor sala — sagome SVG,
 * trascinabili) e `ServicePlanMap` (piantina di servizio — sagome HTML,
 * sola lettura) DEVONO disegnare i tavoli alla stessa dimensione. Se una
 * vista ingrandisse la sagoma senza l'altra, la piantina a servizio non
 * corrisponderebbe più a come l'admin ha disposto la sala nell'editor: due
 * tavoli messi vicini apparirebbero sovrapposti in una vista e non
 * nell'altra. Prima di questo modulo le due costanti erano duplicate
 * separatamente in ciascun file (rischio di disallineamento futuro).
 *
 * Multipli di 10: le posizioni tavolo si salvano a passo di 10px
 * (`TableMap.snapToGrid`). 64→80 e 96→120 mantengono la stessa proporzione
 * 2:3 fra il lato del tavolo quadrato/tondo e la larghezza del rettangolare.
 */
export const TABLE_SHAPE_SIZE = 80
export const TABLE_SHAPE_SIZE_RECT_W = 120
