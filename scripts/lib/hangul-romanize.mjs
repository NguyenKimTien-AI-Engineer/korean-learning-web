// Chuyen Hangul sang phien am Latin (Revised Romanization of Korean),
// tinh theo tung khoi am tiet doc lap (khong xu ly lien am giua cac am
// tiet/tu). Day la thuat toan tat dinh dua tren cach Unicode ma hoa khoi
// am tiet Hangul: moi ky tu = (initial * 21 + medial) * 28 + final + 0xAC00.
//
// Ket qua la phien am "doc tung chu" — huu ich de nguoi hoc doc duoc mat
// chu, khong phai ban ghi am giong noi that (khong the hien lien am/dong
// hoa phu am khi noi nhanh).

const INITIALS = [
  "g", "kk", "n", "d", "tt", "r", "m", "b", "pp", "s",
  "ss", "", "j", "jj", "ch", "k", "t", "p", "h",
];

const MEDIALS = [
  "a", "ae", "ya", "yae", "eo", "e", "yeo", "ye", "o", "wa",
  "wae", "oe", "yo", "u", "wo", "we", "wi", "yu", "eu", "ui", "i",
];

const FINALS = [
  "", "k", "k", "k", "n", "n", "n", "t", "l", "k",
  "m", "l", "l", "l", "p", "l", "m", "p", "p", "t",
  "t", "ng", "t", "t", "k", "t", "p", "t",
];

const HANGUL_BASE = 0xac00;
const HANGUL_LAST = 0xd7a3;

function romanizeSyllable(code) {
  const offset = code - HANGUL_BASE;
  const final = offset % 28;
  const medial = Math.floor(offset / 28) % 21;
  const initial = Math.floor(offset / 28 / 21);
  return INITIALS[initial] + MEDIALS[medial] + FINALS[final];
}

export function romanize(text) {
  let out = "";
  for (const ch of text) {
    const code = ch.codePointAt(0);
    if (code >= HANGUL_BASE && code <= HANGUL_LAST) {
      out += romanizeSyllable(code) + " ";
    } else if (ch === " ") {
      out = out.trimEnd() + "  ";
    } else {
      out = out.trimEnd() + ch + " ";
    }
  }
  return out.replace(/\s+/g, " ").trim();
}
