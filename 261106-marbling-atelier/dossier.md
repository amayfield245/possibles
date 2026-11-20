# Possible #261106: The Marbling Atelier

Working file for the story. Started 20 Nov 2026. Status: stories drafted, waiting for Antony to choose one.

## Facts

- Kind: Concept.
- Made: 6 Nov 2026 (Antony, 20 Nov 2026), as a single-file Claude artifact. Built from one prompt with little steering (Antony).
- Published at https://claude.ai/artifact/HEHmnKshs9KtKKsZUGnfGK. Last published 6 Nov 2026 (version 1793989979-fb9d). A copy of that version is in `experiment/index.html`.
- Related artifacts made on 8 Nov 2026, both Motion films: The Marbling Atelier tour (https://claude.ai/artifact/KNJ2EuQg5MTFY2ZZ8mhnei) and The Marbling Atelier portrait (https://claude.ai/artifact/MisZDShxSQ6RdqdUNtRkG2).
- No AI model runs inside it. Claude wrote it; the page itself is maths, history and WebGL. Nothing on screen is model output at run time.
- Not checked by anyone who knows marbling (Antony, 20 Nov 2026). The craft and history on screen are Claude's account.

## Review

### What

A marbling bench in the browser. You float colours on a bath of size, draw them through with stylus, comb, curl, fan and turpentine, then lay down a sheet and see it bound as the boards of a half-leather book.

On screen (read off the running page and `data/recipes.json`, made by `count-recipes.mjs`):

- Seven tools, each with its period name: drop brush, whisk, stylus ("the biz, an awl"), combs ("a rack of nine"), curl ("French curl, snail"), fan ("breath on the ink"), turpentine ("open lace holes").
- Nine combs, from the 3 mm nonpareil comb to the 30 mm rake and the bird-wing comb.
- Nine palettes with period pigment names: Lahore indigo, orpiment, weld yellow, carmine, sumi, lapis.
- Bench settings that change the result: ox gall (spread), body of the size, edge pooling, grain, four papers (laid, wove, kozo washi, blue sugar), alum mordant, Spanish shift, drag on lifting, air under the sheet, age and foxing, agate burnish.
- A pattern book of 26 patterns: 1 from Japan, 8 from Persia and the Ottomans, 17 from Europe. Each has its other names, place and date, from Suminagashi ("1112 and earlier") to Zebra ("late 19th century"). Choose one and it is worked on the bath step by step, each step captioned.
- A lineage in the masthead: Echizen 1112, Herat c. 1490, Istanbul 1539, Amsterdam 1616, London 1853.
- A colophon that names its sources: Wolfe (1990), Miura (1989), the University of Washington pattern collection, Aubrey Jaffer's pages, and the maths paper.
- The maths: the bath follows Lu, Jaffer and colleagues, "Mathematical Marbling" (IEEE CG&A, 2012). Every stroke is an exactly invertible map of the plane. The shader traces each pixel back through every stroke to the drop of colour that put it there.
- A history slider, undo and redo, and "Replay the working". A guided first plate in five steps: throw, gel-git, comb, lay down, bind. A drying line, a studio mode, palettes taken from an image.

Numbers (from `data/recipes.json`):

- The opening plate is a Bouquet: 9 passes and 1,481 strokes. Its passes: six colours thrown from the whisk (lapis, coral, saffron, lichen, rose madder, cream), the stylus back and forth, a 3 mm comb down, the wide comb up in waves.
- The 26 patterns hold 34,063 strokes between them. The fewest: Abrī, 200. The most: Stormont, 2,977.
- The history bar on the opening plate reads "pass 9 of 9".

The question driving it (Antony): how far can AI go from one prompt into a specialist craft?

### So what

- One prompt reached nine centuries and three traditions of a craft, with the right tools, materials and names, and put a 2012 research paper to work under it. The surprise is the depth, not the polish.
- A finding from the review, which Antony called a story: in a real bath nothing can be undone, and each sheet happens once. Here every stroke can be reversed exactly. Drag the history slider back and the Bouquet unmakes itself, pass by pass. Software adds something the craft never had: you can learn a pattern by watching it come apart.
- Antony kept using it. It is beautiful and relaxing, and he keeps learning about the craft and its history. A test of the AI turned into a place he goes back to.
- The doubt: none of it has been checked by a marbler. A leader should read it the same way: deep, convincing, and unverified until someone with the craft looks.
- Themes: specialist knowledge is now cheap to make tangible; checking it is the scarce part. Tacit craft made into something you can try, rewind and learn from. Tools people return to without being asked.

### What next

- Will: nothing is planned. Antony keeps using it.
- Could: put it in front of a marbler to learn what it gets right and wrong. A teaching tool for binders, schools or museums that hold marbled papers. The same move for another craft or a firm's own tacit know-how.

## Interview (20 Nov 2026, by cards)

1. Why did you make it? "Test what AI can build."
2. When? 6 Nov 2026.
3. How was it built? "One prompt, little steering."
4. What surprised you? "The depth of craft."
5. The undo finding: story, side effect or flaw? "A story."
6. What next? In Antony's words: "The biggest surprise is that I've kept using it because it is beautiful, relaxing and I keep learning more about the craft and its history."
7. Has a marbler checked it? "No, not yet."

## Stories

Each has a hook, one claim, the proof on screen and a reason to care.

### A. One prompt, a craft you can learn backwards (recommended)

- Hook: "One prompt. Nine centuries of a craft." over a comb drawn through the bath.
- Claim: one prompt now turns a deep specialist craft into something you can try, and even learn backwards.
- Proof: the pattern book (26 patterns, Echizen 1112 to London 1853), a pattern worked step by step, then the history slider unmaking the Bouquet's 1,481 strokes.
- Why care: if one prompt can do this for marbling, it can for the know-how inside your organisation. The open question is who checks it: no marbler has yet.

### B. Nothing can be undone

- Hook: "In marbling, every sheet happens once." Then the slider runs the bath backwards.
- Claim: software gives an old craft the one thing it never had: a way back.
- Proof: history slider, Replay the working, the maths line in the colophon.
- Why care: rewind is how people learn. Tools that let you take work apart change how skills pass on.

### C. The test I kept using

- Hook: "I made it to test the AI. I kept it because it is beautiful."
- Claim: the experiments worth following are the ones people return to without being asked.
- Proof: plates worked across palettes, sheets on the drying line, a sheet bound as a book.
- Why care: a sign of real value that no pilot metric catches.

### D. Convincing and unchecked

- Hook: "Every date in this pattern book is Claude's. No marbler has checked one."
- Claim: AI makes deep expertise easy to show and hard to judge.
- Proof: the lineage and pattern book dates, the sources in the colophon.
- Why care: the scarce skill moves from making to checking. Ends with an invitation to a marbler.

### E. One sheet, followed closely

- Hook: a single drop of lapis on the bath.
- Claim: a whole craft fits in nine passes.
- Proof: the Bouquet, pass by pass, laid down, bound as a book.
- Why care: quiet and beautiful; the least argued, the most watchable.

## Footage notes

- The bath renders in WebGL. Headless Chromium here uses a software renderer: the opening plate took about 100 seconds to load and draw. Capture will need long timeouts and stepped frames, not live recording.
